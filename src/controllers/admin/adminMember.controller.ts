// controllers/admin/adminMember.controller.ts
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import {
  ApiResponse,
  UserFinancialData,
  StatisticalData,
  CTVInfoData,
  PaginationInput,
  UserInfoInput,
  ListCTVInput,
} from '../../types/admin.types';
import {
  listMembers,
  listCTV,
  findUserByPhone,
  getDirectSubordinates,
  getSubordinatesByLevel,
  getDepositsByUser,
  countDepositsByUser,
  getWithdrawalsByUser,
  countWithdrawalsByUser,
  getBetsByUser,
  countBetsByUser,
  getUserBankAccounts,
  getDefaultBankAccount,
  getActiveUsersCount,
  getInactiveUsersCount,
  getTotalDeposits,
  getTotalWithdrawals,
  getTodayDeposits,
  getTodayWithdrawals,
  getTotalBetAmount,
  getPendingDeposits,
  getProcessedDeposits,
  getPendingWithdrawals,
  getProcessedWithdrawals,
  getCommissionLevels,
  updateCommissionLevel,
  getSalaryRecords,
  insertSalaryRecord,
  updateUserMoney,
  setFirstDepositBonus,
  updateFreeBonus,
  getDepositById,
  updateDepositStatus,
  getWithdrawalById,
  updateWithdrawalStatus,
} from '../../db/admin.queries';
import {
  formatTime,
  getTodayString,
  safeParseFloat,
  calculatePagination,
  formatTimeIST,
} from '../../utils/admin.helpers';
import { AuthenticatedRequest } from '../../middleware/adminAuth.middleware';

const timeNow = Date.now();

