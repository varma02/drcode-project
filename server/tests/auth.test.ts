import { describe, expect, test } from 'bun:test';
import request, { type Response } from 'supertest';
import { setup, app } from '../src/index';

await setup();

describe("Default admin profile", async () => {
  
  let token = "";
  let authResponse: Response;
  authResponse = await request(app)
    .post('/auth/login')
    .send({
      email: "admin@example.com",
      password: "1234"
    });
  token = authResponse?.body?.data?.token;
  
  test("Login", async () => {
    expect(authResponse.headers["content-type"]).toMatch(/json/);
    expect(authResponse.status).toEqual(200);
    expect(authResponse.body.code).toEqual('success');
    expect(authResponse.body.data).toBeObject();
    expect(authResponse.body.data.token).toBeString();
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
    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual('invalid_credentials');
    expect(response.body.message).toBeString();
  }, 100);

  test.if(!!token)("Get user data", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set('Authorization', `Bearer ${token}`);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual('success');
    expect(response.body.data.employee).toBeObject();
    expect(response.body.data.employee.id).toBeString();
  }, 100);

  test.if(!!token)("Try to get user data without token", async () => {
    const response = await request(app)
      .get("/auth/me")
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual('unauthorized');
    expect(response.body.message).toBeString();
  }, 100);

  test.if(!!token)("Update name", async () => {
    const randomName = Math.random().toString(36).substring(7);
    const response = await request(app)
      .patch("/auth/update")
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

});