import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError } from '../lib/errors';
import { addRemover } from '../lib/defaultCRUD';

const inviteRouter = express.Router();

inviteRouter.use(ensureAuth);

addRemover(inviteRouter, "invite");

inviteRouter.get('/all', errorHandler(async (req, res) => {
  const invites = (await db.query(`
    SELECT * OMIT author.password, author.session_key FROM invite FETCH author;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All invites retrieved",
    data: { invites },
  });
}));

inviteRouter.post('/create', ensureAdmin, errorHandler(async (req, res) => {
  const roles = new Set(req.body.roles).intersection(new Set(["administrator", "teacher"]));

  if (!roles || !roles.size)
    throw new FieldsRequiredError();

  const invite = (await db.query("CREATE ONLY invite SET author = $author, roles = $roles", 
    { author: req.employee?.id, roles: [...roles.keys()] }))[0];

  res.status(200).json({
    code: "success",
    message: "Invite created",
    data: { invite },
  });
}));

export default inviteRouter;