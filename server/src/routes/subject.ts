import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';

const subjectRouter = express.Router();

subjectRouter.use(ensureAuth);

subjectRouter.get('/all', async (req, res) => {
  const subjects = (await db.query(`
    SELECT * FROM subject;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All subjects retrieved",
    data: { subjects },
  });
});

subjectRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || !id.startsWith("subject:")) {
    res.status(400).json({
      code: "fields_required",
      message: "Invalid subject ID",
    });
    return;
  }
  const selection = [];
  selection.push("*");
  // if (req.query.include) {
  //   const include = new Set((req.query.include as string)
  //     .trim().split(",")).intersection(new Set([""]));
  //   if (include.has("")) selection.push("");
  // }
  const subject = (await db.query(`
    SELECT ${selection.join(",")}
    OMIT password, session_key
    FROM ONLY type::thing($id);
  `, {id}))[0];

  res.status(200).json({
    code: "success",
    message: "Subject retrieved",
    data: { subject },
  });
});

subjectRouter.post('/create', ensureAdmin, async (req, res) => {
  const { name, notes } = req.body;
  if (!name) {
    res.status(400).json({
      code: "fields_required",
      message: "One or more fields are missing or invalid",
    });
    return;
  }
  try {
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
  } catch (e) {
    console.trace(e);
    res.status(400).json({
      code: "bad_request",
      message: "One or more fields are missing or invalid",
    });
  }
});

subjectRouter.post('/update', ensureAdmin, async (req, res) => {
  const { id, name, notes } = req.body;
  if (!id || !id.startsWith("subject:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

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
});

subjectRouter.post('/remove', ensureAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id || !id.startsWith("subject:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

  const subject = (await db.query(`DELETE ONLY type::thing($id);`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Subject removed",
    data: { subject },
  });
});

export default subjectRouter;