import express from 'express';
import db from '../database/connection';
import type { AccountJWT, DBEmployee } from '../database/models';
import jwt from 'jsonwebtoken';
import ensureAuth from '../middleware/ensureauth';
import { respond200, validateRequest } from '../lib/utils';
import errorHandler from '../lib/errorHandler';
import { BadRequestError, InvalidCredentialsError } from '../lib/errors';

const userRouter = express.Router();

userRouter.post('/login', errorHandler(async (req, res) => {
  validateRequest(req, "POST /auth/login");
  const { email, password, remember } = req.body;
  const employee = (await db.query<DBEmployee[][]>(
    "SELECT *, role.* FROM employee WHERE email = $email AND crypto::argon2::compare(password, $password) LIMIT 1",
    { email, password }))[0][0];
  if (!employee || !employee.name) throw new InvalidCredentialsError();
  const token = jwt.sign(
    { 
      employee_id: employee.id, 
      session_key: employee.session_key, 
      user_agent: req.headers['employee-agent']
    } as AccountJWT,
    process.env.AUTHTOKEN_SECRET!,
    { algorithm: 'HS512', expiresIn: remember ? '1m' : '12h' }
  );
  respond200(res, "POST /auth/login", {token, employee});
}));

userRouter.post('/register', errorHandler(async (req, res) => {
  validateRequest(req, "POST /auth/register");
  const { invite_id, name, email, password } = req.body;
  const employee = (await db.query<DBEmployee[]>(`
    BEGIN TRANSACTION;
    $invite = (DELETE ONLY type::thing($invite_id) RETURN BEFORE);
    IF $invite.created > time::now() - 1d {
      RETURN CREATE ONLY employee SET
        name = $name,
        email = $email,
        password = crypto::argon2::generate($password),
        roles = $invite.roles
    } ELSE {
      THROW "Invalid invite"
    };
    COMMIT TRANSACTION;
    `, { name, email, password, invite_id }))[0];
  
  if (!employee || !employee.id || !employee.name)
    throw new BadRequestError();
  respond200(res, "POST /auth/register", {});
}));

userRouter.use(ensureAuth);

userRouter.post('/clear-sessions', errorHandler(async (req, res) => {
  await db.query("UPDATE type::thing($employee) SET session_key = rand::string(32);", { employee: req.user?.id });
  respond200(res);
}));

userRouter.get('/me', errorHandler(async (req, res) => {
  respond200(res, "GET /auth/me", { employee: req.user });
}));

userRouter.post('/update', errorHandler(async (req, res) => {
  validateRequest(req, "POST /auth/update");
  const { name, email, new_password, old_password } = req.body;
  const updates = [];
  if (name) updates.push("name = $name");
  if (email) updates.push("email = $email");
  if (new_password) updates.push("password = crypto::argon2::generate($new_password)");
  const updatedUser = (await db.query<DBEmployee[]>(
    `UPDATE ONLY type::thing($employee) SET ${updates.join(", ")} WHERE crypto::argon2::compare(password, $old_password)`,
    { employee: req.user!.id, name, email, new_password, old_password }
  ))[0];
  if (!updatedUser || !updatedUser.name) 
    throw new BadRequestError();
  respond200(res, "POST /auth/update", { employee: updatedUser });
}));

userRouter.post('/replace-profile-picture', errorHandler(async (req, res) => {
  const token = jwt.sign(
    {
      employee_id: req.user?.id,
      user_agent: req.headers['user-agent'],
      ip: req.ip,
      upload: "profile_picture",
    },
    process.env.FILETOKEN_SECRET!,
    { algorithm: 'HS512', expiresIn: '1h' }
  );
  respond200(res, "POST /auth/replace-profile-picture", {
    token, path: "/" + req.user?.id + "/profile_picture.webp",
  });
}));

export default userRouter;