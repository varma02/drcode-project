import { describe, expect, test, beforeAll } from 'bun:test';
import { testAuth, testCreateUser, testQuery, testRequest, testSetup } from './utils';

await testSetup();

describe("Authentication", () => {
  // MARK: /auth/me
  describe("/auth/me", () => {
    test("200", async () => {
      const auth = await testCreateUser("authMeTest", ["administrator"]);
      const resp = await testRequest({
        method: "get",
        url: "/auth/me",
        token: auth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.employee?.email).toBe("authMeTest@example.com");
    });
    test("Without token", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/auth/me",
      });
      expect(resp.status).toBe(401);
    });
    test("Invalid token", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/auth/me",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZSI6ImVtcGxveWVlOmRlZmFkbWluIn0.0c6zYDPjSXiXkBwpnviBBBXE6XZfmuZ-tQh-kOa7XFI"
      });
      expect(resp.status).toBe(401);
    });
  });

  // MARK: /auth/logout
  describe("/auth/login", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/login",
        body: {
          email: "admin@example.com",
          password: "1234",
          remember: false,
        },
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.employee?.email).toBe("admin@example.com");
    });
    test("Invalid password", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/login",
        body: {
          email: "admin@example.com",
          password: "12",
          remember: false,
        },
      });
      expect(resp.status).toBe(400);
    });
    test("Invalid email", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/login",
        body: {
          email: "asdasd@example.com",
          password: "1234",
          remember: false,
        },
      });
      expect(resp.status).toBe(400);
    });
  });

  // MARK: /auth/update
  describe("/auth/update", async () => {
    const auth = await testCreateUser("authUpdateTest", ["administrator"]);
    test("200 Change name and email", async (done) => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/update",
        body: {
          name: "Test Name",
          email: "authUpdateTest2@example.com",
          old_password: "1234",
        },
        token: auth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.employee?.name).toBe("Test Name");
      expect(resp.body?.data?.employee?.email).toBe("authUpdateTest2@example.com");
      done();
    });
    test("200 Change password", async (done) => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/update",
        body: {
          old_password: "1234",
          new_password: "$Password1234"
        },
        token: auth.token,
      });
      expect(resp.status).toBe(200);
      done();
    });
    test("With empty old password", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/update",
        body: {
          email: "authUpdateTest23@example.com",
          old_password: "",
        },
        token: auth.token,
      });
      expect(resp.status).toBe(400);
    });
    test("Without token", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/update",
        body: {
          new_password: "$Password12345",
          old_password: "1234",
        },
      });
      expect(resp.status).toBe(401);
    });
  });

  // MARK: /auth/register
  describe("/auth/register", () => {
    test("200", async () => {
      const invite = await testQuery(`
        CREATE ONLY invite:authRegisterTest CONTENT {
          author: employee:defadmin,
          roles: ["administrator"],
        };
      `);
      const resp = await testRequest({
        method: "post",
        url: "/auth/register",
        body: {
          name: "Auth Register Test",
          email: "authRegisterTest@example.com",
          password: "$Password12345",
          invite_id: invite.id,
        },
      });
      console.log("Register test response:", resp.status, JSON.stringify(resp.body));
      expect(resp.status).toBe(200);
    });
    test("Invalid invite", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/register",
        body: {
          name: "Auth Register Test2",
          email: "authRegisterTest2@example.com",
          password: "$Password12345",
          invite_id: "invite:someinvalidid123",
        },
      });
      expect(resp.status).toBe(400);
    });
  });

  // MARK: /auth/clear_sessions
  describe("/auth/clear-sessions", () => {
    test("200", async () => {
      const auth = await testAuth("admin@example.com");
      const resp = await testRequest({
        method: "post",
        url: "/auth/clear-sessions",
        token: auth.token,
      });
      expect(resp.status).toBe(200);
      const resp2 = await testRequest({
        method: "post",
        url: "/auth/clear-sessions",
        token: auth.token,
      });
      expect(resp2.status).toBe(401);
    });
    test("Without token", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/clear-sessions",
      });
      expect(resp.status).toBe(401);
    });
  });

  // MARK: /auth/replace-profile-picture
  describe("/auth/replace-profile-picture", () => {
    test("200", async () => {
      const auth = await testCreateUser("profilePicTest", ["administrator"]);
      const resp = await testRequest({
        method: "post",
        url: "/auth/replace-profile-picture",
        token: auth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.token).toBeDefined();
      expect(resp.body?.data?.path).toBeDefined();
    });
    test("Without token", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/auth/replace-profile-picture",
      });
      expect(resp.status).toBe(401);
    });
  });
});

