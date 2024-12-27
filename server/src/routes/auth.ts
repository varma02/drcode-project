import express from 'express';
import db from '../database/connection';
import type { JWTData, Employee, Invite } from '../database/models';
import jwt from 'jsonwebtoken';
import ensureAuth from '../middleware/ensureauth';
import { verifyPassword } from '../lib/utils';

const userRouter = express.Router();

userRouter.post('/login', async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !password) {
    res.status(400).json({
      code: "fields_required",
      message: 'The email and password fields are required',
    });
    return;
  }

  const employee = (await db.query<Employee[]>(
    "SELECT *, role.* FROM ONLY employee WHERE email = $email AND crypto::argon2::compare(password, $password) LIMIT 1",
    { email, password }))[0];

  if (!employee || !employee.name) {
    res.status(401).json({
      code: "invalid_credentials",
      message: 'The email or password is incorrect',
    });
    return;
  }

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
});

userRouter.post('/register', async (req, res) => {
  const { invite_id, name, email, password } = req.body;

  if (!invite_id || !name || !email || !password) {
    res.status(400).json({
      code: "fields_required",
      message: 'The invite, name, email, and password fields are required',
    });
    return;
  }

  if (verifyPassword(password)) {
    res.status(400).json({
      code: "invalid_password",
      message: 'The password must contain at least one lowercase letter, uppercase letter, number, special character, and be at least 8 characters long',
    });
    return;
  }

  if (!`${invite_id}`.match(/^invite:[A-Za-z0-9]+$/)) {
    res.status(400).json({
      code: "invalid_invite",
      message: 'The invite_id field is invalid',
    });
    return;
  };

  try {
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
  
    if (!employee || !employee.id?.startsWith("employee:")) {
      throw new Error("No employee");
    }
  
    delete employee.password;
    delete employee.session_key;
    res.status(200).json({
      code: "success",
      message: 'Employee registered',
    });

  } catch {
    res.status(400).json({
      code: "invalid_invite",
      message: "The invite is invalid or has already been used",
    });
    return;
  }
});

userRouter.use(ensureAuth);

userRouter.post('/clear_sessions', async (req, res) => {
  const result = await db.query("UPDATE type::thing($employee) SET session_key = rand::string(32);", { employee: req.employee?.id });

  if (result.length) {
    res.status(200).json({
      code: "success",
      message: "Logged out of all sessions",
    });
  } else {
    res.status(400).json({
      code: "bad_request",
      message: "An unexpected error has occurred",
    });
  }
});

userRouter.get('/me', async (req, res) => {
  res.status(200).json({
    code: "success",
    message: "Employee data retrieved",
    data: {
      employee: req.employee,
    },
  });
});

userRouter.post('/update', async (req, res) => {
  const { name, email, new_password, old_password } = req.body;
  
    if (!old_password) {
      res.status(400).json({
        code: "password_required",
        message: 'The current password is required to complete this action',
      });
      return;
    }
    if (!name && !email && !new_password) {
      res.status(400).json({
        code: "fields_required",
        message: 'At least one field is required',
      });
      return;
    }
    if (new_password && verifyPassword(new_password)) {
      res.status(400).json({
        code: "invalid_password",
        message: 'The password must contain at least one lowercase letter, uppercase letter, number, special character, and be at least 8 characters long',
      });
      return;
    }
  
    const updates = [];
    if (name) updates.push("name = $name");
    if (email) updates.push("email = $email");
    if (new_password) updates.push("password = crypto::argon2::generate($new_password)");

    const updatedUser = (await db.query<Employee[]>(
      `UPDATE ONLY type::thing($employee) SET ${updates.join(", ")} WHERE crypto::argon2::compare(password, $old_password)`,
      { employee: req.employee?.id, name, email, new_password, old_password }
    ))[0];

    if (!updatedUser || !updatedUser.name) {
      res.status(400).json({
        code: "bad_request",
        message: "An unexpected error has occurred",
      });
      return;
    }

    res.status(200).json({
      code: "success",
      message: "Employee data updated",
      data: {
        employee: updatedUser,
      },
    });
});

export default userRouter;