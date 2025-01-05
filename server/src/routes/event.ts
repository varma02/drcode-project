import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';

const eventRouter = express.Router();

eventRouter.use(ensureAuth);

eventRouter.get('/all', async (req, res) => {
  const events = (await db.query(`
    SELECT * FROM event;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All events retrieved",
    data: { events },
  });
});

eventRouter.get('/between_dates', async (req, res) => {
  const { start, end } = req.query;
  if (!start && !end) {
    res.status(400).json({
      code: "fields_required",
      message: "One or more fields are missing or invalid",
    });
    return;
  }

  const events = (await db.query(`
    SELECT * FROM event WHERE
    ${start ? "start >= type::datetime($start)" : "true"}
    AND
    ${end ? "end <= type::datetime($end);" : "true"};
  `, { start, end }))[0];

  res.status(200).json({
    code: "success",
    message: "Events retrieved",
    data: { events },
  });
});

eventRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || !id.startsWith("event:")) {
    res.status(400).json({
      code: "fields_required",
      message: "Invalid event ID",
    });
    return;
  }
  const selection = [];
  selection.push("*");
  if (req.query.include) {
    const include = new Set((req.query.include as string)
      .trim().split(",")).intersection(new Set(["signups", "author"]));
    if (include.has("signups")) selection.push("signups.*.*");
    if (include.has("author")) selection.push("author.*");
  }
  const event = (await db.query(`
    SELECT ${selection.join(",")}
    OMIT signups.*.password, signups.*.session_key, author.password, author.session_key
    FROM ONLY type::thing($id) FETCH location;
  `, {id}))[0];

  res.status(200).json({
    code: "success",
    message: "Event retrieved",
    data: { event },
  });
});

eventRouter.post('/create', ensureAdmin, async (req, res) => {
  const { location, name, notes, signup_limit, start, end } = req.body;
  if (!start || !end || !name) {
    res.status(400).json({
      code: "fields_required",
      message: "One or more fields are missing or invalid",
    });
    return;
  }
  try {
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
  } catch (e) {
    console.trace(e);
    res.status(400).json({
      code: "bad_request",
      message: "One or more fields are missing or invalid",
    });
  }
});

eventRouter.post('/update', ensureAdmin, async (req, res) => {
  const { id, location, name, notes, signup_limit, start, end } = req.body;
  if (!id || !id.startsWith("event:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

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
});

eventRouter.post('/remove', ensureAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id || !id.startsWith("event:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

  const event = (await db.query(`DELETE ONLY type::thing($id);`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Event removed",
    data: { event },
  });
});

export default eventRouter;