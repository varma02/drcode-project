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
    enroled: {SELECT: "group<-enroled.* as enroled"}
  }
})

lesson.addDefaults({});

lesson.router.get('/between_dates', lesson.get({
  WHERE: (req) => `
    ${req.params.start ? "start >= type::datetime($start)" : "true"}
    AND
    ${req.params.end ? "end <= type::datetime($end)" : "true"}`
}));

lesson.router.post('/attendance', errorHandler(async (req, res) => {
  validateRequest(req, `POST /lesson/attendance`);
  const {id, students} = req.body;
  await db.query(`
    BEGIN TRANSACTION;
    DELETE attended WHERE out = type::thing($id);
    RELATE (array::map($students, type::thing))->attended->(type::thing($id));
    COMMIT TRANSACTION;
  `, {id, students});
  respond200(res, 'POST /lesson/attendance');
}));

export default lesson.router;