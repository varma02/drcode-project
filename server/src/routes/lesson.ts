import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';

const lessonRouter = express.Router();

lessonRouter.use(ensureAuth);

lessonRouter.get('/all', async (req, res) => {
  const lessons = (await db.query(`
    SELECT * FROM lesson;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All lessons retrieved",
    data: { lessons },
  });
});

lessonRouter.get('/between_dates', async (req, res) => {
  const { start, end } = req.query;
  if (!start && !end) {
    res.status(400).json({
      code: "fields_required",
      message: "One or more fields are missing or invalid",
    });
    return;
  }

  const lessons = (await db.query(`
    SELECT * FROM lesson WHERE
    ${start ? "start >= type::datetime($start)" : "true"}
    AND
    ${end ? "end <= type::datetime($end);" : "true"};
  `, { start, end }))[0];

  res.status(200).json({
    code: "success",
    message: "Lessons retrieved",
    data: { lessons },
  });
});

lessonRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || !id.startsWith("lesson:")) {
    res.status(400).json({
      code: "fields_required",
      message: "Invalid lesson ID",
    });
    return;
  }
  const selection = [];
  selection.push("*");
  if (req.query.include) {
    const include = new Set((req.query.include as string)
      .trim().split(",")).intersection(new Set(["teachers", "students_attended", "students_replaced"]));
    if (include.has("teachers")) selection.push("teachers.*.*");
    if (include.has("students_attended")) selection.push("<-attended<-student.* as students_attended");
    if (include.has("students_replaced")) selection.push("<-replaced<-student.* as students_replaced");
  }
  const lesson = (await db.query(`
    SELECT ${selection.join(",")} OMIT teachers.*.password, teachers.*.session_key FROM ONLY type::thing($id) FETCH location;
  `, {id}))[0];

  res.status(200).json({
    code: "success",
    message: "Lesson retrieved",
    data: { lesson },
  });
});

lessonRouter.post('/create', ensureAdmin, async (req, res) => {
  const { name, group, notes, location, teachers, start, end } = req.body;
  if (!start || !end) {
    res.status(400).json({
      code: "fields_required",
      message: "One or more fields are missing or invalid",
    });
    return;
  }
  try {
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
  } catch (e) {
    console.trace(e);
    res.status(400).json({
      code: "bad_request",
      message: "One or more fields are missing or invalid",
    });
  }
});

lessonRouter.post('/update', ensureAdmin, async (req, res) => {
  const { id, name, group, notes, location, teachers, start, end } = req.body;
  if (!id || !id.startsWith("lesson:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

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
});

lessonRouter.post('/remove', ensureAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id || !id.startsWith("lesson:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

  const lesson = (await db.query(`DELETE ONLY type::thing($id);`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Lesson removed",
    data: { lesson },
  });
});

export default lessonRouter;