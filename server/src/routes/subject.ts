import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { Subject } from '../database/models';

const subjectRouter = express.Router();

subjectRouter.use(ensureAuth);

subjectRouter.get('/all', errorHandler(async (req, res) => {
  const subjects = (await db.query(`
    SELECT * FROM subject;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All subjects retrieved",
    data: { subjects },
  });
}));

subjectRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("subject:")))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  // if (req.query.include) {
  //   const include = new Set((req.query.include as string).trim().split(","));
  //   if (include.has("something")) selection.push("some_query");
  // }
  const subjects = (await db.query<Subject[][]>(`
    SELECT ${selection.join(",")} FROM array::map($ids, |$id| type::thing($id));
  `, {ids}))[0];

  if (!subjects || !subjects.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Subject(s) retrieved",
    data: { subjects },
  });
}));

subjectRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
  const { name, notes } = req.body;
  if (!name) 
    throw new FieldsRequiredError();
  
  const subject = (await db.query(`
    CREATE ONLY subject CONTENT {
      ${notes ? "notes: $notes," : ""}
      name: $name,
    };
  `, { name, notes }))[0];
  res.status(200).json({
    code: "success",
    message: "Subject created",
    data: { subject },
  });
}));

subjectRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
  const { id, name, notes } = req.body;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("subject:"))
    throw new FieldsInvalidError();

  const subject = (await db.query(`
    UPDATE ONLY type::thing($id) MERGE {
      ${notes ? "notes: $notes," : ""}
      ${name ? "name: $name," : ""}
    };
  `, { id, name, notes }))[0];

  res.status(200).json({
    code: "success",
    message: "Subject updated",
    data: { subject },
  });
}));

subjectRouter.post('/remove', ensureAdmin, errorHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("subject:"))
    throw new FieldsInvalidError();

  const subject = (await db.query(`DELETE ONLY type::thing($id);`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Subject removed",
    data: { subject },
  });
}));

export default subjectRouter;