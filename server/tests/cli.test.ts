import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { setup, app } from '../src/index';
import db from '../src/database/connection';
import { apply_seed, reset } from "../src/database/cli";
import request from 'supertest';
import { spec, ajv } from '../src/lib/utils';

export interface TestCase {
  description: string,
  request?: {
      auth?: "teacher" | "administrator",
      body?: object,
      query?: object,
    },
    response?: object,
}

export async function tests() {
  const auth = {
    "teacher": {
      email: "teacher@example.com",
      password: "1234",
      token: "",
    },
    "administrator": {
      email: "admin@example.com",
      password: "1234",
      token: "",
    }
  };

  beforeAll(async (done) => {
    process.env.API_PORT = "3000";
    process.env.AUTHTOKEN_SECRET = "verysecure4321";
    process.env.FILETOKEN_SECRET = "verysecure1234";
    process.env.DB_URL = "ws://db:8000/rpc";
    process.env.DB_NAMESPACE = "TEST";
    process.env.DB_DATABASE = "main";
    process.env.DB_USERNAME = "root";
    process.env.DB_PASSWORD = "root";
    process.env.DEVELOPMENT_MODE = "false";

    await setup();
    await reset(true);
    await apply_seed();

    for (const x of Object.values(auth)) {
      const resp = await request(app)
        .post('/auth/login')
        .send({
          email: x.email,
          password: x.password,
          remember: false,
        })
      if (resp.status !== 200 || !resp.body.data.token) {
        console.error("Failed to login with email:", x.email, "\nResponse:\n", resp.body);
        throw new Error("Setup failed");
      }
      x.token = resp.body.data.token;
    }
    done();
  });

  afterAll(() => {
    db.close();
  });

  for (const [path, pv] of Object.entries(spec.paths as object)) {
    describe(path, () => {
      for (const [operation, ov] of Object.entries(pv)) {
        describe(operation.toUpperCase(), () => {
          for (let [response, rv] of Object.entries((ov as any).responses as object)) {
            if (rv.allOf) rv = (rv?.allOf as any[])?.reduce((prev, v) => ({...prev, ...v}), {});
            describe(response, () => {
              for (const xtest of (rv?.["x-tests"] as TestCase[]) || []) {
                test(xtest.description, async () => {
                  let agent = operation == "get" ? request(app).get(path) : operation == "post" ? request(app).post(path) : undefined;
                  if (!agent) throw new Error("Invalid operation");
                  if (xtest.request?.auth) agent = agent.set("Authorization", `Bearer ${auth[xtest.request.auth].token}`)
                  const resp = await agent
                    .query(xtest.request?.query || {})
                    .send(xtest.request?.body || {})
                  const validate = ajv.compile(xtest.response || rv.content["application/json"].schema);
                  expect(resp.status).toBe(parseInt(response));
                  const isValid = validate(resp.body);
                  if (!isValid) console.error("Validation errors:", validate.errors);
                  expect(isValid).toBe(true);
                });
              }
            });
          }
        });
      }
    });
  }
}

if (require.main === module) {
  await tests();
}