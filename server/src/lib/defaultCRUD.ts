import type { Router } from "express";
import { ensureAdmin } from "../middleware/ensureadmin";
import errorHandler from "./errorHandler";
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from "./errors";
import db from "../database/connection";

export function addAllGetter(router: Router, table: string, SELECT = "", FETCH = "") {
  router.get('/all', ensureAdmin, errorHandler(async (req, res) => {
    const data = (await db.query(`SELECT ${SELECT || "*"} FROM type::table($table) ${FETCH ? "FETCH " + FETCH : "" }`, { table }))[0];
  
    res.status(200).json({
      code: "success",
      message: `All ${table}s retrieved`,
      data: { [`${table}s`]: data },
    });
  }));
}

export function addRemover(router: Router, table: string, WHERE = "", DBPARAMS?: object) {
  router.post('/remove', ensureAdmin, errorHandler(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length == 0)
      throw new FieldsRequiredError();
    if (!ids.every(id => id.startsWith(`${table}:`))) 
      throw new FieldsInvalidError();
  
    let removed: any;
    if (!WHERE) {
      removed = (await db.query(`DELETE array::map($ids, |$v| type::thing($v)) RETURN BEFORE;`, { ids }))[0];
    } else {
      removed = (await db.query(`DELETE array::map($ids, |$v| type::thing($v)) WHERE ${WHERE} RETURN BEFORE;`, { ids, ...DBPARAMS }))[0];
    }

    if (!removed || !removed.length)
      throw new NotFoundError();
  
    res.status(200).json({
      code: "success",
      message: `${table} removed`,
      data: { [`${table}s`]: removed },
    });
  }));
}