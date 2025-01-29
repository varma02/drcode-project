import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError, UnauthorizedError } from '../lib/errors';
import type { Employee, File } from '../database/models';
import jwt from 'jsonwebtoken';

const fileRouter = express.Router();

fileRouter.get('/nginx_verify', async (req, res): Promise<any> => {
  try {
    const url = new URL("http://localhost" + req.headers['x-original-uri']?.toString());
    const token = url.searchParams.get("token") || "";
    const payload = jwt.verify(token, process.env.FILETOKEN_SECRET!);
  
    if (typeof payload != "object") throw new UnauthorizedError("Invalid JWT payload");
    if (req.headers['x-real-ip']?.includes(payload.ip) || payload.ip?.includes(req.headers['x-real-ip'])) throw new UnauthorizedError("IP mismatch");
    const employee = (await db.query<Employee[]>(`SELECT * OMIT password FROM ONLY type::thing($id);`, { id: payload.employee_id }))[0];
    
    if (!employee) throw new UnauthorizedError("Employee not found");
    // if (!employee.session_key || employee.session_key != payload.session_key) throw new UnauthorizedError("Session key mismatch");
    if (url.pathname.includes("/upload") || payload.upload) {
      const file = (await db.query<File[]>(`SELECT * FROM ONLY type::thing($id);`, { id: payload.files[0] }))[0];
      
      if (!file) throw new UnauthorizedError("File not found");
      if (employee.id.toString() != file.author.toString()) throw new UnauthorizedError("Unauthorized");
      if (!url.pathname.endsWith(file.path)) throw new UnauthorizedError("Path mismatch");
    }
    return res.status(200).send("OK");
  } catch (e) {
    if (!(e instanceof UnauthorizedError))
      console.trace(e);
  }
  res.status(401).send("Unauthorized");
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
        user_agent: req.headers['user-agent'],
        ip: req.ip,
        files: files.map(file => file.id),
        upload: false,
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
  const { name, mime_type, shared_with = [], size } = req.body;
  if (!name || !mime_type || !size) 
    throw new FieldsRequiredError();

  const file = (await db.query<File[]>(`
    CREATE ONLY file CONTENT {
      author: type::thing($user_id),
      name: $name,
      mime_type: $mime_type,
      shared_with: array::map($shared_with, |$id| type::thing($id)),
      size: $size,
    };
  `, { name, mime_type, shared_with, size, user_id: req.employee?.id }))[0];

  const token = jwt.sign(
    {
      employee_id: req.employee?.id,
      user_agent: req.headers['user-agent'],
      ip: req.ip,
      files: [file.id],
      upload: true,
    },
    process.env.FILETOKEN_SECRET!,
    { algorithm: 'HS512', expiresIn: '1h' }
  );

  res.status(200).json({
    code: "success",
    message: "File created",
    data: {
      token,
      file,
    },
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