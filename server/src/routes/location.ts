import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';

const locationsRouter = express.Router();

locationsRouter.use(ensureAuth);

locationsRouter.get('/all', async (req, res) => {
  const locations = (await db.query(`
    SELECT * FROM location;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All locations retrieved",
    data: { locations },
  });
});

locationsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || !id.startsWith("location:")) {
    res.status(400).json({
      code: "fields_required",
      message: "Invalid location ID",
    });
    return;
  }
  const location = (await db.query(`
    SELECT * FROM ONLY type::thing($id);
  `, {id}))[0];

  res.status(200).json({
    code: "success",
    message: "Location retrieved",
    data: { location },
  });
});

locationsRouter.post('/create', ensureAdmin, async (req, res) => {
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
});

locationsRouter.post('/update', ensureAdmin, async (req, res) => {
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
});

locationsRouter.post('/remove', ensureAdmin, async (req, res) => {
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
});

export default locationsRouter;