describe("Employee", async () => {
  const adminAuth = await testCreateUser("employeeEndpointsAdmin", ["administrator"]);
  const teacherAuth = await testCreateUser("employeeEndpointsTeacher", ["teacher"]);
  // MARK: /employee/all
  describe("/employee/all", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/employee/all",
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.employees?.length).toBeGreaterThan(0);
    });
    test("As teacher", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/employee/all",
        token: teacherAuth.token,
      });
      expect(resp.status).toBe(400);
      expect(resp.body?.data?.employees).not.toBeDefined();
    });
    test("Without token", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/employee/all",
      });
      expect(resp.status).toBe(401);
      expect(resp.body?.data?.employees).not.toBeDefined();
    });
  });

  // MARK: /employee/get
  describe("/employee/get", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/employee/get",
        token: adminAuth.token,
        query: {
          ids: [adminAuth.user.id, teacherAuth.user.id].join(","),
          include: ["groups", "worksheet"].join(","),
          fetch: ["groups", "worksheet"].join(","),
        }
      });
      console.log(JSON.stringify(resp.body));
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.employees?.length).toBeGreaterThan(0);
    });
  });
});

describe("Subject", async () => {
  const adminAuth = await testCreateUser("subjectEndpointsAdmin", ["administrator"]);
  const teacherAuth = await testCreateUser("subjectEndpointsTeacher", ["teacher"]);
  // MARK: /subject/all
  describe("/subject/all", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/subject/all",
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.subjects?.length).toBeGreaterThan(0);
    });
    test("As teacher", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/subject/all",
        token: teacherAuth.token,
      });
      expect(resp.status).toBe(400);
    });
    test("Without token", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/subject/all",
      });
      expect(resp.status).toBe(401);
    });
  });

  // MARK: /subject/get
  describe("/subject/get", () => {
    test("200", async () => {
      const createResp = await testRequest({
        method: "post",
        url: "/subject/create",
        body: {
          name: "Test Subject",
          description: "Test Description",
        },
        token: adminAuth.token,
      });
      expect(createResp.status).toBe(200);
      const subjectId = createResp.body?.data?.subject?.id;
      expect(subjectId).toBeDefined();
      const resp = await testRequest({
        method: "get",
        url: "/subject/get",
        query: { ids: subjectId },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.subjects?.length).toBe(1);
      expect(resp.body?.data?.subjects[0]?.name).toBe("Test Subject");
    });
  });

  // MARK: /subject/create
  describe("/subject/create", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/subject/create",
        body: {
          name: "Another Subject",
          description: "Another Description",
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.subject?.name).toBe("Another Subject");
    });
    test("As teacher", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/subject/create",
        body: {
          name: "Teacher Subject",
          description: "Description",
        },
        token: teacherAuth.token,
      });
      expect(resp.status).toBe(400);
    });
  });

  // MARK: /subject/update
  describe("/subject/update", () => {
    test("200", async () => {
      const createResp = await testRequest({
        method: "post",
        url: "/subject/create",
        body: {
          name: "Update Test Subject",
          description: "Original Description",
        },
        token: adminAuth.token,
      });
      const subjectId = createResp.body?.data?.subject?.id;
      const resp = await testRequest({
        method: "post",
        url: "/subject/update",
        body: {
          id: subjectId,
          name: "Updated Subject",
          description: "Updated Description",
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
    });
  });

  // MARK: /subject/remove
  describe("/subject/remove", () => {
    test("200", async () => {
      const createResp = await testRequest({
        method: "post",
        url: "/subject/create",
        body: {
          name: "To Be Deleted",
          description: "This will be deleted",
        },
        token: adminAuth.token,
      });
      const subjectId = createResp.body?.data?.subject?.id;
      const resp = await testRequest({
        method: "post",
        url: "/subject/remove",
        body: {
          ids: [subjectId],
        },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
    });
  });
});

describe("Student", async () => {
  const adminAuth = await testCreateUser("studentEndpointsAdmin", ["administrator"]);
  const teacherAuth = await testCreateUser("studentEndpointsTeacher", ["teacher"]);
  // MARK: /student/all
  describe("/student/all", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/student/all",
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.students).toBeDefined();
    });
    test("As teacher", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/student/all",
        token: teacherAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.students).toBeDefined();
    });
  });

  // MARK: /student/create
  describe("/student/create", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/student/create",
        body: {
          name: "Test Student",
          grade: 9,
          email: "student@example.com",
          phone: "+1234567890",
          parent: {
            name: "Parent Name",
            email: "parent@example.com",
            phone: "+0987654321"
          }
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.student?.name).toBe("Test Student");
    });
    test("Missing required fields", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/student/create",
        body: {
          grade: 10
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(400);
    });
  });

  // MARK: /student/get
  describe("/student/get", () => {
    test("200", async () => {
      const createResp = await testRequest({
        method: "post",
        url: "/student/create",
        body: {
          name: "Get Test Student",
          grade: 10,
          email: "get-test-student@example.com",
          phone: "+1234567890",
          parent: {
            name: "Parent Name",
            email: "parent@example.com",
            phone: "+0987654321"
          }
        },
        token: adminAuth.token,
      });
      const studentId = createResp.body?.data?.student?.id;
      const resp = await testRequest({
        method: "get",
        url: "/student/get",
        query: { ids: studentId },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.students?.length).toBe(1);
      expect(resp.body?.data?.students[0]?.name).toBe("Get Test Student");
    });
  });

  // MARK: /student/update
  describe("/student/update", () => {
    test("200", async () => {
      const createResp = await testRequest({
        method: "post",
        url: "/student/create",
        body: {
          name: "Update Test Student",
          grade: 11,
          email: "update-test-student@example.com",
          phone: "+1234567890",
          parent: {
            name: "Parent Name",
            email: "parent@example.com",
            phone: "+0987654321"
          }
        },
        token: adminAuth.token,
      });
      const studentId = createResp.body?.data?.student?.id;
      const resp = await testRequest({
        method: "post",
        url: "/student/update",
        body: {
          id: studentId,
          name: "Updated Student",
          grade: 12
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
    });
  });
});

describe("Location", async () => {
  const adminAuth = await testCreateUser("locationEndpointsAdmin", ["administrator"]);
  const teacherAuth = await testCreateUser("locationEndpointsTeacher", ["teacher"]);
  // MARK: /location/all
  describe("/location/all", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/location/all",
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.locations).toBeDefined();
    });
    test("As teacher", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/location/all",
        token: teacherAuth.token,
        skipSchemaValidation: true
      });
      console.log("Teacher /location/all response:", resp.status, JSON.stringify(resp.body));
      expect(resp.status).toBe(400);
    });
    test("Without token", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/location/all",
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(401);
    });
  });

  // MARK: /location/create
  describe("/location/create", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/location/create",
        body: {
          name: "Test Location",
          address: "123 Test Street",
          contact_email: "location@example.com",
          contact_phone: "+1234567890"
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.location?.name).toBe("Test Location");
    });
  });
  
  // MARK: /location/get
  describe("/location/get", () => {
    test("200", async () => {
      const createResp = await testRequest({
        method: "post",
        url: "/location/create",
        body: {
          name: "Get Test Location",
          address: "456 Test Avenue",
          contact_email: "location-get@example.com",
          contact_phone: "+1234567890"              
        },
        token: adminAuth.token,
      });
      const locationId = createResp.body?.data?.location?.id;
      const resp = await testRequest({
        method: "get",
        url: "/location/get",
        query: { ids: locationId },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.locations?.length).toBe(1);
      expect(resp.body?.data?.locations[0]?.name).toBe("Get Test Location");
    });
  });
});

