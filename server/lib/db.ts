import Surreal from "surrealdb";

const db = new Surreal();

db.connect(process.env.DB_URL ?? "http://localhost:8000/rpc", {
  namespace: "DRCODE",
  database: "main",
  auth: {
    username: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "root",
  }
}).then(
  () => console.log("Database connection established"),
  (err) => {
    console.error("Database connection failed\n", err);
    process.exit(1);
  },
);

export default db;