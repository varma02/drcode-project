import { PermissionDefaults, Thing } from '../lib/thing';

const subject = new Thing({
  table: "subject",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.adminOnly,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    students: {SELECT: "(SELECT VALUE id FROM student WHERE array::find(->enroled.*.subject, $parent.id)) as students"}
  }
})

subject.addDefaults({});

export default subject.router;