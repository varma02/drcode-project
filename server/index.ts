import express from 'express';
import db from './lib/db';

import authRouter from './routes/auth';

console.log("\nStarting server...");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET environment variable is not set");
  process.exit(1);
}

db.ready;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    code: "hello_world",
    message: 'Hello, world!'
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    code: "not_found",
    message: 'Not Found',
  });
});

app.use("/auth", authRouter)

app.listen(
  process.env.PORT ?? 3000, 
  () => console.log('Server listening on port', process.env.PORT ?? 3000)
);