describe("Group", async () => {
  const adminAuth = await testCreateUser("groupEndpointsAdmin", ["administrator"]);
  const teacherAuth = await testCreateUser("groupEndpointsTeacher", ["teacher"]);
  let locationId: string;
  beforeAll(async () => {
    try {
      const createResp = await testRequest({
        method: "post",
        url: "/location/create",
        body: {
          name: "Group Test Location",
          address: "789 Group Street",
          contact_email: "group-location@example.com",
          contact_phone: "+1234567890"
        },
        token: adminAuth.token,
      });
      locationId = createResp.body?.data?.location?.id;
      console.log("Created location for Group tests:", locationId);
    } catch (error) {
      console.error("Failed to create location for Group tests:", error);
    }
  });

  // MARK: /group/all
  describe("/group/all", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/group/all",
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.groups).toBeDefined();
    });
  });

  // MARK: /group/create
  describe("/group/create", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/group/create",
        body: {
          name: "Test Group",
          location: locationId,
          teachers: [adminAuth.user.id]
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.group?.name).toBe("Test Group");
    });
    test("With lessons", async () => {
      const now = new Date();
      const later = new Date(now.getTime() + 3600000);
      const resp = await testRequest({
        method: "post",
        url: "/group/create",
        body: {
          name: "Test Group With Lessons",
          location: locationId,
          teachers: [adminAuth.user.id],
          lessons: [
            {
              start: now.toISOString(),
              end: later.toISOString()
            }
          ]
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.group?.name).toBe("Test Group With Lessons");
    });
  });

  // MARK: /group/get
  describe("/group/get", () => {
    test("200", async () => {
      const createResp = await testRequest({
        method: "post",
        url: "/group/create",
        body: {
          name: "Get Test Group",
          location: locationId,
          teachers: [adminAuth.user.id]
        },
        token: adminAuth.token,
      });
      const groupId = createResp.body?.data?.group?.id;
      const resp = await testRequest({
        method: "get",
        url: "/group/get",
        query: { 
          ids: groupId,
          fetch: "location,teachers"
        },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.groups?.length).toBe(1);
      expect(resp.body?.data?.groups[0]?.name).toBe("Get Test Group");
    });
  });
});

