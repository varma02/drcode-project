import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';

const groupsRouter = express.Router();

groupsRouter.use(ensureAuth);

groupsRouter.get('/all', async (req, res) => {
  const groups = (await db.query(`
    SELECT * FROM group FETCH location;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All groups retrieved",
    data: { groups },
  });
});

groupsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const selection = [];
  selection.push("*");
  if (req.query.include) {
    const include = new Set((req.query.include as string)
      .trim().split(",")).intersection(new Set(["teachers", "students", "lessons", "subjects"]));
    if (include.has("teachers")) selection.push("teachers.*.*");
    if (include.has("students")) selection.push("<-enroled<-student.* as students");
    if (include.has("subjects")) selection.push("array::group(<-enroled.subject.*) as subjects");
    if (include.has("lessons")) selection.push("(SELECT * FROM lesson WHERE $parent.id = group.id) AS lessons");
  }
  const group = (await db.query(`
    SELECT ${selection.join(",")} OMIT teachers.*.password, teachers.*.session_key FROM ONLY type::thing($groupid) FETCH location;
  `, {groupid: id}))[0];

  res.status(200).json({
    code: "success",
    message: "Group retrieved",
    data: { group },
  });
});

groupsRouter.post('/create', ensureAdmin, async (req, res) => {
  const { name, location, teachers, notes, lessons } = req.body;
  if (!name || !location || !teachers || !Array.isArray(teachers)) {
    res.status(400).json({
      code: "bad_request",
      message: "One or more fields are missing or invalid",
    });
    return;
  }
  try {
    const group = (await db.query(`
      BEGIN TRANSACTION;
      $group = CREATE ONLY group CONTENT {
        name: $name,
        location: $location,
        teachers: $teachers,
        notes: $notes
      };
      ${lessons.length > 0 ? `
        FOR $lesson IN $lessons {
          CREATE ONLY lesson CONTENT {
            group: $group,
            start: $lesson.start,
            end: $lesson.end,
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
  } catch (e) {
    console.trace(e);
    res.status(400).json({
      code: "bad_request",
      message: "One or more fields are missing or invalid",
    });
  }
});

groupsRouter.post('/update', ensureAdmin, async (req, res) => {
  const { id, name, location, notes, teachers, archived  } = req.body;
  if (!id || !id.startsWith("group:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

  const group = (await db.query(`
    UPDATE ONLY type::thing($id) MERGE {
      ${name ? "name: $name," : ""}
      ${notes ? "notes: $notes," : ""}
      ${location ? "location: $location," : ""}
      ${teachers ? "teachers: $teachers," : ""}
      ${archived ? "archived: $archived," : ""}
    };
  `, { id, name, location, notes, teachers, archived }))[0];

  res.status(200).json({
    code: "success",
    message: "Group updated",
    data: { group },
  });
});

groupsRouter.post('/remove', ensureAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id || !id.startsWith("group:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

  const group = (await db.query(`DELETE ONLY type::thing($id);`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Group removed",
    data: { location: group },
  });
});

export default groupsRouter;