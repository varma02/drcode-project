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

  const user = (await db.query<(User & {password?:string, session_key?:string})[]>(
    "SELECT * FROM ONLY user WHERE email = $email AND crypto::argon2::compare(password, $password) LIMIT 1",
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

authRouter.use(ensureAuth);

authRouter.post('/clear_sessions', async (req, res) => {
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

export default authRouter;