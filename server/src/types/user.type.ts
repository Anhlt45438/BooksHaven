export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SHOP = 'shop'
}

export interface UserPayload {
  user_id: string;
  email: string;
  role: UserRole;
  username?: string;
}

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}