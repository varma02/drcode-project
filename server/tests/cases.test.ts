import { describe, expect, test } from 'bun:test';
import { testAuth, testCreateUser, testQuery, testRequest, testSetup } from './utils';

await testSetup();

describe("Authentication", () => {
  // MARK: /auth/me
  describe("/auth/me", async () => {
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
          new_password: "$Password1234",
          old_password: "1234",
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
  // TODO: Test this endpoint
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
      expect(resp.status).toBe(401);
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