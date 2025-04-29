import express from 'express';
import errorHandler from './errorHandler';
import { BadRequestError, FieldsInvalidError, FieldsRequiredError, NotFoundError } from './errors';
import db from '../database/connection';
import ensureAuth from '../middleware/ensureauth';
import { getReqURI, respond200, validateRequest } from './utils';

export const PermissionDefaults = {
  everyone: {general: `TRUE`} as Permission,
  noone: {general: `FALSE`} as Permission,
  adminOnly: {general: `!array::is_empty(array::intersect($user.roles, ["administrator"]))`} as Permission,
}

type Permission = {general: string, perRecord?: string};

interface Permissions {
  getAll: Permission;
  getById: Permission;
  remove: Permission;
  create: Permission;
  update: Permission;
  [key: string]: Permission;
}

interface Fields {
  [key: string]: {
    SELECT?: string;
    CONVERTER?: string;
    default?: string;
    fetch?: boolean;
  }
}

export class Thing {
  public fields: Fields;
  public table: string;
  public router: express.Router;
  public permissions: Permissions;

  constructor({table, fields, permissions}:{table: string, fields: Fields, permissions: Permissions}) {
    this.permissions = permissions;
    this.fields = fields;
    this.table = table;
    this.router = express.Router();
  }

  public addDefaults(
    {auth = true, create = true, getAll = true, getById = true, update = true, remove = true}
    : {auth?: boolean, create?: boolean, getAll?: boolean, getById?: boolean, update?: boolean, remove?: boolean}
  ) {
    if (auth) this.router.use(ensureAuth);
    if (create) this.router.post("/create", this.create());
    if (getAll) this.router.get("/all", this.getAll());
    if (getById) this.router.get("/get", this.get());
    if (update) this.router.post("/update", this.update());
    if (remove) this.router.post("/remove", this.remove());
  }

  public create({ additionalQuery, addToData }: {
      additionalQuery?: (req: express.Request) => string,
      addToData?: (req:express.Request) => object
  } = {}) {
    return errorHandler(async (req, res) => {
      validateRequest(req, `POST ${getReqURI(req)}`);
      const adtq = additionalQuery?.(req);
      for (const [k,v] of Object.entries(this.fields)) 
        !req.body[k] && v.default ? req.body[k] = null : null;
      const result = (await db.query(`
        IF ${this.permissions.create.general} {
          ${adtq ? "BEGIN TRANSACTION;": ""}
          $original = CREATE ONLY type::table($table) CONTENT {
            ${
              Object.keys(req.body).map((k:any) => `${k}: ${
                req.body[k] == null && this.fields[k]?.default
                ? this.fields[k]?.default
                : this.fields[k]?.CONVERTER
                  ? this.fields[k]?.CONVERTER?.replace("$field", `$fields.${k}`) || `$fields.${k}`
                  : `$fields.${k}`
              }`).join(",")
            }
          };
          ${adtq || ""}
          RETURN $original;
          ${adtq ? "COMMIT TRANSACTION;": ""}
        } ELSE {
          THROW "x-permission-denied";
        }
      `, { user: req.user, table: this.table, fields: req.body }))[0];
      respond200(res, `POST ${getReqURI(req)}`, { [`${this.table}`]: result, ...addToData?.(req) });
    });
  }

  public getAll() {
    return errorHandler(async (req, res) => {      
      validateRequest(req, `GET ${getReqURI(req)}`);
      const fetch = new Set((req.query?.fetch as string)?.trim().split(","))
                    .union(new Set(Object.keys(this.fields).filter(v => this.fields[v]?.fetch)));
      const result = (await db.query(`
        IF ${this.permissions.getAll.general} {
          RETURN SELECT * FROM type::table($table)
          ${this.permissions.getAll.perRecord ? `WHERE ${this.permissions.getAll.perRecord}` : ""}
          ${fetch.size ? "FETCH type::fields($fetch)" : ""};
        } ELSE {
          THROW "x-permission-denied";
        }
      `, { user: req.user, table: this.table, fetch: [...fetch] }))[0];
      respond200(res, `GET ${getReqURI(req)}`, { [`${this.table}s`]: result });
    });
  }

  public get({WHERE, extraFields, ORDER = "", LIMIT = "", postProcess}: {
    WHERE?: (req: express.Request) => string,
    ORDER?: string, LIMIT?: string,
    postProcess?: (result: any[]) => any,
    extraFields?: (req: express.Request) => {[key: string]: any}
  } = {}) {
    return errorHandler(async (req, res) => {
      validateRequest(req, `GET ${getReqURI(req)}`);
      const ids = (req.query?.ids as string)?.trim().split(",");
      const selectedFields = new Set((req.query?.include as string)?.trim().split(","));
      const fetch = new Set((req.query?.fetch as string)?.trim().split(","))
                    .union(new Set(Object.keys(this.fields).filter(v => this.fields[v]?.fetch)));
      const result = (await db.query<any[][]>(`
        IF ${this.permissions.getById.general} {
          RETURN SELECT ${
            ["*", ...(selectedFields ? selectedFields.intersection(new Set(Object.keys(this.fields))) : [])]
            .map(v => this.fields[v]?.SELECT || v)
            .join(",")
          } FROM ${WHERE ? this.table :"array::map($ids, |$id| type::thing($id))"}
          WHERE ${this.permissions.getById.perRecord || "true"} AND ${WHERE?.(req) || "true"}
          ${ORDER ? `ORDER BY ${ORDER}` : ""} ${LIMIT ? `LIMIT ${LIMIT}` : ""}
          ${fetch.size ? "FETCH type::fields($fetch)" : ""};
        } ELSE {
          THROW "x-permission-denied";
        }
      `, { user: req.user, ids, fetch: [...fetch], ...(extraFields?.(req) || {}) }))[0];
      if (!result || !result.length) throw new NotFoundError();
      respond200(res, `GET ${getReqURI(req)}`, postProcess ? postProcess(result) : { [`${this.table}s`]: result });
    });
  }

  public update() {
    return errorHandler(async (req, res) => {
      validateRequest(req, `POST ${getReqURI(req)}`);
      const { id, ...updated } = req.body;
      const result = await db.query<any[]>(`
        IF ${this.permissions.update.general} {
          RETURN UPDATE ONLY type::thing($id) MERGE {
            ${
              Object.keys(updated)
              .map(k => `${k}: ${this.fields[k]?.CONVERTER?.replace("$field", `$fields.${k}`) || `$fields.${k}`}`)
              .join(",")
            }
          } ${this.permissions.update.perRecord ? `WHERE ${this.permissions.update.perRecord}` : ""};
        } ELSE {
          THROW "x-permission-denied";
        }
      `, { user: req.user, id, fields: updated });
      respond200(res, `POST ${getReqURI(req)}`, { [`${this.table}`]: result[0] });
    });
  }

  public remove() {
    return errorHandler(async (req, res) => {
      validateRequest(req, `POST ${getReqURI(req)}`);
      const removed = (await db.query<any[][]>(`
        IF ${this.permissions.remove.general} {
          RETURN DELETE array::map($ids, |$v| type::thing($v))
          ${this.permissions.remove.perRecord ? `WHERE ${this.permissions.remove.perRecord}` : ""} 
          RETURN BEFORE;
        } ELSE {
          THROW "x-permission-denied";
        }
        `, { user: req.user, ids: req.body.ids }))[0];
      if (!removed || !removed.length) throw new NotFoundError();
      respond200(res, `POST ${getReqURI(req)}`, { [`${this.table}s`]: removed.map(v => v.id) });
    });
  }
}