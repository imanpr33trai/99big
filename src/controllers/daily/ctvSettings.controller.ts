import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { DailyApiResponse, CreateBonusInput } from '../../types/daily.types';
import { CreateBonusSchema, SettingsSchema } from '../../types/daily.types';
import { generateRedEnvelopeCode } from '../../utils/daily.helpers';
import { createRedEnvelope, getRedEnvelopesByCTV, getUserPoints } from '../../db/daily.queries';

const timeNow = () => Date.now();

export const createCTVSettingsController = (db: Pool) => ({
  // Get/set Telegram
  settings: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = SettingsSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid input', status: false, timeStamp: timeNow() });
        return;
      }

      const { type, value } = validation.data;
      const auth = req.cookies.auth;

      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT id, phone FROM users WHERE token = ? AND isVerified = TRUE AND level = 2',
        [auth]
      );

      if (userRows.length === 0) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const user = userRows[0];

      if (!type || type === 'get') {
        // Get settings
        const [pointList] = await db.execute<RowDataPacket[]>(
          'SELECT telegramId FROM userPoints WHERE userId = ?',
          [user.id]
        );
        const [adminSettings] = await db.execute<RowDataPacket[]>(
          'SELECT configValue FROM adminConfigs WHERE configKey = ?',
          ['telegram_link']
        );

        res.status(200).json({
          message: 'Get success',
          status: true,
          telegram: (adminSettings[0] as { configValue?: string })?.configValue || '',
          telegram2: (pointList[0] as { telegramId?: string })?.telegramId || '',
          timeStamp: timeNow(),
        });
      } else {
        // Update Telegram
        await db.execute(
          'UPDATE userPoints SET telegramId = ? WHERE userId = ?',
          [value || '', user.id]
        );

        res.status(200).json({
          message: 'Successfully edited',
          status: true,
          timeStamp: timeNow(),
        });
      }
    } catch (error) {
      console.error('settings error:', error);
      res.status(500).json({ message: 'Error', status: false, timeStamp: timeNow() });
    }
  },

  // Create red envelope
  createBonus: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = CreateBonusSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid input', status: false, timeStamp: timeNow() });
        return;
      }

      const { amount, count, expiryHours } = validation.data;
      const auth = req.cookies.auth;

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
      const code = generateRedEnvelopeCode();

      await createRedEnvelope(db, ctvId, code, amount, count, expiryHours);

      res.status(200).json({
        message: 'Red envelope created successfully',
        status: true,
        code,
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('createBonus error:', error);
      res.status(500).json({ message: 'Failed', status: false, timeStamp: timeNow() });
    }
  },

  // List red envelopes
  listRedenvelops: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const auth = req.cookies.auth;

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
      const envelopes = await getRedEnvelopesByCTV(db, ctvId);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: envelopes,
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('listRedenvelops error:', error);
      res.status(500).json({ message: 'Failed', status: false, timeStamp: timeNow() });
    }
  },
});
