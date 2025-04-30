import db from '../database/connection';
import errorHandler from '../lib/errorHandler';
import { PermissionDefaults, Thing } from '../lib/thing';
import { respond200, validateRequest } from '../lib/utils';
import ensureAuth from '../middleware/ensureauth';

const isnotadmin = "array::find($user.roles, \"adminisrator\") IS NONE"
const mineoradmin = {general: `($user.id == $employee OR NOT (${isnotadmin}))`}

const worksheet = new Thing({
  table: "worked_at",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.adminOnly,
    getById: mineoradmin,
    update: {general: `${mineoradmin.general} AND NOT (${isnotadmin} AND NOT ($fields.paid IS NONE))`},
    remove: mineoradmin,
  },
  fields: {
    
  }
})

worksheet.addDefaults({
  create: false,
  getAll: false,
  getById: false,
});

worksheet.router.get("/get", worksheet.get({
  WHERE: (req) => {console.log(req.user); return`
    in == type::thing($employee)
    AND ${req.query?.paid ? "true" : "paid == false"}
  `},
  extraFields: (req) => ({
    employee: req.query?.id
  }),
  postProcess: (res) => ({ worksheet: res }),
}));



// lesson.router.get('/between_dates', lesson.get({
//   WHERE: (req) => `
//     ${req.params.start ? "start >= type::datetime($start)" : "true"}
//     AND
//     ${req.params.end ? "end <= type::datetime($end)" : "true"}`,
//   extraFields: (req) => ({start: req.query?.start, end: req.query?.end})
// }));

// lesson.router.get("/next", lesson.get({
//   WHERE: () => `
//     (type::thing($user.id) IN group.teachers OR type::thing($user.id) IN teachers)
//     AND array::len(<-worked_at[WHERE id = type::thing($user.id)]) == 0
//   `,
//   ORDER: "start DESC",
//   LIMIT: "1",
//   postProcess: (res) => ({lesson: res[0]})
// }))

// lesson.router.post('/attendance', errorHandler(async (req, res) => {
//   validateRequest(req, `POST /lesson/attendance`);
//   const {id, students} = req.body;
//   await db.query(`
//     BEGIN TRANSACTION;
//     DELETE attended WHERE out = type::thing($id);
//     RELATE (array::map($students, type::thing))->attended->(type::thing($id));
//     COMMIT TRANSACTION;
//   `, {id, students});
//   respond200(res, 'POST /lesson/attendance');
// }));

export default worksheet.router;