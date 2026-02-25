import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

interface UserAuthRow extends RowDataPacket {
  id: number;
  phone: string;
  token: string;
  status: number;
  level: number;
  balance: number;
  isVerified: boolean;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        phone: string;
        token: string;
        level: number;
        balance: number;
      };
    }
  }
}

export const createUserAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const auth = req.cookies.auth || req.headers.authorization?.replace('Bearer ', '');

      if (!auth) {
        res.status(401).json({
          message: 'Authentication required',
          status: false,
          timeStamp: Date.now()
        });
        return;
      }

      const [rows] = await db.execute<UserAuthRow[]>(
        `SELECT id, phone, token, status, level, balance
         FROM users
         WHERE token = ? AND isVerified = TRUE`,
        [auth]
      );

      if (rows.length === 0) {
        res.clearCookie('auth');
        res.status(401).json({
          message: 'Invalid or expired session',
          status: false,
          timeStamp: Date.now()
        });
        return;
      }

      const user = rows[0];

      if (user.status !== 1) {
        res.clearCookie('auth');
        res.status(403).json({
          message: 'Account suspended. Please contact support.',
          status: false,
          timeStamp: Date.now()
        });
        return;
      }

      // Attach user to request
      req.user = {
        id: user.id,
        phone: user.phone,
        token: user.token,
        level: user.level,
        balance: user.balance,
      };

      next();
    } catch (error) {
      console.error('userAuthMiddleware error:', error);
      res.status(500).json({
        message: 'Authentication error',
        status: false,
        timeStamp: Date.now()
      });
    }
  };
};

// Optional auth - doesn't fail if invalid, just doesn't attach user
export const createOptionalUserAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const auth = req.cookies.auth || req.headers.authorization?.replace('Bearer ', '');

      if (auth) {
        const [rows] = await db.execute<UserAuthRow[]>(
          `SELECT id, phone, token, status, level, balance
           FROM users
           WHERE token = ? AND isVerified = TRUE`,
          [auth]
        );

        if (rows.length > 0) {
          const user = rows[0];
          if (user.status === 1) {
            req.user = {
              id: user.id,
              phone: user.phone,
              token: user.token,
              level: user.level,
              balance: user.balance,
            };
          }
        }
      }

      next();
    } catch (error) {
      console.error('optionalUserAuthMiddleware error:', error);
      next();
    }
  };
};