export const createAdminMemberController = (db: Pool) => ({
  listMember: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { pageno, limit } = req.body as PaginationInput;

      if (pageno === undefined || limit === undefined || pageno < 0 || limit < 0) {
        res.status(400).json({
          code: 0,
          msg: 'No more data',
          data: { gameslist: [] },
          status: false,
        });
        return;
      }

      const { users, total } = await listMembers(db, pageno, limit);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: users,
        page_total: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('List member error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  listCTV: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { pageno, pageto } = req.body as ListCTVInput;

      if (pageno === undefined || pageto === undefined || pageno < 0 || pageto < 0) {
        res.status(400).json({
          code: 0,
          msg: 'No more data',
          data: { gameslist: [] },
          status: false,
        });
        return;
      }

      const users = await listCTV(db, pageno, pageto);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: users,
      });
    } catch (error) {
      console.error('List CTV error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  userInfo: async (req: Request, res: Response<ApiResponse<UserFinancialData>>): Promise<void> => {
    try {
      const { phone } = req.body as UserInfoInput;

      if (!phone) {
        res.status(400).json({
          message: 'Phone is required',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({
          message: 'User not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      // Get direct subordinates (F1)
      const f1s = await getDirectSubordinates(db, user.id);

      // Calculate F1 today
      let f1Today = 0;
      for (const f1 of f1s) {
        if (formatTime(f1.createdAt) === getTodayString()) {
          f1Today++;
        }
      }

      // Calculate all levels
      let f2 = 0;
      let f3 = 0;
      let f4 = 0;
      let fAllToday = 0;

      // Get F2
      const f1Ids = f1s.map(f => f.id).filter((id): id is number => id !== undefined);
      const f2s = await getSubordinatesByLevel(db, f1Ids);
      f2 = f2s.length;

      // Get F3
      const f2Ids = f2s.map(f => f.id).filter((id): id is number => id !== undefined);
      const f3s = await getSubordinatesByLevel(db, f2Ids);
      f3 = f3s.length;

      // Get F4
      const f3Ids = f3s.map(f => f.id).filter((id): id is number => id !== undefined);
      const f4s = await getSubordinatesByLevel(db, f3Ids);
      f4 = f4s.length;

      // Calculate today's registrations for all levels
      for (const f of [...f1s, ...f2s, ...f3s, ...f4s]) {
        if (formatTime(f.createdAt) === getTodayString()) {
          fAllToday++;
        }
      }

      // Get financial data
      const [deposits] = await db.execute<[{ total: string }]>(
        'SELECT COALESCE(SUM(amount), 0) as total FROM deposits WHERE userId = ? AND status = 2',
        [user.id]
      );

      const [withdrawals] = await db.execute<[{ total: string }]>(
        'SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE userId = ? AND status = 2',
        [user.id]
      );

      const bankAccounts = await getUserBankAccounts(db, user.id);
      const defaultBank = bankAccounts.find(b => b.isDefault) || bankAccounts[0] || null;

      // Get inviter phone
      let inviterPhone = null;
      if (user.invitedBy) {
        const [inviter] = await db.execute<[{ phone: string }]>(
          'SELECT phone FROM users WHERE id = ?',
          [user.invitedBy]
        );
        inviterPhone = inviter[0]?.phone || null;
      }

      // Get CTV telegram
      let ctvTelegram = null;
      if (user.invitedBy) {
        const [ctv] = await db.execute<[{ telegramId: string }]>(
          'SELECT telegramId FROM userPoints WHERE userId = ?',
          [user.invitedBy]
        );
        ctvTelegram = ctv[0]?.telegramId || null;
      }

      const { passwordHash, authToken, plainPassword, ...userInfo } = user;

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: {
          user: userInfo as Omit<typeof user, 'passwordHash' | 'authToken' | 'plainPassword'>,
          totalRecharge: safeParseFloat(deposits[0]?.total),
          totalWithdraw: safeParseFloat(withdrawals[0]?.total),
          f1: f1s.length,
          f2,
          f3,
          f4,
          bankUser: defaultBank,
          telegram: ctvTelegram,
          ngMoi: inviterPhone,
          daily: user.invitedBy ? String(user.invitedBy) : null,
        },
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error('User info error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  statistical2: async (req: Request, res: Response<ApiResponse<StatisticalData>>): Promise<void> => {
    try {
      const [winData] = await db.execute<[{ total: string }]>(
        'SELECT COALESCE(SUM(actualWin), 0) as total FROM bets WHERE status = 1'
      );

      const [lossData] = await db.execute<[{ total: string }]>(
        'SELECT COALESCE(SUM(betAmount), 0) as total FROM bets WHERE status = 2'
      );

      const usersOnline = await getActiveUsersCount(db);
      const usersOffline = await getInactiveUsersCount(db);
      const recharges = await getTotalDeposits(db);
      const withdraws = await getTotalWithdrawals(db);
      const rechargeToday = await getTodayDeposits(db);
      const withdrawToday = await getTodayWithdrawals(db);

      res.status(200).json({
        message: 'Success',
        status: true,
        win: safeParseFloat(winData[0]?.total),
        loss: safeParseFloat(lossData[0]?.total),
        usersOnline,
        usersOffline,
        recharges,
        withdraws,
        rechargeToday,
        withdrawToday,
      });
    } catch (error) {
      console.error('Statistical error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  recharge: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const pendingDeposits = await getPendingDeposits(db);
      const processedDeposits = await getProcessedDeposits(db);
      const pendingWithdrawals = await getPendingWithdrawals(db);
      const processedWithdrawals = await getProcessedWithdrawals(db);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: pendingDeposits,
        datas2: processedDeposits,
        datas3: pendingWithdrawals,
        datas4: processedWithdrawals,
      });
    } catch (error) {
      console.error('Recharge error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  rechargeDuyet: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { id, type } = req.body;

      if (!id || !type) {
        res.status(400).json({
          message: 'Missing required fields',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const deposit = await getDepositById(db, id);

      if (!deposit) {
        res.status(404).json({
          message: 'Deposit not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (type === 'confirm') {
        await updateDepositStatus(db, id, 2); // completed

        const user = await findUserByPhone(db, deposit.userPhone || '');
        if (!user) {
          res.status(404).json({
            message: 'User not found',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        let money = safeParseFloat(deposit.amount);
        const isFirstDeposit = !user.firstDepositBonus;

        // Calculate bonus based on amount
        let salary = 0;
        if (money >= 100 && money <= 299) salary = 20;
        else if (money >= 300 && money <= 999) salary = 60;
        else if (money >= 1000) salary = 150;

        // Get inviter
        let inviterId: number | null = null;
        if (user.invitedBy) {
          inviterId = user.invitedBy;
        }

        const incrementPercentage = isFirstDeposit ? 0.15 : 0.05;
        await setFirstDepositBonus(db, user.phone);

        const tenPercent = 0.1 * money;
        money += money * incrementPercentage;

        // Apply free bonus
        const freeBonus = user.freeBonus || 0;
        if (freeBonus >= tenPercent) {
          money += tenPercent;
          await updateFreeBonus(db, user.phone, tenPercent);
        } else {
          money += freeBonus;
          await updateFreeBonus(db, user.phone, freeBonus);
        }

        // Update user balance
        await updateUserMoney(db, user.phone, money);

        // Add salary to inviter if exists
        if (inviterId && salary > 0) {
          const formattedTime = formatTimeIST();
          await insertSalaryRecord(db, inviterId, salary, 'Referral Bonus', formattedTime);

          const [inviter] = await db.execute<[{ phone: string }]>(
            'SELECT phone FROM users WHERE id = ?',
            [inviterId]
          );
          if (inviter[0]) {
            await updateUserMoney(db, inviter[0].phone, salary);
          }
        }

        res.status(200).json({
          message: 'Successful application confirmation',
          status: true,
        });
        return;
      }

      if (type === 'delete') {
        await updateDepositStatus(db, id, 3); // failed
        res.status(200).json({
          message: 'Cancellation successful',
          status: true,
        });
        return;
      }

      res.status(400).json({
        message: 'Invalid type',
        status: false,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error('Recharge duyet error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  handlWithdraw: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { id, type, remark } = req.body;

      if (!id || !type) {
        res.status(400).json({
          message: 'Missing required fields',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const withdrawal = await getWithdrawalById(db, id);

      if (!withdrawal) {
        res.status(404).json({
          message: 'Withdrawal not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (type === 'confirm') {
        await updateWithdrawalStatus(db, id, 2); // completed
        res.status(200).json({
          message: 'Successful application confirmation',
          status: true,
        });
        return;
      }

      if (type === 'delete') {
        await updateWithdrawalStatus(db, id, 3, remark); // rejected
        // Refund money
        await updateUserMoney(db, withdrawal.userPhone || '', safeParseFloat(withdrawal.amount));
        res.status(200).json({
          message: 'Cancel successfully',
          status: true,
        });
        return;
      }

      res.status(400).json({
        message: 'Invalid type',
        status: false,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error('Handle withdraw error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  profileUser: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { phone } = req.body;

      if (!phone) {
        res.status(400).json({
          message: 'Phone is required',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({
          message: 'User not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const deposits = await getDepositsByUser(db, user.id, 0, 10);
      const withdrawals = await getWithdrawalsByUser(db, user.id, 0, 10);

      res.status(200).json({
        message: 'Get success',
        status: true,
        recharge: deposits,
        withdraw: withdrawals,
      });
    } catch (error) {
      console.error('Profile user error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  listRechargeMem: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { phone } = req.params;
      const { pageno, limit } = req.body as PaginationInput;

      if (!phone || pageno === undefined || limit === undefined) {
        res.status(400).json({
          message: 'Missing required fields',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const user = await findUserByPhone(db, phone);
      if (!user) {
        res.status(404).json({
          message: 'User not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const deposits = await getDepositsByUser(db, user.id, pageno, limit);
      const total = await countDepositsByUser(db, user.id);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: deposits,
        page_total: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('List recharge mem error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  listWithdrawMem: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { phone } = req.params;
      const { pageno, limit } = req.body as PaginationInput;

      if (!phone || pageno === undefined || limit === undefined) {
        res.status(400).json({
          message: 'Missing required fields',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const user = await findUserByPhone(db, phone);
      if (!user) {
        res.status(404).json({
          message: 'User not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const withdrawals = await getWithdrawalsByUser(db, user.id, pageno, limit);
      const total = await countWithdrawalsByUser(db, user.id);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: withdrawals,
        page_total: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('List withdraw mem error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  listBet: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { phone } = req.params;
      const { pageno, limit } = req.body as PaginationInput;

      if (!phone || pageno === undefined || limit === undefined) {
        res.status(400).json({
          message: 'Missing required fields',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const user = await findUserByPhone(db, phone);
      if (!user) {
        res.status(404).({
          message: 'User not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const bets = await getBetsByUser(db, user.id, pageno, limit);
      const total = await countBetsByUser(db, user.id);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: bets,
        page_total: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('List bet error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  infoCtv: async (req: Request, res: Response<ApiResponse<CTVInfoData>>): Promise<void> => {
    try {
      const { phone } = req.body;

      if (!phone) {
        res.status(400).json({
          message: 'Phone is required',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({
          message: 'User not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      // Get all subordinates logic similar to userInfo but with CTV-specific data
      const f1s = await getDirectSubordinates(db, user.id);

      let f2 = 0, f3 = 0, f4 = 0;
      const f1Ids = f1s.map(f => f.id).filter((id): id is number => id !== undefined);
      const f2s = await getSubordinatesByLevel(db, f1Ids);
      f2 = f2s.length;

      const f2Ids = f2s.map(f => f.id).filter((id): id is number => id !== undefined);
      const f3s = await getSubordinatesByLevel(db, f2Ids);
      f3 = f3s.length;

      const f3Ids = f3s.map(f => f.id).filter((id): id is number => id !== undefined);
      const f4s = await getSubordinatesByLevel(db, f3Ids);
      f4 = f4s.length;

      // Get CTV members
      const [members] = await db.execute<UserRow[]>(
        'SELECT * FROM users WHERE invitedBy = ? AND status = 0 AND isVerified = TRUE',
        [user.id]
      );

      const [bannedMembers] = await db.execute<UserRow[]>(
        'SELECT * FROM users WHERE invitedBy = ? AND status = 2 AND isVerified = TRUE',
        [user.id]
      );

      // Calculate totals
      let totalRecharge = 0;
      let totalWithdraw = 0;
      let totalRechargeToday = 0;
      let totalWithdrawToday = 0;
      let win = 0;
      let loss = 0;

      const today = getTodayString();

      for (const member of members) {
        // Recharges
        const [recharges] = await db.execute<[{ total: string }]>(
          'SELECT COALESCE(SUM(amount), 0) as total FROM deposits WHERE userId = ? AND status = 2',
          [member.id]
        );
        const rechargeAmount = safeParseFloat(recharges[0]?.total);
        totalRecharge += rechargeAmount;

        // Withdrawals
        const [withdrawals] = await db.execute<[{ total: string }]>(
          'SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE userId = ? AND status = 2',
          [member.id]
        );
        const withdrawAmount = safeParseFloat(withdrawals[0]?.total);
        totalWithdraw += withdrawAmount;

        // Today's transactions
        const [todayRecharges] = await db.execute<[{ amount: string; createdAt: number }]>(
          'SELECT amount, createdAt FROM deposits WHERE userId = ? AND status = 2',
          [member.id]
        );

        for (const r of todayRecharges as [{ amount: string; createdAt: number }]) {
          if (formatTime(r.createdAt) === today) {
            totalRechargeToday += safeParseFloat(r.amount);
          }
        }

        const [todayWithdrawals] = await db.execute<[{ amount: string; requestedAt: number }]>(
          'SELECT amount, requestedAt FROM withdrawals WHERE userId = ? AND status = 2',
          [member.id]
        );

        for (const w of todayWithdrawals as [{ amount: string; requestedAt: number }]) {
          if (formatTime(w.requestedAt) === today) {
            totalWithdrawToday += safeParseFloat(w.amount);
          }
        }

        // Win/Loss
        const [wins] = await db.execute<[{ money: string; createdAt: number }]>(
          'SELECT actualWin as money, createdAt FROM bets WHERE userId = ? AND status = 1',
          [member.id]
        );

        for (const w of wins as [{ money: string; createdAt: number }]) {
          if (formatTime(w.createdAt) === today) {
            win += safeParseFloat(w.money);
          }
        }

        const [losses] = await db.execute<[{ money: string; createdAt: number }]>(
          'SELECT betAmount as money, createdAt FROM bets WHERE userId = ? AND status = 2',
          [member.id]
        );

        for (const l of losses as [{ money: string; createdAt: number }]) {
          if (formatTime(l.createdAt) === today) {
            loss += safeParseFloat(l.money);
          }
        }
      }

      // Get money from point_list equivalent
      const [userPoints] = await db.execute<[{ points: string }]>(
        'SELECT points FROM userPoints WHERE userId = ?',
        [user.id]
      );

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,
        f1: f1s.length,
        f2,
        f3,
        f4,
        list_mems: members.filter(m => formatTime(m.createdAt) === today),
        total_recharge: totalRecharge,
        total_withdraw: totalWithdraw,
        total_recharge_today: totalRechargeToday,
        total_withdraw_today: totalWithdrawToday,
        list_mem_baned: bannedMembers.length,
        win,
        loss,
        list_recharge_news: [],
        list_withdraw_news: [],
        moneyCTV: safeParseFloat(userPoints[0]?.points),
        redenvelopes_used: [],
        financial_details_today: [],
      });
    } catch (error) {
      console.error('Info CTV error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  getLevelInfo: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const levels = await getCommissionLevels(db);

      res.status(200).json({
        message: 'Success',
        status: true,
        rows: levels,
      });
    } catch (error) {
      console.error('Get level info error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  updateLevel: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { id, f1, f2, f3, f4 } = req.body;

      if (!id || f1 === undefined || f2 === undefined || f3 === undefined || f4 === undefined) {
        res.status(400).json({
          message: 'Missing required fields',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      await updateCommissionLevel(db, id, f1, f2, f3, f4);

      res.status(200).json({
        message: 'Update successful',
        status: true,
      });
    } catch (error) {
      console.error('Update level error:', error);
      res.status(500).json({
        message: 'Update failed',
        status: false,
        error: (error as Error).message,
        timeStamp: timeNow,
      });
    }
  },

  CreatedSalary: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { phone, amount, type } = req.body;

      // Validate phone format
      if (!/^\d{10}$/.test(phone)) {
        res.status(400).json({
          message: 'Invalid phone number. Please provide a 10-digit phone number.',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({
          message: 'User with the provided phone number does not exist.',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const formattedTime = formatTimeIST();

      // Update user balance
      await updateUserMoney(db, phone, amount);

      // Insert salary record
      await insertSalaryRecord(db, user.id, amount, type, formattedTime);

      res.status(200).json({
        message: 'Salary record created successfully',
        status: true,
      });
    } catch (error) {
      console.error('Create salary error:', error);
      res.status(500).json({
        message: 'Internal server error',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  getSalary: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const salaries = await getSalaryRecords(db);

      res.status(200).json({
        message: 'Success',
        status: true,
        rows: salaries,
      });
    } catch (error) {
      console.error('Get salary error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  settingBuff: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { id_user, buff_acc, money_value } = req.body;

      if (!id_user || !buff_acc || !money_value) {
        res.status(400).json({
          message: 'Missing required fields',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const [users] = await db.execute<UserRow[]>(
        'SELECT * FROM users WHERE id = ?',
        [id_user]
      );

      if (users.length === 0) {
        res.status(404).json({
          message: 'User not found',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const amount = buff_acc === '1' ? money_value : -money_value;
      await updateUserMoney(db, users[0].phone, amount);

      res.status(200).json({
        message: 'Successful change',
        status: true,
      });
    } catch (error) {
      console.error('Setting buff error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  createBonus: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { money, type, select, phone } = req.body;

      if (!money) {
        res.status(400).json({
          message: 'Money is required',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (type === 'all') {
        if (select === '1') {
          await db.execute('UPDATE userPoints SET points = points + ? WHERE currentLevel = 2', [money]);
        } else {
          await db.execute('UPDATE userPoints SET points = points - ? WHERE currentLevel = 2', [money]);
        }
        res.status(200).json({
          message: 'Successful change',
          status: true,
        });
        return;
      }

      if (type === 'two') {
        if (select === '1') {
          await db.execute('UPDATE userPoints SET pointsUs = pointsUs + ? WHERE currentLevel = 2', [money]);
        } else {
          await db.execute('UPDATE userPoints SET pointsUs = pointsUs - ? WHERE currentLevel = 2', [money]);
        }
        res.status(200).json({
          message: 'Successful change',
          status: true,
        });
        return;
      }

      if (type === 'one' || type === 'three') {
        if (!phone) {
          res.status(400).json({
            message: 'Phone is required',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        const [userPoints] = await db.execute(
          'SELECT * FROM userPoints up JOIN users u ON up.userId = u.id WHERE u.phone = ?',
          [phone]
        );

        if ((userPoints as []).length === 0) {
          res.status(404).json({
            message: 'Account does not exist',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        const field = type === 'one' ? 'points' : 'pointsUs';
        const operation = select === '1' ? '+' : '-';

        await db.execute(
          `UPDATE userPoints up
           JOIN users u ON up.userId = u.id
           SET up.${field} = up.${field} ${operation} ?
           WHERE u.phone = ? AND up.currentLevel = 2`,
          [money, phone]
        );

        res.status(200).json({
          message: 'Successful change',
          status: true,
        });
        return;
      }

      // Default: create red envelope
      const idRedenvelope = generateRandomString(16) + Date.now();
      await db.execute(
        'INSERT INTO redEnvelopes (envelopeId, creatorId, totalAmount, totalCount, claimedCount, claimedAmount, status, expiredAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [idRedenvelope, req.user?.id || 0, money, 1, 0, 0, 0, getCurrentTimestamp() + 86400000, getCurrentTimestamp()]
      );

      res.status(200).json({
        message: 'Successful change',
        status: true,
        id: idRedenvelope,
      });
    } catch (error) {
      console.error('Create bonus error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  listRedenvelops: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const [redenvelopes] = await db.execute(
        'SELECT * FROM redEnvelopes WHERE status = 0'
      );

      res.status(200).json({
        message: 'Successful change',
        status: true,
        redenvelopes,
      });
    } catch (error) {
      console.error('List redenvelops error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  settingGet: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const [settings] = await db.execute('SELECT * FROM adminConfigs');
      const [paymentMethods] = await db.execute('SELECT * FROM paymentMethods');
      const [momoMethod] = await db.execute<PaymentMethodRow[]>(
        "SELECT * FROM paymentMethods WHERE type = 'momo' LIMIT 1"
      );

      const momoData = momoMethod[0];

      res.status(200).json({
        message: 'Success',
        status: true,
        settings,
        datas: paymentMethods,
        momo: {
          bank_name: momoData?.bankName || '',
          username: momoData?.accountName || '',
          upi_id: momoData?.upiId || '',
          usdt_wallet_address: momoData?.cryptoAddress || '',
        },
      });
    } catch (error) {
      console.error('Setting get error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  settingBank: async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const { typer, name_bank, name, info, qr, bank_name, username, upi_id, usdt_wallet_address } = req.body;

      if (!typer) {
        res.status(400).json({
          message: 'Type is required',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      if (typer === 'bank') {
        await db.execute(
          "UPDATE paymentMethods SET bankName = ?, accountName = ?, accountNumber = ? WHERE type = 'bank'",
          [name_bank, name, info]
        );
        res.status(200).json({
          message: 'Successful change',
          status: true,
        });
        return;
      }

      if (typer === 'momo') {
        // Delete existing momo records
        await db.execute("DELETE FROM paymentMethods WHERE type = 'momo'");

        // Insert new momo record
        await db.execute(
          "INSERT INTO paymentMethods (type, bankName, accountName, upiId, cryptoAddress, isActive, createdAt) VALUES ('momo', ?, ?, ?, ?, true, ?)",
          [bank_name, username, upi_id, usdt_wallet_address, getCurrentTimestamp()]
        );

        res.status(200).json({
          message: 'Successfully changed',
          status: true,
        });
        return;
      }

      res.status(400).json({
        message: 'Invalid type',
        status: false,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error('Setting bank error:', error);
      res.status(500).json({
        message: 'Something went wrong!',
        status: false,
        timeStamp: timeNow,
      });
    }
  },
});
