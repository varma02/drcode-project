import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { DBSubject } from '../database/models';
import { addAllGetter, addRemover } from '../lib/defaultCRUD';

const subjectRouter = express.Router();

subjectRouter.use(ensureAuth);

addRemover(subjectRouter, "subject");

addAllGetter(subjectRouter, "subject");

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
  const subjects = (await db.query<DBSubject[][]>(`
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
  const { name, description } = req.body;
  if (!name) 
    throw new FieldsRequiredError();
  
  const subject = (await db.query(`
    CREATE ONLY subject CONTENT {
      ${description ? "description: $description," : ""}
      name: $name,
    };
  `, { name, description }))[0];
  res.status(200).json({
    code: "success",
    message: "Subject created",
    data: { subject },
  });
}));

subjectRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
  const { id, name, description } = req.body;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("subject:"))
    throw new FieldsInvalidError();

  const subject = (await db.query(`
    UPDATE ONLY type::thing($id) MERGE {
      ${description ? "description: $description," : ""}
      ${name ? "name: $name," : ""}
    };
  `, { id, name, description }))[0];

  res.status(200).json({
    code: "success",
    message: "Subject updated",
    data: { subject },
  });
}));

export default subjectRouter;