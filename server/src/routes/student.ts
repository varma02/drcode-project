import { PermissionDefaults, Thing } from '../lib/thing';

const student = new Thing({
  table: "student",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.everyone,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    enroled: {SELECT: "->enroled.* as enroled"},
    attended: {SELECT: "->attended.* as attended"},
  }
})

student.addDefaults({});

export default student.router;