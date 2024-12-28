import express from 'express';
import db from '../database/connection';
import { ensureAdmin, isAdmin } from '../middleware/ensureadmin';
import ensureAuth from '../middleware/ensureauth';

const groupsRouter = express.Router();

groupsRouter.use(ensureAuth);

groupsRouter.get('/all', async (req, res) => {
  const groups = (await db.query(`
    SELECT * FROM group FETCH location;
  `))[0];

  res.status(200).json({
    code: "success",
    message: "All groups retrieved",
    data: { groups },
  });
});

groupsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const include = new Set((req.query.include as string)
    .trim().split(",")).intersection(new Set(["teachers", "students", "lessons"]));
  const selection = [];
  selection.push("*");
  if (include.has("teachers")) selection.push("teachers.*.*");
  if (include.has("students")) selection.push("->enroled->student.* as students");
  if (include.has("lessons")) selection.push("(SELECT * FROM lesson WHERE $parent.id = group.id) AS lessons");
  const group = (await db.query(`
    SELECT ${selection.join(",")} OMIT teachers.*.password, teachers.*.session_key FROM ONLY type::thing($groupid) FETCH location;
  `, {groupid: id}))[0];

  res.status(200).json({
    code: "success",
    message: "Group retrieved",
    data: { group },
  });
});

export default groupsRouter;