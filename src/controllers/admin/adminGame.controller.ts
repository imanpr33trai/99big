import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import {
TotalJoinSchema,
EditResultSchema,
AdminApiResponse,
} from '../../types/admin.types';
import { getTotalJoin, updateAdminConfig, findUserByPhone } from '../../db/admin.queries';
import { getCurrentTimestamp, getTodayString } from '../../utils/admin.helpers';

/\*\*

- Create admin game controller
  \*/
  export const createAdminGameController = (db: Pool) => ({
  /\*\*
  - Get total join statistics by game type
    \*/
    totalJoin: async (req: Request, res: Response): Promise<void> => {
    try {
    const validation = TotalJoinSchema.safeParse(req.body);
    if (!validation.success) {
    res.status(400).json({ message: 'Invalid input', status: false });
    return;
    }

        const { gameJoin } = validation.data;
        const gameTypeMap: Record<string, number> = {
          '1': 1, // wingo 1min
          '3': 2, // wingo 3min
          '5': 3, // wingo 5min
          '10': 4, // wingo 10min
        };

        const gameTypeId = gameTypeMap[gameJoin];
        const stats = await getTotalJoin(db, gameTypeId);

        res.json({
          message: 'Success',
          status: true,
          data: stats,
          timeStamp: getCurrentTimestamp(),
        });

    } catch (error) {
    console.error('Total join error:', error);
    res.status(500).json({ message: 'Internal server error', status: false });
    }
    },

/\*\*

- Get historical game results (5D)
  _/
  listOrderOld: async (req: Request, res: Response): Promise<void> => {
  try {
  const { gameJoin, pageno, pageto } = req.body;
  const offset = pageno _ pageto;

      const [rows] = await db.execute(
        `SELECT gs.*, gt.name as gameName
         FROM gameSessions gs
         JOIN gameTypes gt ON gs.gameTypeId = gt.id
         WHERE gt.name LIKE '%5D%' AND gt.duration = ?
         ORDER BY gs.id DESC LIMIT ? OFFSET ?`,
        [parseInt(gameJoin), pageto, offset]
      );

      const [current] = await db.execute(
        `SELECT period FROM gameSessions
         WHERE gameTypeId = (SELECT id FROM gameTypes WHERE name = '5D' AND duration = ? LIMIT 1)
         ORDER BY id DESC LIMIT 1`,
        [parseInt(gameJoin)]
      );

      res.json({
        code: 0,
        msg: 'Get success',
        data: {
          gameslist: rows,
        },
        period: (current as any[])[0]?.period || '',
        page: pageno,
        status: true,
      });

  } catch (error) {
  console.error('List order old error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get K3 historical results
  _/
  listOrderOldK3: async (req: Request, res: Response): Promise<void> => {
  try {
  const { gameJoin, pageno, pageto } = req.body;
  const offset = pageno _ pageto;

      const [rows] = await db.execute(
        `SELECT gs.*, gt.name as gameName
         FROM gameSessions gs
         JOIN gameTypes gt ON gs.gameTypeId = gt.id
         WHERE gt.name LIKE '%K3%' AND gt.duration = ?
         ORDER BY gs.id DESC LIMIT ? OFFSET ?`,
        [parseInt(gameJoin), pageto, offset]
      );

      const [current] = await db.execute(
        `SELECT period FROM gameSessions
         WHERE gameTypeId = (SELECT id FROM gameTypes WHERE name = 'K3' AND duration = ? LIMIT 1)
         ORDER BY id DESC LIMIT 1`,
        [parseInt(gameJoin)]
      );

      res.json({
        code: 0,
        msg: 'Get success',
        data: {
          gameslist: rows,
        },
        period: (current as any[])[0]?.period || '',
        page: pageno,
        status: true,
      });

  } catch (error) {
  console.error('List order old K3 error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Edit 5D result settings
  \*/
  editResult: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = EditResultSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { game, list } = validation.data;
      const configKey = `5d${game}_control`;

      await updateAdminConfig(db, configKey, list);

      res.json({
        message: '5D result settings updated',
        status: true,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Edit result error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Edit K3 result settings
  \*/
  editResult2: async (req: Request, res: Response): Promise<void> => {
  try {
  const validation = EditResultSchema.safeParse(req.body);
  if (!validation.success) {
  res.status(400).json({ message: 'Invalid input', status: false });
  return;
  }

      const { game, list } = validation.data;
      const configKey = `k3${game}_control`;

      await updateAdminConfig(db, configKey, list);

      res.json({
        message: 'K3 result settings updated',
        status: true,
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Edit result2 error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get phone by invite code
  \*/
  getPhoneByInvite: async (req: Request, res: Response): Promise<void> => {
  try {
  const { invite } = req.params;

      const [rows] = await db.execute(
        'SELECT phone FROM users WHERE referralCode = ?',
        [invite]
      );

      if ((rows as any[]).length === 0) {
        res.status(404).json({ message: 'Invite code not found', status: false });
        return;
      }

      res.json({
        message: 'Success',
        status: true,
        data: { phone: (rows as any[])[0].phone },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Get phone by invite error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get user count by invite code
  \*/
  getUserByCode: async (req: Request, res: Response): Promise<void> => {
  try {
  const { code } = req.params;

      const [rows] = await db.execute(
        `SELECT COUNT(*) as count FROM users
         WHERE invitedBy = (SELECT id FROM users WHERE referralCode = ?)`,
        [code]
      );

      res.json({
        message: 'Success',
        status: true,
        data: { count: (rows as any[])[0].count },
        timeStamp: getCurrentTimestamp(),
      });

  } catch (error) {
  console.error('Get user by code error:', error);
  res.status(500).json({ message: 'Internal server error', status: false });
  }
  },

/\*\*

- Get all referred users by code
  \*/
  getReferredUsers: async (req: Request, res: Response): Promise<void> => {
  try {
  const { code } = req.params;

        const [rows] = await db.execute(
          `SELECT u.id, u.phone, u.userName, u.createdAt, u.balance
           FROM users u
           JOIN users inviter ON u.invitedBy = inviter.id
           WHERE inviter.referralCode = ?
           ORDER BY u.createdAt DESC`,
          [code]
        );

        res.json({
          message: 'Success',
          status: true,
          data: rows,
          timeStamp: getCurrentTimestamp(),
        });
      } catch (error) {
        console.error('Get referred users error:', error);
        res.status(500).json({ message: 'Internal server error', status: false });
      }

  },
  });
