import { User } from '../../shared/models';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null;
  }
}