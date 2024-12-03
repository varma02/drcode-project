import express, { type ErrorRequestHandler } from 'express';
import db, { db_connect } from './database/connection';

import authRouter from './routes/auth';
import employeesRouter from './routes/employees';

export const app = express();

export async function setup(): Promise<string | null> {
  if (!process.env.JWT_SECRET) {
    return "JWT_SECRET environment variable is not set";
  }

  if (!process.env.API_PORT) {
    return "API_PORT environment variable is not set";
  }
  
  if (!(await db_connect())) {
    return "Error connecting to database";
  }
  
  app.use(express.json());
  app.disable('x-powered-by');

  app.get('/', (req, res) => {
    res.status(200).json({
      code: "hello_world",
      message: 'Hello, world!'
    });
  });
  
  app.use('/auth', authRouter);
  app.use('/employee', employeesRouter);
  
  app.use((req, res, next) => {
    res.status(404).json({
      code: "not_found",
      message: 'Not Found',
    });
  });

  app.use(((err, req, res, next) => {
    res.status(500).json({
      code: "server_error",
      message: err.message || "An unexpected error has occurred",
    });
  }) as ErrorRequestHandler);

  return null;
}

export async function main() {
  console.log("\nStarting server...");
  
  const setupMessage = await setup();
  if (setupMessage) {
    console.error(setupMessage);
    process.exit(1);
  }

  const server = app.listen(
    process.env.API_PORT, 
    () => console.log('Server listening on port', process.env.API_PORT)
  );

  return async () => {
    console.log("\nShutting down server...");
    await new Promise((r) => server.close((err) => r(err)));
    await db.close();
  }
}

if (require.main === module) {
  main().then((closeApp) => {
    process.on('SIGINT', async () => {
      await closeApp();
      process.exit(0);
    });
  });
}