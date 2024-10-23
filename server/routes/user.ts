import express from 'express';
import db from '../lib/db';
import type { JWTData, User } from '../../shared/models';
import jwt from 'jsonwebtoken';
import ensureAuth from '../middleware/ensureauth';

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

  const user = (await db.query<(User & {password?:string, session_key?:string})[]>(
    "SELECT *, role.* FROM ONLY user WHERE email = $email AND crypto::argon2::compare(password, $password) LIMIT 1",
    { email, password }))[0];

  if (!user || !user.name) {
    res.status(401).json({
      code: "invalid_credentials",
      message: 'The email or password is incorrect',
    });
    return;
  }

  const token = jwt.sign(
    { user: user.id, session_key: user.session_key, user_agent: req.headers['user-agent'] } as JWTData,
    process.env.JWT_SECRET!,
    { algorithm: 'HS256', expiresIn: remember ? '1m' : '1d' }
  );

  delete user.password;
  delete user.session_key;
  res.status(200).json({
    code: "login_success",
    message: 'Login successful',
    data: {
      token,
      user,
    }
  });
});

userRouter.use(ensureAuth);

userRouter.post('/clear_sessions', async (req, res) => {
  const result = await db.query("UPDATE $user SET session_key = rand::string(32);", { user: req.user.id });

  if (result.length) {
    res.status(200).json({
      code: "sessions_cleared",
      message: "Logged out of all sessions",
    });
  } else {
    res.status(500).json({
      code: "internal_error",
      message: "An unexpected error has occurred",
    });
  }
});

userRouter.get('/', async (req, res) => {
  res.status(200).json({
    code: "user_data",
    message: "User data retrieved",
    data: {
      user: req.user,
    },
  });
});

userRouter.get('/:id', async (req, res) => {
  if (!req.params.id || !req.params.id.startsWith("user:")) {
    res.status(404).json({
      code: "not_found",
      message: "This user does not exist",
    });
    return;
  }

  const user = (await db.query<User[]>(
    "SELECT *, role.* OMIT password, session_key, role.permissions FROM ONLY type::thing($user)",
    { user: req.params.id }))[0];

  if (!user || !user.name) {
    res.status(404).json({
      code: "not_found",
      message: "This user does not exist",
    });
    return;
  }

  res.status(200).json({
    code: "user_data",
    message: "User data retrieved",
    data: { user },
  });
});

userRouter.patch('/update', async (req, res) => {
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
  
    const updates = [];
    if (name) updates.push("name = $name");
    if (email) updates.push("email = $email");
    if (new_password) updates.push("password = crypto::argon2::generate($new_password)");

    const updatedUser = (await db.query<User[]>(
      `UPDATE ONLY type::thing($user) SET ${updates.join(", ")} WHERE crypto::argon2::compare(password, $old_password)`,
      { user: req.user.id, name, email, new_password, old_password }
    ))[0];

    if (!updatedUser || !updatedUser.name) {
      res.status(404).json({
        code: "internal_error",
        message: "An unexpected error has occurred",
      });
      return;
    }

    res.status(200).json({
      code: "user_updated",
      message: "User data updated",
      data: {
        user: updatedUser,
      },
    });
});

export default userRouter;