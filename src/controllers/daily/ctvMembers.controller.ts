import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { DailyApiResponse, PaginationInput } from '../../types/daily.types';
import { PaginationSchema } from '../../types/daily.types';

const timeNow = () => Date.now();

export const createCTVMembersController = (db: Pool) => ({
  // List CTV members
  listMember: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = PaginationSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid pagination', status: false, timeStamp: timeNow() });
        return;
      }

      const { pageno, limit } = validation.data;
      const auth = req.cookies.auth;

      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT phone FROM users WHERE token = ? AND isVerified = TRUE AND level = 2',
        [auth]
      );

      if (userRows.length === 0) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const ctvPhone = (userRows[0] as { phone: string }).phone;
      const offset = pageno * limit;

      const [members] = await db.execute<RowDataPacket[]>(
        `SELECT id, phone, balance, totalMoney, status, createdAt
         FROM users
         WHERE invitedByPhone = ? AND isVerified = TRUE
         ORDER BY id DESC LIMIT ? OFFSET ?`,
        [ctvPhone, limit, offset]
      );

      const [total] = await db.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users WHERE invitedByPhone = ? AND isVerified = TRUE',
        [ctvPhone]
      );

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: members,
        page_total: Math.ceil((total[0] as { count: number }).count / limit),
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('listMember error:', error);
      res.status(500).json({ message: 'Failed', status: false, timeStamp: timeNow() });
    }
  },

  // List member recharges
  listRechargeMem: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = PaginationSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid pagination', status: false, timeStamp: timeNow() });
        return;
      }

      const { pageno, limit } = validation.data;
      const auth = req.cookies.auth;
      const offset = pageno * limit;

      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT phone FROM users WHERE token = ? AND isVerified = TRUE AND level = 2',
        [auth]
      );

      if (userRows.length === 0) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const ctvPhone = (userRows[0] as { phone: string }).phone;

      const [records] = await db.execute<RowDataPacket[]>(
        `SELECT d.id, d.userId, d.amount, d.status, d.createdAt, u.phone as userPhone
         FROM deposits d
         JOIN users u ON d.userId = u.id
         WHERE u.invitedByPhone = ?
         ORDER BY d.createdAt DESC LIMIT ? OFFSET ?`,
        [ctvPhone, limit, offset]
      );

      const [total] = await db.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as count FROM deposits d
         JOIN users u ON d.userId = u.id
         WHERE u.invitedByPhone = ?`,
        [ctvPhone]
      );

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: records,
        page_total: Math.ceil((total[0] as { count: number }).count / limit),
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('listRechargeMem error:', error);
      res.status(500).json({ message: 'Failed', status: false, timeStamp: timeNow() });
    }
  },

  // List member withdrawals
  listWithdrawMem: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = PaginationSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid pagination', status: false, timeStamp: timeNow() });
        return;
      }

      const { pageno, limit } = validation.data;
      const auth = req.cookies.auth;
      const offset = pageno * limit;

      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT phone FROM users WHERE token = ? AND isVerified = TRUE AND level = 2',
        [auth]
      );

      if (userRows.length === 0) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const ctvPhone = (userRows[0] as { phone: string }).phone;

      const [records] = await db.execute<RowDataPacket[]>(
        `SELECT w.id, w.userId, w.amount, w.status, w.createdAt, u.phone as userPhone
         FROM withdrawals w
         JOIN users u ON w.userId = u.id
         WHERE u.invitedByPhone = ?
         ORDER BY w.createdAt DESC LIMIT ? OFFSET ?`,
        [ctvPhone, limit, offset]
      );

      const [total] = await db.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as count FROM withdrawals w
         JOIN users u ON w.userId = u.id
         WHERE u.invitedByPhone = ?`,
        [ctvPhone]
      );

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: records,
        page_total: Math.ceil((total[0] as { count: number }).count / limit),
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('listWithdrawMem error:', error);
      res.status(500).json({ message: 'Failed', status: false, timeStamp: timeNow() });
    }
  },

  // List member bets
  listBet: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = PaginationSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid pagination', status: false, timeStamp: timeNow() });
        return;
      }

      const { pageno, limit } = validation.data;
      const auth = req.cookies.auth;
      const offset = pageno * limit;

      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT phone FROM users WHERE token = ? AND isVerified = TRUE AND level = 2',
        [auth]
      );

      if (userRows.length === 0) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const ctvPhone = (userRows[0] as { phone: string }).phone;

      const [records] = await db.execute<RowDataPacket[]>(
        `SELECT b.id, b.userId, b.game, b.amount, b.result, b.winAmount, b.status, b.createdAt, u.phone as userPhone
         FROM bets b
         JOIN users u ON b.userId = u.id
         WHERE u.invitedByPhone = ?
         ORDER BY b.createdAt DESC LIMIT ? OFFSET ?`,
        [ctvPhone, limit, offset]
      );

      const [total] = await db.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as count FROM bets b
         JOIN users u ON b.userId = u.id
         WHERE u.invitedByPhone = ?`,
        [ctvPhone]
      );

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: records,
        page_total: Math.ceil((total[0] as { count: number }).count / limit),
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('listBet error:', error);
      res.status(500).json({ message: 'Failed', status: false, timeStamp: timeNow() });
    }
  },

  // List member red envelopes
  listRedenvelope: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = PaginationSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid pagination', status: false, timeStamp: timeNow() });
        return;
      }

      const { pageno, limit } = validation.data;
      const auth = req.cookies.auth;
      const offset = pageno * limit;

      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE token = ? AND isVerified = TRUE AND level = 2',
        [auth]
      );

      if (userRows.length === 0) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const ctvId = (userRows[0] as { id: number }).id;

      const [records] = await db.execute<RowDataPacket[]>(
        `SELECT rec.id, rec.userId, rec.amount, rec.createdAt, u.phone as userPhone, re.code
         FROM redEnvelopeClaims rec
         JOIN users u ON rec.userId = u.id
         JOIN redEnvelopes re ON rec.envelopeId = re.id
         WHERE re.ctvId = ?
         ORDER BY rec.createdAt DESC LIMIT ? OFFSET ?`,
        [ctvId, limit, offset]
      );

      const [total] = await db.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as count FROM redEnvelopeClaims rec
         JOIN redEnvelopes re ON rec.envelopeId = re.id
         WHERE re.ctvId = ?`,
        [ctvId]
      );

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: records,
        page_total: Math.ceil((total[0] as { count: number }).count / limit),
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('listRedenvelope error:', error);
      res.status(500).json({ message: 'Failed', status: false, timeStamp: timeNow() });
    }
  },
});
