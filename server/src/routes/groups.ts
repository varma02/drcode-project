import { PermissionDefaults, Thing } from '../lib/thing';

const group = new Thing({
  table: "group",
  permissions: {
    create: PermissionDefaults.adminOnly,
    getAll: PermissionDefaults.adminOnly,
    getById: PermissionDefaults.everyone,
    update: PermissionDefaults.adminOnly,
    remove: PermissionDefaults.adminOnly,
  },
  fields: {
    enroled: {SELECT:"<-enroled.* as enroled"},
    subjects: {SELECT:"array::group(<-enroled.subject) as subjects"},
    lessons: {SELECT:"(SELECT VALUE id FROM lesson WHERE $parent.id = group.id) AS lessons"},
    location: {fetch: true}
  }
})

group.addDefaults({ create: false });

group.router.post('/create', group.create({
  additionalQuery: (req) => req.body.lessons?.length > 0 ? `
    FOR $lesson IN $fields.lessons {
      CREATE ONLY lesson CONTENT {
        group: type::thing($original.id),
        start: type::datetime($lesson.start),
        end: type::datetime($lesson.end),
      };
    };
  ` : "",
}));

export default group.router;