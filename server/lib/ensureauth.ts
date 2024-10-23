import db from './db';
import type { JWTData, User } from '../../shared/models';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';

const ensureAuth: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') ?? "";
  const tokenData = jwt.verify(token, process.env.JWT_SECRET!, {algorithms:['HS256']}) as JWTData;

  if (!tokenData || !tokenData.user) {
    res.status(401).json({
      code: "unauthorized",
      message: 'You are not authorized to perform this action',
    });
    return;
  };

  const user = (await db.query<(User & {password?:string, session_key?:string})[]>(
    "SELECT * OMIT PASSWORD FROM ONLY type::thing($user)", { user: tokenData.user }))[0];
  if (!user || user.session_key !== tokenData.session_key) {
    res.status(401).json({
      code: "unauthorized",
      message: 'You are not authorized to perform this action',
    });
    return;
  }

  delete user.session_key;
  delete user.password;
  req.user = user;
  next();
};

export default ensureAuth;