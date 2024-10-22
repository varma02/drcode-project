import db from './db';
import type { JWTData, User } from '../../shared/models';
import jwt from 'jsonwebtoken';

export default async function ensureAuth(token?:string): Promise<User | null> {
  if (!token) return null;
  const tokenData = jwt.verify(token, process.env.JWT_SECRET!, {algorithms:['HS256']}) as JWTData;
  if (!tokenData) return null;
  const user = (await db.query<User[]>("SELECT * OMIT password FROM ONLY $user", { user: tokenData.user }))[0];
  if (!user) return null;
  if (user.session_key !== tokenData.session_key) return null;
  return user;
}