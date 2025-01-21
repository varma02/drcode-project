import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { Subject } from '../database/models';

const studentRouter = express.Router();

studentRouter.use(ensureAuth);

studentRouter.get('/all', errorHandler(async (req, res) => {
  const students = (await db.query(`
    SELECT * FROM student;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All students retrieved",
    data: { students },
  });
}));

studentRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("student:")))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  // if (req.query.include) {
  //   const include = new Set((req.query.include as string).trim().split(","));
  //   if (include.has("something")) selection.push("some_query");
  // }
  const students = (await db.query<Subject[][]>(`
    SELECT ${selection.join(",")} FROM array::map($ids, |$id| type::thing($id));
  `, {ids}))[0];

  if (!students || !students.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Student(s) retrieved",
    data: { students },
  });
}));

studentRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
  const { name, email, notes, parent } = req.body;
  if (!name)
    throw new FieldsRequiredError();
  
  const student = (await db.query(`
    CREATE ONLY student CONTENT {
      ${notes ? "notes: $notes," : ""}
      ${email ? "email: $email," : ""}
      ${parent ? "parent: $parent," : ""}
      name: $name,
    };
  `, { name, email, notes, parent }))[0];
  res.status(200).json({
    code: "success",
    message: "Student created",
    data: { student },
  });
}));

studentRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
  const { id, name, email, notes, parent } = req.body;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("student:"))
    throw new FieldsInvalidError();

  const student = (await db.query(`
    UPDATE ONLY type::thing($id) MERGE {
      ${notes ? "notes: $notes," : ""}
      ${email ? "email: $email," : ""}
      ${parent ? "parent: $parent," : ""}
      ${name ? "name: $name," : ""}
    };
  `, { id, name, email, notes, parent }))[0];

  res.status(200).json({
    code: "success",
    message: "Student updated",
    data: { student },
  });
}));

studentRouter.post('/remove', ensureAdmin, errorHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("student:"))
    throw new FieldsInvalidError();

  const student = (await db.query(`DELETE ONLY type::thing($id) RETURN BEFORE;`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Student removed",
    data: { student },
  });
}));

export default studentRouter;