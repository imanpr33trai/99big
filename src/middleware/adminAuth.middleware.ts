import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { AdminUser } from '../types/admin.types';

// Extend Express Request
declare global {
namespace Express {
interface Request {
admin?: AdminUser;
}
}
}

/\*\*

- Admin authentication middleware
- Validates token and checks admin level (1 or 2)
  \*/
  export const adminAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
  const authToken = req.headers.authorization?.replace('Bearer ', '') ||
  req.body.token ||
  req.query.token;

        if (!authToken) {
          res.status(401).json({
            message: 'Authentication required',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        const [rows] = await db.execute(
          `SELECT id, phone, userName, passwordHash, authToken, balance, referralCode,
                  invitedBy, isVerified, status, userLevel, createdAt
           FROM users WHERE authToken = ? AND userLevel IN (1, 2) LIMIT 1`,
          [authToken]
        );

        const users = rows as AdminUser[];

        if (users.length === 0) {
          res.status(401).json({
            message: 'Invalid admin token or insufficient privileges',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        const admin = users[0];

        if (admin.status !== 0) {
          res.status(403).json({
            message: 'Admin account suspended or banned',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        req.admin = admin;
        next();
      } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(500).json({
          message: 'Internal server error',
          status: false,
          timeStamp: Date.now(),
        });
      }

  };
  };
