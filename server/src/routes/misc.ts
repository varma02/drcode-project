import express from 'express';
import ensureAuth from '../middleware/ensureauth';
import { ensureAdmin } from '../middleware/ensureadmin';
import db from '../database/connection';
import { respond200 } from '../lib/utils';

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json({
    code: "success",
    message: 'Hello, World!'
  });
});

router.get('/stats', ensureAuth, ensureAdmin, async (req, res) => {
  const stats = await db.query<any[]>(`
    RETURN {
      "number_of": {
        "employees": count(SELECT id FROM employee),
        "groups": count(SELECT id FROM group),
        "invites": count(SELECT id FROM invite),
        "lessons": {
          "total": count(SELECT id FROM lesson),
          "past": count(SELECT id FROM lesson WHERE start < time::now()),
          "future": count(SELECT id FROM lesson WHERE start >= time::now()),
        },
        "locations": count(SELECT id FROM location),
        "students": count(SELECT id FROM student),
        "subjects": count(SELECT id FROM subject),
      },
      "income": {
        "total": 0,
        "today": 0,
        "this_week": 0,
        "this_month": 0,
      },
      "worked_hours": {
        "total": math::sum(SELECT VALUE (duration::hours(end-start)) FROM worked_at),
        "today": math::sum(SELECT VALUE (duration::hours(end-start)) FROM worked_at WHERE time::round(time::now(), 1d) == time::round(time::now(), 1d)),
        "this_week": math::sum(SELECT VALUE (duration::hours(end-start)) FROM worked_at WHERE time::round(time::now(), 1w) == time::round(time::now(), 1w)),
        "this_month": math::sum(SELECT VALUE (duration::hours(end-start)) FROM worked_at WHERE time::round(time::now(), 4w) == time::round(time::now(), 4w)),
      },
    }
  `)
  respond200(res, "GET /stats", stats[0]);
});

export default router;