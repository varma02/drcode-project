import { PermissionDefaults, Thing } from '../lib/thing';

const invite = new Thing({
  table: "invite",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.adminOnly,
    getById: PermissionDefaults.noone,
    update: PermissionDefaults.noone,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    author: {default: "type::thing($user.id)"},
  }
})

invite.addDefaults({getById: false, update: false});

export default invite.router;