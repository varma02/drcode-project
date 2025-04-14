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
  fields: {}
})

subject.addDefaults({});

export default subject.router;