import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';

const inviteRouter = express.Router();

inviteRouter.use(ensureAuth);

inviteRouter.get('/all', async (req, res) => {
  const invites = (await db.query(`
    SELECT * OMIT author.password, author.session_key FROM invite FETCH author;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All invites retrieved",
    data: { invites },
  });
});

inviteRouter.post('/create', ensureAdmin, async (req, res) => {
  const roles = new Set(req.body.roles).intersection(new Set(["administrator", "teacher"]));

  if (!roles || !roles.size) {
    res.status(400).json({
      code: "fields_required",
      message: "The roles field is required",
    });
  }

  const invite = (await db.query("CREATE ONLY invite SET author = $author, roles = $roles", 
    { author: req.employee?.id, roles: [...roles.keys()] }))[0];

  res.status(200).json({
    code: "success",
    message: "Invite created",
    data: { invite },
  });
});

inviteRouter.post('/remove', ensureAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id || !id.startsWith("invite:")) {
    res.status(400).json({
      code: "fields_required",
      message: "The ID field is required",
    });
    return;
  }
  console.log(id);
  
  const invite = (await db.query(`DELETE ONLY type::thing($id) RETURN BEFORE;`, { id }))[0];

  res.status(200).json({
    code: "success",
    message: "Invite removed",
    data: { invite },
  });
});

export default inviteRouter;