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
    groups: {SELECT: "(SELECT VALUE id FROM group WHERE type::thing($parent.id) IN location) AS groups"},
  }
})

location.addDefaults({});

export default location.router;