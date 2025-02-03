import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { Group } from '../database/models';
import { addAllGetter, addRemover } from '../lib/defaultCRUD';

const groupsRouter = express.Router();

groupsRouter.use(ensureAuth);

addRemover(groupsRouter, "group");

addAllGetter(groupsRouter, "group", "", "location");

groupsRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("group:")))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  if (req.query.include) {
    const include = new Set((req.query.include as string).trim().split(","));
    if (include.has("enroled")) selection.push("<-enroled.* as enroled");
    if (include.has("subjects")) selection.push("array::group(<-enroled.subject) as subjects");
    if (include.has("lessons")) selection.push("(SELECT VALUE id FROM lesson WHERE $parent.id = group.id) AS lessons");
  }
  const groups = (await db.query<Group[][]>(`
    SELECT ${selection.join(",")} FROM array::map($ids, |$id| type::thing($id));
  `, {ids}))[0];

  if (!groups || !groups.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Group(s) retrieved",
    data: { groups },
  });
}));

groupsRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
  const { name, location, teachers, notes, lessons } = req.body;
  if (!name || !location || !teachers)
    throw new FieldsRequiredError();

  const group = (await db.query(`
    BEGIN TRANSACTION;
    $group = CREATE ONLY group CONTENT {
      name: $name,
      location: type::thing($location),
      teachers: array::map($teachers, |$v| type::thing($v)),
      notes: $notes
    };
    ${lessons?.length > 0 ? `
      FOR $lesson IN $lessons {
        CREATE ONLY lesson CONTENT {
          group: type::thing($group.id),
          start: type::datetime($lesson.start),
          end: type::datetime($lesson.end),
        };
      };
    ` : ""}
    RETURN $group;
    COMMIT TRANSACTION;
  `, {name, location, teachers, notes, lessons}))[0];
  
  res.status(200).json({
    code: "success",
    message: "Group created",
    data: { group },
  });
  
}));

groupsRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
  const { id, name, location, notes, teachers, archived  } = req.body;
  if (!id)
    throw new FieldsRequiredError();
  if (!id.startsWith("group:"))
    throw new FieldsInvalidError();

  const group = (await db.query(`
    UPDATE ONLY type::thing($id) MERGE {
      ${name ? "name: $name," : ""}
      ${notes ? "notes: $notes," : ""}
      ${location ? "location: type::thing($location)," : ""}
      ${teachers ? "teachers: array::map($teachers, |$v| type::thing($v))," : ""}
      ${archived ? "archived: $archived," : ""}
    };
  `, { id, name, location, notes, teachers, archived }))[0];

  res.status(200).json({
    code: "success",
    message: "Group updated",
    data: { group },
  });
}));

export default groupsRouter;