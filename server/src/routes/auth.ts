import express from 'express';
import db from '../database/connection';
import type { JWTData, Employee } from '../database/models';
import jwt from 'jsonwebtoken';
import ensureAuth from '../middleware/ensureauth';
import { verifyPassword } from '../lib/utils';
import errorHandler from '../lib/errorHandler';
import { BadRequestError, FieldsRequiredError, InvalidCredentialsError, InvalidInviteError, PasswordTooWeakError } from '../lib/errors';

const userRouter = express.Router();

userRouter.post('/login', errorHandler(async (req, res) => {
  const { email, password, remember } = req.body;
  
  if (!email || !password) throw new FieldsRequiredError();

  const employee = (await db.query<Employee[][]>(
    "SELECT *, role.* FROM employee WHERE email = $email AND crypto::argon2::compare(password, $password) LIMIT 1",
    { email, password }))[0][0];

  if (!employee || !employee.name) throw new InvalidCredentialsError();

  const token = jwt.sign(
    { employee_id: employee.id, session_key: employee.session_key, user_agent: req.headers['employee-agent'] } as JWTData,
    process.env.JWT_SECRET!,
    { algorithm: 'HS256', expiresIn: remember ? '1m' : '1d' }
  );

  delete employee.password;
  delete employee.session_key;
  res.status(200).json({
    code: "success",
    message: 'Login successful',
    data: {
      token,
      employee,
    }
  });
}));

userRouter.post('/register', errorHandler(async (req, res) => {
  const { invite_id, name, email, password } = req.body;

  if (!invite_id || !name || !email || !password) 
    throw new FieldsRequiredError();

  if (!verifyPassword(password)) 
    throw new PasswordTooWeakError();

  if (!invite_id.startsWith("invite:")) 
    throw new InvalidInviteError();

  const employee = (await db.query<Employee[]>(`
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

  delete employee.password;
  delete employee.session_key;
  res.status(200).json({
    code: "success",
    message: 'Employee registered',
  });
}));

userRouter.use(ensureAuth);

userRouter.post('/clear_sessions', errorHandler(async (req, res) => {
  await db.query("UPDATE type::thing($employee) SET session_key = rand::string(32);", { employee: req.employee?.id });

  res.status(200).json({
    code: "success",
    message: "Logged out of all sessions",
  });
}));

userRouter.get('/me', errorHandler(async (req, res) => {
  res.status(200).json({
    code: "success",
    message: "Employee data retrieved",
    data: {
      employee: req.employee,
    },
  });
}));

userRouter.post('/update', errorHandler(async (req, res) => {
  const { name, email, new_password, old_password } = req.body;
  
    if (!old_password) 
      throw new FieldsRequiredError();
    if (!name && !email && !new_password) 
      throw new FieldsRequiredError("At least one of the optional fields is required");

    if (new_password && !verifyPassword(new_password)) 
      throw new PasswordTooWeakError();
  
    const updates = [];
    if (name) updates.push("name = $name");
    if (email) updates.push("email = $email");
    if (new_password) updates.push("password = crypto::argon2::generate($new_password)");

    const updatedUser = (await db.query<Employee[]>(
      `UPDATE ONLY type::thing($employee) SET ${updates.join(", ")} WHERE crypto::argon2::compare(password, $old_password)`,
      { employee: req.employee!.id, name, email, new_password, old_password }
    ))[0];

    if (!updatedUser || !updatedUser.name) 
      throw new BadRequestError();

    delete updatedUser.password;
    delete updatedUser.session_key;
    res.status(200).json({
      code: "success",
      message: "Employee data updated",
      data: {
        employee: updatedUser,
      },
    });
}));

export default userRouter;