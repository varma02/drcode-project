import db from '../database/connection';
import { DBRole } from '../database/models';
import errorHandler from '../lib/errorHandler';
import { UnauthorizedError } from '../lib/errors';
import { PermissionDefaults, Thing } from '../lib/thing';
import { respond200, validateRequest } from '../lib/utils';


const enrolment = new Thing({
  table: "enroled",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.noone,
    getById: PermissionDefaults.noone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    
  }
})

enrolment.addDefaults({
  create: false,
  getAll: false,
  getById: false,
});

enrolment.router.post('/create', errorHandler(async (req, res) => {
  validateRequest(req, `POST /enrolment/create`);
  if (req.user?.roles?.includes(DBRole.Admin) === false)
    throw new UnauthorizedError("You are not authorized to perform this action");
  const { student, group, subject, price } = req.body;
  const result = await db.query(`
    RELATE ONLY (type::thing($student))->enroled->(type::thing($group)) CONTENT {
      price: $price, subject: type::thing($subject)
    };
  `, {student, group, subject, price});
  respond200(res, "POST /enrolment/create", {enrolment: result[0]});
}))

export default enrolment.router;