import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { File } from '../database/models';
import jwt from 'jsonwebtoken';

const fileRouter = express.Router();

fileRouter.get('/nginx_verify', (req, res) => {
  //   proxy_set_header X-Real-IP $remote_addr;
  //   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  //   proxy_set_header X-Original-URI $request_uri;
  //   proxy_set_header X-HTTP-Method $request_method;
  try {
    console.log(req.headers);
    const url = new URL("http://localhost" + req.headers['x-original-uri']?.toString());
    console.log(url)
    const token = url.searchParams.get("token") || "";
    console.log(token);
    const payload = jwt.verify(token, process.env.FILETOKEN_SECRET!);
    console.log(payload);
    if (typeof payload !== "object") throw new Error("Invalid JWT payload");
    console.log("payload ok")
    if (req.headers['x-real-ip']?.includes(payload.ip) || payload.ip?.includes(req.headers['x-real-ip'])) throw new Error("IP mismatch");
    console.log("ip ok")
    res.status(200).send("OK");
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
});

fileRouter.use(ensureAuth);

fileRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("file:")))
    throw new FieldsInvalidError();

  const files = (await db.query<File[][]>(`
    SELECT * FROM array::map($ids, |$id| type::thing($id))
    WHERE !shared_with OR $user_id IN shared_with;
  `, {ids, user_id: req.employee?.id}))[0];

  const token = jwt.sign(
      {
        employee_id: req.employee?.id,
        session_key: req.employee?.session_key,
        user_agent: req.headers['user-agent'],
        ip: req.ip,
        files: files.map(file => file.id),
      },
      process.env.FILETOKEN_SECRET!,
      { algorithm: 'HS512', expiresIn: '5h' }
    );

  if (!files || !files.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "File(s) retrieved",
    data: {
      token,
      files
    },
  });
}));

fileRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
  const { name, notes, address, contact_email, contact_phone } = req.body;
  if (!name || !address || !contact_email || !contact_phone) 
    throw new FieldsRequiredError();

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

fileRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
  const { id, name, notes, address, contact_email, contact_phone } = req.body;
  if (!id) 
    throw new FieldsRequiredError();
  if (!id.startsWith("location:")) 
    throw new FieldsInvalidError();

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

fileRouter.post('/remove', ensureAdmin, errorHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) 
    throw new FieldsRequiredError();
  if (!id.startsWith("location:")) 
    throw new FieldsInvalidError();

  const location = (await db.query(`DELETE ONLY type::thing($id) RETURN BEFORE;`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Location removed",
    data: { location },
  });
}));

export default fileRouter;