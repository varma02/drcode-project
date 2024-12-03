import { Employee } from './database/models';

declare module 'express-serve-static-core' {
  interface Request {
    employee?: Employee;
  }
}