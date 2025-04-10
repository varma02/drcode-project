import fs from 'fs';
import path from 'path';
import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { setup, app } from '../src/index';
import db from '../src/database/connection';
import { apply_seed, reset } from "../src/database/cli";
import request from 'supertest';
import { parse as jsonrefParse } from 'jsonref';
import Ajv from 'ajv';
import AjvAddFormats from 'ajv-formats';

const spec = await jsonrefParse((await import("../openapi.spec.json")).default, {scope: 'file:///'});

interface TestCase {
  category: string,
  tests: {
      auth: "teacher" | "administrator",
      description: string,
      request: {
        method: string,
        body: object,
        query: object,
      },
      response: {
        status: number,
        schema: any,
      } | string,
  }[]
}
// @ts-expect-error
const cases: {[key:string]: TestCase} = (await import("./testcases.json")).default;

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
          email: "admin@example.com",
          password: "1234"
        })
      if (resp.status !== 200) {
        console.error("Failed to login with email:", x.email, "\nResponse:\n", resp.body);
        throw new Error("Setup failed");
      }
      x.token = resp.body.token;
    }
    done();
  });

  afterAll(() => {
    db.close();
  });

  for (const [p, c] of Object.entries(cases)) {
    describe(p, () => {
      for (const t of c.tests) {
        test(t.description, async () => {
          const agent = request(app);
          let resp;
          switch (t.request.method) {
            case "GET": resp = agent.get(p); break;
            case "POST": resp = agent.post(p); break;
            default: throw new Error("Method not supported");
          }
          if (t.auth) resp = resp.set("Authorization", `Bearer ${auth[t.auth].token}`)
          resp = await resp
            .query(t.request.query || {})
            .send(t.request.body || {})
          const ajv = new Ajv({strict: false, allErrors: true});
          AjvAddFormats(ajv);
          const validate = ajv.compile(typeof t.response === "string" 
            ? spec.paths[p][t.request.method.toLowerCase()].responses[t.response].content["application/json"].schema
            : t.response.schema
          );
          expect(resp.status).toBe(typeof t.response === "object"
            ? t.response.status
            : parseInt(t.response)
          );
          const isValid = validate(resp.body);
          if (!isValid) console.error("Validation errors:", validate.errors);
          expect(isValid).toBe(true);
        });
      }
    })
  }
}

export async function generate(args: string[]) {
  const newCases: {[key:string]: object} = {};

  for (const [path, v] of Object.entries(spec.paths)) {
    if (cases[path]) newCases[path] = cases[path];
    else {
      // console.log((v as any).map(x => x.responses.map(y => y.content["application/json"].schema)).flat(1));
      newCases[path] = {
        category: (v as any)?.tags?.[0] || "uncategorized",
        tests: [
          {
            auth: "administrator",
            description: "example test",
            request: {
              method: "GET",
              body: {},
              query: {},
            },
            response: {
              status: 200,
              body: {},
            },
          }
        ]
      };
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "testcases.json"),
    JSON.stringify(newCases, null, 2),
    { encoding: "utf-8" }
  );
  console.log("Test cases generated successfully.");
}

async function main() {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case 'generate':
      await generate(args.slice(1));
      break;
    default:
      await tests();
      break;
  }
}

if (require.main === module) {
  main();
}