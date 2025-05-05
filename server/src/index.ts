import express from 'express';
import cors from 'cors';
import db, { db_connect } from './database/connection';

import authRouter from './routes/auth';
import employeesRouter from './routes/employees';
import groupsRouter from './routes/groups';
import locationsRouter from './routes/location';
import lessonRouter from './routes/lesson';
import inviteRouter from './routes/invite';
import subjectRouter from './routes/subject';
import studentRouter from './routes/student';
import fileRouter from './routes/file';
import worksheetRouter from './routes/worksheet';
import enrolmentRouter from './routes/enrolment';
import replacementRouter from './routes/replacement';

export const app = express();

export async function setup(): Promise<string | null> {
  if (!process.env.AUTHTOKEN_SECRET) {
    return "AUTHTOKEN_SECRET environment variable is not set";
  }

  if (!process.env.FILETOKEN_SECRET) {
    return "FILETOKEN_SECRET environment variable is not set";
  }

  if (!process.env.API_PORT) {
    return "API_PORT environment variable is not set";
  }
  
  if (!(await db_connect())) {
    return "Error connecting to database";
  }
  
  app.use(express.json());
  app.use(cors());
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    console.log(req.ip, req.method, req.path);
    next();
  });

  app.get('/', async (req, res) => {
    res.status(200).json({
      code: "success",
      message: 'Hello, World!'
    });
  });
  
  app.use('/auth', authRouter);
  app.use('/employee', employeesRouter);
  app.use('/group', groupsRouter);
  app.use('/location', locationsRouter);
  app.use('/lesson', lessonRouter);
  app.use('/invite', inviteRouter);
  app.use('/subject', subjectRouter);
  app.use('/student', studentRouter);
  app.use('/file', fileRouter);
  app.use('/worksheet', worksheetRouter);
  app.use('/enrolment', enrolmentRouter);
  app.use('/replacement', replacementRouter);
  
  app.use((req, res, next) => {
    res.status(404).json({
      code: "not_found",
      message: 'The route you requested does not exist or uses a different HTTP method.',
    });
  });

  app.use(function (err, req, res, next) {
    res.status(404).json({
      code: "bad_request",
      message: err.message,
    });
  } as express.ErrorRequestHandler);

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
    return
  }
}

if (require.main === module) {
  main().then((closeApp) => {
    for (const signal of ['SIGTERM', 'SIGINT', 'SIGKILL']) {
      process.once(signal, async () => {
        await closeApp();
        process.exit(0);
      });
    }
  });
}