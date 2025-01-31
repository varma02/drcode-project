import { beforeAll, afterAll } from "bun:test";
import { setup } from '../src/index';
import db from '../src/database/connection';
import { apply_seed, reset } from "../src/database/cli";

beforeAll(async () => {
  process.env.API_PORT = "3000"
  process.env.AUTHTOKEN_SECRET = "verysecure"
  process.env.FILETOKEN_SECRET = "verysecure"
  process.env.DB_URL = "ws://db:8000/rpc"
  process.env.DB_NAMESPACE = "UNITTEST"
  process.env.DB_DATABASE = "main"
  process.env.DB_USERNAME = "root"
  process.env.DB_PASSWORD = "root"
  process.env.DEVELOPMENT_MODE = "false"

  await setup();
  await reset(true);
  await apply_seed();
});

afterAll(() => {
  db.close();
});