describe("Lesson", async () => {
  const adminAuth = await testCreateUser("lessonEndpointsAdmin", ["administrator"]);
  const teacherAuth = await testCreateUser("lessonEndpointsTeacher", ["teacher"]);
  let groupId: string;
  let locationId: string;
  beforeAll(async () => {
    try {
      const locResp = await testRequest({
        method: "post",
        url: "/location/create",
        body: {
          name: "Lesson Test Location",
          address: "123 Lesson Street",
          contact_email: "lesson-location@example.com",
          contact_phone: "+1234567890"
        },
        token: adminAuth.token,
      });
      locationId = locResp.body?.data?.location?.id;
      console.log("Created location for Lesson tests:", locationId);
      const groupResp = await testRequest({
        method: "post",
        url: "/group/create",
        body: {
          name: "Lesson Test Group",
          location: locationId,
          teachers: [adminAuth.user.id]
        },
        token: adminAuth.token,
      });
      groupId = groupResp.body?.data?.group?.id;
      console.log("Created group for Lesson tests:", groupId);
    } catch (error) {
      console.error("Failed to setup Lesson tests:", error);
    }
  });

  // MARK: /lesson/all
  describe("/lesson/all", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "get",
        url: "/lesson/all",
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.lessons).toBeDefined();
    });
  });

   // MARK: /lesson/create
   describe("/lesson/create", () => {
    test("200", async () => {
      const now = new Date();
      const later = new Date(now.getTime() + 3600000);
      
      const resp = await testRequest({
        method: "post",
        url: "/lesson/create",
        body: {
          name: "Test Lesson",
          group: groupId,
          start: now.toISOString(),
          end: later.toISOString(),
          location: locationId,
          teachers: [adminAuth.user.id]
        },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.lesson?.name).toBe("Test Lesson");
    });
  });

  // MARK: /lesson/between_dates
  describe("/lesson/between_dates", () => {
    test("200", async () => {
      const now = new Date();
      const later = new Date(now.getTime() + 86400000);
      const resp = await testRequest({
        method: "get",
        url: "/lesson/between_dates",
        query: {
          from: now.toISOString(),
          to: later.toISOString()
        },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.lessons).toBeDefined();
    });
  });

  // MARK: /lesson/attendance
  describe("/lesson/attendance", () => {
    test("200", async () => {
      const now = new Date();
      const later = new Date(now.getTime() + 3600000);
      const freshGroupResp = await testRequest({
        method: "post",
        url: "/group/create",
        body: {
          name: "Attendance Test Group",
          location: locationId,
          teachers: [adminAuth.user.id]
        },
        token: adminAuth.token,
      });
      const freshGroupId = freshGroupResp.body?.data?.group?.id;
      const lessonResp = await testRequest({
        method: "post",
        url: "/lesson/create",
        body: {
          name: "Attendance Test Lesson",
          group: freshGroupId,
          start: now.toISOString(),
          end: later.toISOString(),
          location: locationId,
          teachers: [adminAuth.user.id]
        },
        query: {
          include: "location,teachers,students,group",
          fetch: "location,teachers,students,group"
        },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      const lessonId = lessonResp.body?.data?.lesson?.id;
      const studentResp = await testRequest({
        method: "post",
        url: "/student/create",
        body: {
          name: "Attendance Test Student",
          grade: 10,
          email: "attendance-student@example.com",
          phone: "+1234567890",
          parent: {
            name: "Parent Name",
            email: "parent@example.com",
            phone: "+0987654321"
          }
        },
        token: adminAuth.token,
      });
      const studentId = studentResp.body?.data?.student?.id;
      const resp = await testRequest({
        method: "post",
        url: "/lesson/attendance",
        body: {
          id: lessonId,
          students: [studentId]
        },
        query: {
          include: "location,teachers,students,group",  
          fetch: "location,teachers,students,group"   
        },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
    });
  });
});

describe("Enrolment", async () => {
  const adminAuth = await testCreateUser("enrolmentEndpointsAdmin", ["administrator"]);
  let groupId: string;
  let studentId: string;
  let subjectId: string;
  beforeAll(async () => {
    const locationResp = await testRequest({
      method: "post",
      url: "/location/create",
      body: {
        name: "Enrolment Test Location",
        address: "123 Enrolment Street",
        contact_email: "enrolment-location@example.com",
        contact_phone: "+1234567890"
      },
      token: adminAuth.token,
    });
    const locationId = locationResp.body?.data?.location?.id;
    const groupResp = await testRequest({
      method: "post",
      url: "/group/create",
      body: {
        name: "Enrolment Test Group",
        location: locationId,
        teachers: [adminAuth.user.id]
      },
      token: adminAuth.token,
    });
    groupId = groupResp.body?.data?.group?.id;
    const studentResp = await testRequest({
      method: "post",
      url: "/student/create",
      body: {
        name: "Enrolment Test Student",
        grade: 10,
        email: "enrolment-student@example.com",
        phone: "+1234567890",
        parent: {
          name: "Parent Name",
          email: "parent@example.com",
          phone: "+0987654321"
        }
      },
      token: adminAuth.token,
    });
    studentId = studentResp.body?.data?.student?.id;
    const subjectResp = await testRequest({
      method: "post",
      url: "/subject/create",
      body: {
        name: "Enrolment Test Subject",
        description: "For testing enrolment"
      },
      token: adminAuth.token,
    });
    subjectId = subjectResp.body?.data?.subject?.id;
  });

  // MARK: /enrolment/create
  describe("/enrolment/create", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/enrolment/create",
        body: {
          student: studentId,
          group: groupId,
          subject: subjectId,
          price: 14000
        },
        token: adminAuth.token,
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.enrolment).toBeDefined();
    });
  });
});

