import { PermissionDefaults, Thing } from '../lib/thing';

const employees = new Thing({
  table: "employee",
  permissions: {
    create: PermissionDefaults.noone,
    getAll: PermissionDefaults.adminOnly,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    id: {required: true},
    created: {required: true},
    name: {required: true, writable: true},
    email: {required: true, writable: true},
    roles: {required: true, writable: true},
    worksheet: {SELECT: "->worked_at[WHERE !paid].* AS worksheet"},
    groups: {SELECT: "(SELECT VALUE id FROM group WHERE type::thing($parent.id) IN teachers) AS groups"},
  }
})

employees.addDefaults({create: false});

export default employees.router;