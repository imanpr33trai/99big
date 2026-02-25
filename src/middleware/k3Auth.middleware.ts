import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';

/**
 * Middleware to validate user authentication for K3 betting operations
 */
export const k3AuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authToken = req.cookies?.auth || req.headers?.authorization;

      if (!authToken) {
        res.status(401).json({
          message: 'Authentication required',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      const [rows] = await db.execute(
        'SELECT id, phone, userName, balance, referralCode, invitedBy, status FROM users WHERE token = ? AND isVerified = TRUE LIMIT 1',
        [authToken]
      );

      if (!rows || (rows as any[]).length === 0) {
        res.status(401).json({
          message: 'Invalid or expired authentication',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      const user = (rows as any[])[0];

      if (user.status !== 1) {
        res.status(403).json({
          message: 'Account suspended',
          status: false,
          timeStamp: Date.now(),
        });
        return;
      }

      // Attach user to request for downstream use
      (req as any).user = user;
      next();
    } catch (error) {
      console.error('K3 auth middleware error:', error);
      res.status(500).json({
        message: 'Authentication verification failed',
        status: false,
        timeStamp: Date.now(),
      });
    }
  };
};
