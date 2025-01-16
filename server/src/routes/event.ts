import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { DEvent } from '../database/models';

const eventRouter = express.Router();

eventRouter.use(ensureAuth);

eventRouter.get('/all', errorHandler(async (req, res) => {
  const events = (await db.query(`
    SELECT * FROM event;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All events retrieved",
    data: { events },
  });
}));

eventRouter.get('/between_dates', errorHandler(async (req, res) => {
  const { start, end } = req.query;
  if (!start && !end) 
    throw new FieldsRequiredError();

  const events = (await db.query<Event[][]>(`
    SELECT * FROM event WHERE
    ${start ? "start >= type::datetime($start)" : "true"}
    AND
    ${end ? "end <= type::datetime($end);" : "true"};
  `, { start, end }))[0];

  if (!events || !events.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Events retrieved",
    data: { events },
  });
}));

eventRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("event:")))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  // if (req.query.include) {
  //   const include = new Set((req.query.include as string).trim().split(","));
  //   if (include.has("something")) selection.push("some_query");
  // }
  const events = (await db.query<Event[][]>(`
    SELECT ${selection.join(",")} FROM array::map($ids, |$id| type::thing($id));
  `, {ids}))[0];

  if (!events || !events.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Event(s) retrieved",
    data: { events },
  });
}));

eventRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
  const { location, name, notes, signup_limit, start, end } = req.body;
  if (!start || !end || !name) 
    throw new FieldsRequiredError();

  const event = (await db.query(`
    CREATE ONLY event CONTENT {
      ${notes ? "notes: $notes," : ""}
      ${location ? "location: type::thing($location)," : ""}
      ${signup_limit ? "signup_limit: $signup_limit," : ""}
      name: $name,
      author: type::thing($author),
      start: type::datetime($start),
      end: type::datetime($end)
    };
  `, {author: req.employee!.id, location, name, notes, signup_limit, start, end}))[0];
  res.status(200).json({
    code: "success",
    message: "Event created",
    data: { event },
  });
}));

eventRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
  const { id, location, name, notes, signup_limit, start, end } = req.body;
  if (!id) 
    throw new FieldsRequiredError();
  if (!id.startsWith("event:"))
    throw new FieldsInvalidError();

  const event = (await db.query(`
    UPDATE ONLY type::thing($id) MERGE {
      ${notes ? "notes: $notes," : ""}
      ${location ? "location: type::thing($location)," : ""}
      ${signup_limit ? "signup_limit: $signup_limit," : ""}
      ${name ? "name: $name," : ""}
      ${start ? "start: type::datetime($start)," : ""}
      ${end ? "end: type::datetime($end)" : ""}
    };
  `, { id, location, name, notes, signup_limit, start, end }))[0];

  res.status(200).json({
    code: "success",
    message: "Event updated",
    data: { event },
  });
}));

eventRouter.post('/remove', ensureAdmin, errorHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) 
    throw new FieldsRequiredError();
  if (!id.startsWith("event:")) 
    throw new FieldsInvalidError();

  const event = (await db.query(`DELETE ONLY type::thing($id);`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Event removed",
    data: { event },
  });
}));

export default eventRouter;