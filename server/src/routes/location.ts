import { PermissionDefaults, Thing } from '../lib/thing';

const location = new Thing({
  table: "location",
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
    address: {required: true, writable: true},
    contact_email: {required: true, writable: true},
    contact_phone: {required: true, writable: true},
    groups: {SELECT: "(SELECT VALUE id FROM group WHERE type::thing($parent.id) IN location) AS groups"},
  }
})

location.addDefaults({});

export default location.router;