import { User } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      user?: User | any;
      userId?: string;
    }
  }
}
