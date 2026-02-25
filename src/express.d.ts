declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        phone: string;
        userName: string;
        userLevel: number;
        commissionLevel: number;
      };
    }
  }
}
