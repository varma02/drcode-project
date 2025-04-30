import type { RequestHandler, Request } from 'express';
import { DBRole } from '../database/models';

export const isAdmin = (req: Request): boolean => {
  try {
    if (!req.user || !req.user.roles.includes(DBRole.Admin)) {
      throw new Error("unauthorized");
    }
    return true;
  } catch {}
  return false;
};

export const ensureAdmin: RequestHandler = async (req, res, next) => {
  if (isAdmin(req)) {
    next();
  } else {
    res.status(401).json({
      code: "unauthorized",
      message: 'You must be an administrator to perform this action',
    });
  }
};