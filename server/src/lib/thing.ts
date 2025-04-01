import express from 'express';
import errorHandler from './errorHandler';
import { BadRequestError, FieldsInvalidError, FieldsRequiredError, NotFoundError } from './errors';
import db from '../database/connection';

interface Permissions {
  getAll: string;
  getById: string;
  delete: string;
  create: string;
  update: string;
  [key: string]: string;
}

interface Fields {
  [key: string]: {
    SELECT?: string;
    required?: boolean;
    updatable?: boolean;
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

  public create() {
    errorHandler(async (req, res) => {
      const result = (await db.query(`
        CREATE ONLY type::table($table) CONTENT {
          ${Object.entries(this.fields).filter(v => req.body[v[0]] !== undefined).map(v => `${v[0]}: ${v[1].CONVERTER?.replace("$field", `$fields.${v[0]}`) || `$fields.${v[0]}`}`).join(",")}
        };
      `, { table: this.table, fields: req.body }))[0];
    
      res.status(200).json({
        code: "success",
        data: { [`${this.table}s`]: result },
      });
    });
  }

  public getAll() {
    return errorHandler(async (req, res) => {      
      const result = (await db.query(`
        IF ${this.permissions.getAll} {
          RETURN SELECT ${Object.entries(this.fields).filter(v => v[1].SELECT === undefined).map(v => v[0]).join(",")} FROM type::table($table)
        } ELSE {
          THROW "permission-denied"
        }
      `, { table: this.table, user: req.user }))[0];
      res.status(200).json({
        code: "success",
        data: { [`${this.table}s`]: result },
      });
    });
  }

  public get() {
    return errorHandler(async (req, res) => {
      const ids = (req.query.ids as string).trim().split(",");
      if (!ids || !Array.isArray(ids) || ids.length == 0)
        throw new FieldsRequiredError();
      if (!ids.every(id => id.startsWith(`${this.table}:`))) 
        throw new FieldsInvalidError();
      const selectedFields = new Set((req.query.fields as string).trim().split(","));
      
      const result = (await db.query<any[][]>(`
        IF ${this.permissions.getById} {
          RETURN SELECT ${Object.entries(this.fields).filter(v => selectedFields ? selectedFields.has(v[0]) : !v[1].SELECT).map(v => v[1].SELECT || v[0]).join(",")} FROM array::map($ids, |$id| type::thing($id));
        } ELSE {
          THROW "permission-denied";
        }
      `, { ids, user: req.user }))[0];
    
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
        UPDATE ONLY type::thing($id) MERGE {
          ${Object.entries(this.fields).filter(v => updated[v[0]] !== undefined && v[1].updatable).map(v => `${v[0]}: ${v[1].CONVERTER?.replace("$field", `$fields.${v[0]}`) || `$fields.${v[0]}`}`).join(",")}
        };`, { id, fields: updated });
    
      if (!result?.[0]?.email)
        throw new BadRequestError();
    
      delete result[0].password;
      delete result[0].session_key;
      res.status(200).json({
        code: "success",
        data: { [`${this.table}s`]: result },
      });
    });
  }

  public delete() {
    return errorHandler(async (req, res) => {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length == 0)
        throw new FieldsRequiredError();
      if (!ids.every(id => id.startsWith(`${this.table}:`))) 
        throw new FieldsInvalidError();

      const deleted = (await db.query<any[][]>(`
        IF ${this.permissions.delete} {
          RETURN DELETE array::map($ids, |$v| type::thing($v)) WHERE ${this.permissions.DELETE} RETURN BEFORE;
        } ELSE {
          THROW "permission-denied";
        }
      `, { ids, user: req.user }))[0];
  
      if (!deleted || !deleted.length)
        throw new NotFoundError();
    
      res.status(200).json({
        code: "success",
        data: { [`${this.table}s`]: deleted },
      });
    });
  }
}