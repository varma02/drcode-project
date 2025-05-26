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
        "employees": (SELECT count() FROM employee),
        "groups": (SELECT count() FROM group),
        "invites": (SELECT count() FROM invite),
        "lessons": {
          "total": (SELECT count() FROM lesson),
          "past": (SELECT count() FROM lesson WHERE start < time::now()),
          "future": (SELECT count() FROM lesson WHERE start >= time::now()),
        },
        "locations": (SELECT count() FROM location),
        "students": (SELECT count() FROM student),
        "subjects": (SELECT count() FROM subject),
      },
      "income": {
        "total": 0,
        "today": 0,
        "this_week": 0,
        "this_month": 0,
      },
      "worked_hours": {
        "total": (SELECT math::sum(end-start) FROM worked_at),
        "today": (SELECT math::sum(end-start) FROM worked_at WHERE time::round(start, 1d) == time::round(time::now(), 1d)),
        "this_week": (SELECT math::sum(end-start) FROM worked_at WHERE time::round(start, 1w) == time::round(time::now(), 1w)),
        "this_month": (SELECT math::sum(end-start) FROM worked_at WHERE time::round(start, 1m) == time::round(time::now(), 1m)),
      },
    }
  `)
  respond200(res, "GET /stats", stats[0]);
});

export default router;