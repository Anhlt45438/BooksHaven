

export interface UserPayload {
  user_id: string;
  email: string;
  username?: string;
}

// Extend Express Request interface to include user property
