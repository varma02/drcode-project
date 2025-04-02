import express from 'express';
import errorHandler from './errorHandler';
import { BadRequestError, FieldsInvalidError, FieldsRequiredError, NotFoundError } from './errors';
import db from '../database/connection';
import ensureAuth from '../middleware/ensureauth';

export const PermissionDefaults: {[key:string]:Permission} = {
  everyone: {general: `TRUE`},
  noone: {general: `FALSE`},
  adminOnly: {general: `!array::is_empty(array::intersect(user.roles, ["administrator"]))`},
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
    required?: boolean;
    writable?: boolean;
    CONVERTER?: string;
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

  public create() {
    return errorHandler(async (req, res) => {
      const result = (await db.query(`
        IF ${this.permissions.create.general} {
          RETURN CREATE ONLY type::table($table) CONTENT {
            ${Object.entries(this.fields).filter(v => req.body[v[0]] !== undefined).map(v => `${v[0]}: ${v[1].CONVERTER?.replace("$field", `$fields.${v[0]}`) || `$fields.${v[0]}`}`).join(",")}
          };
        } ELSE {
          THROW "permission-denied"
        }
      `, { user: req.user, table: this.table, fields: req.body }))[0];
    
      res.status(200).json({
        code: "success",
        data: { [`${this.table}s`]: result },
      });
    });
  }

  public getAll() {
    return errorHandler(async (req, res) => {      
      const result = (await db.query(`
        IF ${this.permissions.getAll.general} {
          RETURN SELECT ${Object.entries(this.fields).filter(v => v[1].SELECT === undefined).map(v => v[0]).join(",")} FROM type::table($table)
        } ELSE {
          THROW "permission-denied"
        }
      `, { user: req.user, table: this.table }))[0];
      res.status(200).json({
        code: "success",
        data: { [`${this.table}s`]: result },
      });
    });
  }

  public get() {
    return errorHandler(async (req, res) => {
      const ids = (req.query.ids as string).trim().split(",");
      if (!ids)
        throw new FieldsRequiredError("The `ids` field is required.");
      if (!Array.isArray(ids) || ids.length == 0 ||!ids.every(id => id.startsWith(`${this.table}:`))) 
        throw new FieldsInvalidError("The `ids` field is invalid.");
      const selectedFields = req.query.fields ? new Set((req.query.fields as string).trim().split(",")) : undefined;
      
      const result = (await db.query<any[][]>(`
        IF ${this.permissions.getById.general} {
          RETURN SELECT ${
            Object.entries(this.fields)
            .filter(v => selectedFields ? selectedFields.has(v[0]) : !v[1].SELECT)
            .map(v => v[1].SELECT || v[0])
            .join(",")
          } FROM array::map($ids, |$id| type::thing($id));
        } ELSE {
          THROW "permission-denied";
        }
      `, { user: req.user, ids }))[0];
    
      if (!result || !result.length)
        throw new NotFoundError();
    
      res.status(200).json({
        code: "success",
        data: { [`${this.table}s`]: result },
      });
    });
  }

  public update() {
    return errorHandler(async (req, res) => {
      const { id, ...updated } = req.body;
      if (!id || !updated) 
        throw new FieldsRequiredError();
    
      if (!id.startsWith(`${this.table}:`))
        throw new FieldsInvalidError();
    
      const result = await db.query<any[]>(`
        IF ${this.permissions.update.general} {
          RETURN UPDATE ONLY type::thing($id) MERGE {
            ${
              Object.entries(this.fields)
              .filter(v => updated[v[0]] !== undefined && v[1].writable)
              .map(v => `${v[0]}: ${v[1].CONVERTER?.replace("$field", `$fields.${v[0]}`) || `$fields.${v[0]}`}`)
              .join(",")
            }
          }; 
        } ELSE {
          THROW "permission-denied";
        }
        `, { user: req.user, id, fields: updated });

      for (const field of new Set(Object.keys(result[0])).difference(new Set(Object.keys(this.fields)))) {
        delete result[0][field];
      }
      res.status(200).json({
        code: "success",
        data: { [`${this.table}`]: result[0] },
      });
    });
  }

  public remove() {
    return errorHandler(async (req, res) => {
      const { ids } = req.body;
      if (!ids)
        throw new FieldsRequiredError("The `ids` field is required.");
      if (!Array.isArray(ids) || ids.length == 0 || !ids.every(id => id.startsWith(`${this.table}:`))) 
        throw new FieldsInvalidError("The `ids` field is invalid.");

      const removed = (await db.query<any[][]>(`
        IF ${this.permissions.remove.general} {
          RETURN DELETE array::map($ids, |$v| type::thing($v)) RETURN BEFORE;
        } ELSE {
          THROW "permission-denied";
        }
        `, { user: req.user, ids }))[0];
  
      if (!removed || !removed.length)
        throw new NotFoundError();
    
      res.status(200).json({
        code: "success",
        data: { [`${this.table}s`]: removed.map(v => v.id) },
      });
    });
  }
}