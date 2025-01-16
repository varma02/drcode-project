import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { Location } from '../database/models';

const locationsRouter = express.Router();

locationsRouter.use(ensureAuth);

locationsRouter.get('/all', errorHandler(async (req, res) => {
  const locations = (await db.query(`
    SELECT * FROM location;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All locations retrieved",
    data: { locations },
  });
}));

locationsRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("location:")))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  // if (req.query.include) {
  //   const include = new Set((req.query.include as string).trim().split(","));
  //   if (include.has("something")) selection.push("some_query");
  // }
  const locations = (await db.query<Location[][]>(`
    SELECT ${selection.join(",")} FROM array::map($ids, |$id| type::thing($id));
  `, {ids}))[0];

  if (!locations || !locations.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Location(s) retrieved",
    data: { locations },
  });
}));

locationsRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
  const { name, notes, address, contact_email, contact_phone } = req.body;
  if (!name || !address || !contact_email || !contact_phone) {
    res.status(400).json({
      code: "fields_required",
      message: "One or more of the required fields are missing",
    });
    return;
  }

  const location = (await db.query(`
    CREATE ONLY location CONTENT {
      name: $name,
      ${notes ? "notes: $notes," : ""}
      address: $address,
      contact_email: $contact_email,
      contact_phone: $contact_phone
    };
  `, { name, notes, address, contact_email, contact_phone }))[0];

  res.status(200).json({
    code: "success",
    message: "Location created",
    data: { location },
  });
}));

locationsRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
  const { id, name, notes, address, contact_email, contact_phone } = req.body;
  if (!id || !id.startsWith("location:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

  const location = (await db.query(`
    UPDATE ONLY type::thing($id) MERGE {
      ${name ? "name: $name," : ""}
      ${notes ? "notes: $notes," : ""}
      ${address ? "address: $address," : ""}
      ${contact_email ? "contact_email: $contact_email," : ""}
      ${contact_phone ? "contact_phone: $contact_phone," : ""}
    };
  `, { id, name, notes, address, contact_email, contact_phone }))[0];

  res.status(200).json({
    code: "success",
    message: "Location updated",
    data: { location },
  });
}));

locationsRouter.post('/remove', ensureAdmin, errorHandler(async (req, res) => {
  const { id } = req.body;
  if (!id || !id.startsWith("location:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }

  const location = (await db.query(`DELETE ONLY type::thing($id);`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Location removed",
    data: { location },
  });
}));

export default locationsRouter;