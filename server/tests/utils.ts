import { expect, beforeAll, afterAll } from "bun:test";
import { setup, app } from '../src/index';
import db from '../src/database/connection';
import { apply_seed, reset } from "../src/database/cli";
import request from 'supertest';
import { spec, ajv } from '../src/lib/utils';
import jwt from 'jsonwebtoken';


export async function testQuery(sql: string, params?: {[key: string]: string}) {
  await db.ready;
  return (await db.query<any[]>(sql, params))[0];
}

export async function testAuth(email: string) {
  if (process.env.API_MODE !== "test")
    throw new Error("Test auth can only be used in test mode");
  const user = await testQuery("SELECT * FROM ONLY employee WHERE email == $email LIMIT 1", { email });
  const token = jwt.sign(
    { 
      employee_id: user.id, 
      session_key: user.session_key, 
      user_agent: "TEST MODE"
    },
    process.env.AUTHTOKEN_SECRET!,
    { algorithm: 'HS512', expiresIn: '12h' }
  );
  delete user.password;
  delete user.session_key;
  return {
    token,
    user: user
  };
}

export async function testCreateUser(slug: string, roles: ("administrator" | "teacher")[]) {
  const user = await testQuery(`
    CREATE ONLY employee:${slug} CONTENT {
      name: "TEST NAME",
      email: "${slug}@example.com",
      password: crypto::argon2::generate("1234"),
      roles: ${JSON.stringify(roles)},
    };
  `);
  return await testAuth(user.email);
}

export async function testRequest({
  method, url, body, query, token
}:{
  method: "get" | "post",
  url: string,
  body?: {[key: string]: any},
  query?: {[key: string]: any},
  token?: string
}) {
  const agent = request(app)[method](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .query(query || {});
  if (token) agent.set('Authorization', `Bearer ${token}`);
  const resp = await agent.send(body);
  const schema = spec.paths[url]?.[method.toLowerCase()]?.responses[resp.status]?.content["application/json"].schema;
  if (!schema) {
    console.error("No schema found for", method, url, resp.status);
    return resp;
  }
  const validate = ajv.compile(schema);
  const isValid = validate(resp.body);
  if (!isValid) console.error("Validation errors:\n", validate.errors, "\n", resp.body, "\n");
  expect(isValid).toBe(true);
  return resp;
}

export async function testSetup() {
  process.env.API_PORT = "3000";
  process.env.API_MODE = "test";
  process.env.AUTHTOKEN_SECRET = "verysecure4321";
  process.env.FILETOKEN_SECRET = "verysecure1234";
  process.env.DB_URL = "ws://db:8000/rpc";
  process.env.DB_NAMESPACE = "TEST";
  process.env.DB_DATABASE = "main";
  process.env.DB_USERNAME = "root";
  process.env.DB_PASSWORD = "root";
  await setup();
  await reset(true);
  await apply_seed();

  beforeAll(async (done) => {
    await db.ready;
    done();
  });

  afterAll(() => {
    db.close();
  });
}