import express from 'express';
import db from '../lib/db';
import type { JWTData, User } from '../../shared/models';
import jwt from 'jsonwebtoken';
import ensureAuth from '../lib/ensureauth';

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !password) {
    res.status(400).json({
      code: "fields_required",
      message: 'The email and password fields are required',
    });
    return;
  }

  const user = (await db.query<User[]>("SELECT * OMIT password FROM user WHERE email = $email", { email }))[0];

  if (!user) {
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

  res.status(200).json({
    code: "login_success",
    message: 'Login successful',
    data: {
      token,
      user,
    }
  });
});

authRouter.post('/clear_sessions', async (req, res) => {
  const user = await ensureAuth(req.headers.authorization);
  if (!user) {
    res.status(401).json({
      code: "unauthorized",
      message: 'You are not authorized to perform this action',
    });
    return;
  }

  const result = await db.query("UPDATE $user SET session_key = rand::string(32);", { user: user.id });

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

export default authRouter;