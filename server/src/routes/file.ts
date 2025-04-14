import db from '../database/connection';
import { UnauthorizedError } from '../lib/errors';
import type { DBEmployee, DBFile } from '../database/models';
import jwt from 'jsonwebtoken';

import { PermissionDefaults, Thing } from '../lib/thing';

const file = new Thing({
  table: "file",
  permissions: {
    create: PermissionDefaults.everyone,
    getAll: PermissionDefaults.noone,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    
  }
})

file.router.get('/nginx_verify', async (req, res): Promise<any> => {
  try {
    const url = new URL("http://localhost" + req.headers['x-original-uri']?.toString());
    const token = url.searchParams.get("token") || "";
    const payload = jwt.verify(token, process.env.FILETOKEN_SECRET!);
  
    if (typeof payload != "object") throw new UnauthorizedError("Invalid JWT payload");
    if (req.headers['x-real-ip']?.includes(payload.ip) || payload.ip?.includes(req.headers['x-real-ip'])) throw new UnauthorizedError("IP mismatch");
    const employee = (await db.query<DBEmployee[]>(`SELECT * OMIT password FROM ONLY type::thing($id);`, { id: payload.employee_id }))[0];
    if (!employee) throw new UnauthorizedError("Employee not found");
    // TODO: if (!employee.session_key || employee.session_key != payload.session_key) throw new UnauthorizedError("Session key mismatch");

    if ((url.pathname.includes("/upload/") || payload.upload) && payload.upload != "profile_picture") {
      const file = (await db.query<DBFile[]>(`SELECT * FROM ONLY type::thing($id);`, { id: payload.files[0] }))[0];
      if (!file) throw new UnauthorizedError("File not found");
      if (employee.id.toString() != file.author.toString()) throw new UnauthorizedError("Unauthorized");
      if (!url.pathname.endsWith(file.path)) throw new UnauthorizedError("Path mismatch");

    } else if (!url.pathname.match(/\/employee:.+\/profile\.webp$/)) {
      const file_ids = (await db.query<string[][]>(`
        SELECT VALUE id FROM file WHERE !shared_with OR type::thing($user_id) IN shared_with OR author = type::thing($user_id);`,
        { user_id: employee.id }))[0];
      payload.files = file_ids;
      if (!payload.files.some((id: string) => url.pathname.match(`\\/${id}\\/`))) throw new UnauthorizedError("Invalid file ID");
    }

    return res.status(200).send("OK");
  } catch (e) {
    if (!(e instanceof UnauthorizedError))
      console.trace(e);
  }
  res.status(401).send("Unauthorized");
});

file.router.use((req, res, next) => {
  res.status(501).json({
    code: "not_implemented"
  })
});

export default file.router;


// fileRouter.use(ensureAuth);

// addRemover(fileRouter, "file");

// fileRouter.get('/get', errorHandler(async (req, res) => {
//   if (!req.query.ids) {
//     const token = jwt.sign(
//       {
//         employee_id: req.user?.id,
//         user_agent: req.headers['user-agent'],
//         ip: req.ip,
//         upload: false,
//       },
//       process.env.FILETOKEN_SECRET!,
//       { algorithm: 'HS512', expiresIn: '5h' }
//     );
//     res.status(200).json({
//       code: "success",
//       message: "Viewing token retrieved",
//       data: {
//         token,
//         files: [],
//       },
//     });
//   }
//   const ids = (req.query.ids as string).trim().split(",");
//   if (ids.length === 0)
//     throw new FieldsRequiredError();
//   if (ids.every(id => !id.startsWith("file:")))
//     throw new FieldsInvalidError();

//   const files = (await db.query<DBFile[][]>(`
//     SELECT * FROM array::map($ids, |$id| type::thing($id))
//     WHERE !shared_with OR type::thing($user_id) IN shared_with OR author = type::thing($user_id);
//   `, {ids, user_id: req.user?.id}))[0];

//   const token = jwt.sign(
//       {
//         employee_id: req.user?.id,
//         user_agent: req.headers['user-agent'],
//         ip: req.ip,
//         upload: false,
//       },
//       process.env.FILETOKEN_SECRET!,
//       { algorithm: 'HS512', expiresIn: '5h' }
//     );

//   if (!files || !files.length)
//     throw new NotFoundError();

//   res.status(200).json({
//     code: "success",
//     message: "File(s) retrieved",
//     data: {
//       token,
//       files
//     },
//   });
// }));

// fileRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
//   const { name, mime_type, shared_with = [], size } = req.body;
//   if (!name || !mime_type || !size) 
//     throw new FieldsRequiredError();

//   const file = (await db.query<DBFile[]>(`
//     CREATE ONLY file CONTENT {
//       author: type::thing($user_id),
//       name: $name,
//       mime_type: $mime_type,
//       shared_with: array::map($shared_with, |$id| type::thing($id)),
//       size: $size,
//     };
//   `, { name, mime_type, shared_with, size, user_id: req.user?.id }))[0];

//   const token = jwt.sign(
//     {
//       employee_id: req.user?.id,
//       user_agent: req.headers['user-agent'],
//       ip: req.ip,
//       files: [file.id],
//       upload: true,
//     },
//     process.env.FILETOKEN_SECRET!,
//     { algorithm: 'HS512', expiresIn: '1h' }
//   );

//   res.status(200).json({
//     code: "success",
//     message: "File created",
//     data: {
//       token,
//       file,
//     },
//   });
// }));

// fileRouter.post('/update', ensureAdmin, errorHandler(async (req, res) => {
//   const { id, name, shared_with } = req.body;
//   if (!id) 
//     throw new FieldsRequiredError();
//   if (!id.startsWith("file:")) 
//     throw new FieldsInvalidError();

//   const file = (await db.query(`
//     UPDATE ONLY type::thing($id) MERGE {
//       ${name ? "name: $name," : ""}
//       ${shared_with ? "shared_with: array::map($shared_with, |$v| type::thing($v))," : ""}
//     };
//   `, { id, name, shared_with }))[0];

//   res.status(200).json({
//     code: "success",
//     message: "File updated",
//     data: { file },
//   });
// }));

// export default fileRouter;