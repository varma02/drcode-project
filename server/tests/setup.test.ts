import { describe, expect, test } from 'bun:test';
import { setup } from '../src/index';
import db from '../src/database/connection';

describe("Setup", async () => {
  test("Setup function", async (done) => {
    const setupMessage = await setup();
    if (setupMessage) console.error(setupMessage);
    expect(setupMessage).toBeNull();
    done();
  });

  test("Database connection", async () => {
    const response = await db.query("RETURN $db_version;");
    expect(response).toBeArray();
    expect(response[0]).toBeNumber();
  }, 100);
});