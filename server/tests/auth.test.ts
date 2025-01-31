import { describe, expect, test } from 'bun:test';
import request, { type Response } from 'supertest';
import { app } from '../src/index';
import db from '../src/database/connection';

describe("Authentication (/auth)", () => {
  let token = "";

  test("Login as Default Admin", async (done) => {
    let authResponse: Response;
    authResponse = await request(app)
      .post('/auth/login')
      .send({
        email: "admin@example.com",
        password: "1234"
      });
    token = authResponse?.body?.data?.token;
    expect(authResponse.headers["content-type"]).toMatch(/json/);
    expect(authResponse.status).toEqual(200);
    expect(authResponse.body.code).toEqual('success');
    expect(authResponse.body.data).toBeObject();
    expect(authResponse.body.data.token).toBeString();
    done();
  }, 100);
  
  test("Login without credentials", async () => {
    const response = await request(app)
      .post('/auth/login');
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(400);
    expect(response.body.code).toEqual('fields_required');
    expect(response.body.message).toBeString();
  }, 100);

  test("Login with invalid credentials", async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: "wrong@email.com",
        password: "wrongpassword"
      });
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(400);
    expect(response.body.code).toEqual('invalid_credentials');
    expect(response.body.message).toBeString();
  }, 100);

  test("Get user data", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set('Authorization', `Bearer ${token}`);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('success');
    expect(response.body.data.employee).toBeObject();
    expect(response.body.data.employee.id).toBeString();
  }, 100);

  test("Try to get user data without token", async () => {
    const response = await request(app)
      .get("/auth/me")
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual('unauthorized');
    expect(response.body.message).toBeString();
  }, 100);

  test("Update username", async () => {
    const randomName = Math.random().toString(36).substring(7);
    const response = await request(app)
      .post("/auth/update")
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: randomName,
        old_password: "1234"
      });
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('success');
    expect(response.body.data).toBeObject();
    expect(response.body.data.employee).toBeObject();
    expect(response.body.data.employee.name).toEqual(randomName);
  }, 100);

  test("Update everything", async () => {
    const randomName = Math.random().toString(36).substring(7);
    const randomEmail = Math.random().toString(36).substring(7) + "@example.com";
    const response = await request(app)
      .post("/auth/update")
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: randomName,
        email: randomEmail,
        new_password: "VerySecure1234$#",
        old_password: "1234"
      });
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('success');
    expect(response.body.data).toBeObject();
    expect(response.body.data.employee).toBeObject();
    expect(response.body.data.employee.name).toEqual(randomName);
    expect(response.body.data.employee.email).toEqual(randomEmail);
  }, 100);

  test("Register a new user", async () => {
    const randomName = Math.random().toString(36).substring(7);
    const randomEmail = Math.random().toString(36).substring(7) + "@example.com";
    const invite = (await db.query<any[]>(`
      CREATE ONLY invite CONTENT {
        author: (SELECT VALUE id FROM ONLY employee WHERE "administrator" IN roles LIMIT 1),
        roles: ["teacher", "administrator"],
      }`))[0];
    const response = await request(app)
      .post("/auth/register")
      .send({
        invite_id: invite?.id,
        name: randomName,
        email: randomEmail,
        password: "VerySecure1234$#"
      });
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('success');
  });
});