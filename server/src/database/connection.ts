import Surreal from "surrealdb";

const db = new Surreal();

export async function db_connect(): Promise<boolean> {
  if (db.ready) return true;
  try {
    await db.connect(process.env.DB_URL || "ws://localhost:8000/rpc", {
      namespace: process.env.DB_NAMESPACE || "DRCODE",
      database: process.env.DB_DATABASE || "main",
      auth: {
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "root",
      }
    });
    return true;
  } catch (error) {
    return false;
  }
}

export default db;