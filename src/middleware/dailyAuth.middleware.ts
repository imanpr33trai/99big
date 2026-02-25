import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

interface UserTokenRow extends RowDataPacket {
  token: string;
  level: number;
  status: number;
}

export const createDailyAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const auth = req.cookies.auth;

      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false });
        return;
      }

      const [rows] = await db.execute<UserTokenRow[]>(
        `SELECT token, level, status FROM users
         WHERE token = ? AND isVerified = TRUE`,
        [auth]
      );

      if (rows.length === 0) {
        res.status(401).json({ message: 'Invalid token', status: false });
        return;
      }

      const user = rows[0];

      if (auth !== user.token || user.status !== 1) {
        res.status(401).json({ message: 'Account suspended or invalid session', status: false });
        return;
      }

      // CTV level = 2
      if (user.level !== 2) {
        res.status(403).json({ message: 'CTV access required', status: false });
        return;
      }

      next();
    } catch (error) {
      console.error('dailyAuthMiddleware error:', error);
      res.status(500).json({ message: 'Authentication error', status: false });
    }
  };
};
