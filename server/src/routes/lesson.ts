import db from '../database/connection';
import errorHandler from '../lib/errorHandler';
import { PermissionDefaults, Thing } from '../lib/thing';
import { respond200, validateRequest } from '../lib/utils';

const lesson = new Thing({
  table: "lesson",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.adminOnly,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    attended: {SELECT: "<-attended<-student as attended"},
    replaced: {SELECT: "<-replaced<-student as replaced"},
    enroled: {SELECT: "group<-enroled.* as enroled"},
    end: {CONVERTER: "type::datetime($end)"},
    start: {CONVERTER: "type::datetime($start)"},
  }
})

lesson.addDefaults({});

lesson.router.get('/between_dates', lesson.get({
  WHERE: (req) => `
    ${req.query?.start ? "start >= type::datetime($start)" : "true"}
    AND
    ${req.query?.end ? "end <= type::datetime($end)" : "true"}`,
  ORDER: `start ASC`,
  extraFields: (req) => ({start: req.query?.start, end: req.query?.end})
}));

lesson.router.get("/next", lesson.get({
  WHERE: () => `
    (type::thing($user.id) IN group.teachers OR type::thing($user.id) IN teachers)
    AND array::len(<-worked_at[WHERE id = type::thing($user.id)]) == 0
  `,
  ORDER: "start ASC",
  LIMIT: "1",
  postProcess: (res) => ({lesson: res[0]})
}))

lesson.router.post('/attendance', errorHandler(async (req, res) => {
  validateRequest(req, `POST /lesson/attendance`);
  const {id, students} = req.body;
  await db.query(`
    BEGIN TRANSACTION;
    DELETE attended WHERE out = type::thing($id);
    RELATE (array::map($students, |$v| type::thing($v)))->attended->(type::thing($id));
    COMMIT TRANSACTION;
  `, {id, students});
  respond200(res, 'POST /lesson/attendance');
}));

export default lesson.router;