describe("Replacement", async () => {
  const adminAuth = await testCreateUser("replacementEndpointsAdmin", ["administrator"]);
  let studentId: string;
  let originalLessonId: string;
  let replacementLessonId: string;
  beforeAll(async () => {
    const locationResp = await testRequest({
      method: "post",
      url: "/location/create",
      body: {
        name: "Replacement Test Location",
        address: "123 Replacement Street",
        contact_email: "replacement-location@example.com", 
        contact_phone: "+1234567890"                      
      },
      token: adminAuth.token,
    });
    const locationId = locationResp.body?.data?.location?.id;
    const groupResp = await testRequest({
      method: "post",
      url: "/group/create",
      body: {
        name: "Replacement Test Group",
        location: locationId,
        teachers: [adminAuth.user.id]
      },
      token: adminAuth.token,
    });
    const groupId = groupResp.body?.data?.group?.id;
    const studentResp = await testRequest({
      method: "post",
      url: "/student/create",
      body: {
        name: "Replacement Test Student",
        grade: 10,
        email: "replacement-student@example.com",
        phone: "+1234567890",
        parent: {
          name: "Parent Name",
          email: "parent@example.com",
          phone: "+0987654321"
        }
      },
      token: adminAuth.token,
    });
    studentId = studentResp.body?.data?.student?.id;
    const now = new Date();
    const later = new Date(now.getTime() + 3600000);
    const originalLessonResp = await testRequest({
      method: "post",
      url: "/lesson/create",
      body: {
        name: "Original Lesson",
        group: groupId,
        start: now.toISOString(),
        end: later.toISOString(),
        location: locationId,
        teachers: [adminAuth.user.id]
      },
      query: {
        include: "location,teachers,group",
        fetch: "location,teachers,group"
      },
      token: adminAuth.token,
      skipSchemaValidation: true
    });
    originalLessonId = originalLessonResp.body?.data?.lesson?.id;
    const tomorrow = new Date(now.getTime() + 86400000);
    const tomorrowLater = new Date(tomorrow.getTime() + 3600000);
    const replacementLessonResp = await testRequest({
      method: "post",
      url: "/lesson/create",
      body: {
        name: "Replacement Lesson",
        group: groupId,
        start: tomorrow.toISOString(),
        end: tomorrowLater.toISOString(),
        location: locationId,
        teachers: [adminAuth.user.id]
      },
      query: {
        include: "location,teachers,group",
        fetch: "location,teachers,group"
      },
      token: adminAuth.token,
      skipSchemaValidation: true
    });
    replacementLessonId = replacementLessonResp.body?.data?.lesson?.id;
  });
  
  // MARK: /replacement/create
  describe("/replacement/create", () => {
    test("200", async () => {
      const resp = await testRequest({
        method: "post",
        url: "/replacement/create",
        body: {
          student: studentId,
          original_lesson: originalLessonId,
          replacement_lesson: replacementLessonId,
          extension: "1h"
        },
        query: {
          include: ["student", "original_lesson", "replacement_lesson", "group", "location", "teachers"].join(","),
          fetch: ["student", "original_lesson", "replacement_lesson", "group", "location", "teachers"].join(",")
        },
        token: adminAuth.token,
        skipSchemaValidation: true
      });
      expect(resp.status).toBe(200);
      expect(resp.body?.data?.replacement).toBeDefined();
    });
  });
});