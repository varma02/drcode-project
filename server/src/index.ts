import express, { type ErrorRequestHandler } from 'express';
import db, { db_connect } from './database/connection';

import authRouter from './routes/auth';
import employeesRouter from './routes/employees';

export default async function main() {
  console.log("\nStarting server...");
  
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is not set");
    process.exit(1);
  }
  
  await db_connect();
  
  const app = express();
  app.use(express.json());
  app.disable('x-powered-by');
  
  app.get('/', (req, res) => {
    res.status(200).json({
      code: "hello_world",
      message: 'Hello, world!'
    });
  });
  
  app.use('/auth', authRouter);
  app.use('/employees', employeesRouter);
  
  app.use((req, res, next) => {
    res.status(404).json({
      code: "not_found",
      message: 'Not Found',
    });
  });

  app.use(((err, req, res, next) => {
    res.status(400).json({
      code: "bad_request",
      message: err.message || "An unexpected error has occurred",
    });
  }) as ErrorRequestHandler);

  const server = app.listen(
    process.env.API_PORT ?? 3000, 
    () => console.log('Server listening on port', process.env.API_PORT ?? 3000)
  );

  return async () => {
    console.log("\nShutting down server...");
    await new Promise((r) => server.close((err) => r(err)));
    await db.close();
  }
}

if (require.main === module) {
  main();
}