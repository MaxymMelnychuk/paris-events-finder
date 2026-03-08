export type SessionUser = {
  id: number;
  username: string;
  email: string;
};

export type LoginResponse = {
  message?: string;
  user?: SessionUser;
  error?: string;
};

export type RegisterResponse = {
  message?: string;
  userId?: number;
  error?: string;
};
