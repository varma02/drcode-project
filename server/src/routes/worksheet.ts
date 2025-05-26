import db from '../database/connection';
import { DBRole } from '../database/models';
import errorHandler from '../lib/errorHandler';
import { UnauthorizedError } from '../lib/errors';
import { PermissionDefaults, Thing } from '../lib/thing';
import { respond200, validateRequest } from '../lib/utils';

const worksheet = new Thing({
  table: "worked_at",
  permissions: {
    create: PermissionDefaults.noone,
    getAll: PermissionDefaults.noone,
    getById: PermissionDefaults.everyone,
    update: {general: `(type::thing($user.id) == in AND !$fields.paid) OR (array::find($user.roles, "administrator") IS NOT NONE)`},
    remove: {general: `(type::thing($user.id) == in) OR (array::find($user.roles, "administrator") IS NOT NONE)`},
  },
  fields: {
    start: {CONVERTER: "type::datetime($field)"},
    end: {CONVERTER: "type::datetime($field)"},
  }
})

worksheet.addDefaults({
  create: false,
  getAll: false,
  getById: false,
  remove: false,
});

worksheet.router.post('/create', errorHandler(async (req, res) => {
  validateRequest(req, `POST /worksheet/create`);
  let { employee, out, start, end } = req.body;
  if (req.user?.roles?.includes(DBRole.Admin) === false && employee)
    throw new UnauthorizedError("The employee property is only available to admins");
  if (!employee)
    employee = req.user?.id;
  const result = await db.query(`
    RELATE ONLY (type::thing($employee))->worked_at->(type::thing($out)) CONTENT {
      start: type::datetime($start),
      end: type::datetime($end),
      paid: false
    };
  `, {employee, out, start, end});
  respond200(res, "POST /worksheet/create", {worksheet: result[0]});
}))

worksheet.router.get("/get", worksheet.get({
  WHERE: (req) => {console.log(req.user); return`
    in == type::thing($user.id)
    AND ${req.query?.paid ? "true" : "paid == false"}
  `},
  postProcess: (res) => ({ worksheet: res }),
}));

worksheet.router.post("/remove", worksheet.remove({
  postProcess: (res) => ({ worksheet: res.filter(v => v.id) }),
}))

export default worksheet.router;