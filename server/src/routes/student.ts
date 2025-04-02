import { PermissionDefaults, Thing } from '../lib/thing';

const student = new Thing({
  table: "student",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.adminOnly,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    id: {required: true},
    created: {required: true},
    name: {required: true, writable: true},
    grade: {writable: true},
    parent: {writable: true},
    email: {writable: true},
    phone: {writable: true},
    enroled: {SELECT: "->enroled.* as enroled"},
  }
})

student.addDefaults({});

export default student.router;