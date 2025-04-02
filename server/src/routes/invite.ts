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
    id: {required: true},
    created: {required: true},
    author: {required: true, default: "type::thing($user.id)"},
    roles: {required: true, writable: true},
  }
})

invite.addDefaults({getById: false, update: false});

export default invite.router;