import Surreal from "surrealdb";

const db = new Surreal();

export async function db_connect() {
  if (db.ready) return;
  try {
    await db.connect(process.env.DB_URL || "ws://localhost:8000/rpc", {
      namespace: process.env.DB_NAMESPACE || "DRCODE",
      database: process.env.DB_DATABASE || "main",
      auth: {
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "root",
      }
    });
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed!\n", error);
    process.exit(1);
  }
}

export default db;