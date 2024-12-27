import express from 'express';
import ensureAuth from '../middleware/ensureauth';
import { ensureAdmin } from '../middleware/ensureadmin';
import type { Class } from '../database/models';
import db from '../database/connection';

const classesRouter = express.Router();

classesRouter.use(ensureAuth);

classesRouter.get('/all', ensureAdmin, async (req, res) => {
  const include = new Set((req.query.include as string).trim().split(","));
  const dbResponse = (await db.query<Class[][]>(`
    SELECT * ${include.has("teachers") ? ", teachers.*.* OMIT teachers.*.{password,session_key}" : ""} FROM class
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All classes retrieved",
    data: { classes: dbResponse },
  });
});

classesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || !id.startsWith("class:")) {
    res.status(404).json({
      code: "not_found",
      message: "No class was found with the provided ID",
    });
    return;
  }
  
  const dbResponse = (await db.query<Class[]>(`
    SELECT *, teachers.*.* OMIT teachers.*.{password,session_key} FROM ONLY type::thing($class)
  `, { class: id }))[0];

  if (!dbResponse.created) {
    res.status(404).json({
      code: "not_found",
      message: "No class was found with the provided ID",
    });
    return;
  }

  res.status(200).json({
    code: "success",
    message: "Class retrieved",
    data: { class: dbResponse },
  });
});

classesRouter.post('/create', ensureAdmin, async (req, res) => {
  const {location, notes = "", teachers, archived = false, lessons} = req.body;
  if (!location || !teachers) {
    res.status(400).json({
      code: "fields_required",
      message: "The location and teachers fields are required",
    });
    return;
  }

  try {
    const newClass = (await db.query<Class[]>("CREATE ONLY class SET location = $location, notes = $notes, teachers = $teachers, archived = $archived", 
      { location, notes, teachers, archived }))[0];

    res.status(200).json({
      code: "success",
      message: "Class created",
      data: { class: newClass },
    });

  } catch (e) {
    res.status(400).json({
      code: "fields_invalid",
      message: "One or more fields are invalid",
    });
    return;
  }
});

export default classesRouter;