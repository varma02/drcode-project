import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError } from '../lib/errors';
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

subjectRouter.get('/:id', errorHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("subject:"))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  // if (req.query.include) {
  //   const include = new Set((req.query.include as string)
  //     .trim().split(",")).intersection(new Set([""]));
  //   if (include.has("")) selection.push("");
  // }
  const subject = (await db.query<Subject[]>(`
    SELECT ${selection.join(",")}
    OMIT password, session_key
    FROM ONLY type::thing($id);
  `, {id}))[0];

  if (!subject || !subject.id)
    throw new FieldsInvalidError();

  res.status(200).json({
    code: "success",
    message: "Subject retrieved",
    data: { subject },
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