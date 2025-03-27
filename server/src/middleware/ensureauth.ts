import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/connection';
import type { AccountJWT, DBEmployee } from '../database/models';

const ensureAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '').trim() || "";
    const tokenData = jwt.verify(token, process.env.AUTHTOKEN_SECRET!, {algorithms:['HS512']}) as AccountJWT;
    if (!tokenData || !tokenData.employee_id) throw new Error("unauthorized");

    const employee = (await db.query<DBEmployee[]>(
      "SELECT * OMIT password FROM ONLY type::thing($user)", { user: tokenData.employee_id }))[0];
    if (!employee || employee.session_key !== tokenData.session_key) throw new Error("unauthorized");
  
    delete employee.session_key;
    delete employee.password;
    req.user = employee;
    next();

  } catch (error) {
    res.status(401).json({
      code: "unauthorized",
      message: 'You are not authorized to perform this action',
    });
  }
};

export default ensureAuth;