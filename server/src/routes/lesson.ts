import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { Lesson } from '../database/models';
import { addRemover } from '../lib/defaultCRUD';

const lessonRouter = express.Router();

lessonRouter.use(ensureAuth);

addRemover(lessonRouter, "lesson");

lessonRouter.get('/all', errorHandler(async (req, res) => {
  const lessons = (await db.query(`
    SELECT * FROM lesson;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All lessons retrieved",
    data: { lessons },
  });
}));

lessonRouter.get('/between_dates', errorHandler(async (req, res) => {
  const { start, end } = req.query;
  if (!start && !end) 
    throw new FieldsRequiredError();

  const lessons = (await db.query<Lesson[][]>(`
    SELECT * FROM lesson WHERE
    ${start ? "start >= type::datetime($start)" : "true"}
    AND
    ${end ? "end <= type::datetime($end);" : "true"};
  `, { start, end }))[0];

  if (!lessons || !lessons.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Lessons retrieved",
    data: { lessons },
  });
}));

lessonRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("lesson:")))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  if (req.query.include) {
    const include = new Set((req.query.include as string).trim().split(","));
    if (include.has("students_attended")) selection.push("<-attended<-student as students_attended");
    if (include.has("students_replaced")) selection.push("<-replaced<-student as students_replaced");
  }
  const lessons = (await db.query<Lesson[][]>(`
    SELECT ${selection.join(",")} FROM array::map($ids, |$id| type::thing($id));
  `, {ids}))[0];

  if (!lessons || !lessons.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Lesson(s) retrieved",
    data: { lessons },
  });
}));

lessonRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
  const { name, group, notes, location, teachers, start, end } = req.body;
  if (!start || !end) 
    throw new FieldsRequiredError();

  const lesson = (await db.query(`
    CREATE ONLY lesson CONTENT {
      ${name ? "name: $name," : ""}
      ${notes ? "notes: $notes," : ""}
      ${location ? "location: type::thing($location)," : ""}
      ${teachers ? "teachers: array::map($teachers, |$v| type::thing($v))," : ""}
      ${group ? "group: type::thing($group)," : ""}
      start: type::datetime($start),
      end: type::datetime($end)
    };
  `, {name, group, notes, location, teachers, start, end}))[0];
  res.status(200).json({
    code: "success",
    message: "Lesson created",
    data: { lesson },
  });
}));

lessonRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
  const { id, name, group, notes, location, teachers, start, end } = req.body;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("lesson:")) 
    throw new FieldsInvalidError();

  const lesson = (await db.query(`
    UPDATE ONLY type::thing($id) MERGE {
      ${name ? "name: $name," : ""}
      ${notes ? "notes: $notes," : ""}
      ${location ? "location: type::thing($location)," : ""}
      ${teachers ? "teachers: array::map($teachers, |$v| type::thing($v))," : ""}
      ${group ? "group: type::thing($group)," : ""}
      ${start ? "start: type::datetime($start)," : ""}
      ${end ? "end: type::datetime($end)," : ""}
    };
  `, { id, name, group, notes, location, teachers, start, end }))[0];

  res.status(200).json({
    code: "success",
    message: "Lesson updated",
    data: { lesson },
  });
}));

export default lessonRouter;