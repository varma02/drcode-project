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

export default worksheet.router;