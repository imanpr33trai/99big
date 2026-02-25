import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { findUserByToken } from '../db/wingo.queries';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    phone: string;
    userName: string;
    balance: number;
    userLevel: number;
    authToken: string;
  };
}

/**
 * Authentication middleware for Wingo routes
 */
export const wingoAuthMiddleware = (db: Pool) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authToken = req.cookies?.auth || req.headers?.authorization?.replace('Bearer ', '');

      if (!authToken) {
        res.status(401).json({
          message: 'Authentication required',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      const user = await findUserByToken(db, authToken);

      if (!user) {
        res.status(401).json({
          message: 'Invalid authentication token',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      if (user.status !== 0) {
        res.status(403).json({
          message: 'Account is suspended or banned',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // Attach user to request
      req.user = {
        id: user.id,
        phone: user.phone,
        userName: user.userName,
        balance: user.balance,
        userLevel: user.userLevel,
        authToken: user.authToken || '',
      };

      next();
    } catch (error) {
      console.error('wingoAuthMiddleware error:', error);
      res.status(500).json({
        message: 'Authentication error',
        status: false,
        timeStamp: Date.now(),
      });
    }
  };
};
