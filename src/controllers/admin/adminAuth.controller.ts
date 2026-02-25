import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { K5DEditResultSchema, K5DApiResponse } from '../../types/5d.types';
import { get5DHistory, getCurrent5DSession, update5DControlSettings } from '../../db/5d.queries';

/\*\*

- Create 5D admin controller
  \*/
  export const create5DController = (db: Pool) => ({
  /\*\*
  - List historical results (admin view)
    \*/
    listOrderOld: async (req: Request, res: Response): Promise<void> => {
    try {
    const { gameJoin, pageno, pageto } = req.body;

        const history = await get5DHistory(db, parseInt(gameJoin), pageno, pageto);
        const currentSession = await getCurrent5DSession(db, parseInt(gameJoin));

        const response: K5DApiResponse = {
          code: 0,
          msg: 'Get success',
          data: {
            gameslist: history,
          },
          period: currentSession?.period || '',
          page: pageno,
          status: true,
        };

        res.json(response);

    } catch (error) {
    console.error('Admin list error:', error);
    res.status(500).json({
    message: 'Internal server error',
    status: false,
    });
    }
    },

/\*\*

- Edit result settings (predefined results)
  \*/
  editResult: async (req: Request, res: Response): Promise<void> => {
  try {
  const validationResult = K5DEditResultSchema.safeParse(req.body);

        if (!validationResult.success) {
          res.status(400).json({
            message: 'Invalid parameters',
            status: false,
          });
          return;
        }

        const { game, list } = validationResult.data;

        // Validate list format (pipe-separated 5-digit numbers or -1)
        const parts = list.split('|');
        const isValid = parts.every(part =>
          part === '-1' || (/^\d{5}$/.test(part) && part.split('').every(d => parseInt(d) >= 0 && parseInt(d) <= 9))
        );

        if (!isValid) {
          res.status(400).json({
            message: 'Invalid result format. Use 5-digit numbers or -1 separated by |',
            status: false,
          });
          return;
        }

        await update5DControlSettings(db, game, list);

        res.json({
          message: 'Settings updated successfully',
          status: true,
        });
      } catch (error) {
        console.error('Edit result error:', error);
        res.status(500).json({
          message: 'Internal server error',
          status: false,
        });
      }

  },
  });

  import { Request, Response } from 'express';
  import { Pool } from 'mysql2/promise';
  import {
  AdminLoginSchema,
  AdminRegisterSchema,
  ChangeAdminSchema,
  SettingCskhSchema,
  BannedSchema,
  AdminApiResponse,
  AdminUser
  } from '../../types/admin.types';
  import { findUserByPhone, findUserById, updateAdminConfig, updateUserBalance } from '../../db/admin.queries';
  import { hashPassword, verifyPassword, generateReferralCode, getCurrentTimestamp, generateOrderId } from '../../utils/admin.helpers';

  /\*\*

  - Create admin authentication controller
    \*/
    export const createAdminAuthController = (db: Pool) => ({
    /\*\*
    - Admin login
      \*/
      login: async (req: Request, res: Response): Promise<void> => {
      try {
      const validation = AdminLoginSchema.safeParse(req.body);
      if (!validation.success) {
      res.status(400).json({
      message: 'Invalid input',
      status: false,
      errors: validation.error.errors,
      });
      return;
      }

          const { phone, password } = validation.data;

          const user = await findUserByPhone(db, phone);
          if (!user) {
            res.status(401).json({
              message: 'Invalid credentials',
              status: false,
            });
            return;
          }

          if (user.userLevel !== 1 && user.userLevel !== 2) {
            res.status(403).json({
              message: 'Insufficient privileges',
              status: false,
            });
            return;
          }

          const isValidPassword = await verifyPassword(password, user.passwordHash);
          if (!isValidPassword) {
            res.status(401).json({
              message: 'Invalid credentials',
              status: false,
            });
            return;
          }

          // Generate new auth token
          const authToken = generateOrderId('ADM');
          await db.execute(
            'UPDATE users SET authToken = ? WHERE id = ?',
            [authToken, user.id]
          );

          const response: AdminApiResponse = {
            message: 'Login successful',
            status: true,
            data: {
              token: authToken,
              user: {
                id: user.id,
                phone: user.phone,
                userName: user.userName,
                userLevel: user.userLevel,
              },
            },
            timeStamp: getCurrentTimestamp(),
          };

          res.json(response);

      } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({
      message: 'Internal server error',
      status: false,
      });
      }
      },

  /\*\*

  - Register new admin/CTV/user
    \*/
    register: async (req: Request, res: Response): Promise<void> => {
    try {
    const validation = AdminRegisterSchema.safeParse(req.body);
    if (!validation.success) {
    res.status(400).json({
    message: 'Invalid input',
    status: false,
    errors: validation.error.errors,
    });
    return;
    }

        const { phone, password, userName, inviteCode, userLevel } = validation.data;

        // Check if phone exists
        const existing = await findUserByPhone(db, phone);
        if (existing) {
          res.status(409).json({
            message: 'Phone number already registered',
            status: false,
          });
          return;
        }

        // Hash password with bcrypt
        const passwordHash = await hashPassword(password);
        const referralCode = generateReferralCode();
        const now = getCurrentTimestamp();

        // Find inviter if invite code provided
        let invitedBy: number | null = null;
        if (inviteCode) {
          const inviter = await db.execute(
            'SELECT id FROM users WHERE referralCode = ?',
            [inviteCode]
          );
          if ((inviter as any[]).length > 0) {
            invitedBy = (inviter as any[])[0].id;
          }
        }

        const [result] = await db.execute(
          `INSERT INTO users (phone, userName, passwordHash, authToken, balance, referralCode,
                             invitedBy, isVerified, status, userLevel, createdAt, updatedAt)
           VALUES (?, ?, ?, NULL, 0, ?, ?, false, 0, ?, ?, ?)`,
          [phone, userName, passwordHash, referralCode, invitedBy, parseInt(userLevel), now, now]
        );

        const response: AdminApiResponse = {
          message: 'Registration successful',
          status: true,
          data: {
            userId: (result as any).insertId,
            phone,
            userName,
          },
          timeStamp: getCurrentTimestamp(),
        };

        res.json(response);

    } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({
    message: 'Internal server error',
    status: false,
    });
    }
    },

  /\*\*

  - Change game control settings
    \*/
    changeAdmin: async (req: Request, res: Response): Promise<void> => {
    try {
    const validation = ChangeAdminSchema.safeParse(req.body);
    if (!validation.success) {
    res.status(400).json({
    message: 'Invalid input',
    status: false,
    });
    return;
    }

        const { game, duration, value } = validation.data;
        const configKey = `${game}${duration}_control`;

        await updateAdminConfig(db, configKey, value);

        res.json({
          message: 'Settings updated successfully',
          status: true,
          timeStamp: getCurrentTimestamp(),
        });

    } catch (error) {
    console.error('Change admin error:', error);
    res.status(500).json({
    message: 'Failed to update settings',
    status: false,
    });
    }
    },

  /\*\*

  - Update customer service settings
    \*/
    settingCskh: async (req: Request, res: Response): Promise<void> => {
    try {
    const validation = SettingCskhSchema.safeParse(req.body);
    if (!validation.success) {
    res.status(400).json({
    message: 'Invalid input',
    status: false,
    });
    return;
    }

        const { telegram, whatsapp, supportEmail } = validation.data;

        if (telegram) await updateAdminConfig(db, 'telegram', telegram);
        if (whatsapp) await updateAdminConfig(db, 'whatsapp', whatsapp);
        if (supportEmail) await updateAdminConfig(db, 'support_email', supportEmail);

        res.json({
          message: 'Customer service settings updated',
          status: true,
          timeStamp: getCurrentTimestamp(),
        });

    } catch (error) {
    console.error('Setting CSKH error:', error);
    res.status(500).json({
    message: 'Failed to update settings',
    status: false,
    });
    }
    },

  /\*\*

  - Ban/unban user
    \*/
    banned: async (req: Request, res: Response): Promise<void> => {
    try {
    const validation = BannedSchema.safeParse(req.body);
    if (!validation.success) {
    res.status(400).json({
    message: 'Invalid input',
    status: false,
    });
    return;
    }

          const { phone, status } = validation.data;

          const user = await findUserByPhone(db, phone);
          if (!user) {
            res.status(404).json({
              message: 'User not found',
              status: false,
            });
            return;
          }

          await db.execute(
            'UPDATE users SET status = ? WHERE phone = ?',
            [parseInt(status), phone]
          );

          res.json({
            message: `User ${status === '0' ? 'activated' : status === '1' ? 'suspended' : 'banned'} successfully`,
            status: true,
            timeStamp: getCurrentTimestamp(),
          });
        } catch (error) {
          console.error('Banned error:', error);
          res.status(500).json({
            message: 'Failed to update user status',
            status: false,
          });
        }

    },
    });
