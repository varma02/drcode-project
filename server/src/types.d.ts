import { DBEmployee } from './database/models';

declare module 'express-serve-static-core' {
  interface Request {
    user?: DBEmployee;
  }
}