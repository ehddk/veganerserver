declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: RoleType;
        name: string;
      };
    }
  }
}

export {};
