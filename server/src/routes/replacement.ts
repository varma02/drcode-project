import db from '../database/connection';
import errorHandler from '../lib/errorHandler';
import { PermissionDefaults, Thing } from '../lib/thing';
import { respond200, validateRequest } from '../lib/utils';

const replacement = new Thing({
  table: "replaced",
  permissions: {
    create: PermissionDefaults.noone,
    getAll: PermissionDefaults.noone,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.everyone,
    remove: PermissionDefaults.everyone,
  },
  fields: {
    original: {CONVERTER: "type::thing($field)"},
    extension: {CONVERTER: "type::duration($field)"},
  }
})

replacement.addDefaults({
  create: false,
  getAll: false,
  getById: false,
  remove: false,
});

replacement.router.post('/create', errorHandler(async (req, res) => {
  validateRequest(req, `POST /replacement/create`);
  let { student, original_lesson, replacement_lesson, extension } = req.body;
  const result = await db.query(`
    RELATE ONLY (type::thing($student))->replaced->(type::thing($replacement_lesson)) CONTENT {
      original: type::thing($original_lesson),
      extension: type::duration($extension),
    };
  `, {student, original_lesson, replacement_lesson, extension});
  respond200(res, "POST /replacement/create", {replacement: result[0]});
}))

replacement.router.get("/get", replacement.get({
  postProcess: (res) => ({ replacements: res }),
}));

replacement.router.post("/remove", replacement.remove({
  postProcess: (res) => ({ replacements: res.filter(v => v.id) }),
}))

export default replacement.router;