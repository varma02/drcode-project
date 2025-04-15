import { PermissionDefaults, Thing } from '../lib/thing';

const lesson = new Thing({
  table: "lesson",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.adminOnly,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    attended: {SELECT: "<-attended<-student as attended"},
    replaced: {SELECT: "<-replaced<-student as replaced"},
    enroled: {SELECT: "group<-enroled.* as enroled"}
  }
})

lesson.addDefaults({});

lesson.router.get('/between_dates', lesson.get({
  WHERE: (req) => `
    ${req.params.start ? "start >= type::datetime($start)" : "true"}
    AND
    ${req.params.end ? "end <= type::datetime($end)" : "true"}`
}));

export default lesson.router;