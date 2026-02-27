import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import {
  createRedEnvelope,
  createSalaryRecord,
  findUserByPhone,
  getAdminConfigs,
  getCommissionLevels,
  getDepositById,
  getDirectSubordinates,
  getPaymentMethods,
  getPendingDeposits,
  getProcessedDeposits,
  getRedEnvelopes,
  getSalaryRecords,
  getSubordinatesByLevel,
  getTodayDeposits,
  getTodayWithdrawals,
  getWithdrawalById,
  listCTV,
  listMembers,
  updateCommissionLevel,
  updateDepositStatus,
  updatePaymentMethod,
  updateUserBalance,
  updateWithdrawalStatus,
} from "../../db/";
import { getGameStatistics } from "../../db/admin.queries";
import {
  CreateBonusSchema,
  CreateSalarySchema,
  CTVInfoData,
  ListCTVSchema,
  PaginationSchema,
  RechargeActionSchema,
  SettingBankSchema,
  SettingBuffSchema,
  UpdateLevelSchema,
  UserInfoSchema,
  WithdrawActionSchema,
} from "../../types/";
import {
  calculatePagination,
  generateOrderId,
  getCurrentTimestamp,
  getTodayStartTimestamp,
} from "../../utils/";

/**
 * Create admin member management controller
 * @param db
 * @returns
 */
export const createAdminMemberController = (db: Pool) => ({
  /**
   * List all members
   * @param req
   * @param res
   * @returns
   */
  listMember: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = PaginationSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid pagination", status: false });
        return;
      }

      const { page, limit } = validation.data;
      const { users, total } = await listMembers(db, page, limit);

      const pagination = calculatePagination(page, limit, total);

      res.json({
        message: "Success",
        status: true,
        data: users,
        pagination,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("List member error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * List all CTVs
   * @param req
   * @param res
   * @returns
   */
  listCTV: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = ListCTVSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid pagination", status: false });
        return;
      }

      const { page, limit } = validation.data;
      const { users, total } = await listCTV(db, page, limit);

      const pagination = calculatePagination(page, limit, total);

      res.json({
        message: "Success",
        status: true,
        data: users,
        pagination,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("List CTV error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get user info with referral hierarchy
   * @param req
   * @param res
   * @returns
   */
  userInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = UserInfoSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid input", status: false });
        return;
      }

      const { phone } = validation.data;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: "User not found", status: false });
        return;
      }

      // Get F1 (direct)
      const f1 = await getDirectSubordinates(db, user.referralCode);
      const f1Ids = f1.map((u) => u.id);

      // Get F2
      const f2 = f1Ids.length > 0 ? await getSubordinatesByLevel(db, f1Ids) : [];
      const f2Ids = f2.map((u) => u.id);

      // Get F3
      const f3 = f2Ids.length > 0 ? await getSubordinatesByLevel(db, f2Ids) : [];
      const f3Ids = f3.map((u) => u.id);

      // Get F4
      const f4 = f3Ids.length > 0 ? await getSubordinatesByLevel(db, f3Ids) : [];

      const todayStart = getTodayStartTimestamp();

      res.json({
        message: "Success",
        status: true,
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            userName: user.userName,
            balance: user.balance,
            referralCode: user.referralCode,
            userLevel: user.userLevel,
            status: user.status,
            createdAt: user.createdAt,
          },
          referralHierarchy: {
            f1: f1.map((u) => ({
              id: u.id,
              phone: u.phone,
              userName: u.userName,
              createdAt: u.createdAt,
            })),
            f2: f2.map((u) => ({
              id: u.id,
              phone: u.phone,
              userName: u.userName,
              createdAt: u.createdAt,
            })),
            f3: f3.map((u) => ({
              id: u.id,
              phone: u.phone,
              userName: u.userName,
              createdAt: u.createdAt,
            })),
            f4: f4.map((u) => ({
              id: u.id,
              phone: u.phone,
              userName: u.userName,
              createdAt: u.createdAt,
            })),
          },
          stats: {
            f1Count: f1.length,
            f2Count: f2.length,
            f3Count: f3.length,
            f4Count: f4.length,
            todayF1: f1.filter((u) => u.createdAt >= todayStart).length,
            todayF2: f2.filter((u) => u.createdAt >= todayStart).length,
            todayF3: f3.filter((u) => u.createdAt >= todayStart).length,
            todayF4: f4.filter((u) => u.createdAt >= todayStart).length,
          },
        },
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("User info error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get platform statistics
   * @param req
   * @param res
   */
  statistical2: async (req: Request, res: Response): Promise<void> => {
    try {
      // Get user stats
      const [userStats] = await db.execute(
        `SELECT
  COUNT(_) as totalUsers,
  SUM(CASE WHEN createdAt >= ? THEN 1 ELSE 0 END) as todayUsers
  FROM users`,
        [getTodayStartTimestamp()],
      );

      // Get deposit stats
      const todayDeposits = await getTodayDeposits(db);

      // Get withdrawal stats
      const todayWithdrawals = await getTodayWithdrawals(db);

      // Get game stats
      const gameStats = await getGameStatistics(db);

      res.json({
        message: "Success",
        status: true,
        data: {
          users: (userStats as any[])[0],
          deposits: todayDeposits,
          withdrawals: todayWithdrawals,
          games: gameStats,
        },
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Statistical error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },
  /**
   * Get all deposits (pending + processed)
   * @param req
   * @param res
   */
  recharge: async (req: Request, res: Response): Promise<void> => {
    try {
      const pending = await getPendingDeposits(db);
      const processed = await getProcessedDeposits(db);

      res.json({
        message: "Success",
        status: true,
        data: {
          pending,
          processed,
        },
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Recharge list error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Approve or reject deposit
   * @param req
   * @param res
   * @returns
   */
  rechargeDuyet: async (req: Request, res: Response): Promise<void> => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const validation = RechargeActionSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid input", status: false });
        return;
      }

      const { id, type, utrNumber } = validation.data;
      const deposit = await getDepositById(db, id);

      if (!deposit) {
        res.status(404).json({ message: "Deposit not found", status: false });
        return;
      }

      if (deposit.status !== 0) {
        res.status(400).json({ message: "Deposit already processed", status: false });
        return;
      }

      if (type === "confirm") {
        // Update deposit status
        await updateDepositStatus(db, id, 2, utrNumber);

        // Calculate bonus (15% first deposit, 5% subsequent)
        const [firstDeposit] = await connection.execute(
          "SELECT COUNT(*) as count FROM deposits WHERE userId = ? AND status = 2 AND id != ?",
          [deposit.userId, id],
        );

        const isFirstDeposit = (firstDeposit as any[])[0].count === 0;
        const bonusRate = isFirstDeposit ? 0.15 : 0.05;
        const bonusAmount = deposit.amount * bonusRate;

        // Add deposit amount + bonus to user balance
        const totalCredit = deposit.amount + bonusAmount;
        await updateUserBalance(db, deposit.userId, totalCredit);

        // Calculate and distribute commission if applicable
        if (deposit.amount >= 10000) {
          await distributeDepositCommission(connection, deposit.userId, deposit.amount, id);
        }

        await connection.commit();

        res.json({
          message: "Deposit approved successfully",
          status: true,
          data: { bonusAmount, isFirstDeposit },
          timeStamp: getCurrentTimestamp(),
        });
      } else {
        // Cancel deposit
        await updateDepositStatus(db, id, 3);
        await connection.commit();

        res.json({
          message: "Deposit rejected",
          status: true,
          timeStamp: getCurrentTimestamp(),
        });
      }
    } catch (error) {
      await connection.rollback();
      console.error("Recharge duyet error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    } finally {
      connection.release();
    }
  },

  /**
   * Handle withdrawal approval/rejection
   * @param req
   * @param res
   * @returns
   */

  handlWithdraw: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = WithdrawActionSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid input", status: false });
        return;
      }

      const { id, type, reason } = validation.data;
      const withdrawal = await getWithdrawalById(db, id);

      if (!withdrawal) {
        res.status(404).json({ message: "Withdrawal not found", status: false });
        return;
      }

      if (withdrawal.status !== 0) {
        res.status(400).json({ message: "Withdrawal already processed", status: false });
        return;
      }

      if (type === "confirm") {
        await updateWithdrawalStatus(db, id, 2);
        res.json({
          message: "Withdrawal approved",
          status: true,
          timeStamp: getCurrentTimestamp(),
        });
      } else {
        // Reject and refund
        await updateWithdrawalStatus(db, id, 3, reason);
        await updateUserBalance(db, withdrawal.userId, withdrawal.amount);

        res.json({
          message: "Withdrawal rejected and refunded",
          status: true,
          timeStamp: getCurrentTimestamp(),
        });
      }
    } catch (error) {
      console.error("Handle withdraw error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get user profile with recent transactions
   * @param req
   * @param res
   * @returns
   */

  profileUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.params;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: "User not found", status: false });
        return;
      }

      // Get recent deposits
      const [deposits] = await db.execute(
        "SELECT * FROM deposits WHERE userId = ? ORDER BY createdAt DESC LIMIT 5",
        [user.id],
      );

      // Get recent withdrawals
      const [withdrawals] = await db.execute(
        "SELECT * FROM withdrawals WHERE userId = ? ORDER BY requestedAt DESC LIMIT 5",
        [user.id],
      );

      // Get recent bets
      const [bets] = await db.execute(
        `SELECT b.*, gs.period FROM bets b
         JOIN gameSessions gs ON b.sessionId = gs.id
         WHERE b.userId = ? ORDER BY b.createdAt DESC LIMIT 5`,
        [user.id],
      );

      res.json({
        message: "Success",
        status: true,
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            userName: user.userName,
            balance: user.balance,
            referralCode: user.referralCode,
            status: user.status,
          },
          recentActivity: {
            deposits,
            withdrawals,
            bets,
          },
        },
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Profile user error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get user's deposit history
   * @param req
   * @param res
   * @returns
   */

  listRechargeMem: async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.params;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: "User not found", status: false });
        return;
      }

      const [deposits] = await db.execute(
        "SELECT * FROM deposits WHERE userId = ? ORDER BY createdAt DESC",
        [user.id],
      );

      res.json({
        message: "Success",
        status: true,
        data: deposits,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("List recharge mem error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get user's withdrawal history
   * @param req
   * @param res
   * @returns
   */

  listWithdrawMem: async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.params;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: "User not found", status: false });
        return;
      }

      const [withdrawals] = await db.execute(
        "SELECT * FROM withdrawals WHERE userId = ? ORDER BY requestedAt DESC",
        [user.id],
      );

      res.json({
        message: "Success",
        status: true,
        data: withdrawals,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("List withdraw mem error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get user's bet history
   * @param req
   * @param res
   * @returns
   */

  listBet: async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.params;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: "User not found", status: false });
        return;
      }

      const [bets] = await db.execute(
        `SELECT b.*, gt.name as gameName, gs.period
         FROM bets b
         JOIN gameTypes gt ON b.gameTypeId = gt.id
         JOIN gameSessions gs ON b.sessionId = gs.id
         WHERE b.userId = ? ORDER BY b.createdAt DESC`,
        [user.id],
      );

      res.json({
        message: "Success",
        status: true,
        data: bets,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("List bet error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get CTV dashboard data
   * @param req
   * @param res
   * @returns
   */

  infoCtv: async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.body;
      const user = await findUserByPhone(db, phone);

      if (!user || user.userLevel !== 2) {
        res.status(404).json({ message: "CTV not found", status: false });
        return;
      }

      // Get referral stats
      const f1 = await getDirectSubordinates(db, user.referralCode);
      const f1Ids = f1.map((u) => u.id);
      const f2 = f1Ids.length > 0 ? await getSubordinatesByLevel(db, f1Ids) : [];
      const f2Ids = f2.map((u) => u.id);
      const f3 = f2Ids.length > 0 ? await getSubordinatesByLevel(db, f2Ids) : [];
      const f3Ids = f3.map((u) => u.id);
      const f4 = f3Ids.length > 0 ? await getSubordinatesByLevel(db, f3Ids) : [];

      const todayStart = getTodayStartTimestamp();

      // Get commission data
      const [commissionData] = await db.execute(
        `SELECT
          COALESCE(SUM(CASE WHEN createdAt >= ? THEN amount ELSE 0 END), 0) as todayCommission,
          COALESCE(SUM(amount), 0) as totalCommission
         FROM commissionRecords WHERE userId = ?`,
        [todayStart, user.id],
      );

      const ctvData: CTVInfoData = {
        ctvId: user.id,
        ctvName: user.userName,
        f1Count: f1.length,
        f2Count: f2.length,
        f3Count: f3.length,
        f4Count: f4.length,
        todayF1: f1.filter((u) => u.createdAt >= todayStart).length,
        todayF2: f2.filter((u) => u.createdAt >= todayStart).length,
        todayF3: f3.filter((u) => u.createdAt >= todayStart).length,
        todayF4: f4.filter((u) => u.createdAt >= todayStart).length,
        totalCommission: (commissionData as any[])[0]?.totalCommission || 0,
        todayCommission: (commissionData as any[])[0]?.todayCommission || 0,
      };

      res.json({
        message: "Success",
        status: true,
        data: ctvData,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Info CTV error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get commission levels
   * @param req
   * @param res
   */

  getLevelInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const levels = await getCommissionLevels(db);
      res.json({
        message: "Success",
        status: true,
        data: levels,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Get level info error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Update commission level

   * @param req
   * @param res
   * @returns
   */
  updateLevel: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = UpdateLevelSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid input", status: false });
        return;
      }

      const { level, rateF1, rateF2, rateF3, rateF4, minTurnover } = validation.data;

      await updateCommissionLevel(db, level, {
        rateF1: rateF1 / 100, // Convert percentage to decimal
        rateF2: rateF2 / 100,
        rateF3: rateF3 / 100,
        rateF4: rateF4 / 100,
        minTurnover,
      });

      res.json({
        message: "Commission level updated",
        status: true,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Update level error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Create salary record
   * @param req
   * @param res
   * @returns
   */
  CreatedSalary: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = CreateSalarySchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid input", status: false });
        return;
      }

      const { phone, amount, type } = validation.data;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: "User not found", status: false });
        return;
      }

      // Calculate period dates
      const now = new Date();
      let periodStart: Date, periodEnd: Date;

      if (type === "daily") {
        periodStart = new Date(now.setHours(0, 0, 0, 0));
        periodEnd = new Date(now.setHours(23, 59, 59, 999));
      } else if (type === "weekly") {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        periodStart = new Date(now.setDate(diff));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
      } else {
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }

      const salaryId = await createSalaryRecord(db, {
        userId: user.id,
        amount,
        type,
        periodStart: periodStart.toISOString().split("T")[0],
        periodEnd: periodEnd.toISOString().split("T")[0],
      });

      res.json({
        message: "Salary record created",
        status: true,
        data: { salaryId },
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Created salary error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get salary records
   * @param req
   * @param res
   */

  getSalary: async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.query;
      const records = await getSalaryRecords(db, phone as string | undefined);

      res.json({
        message: "Success",
        status: true,
        data: records,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Get salary error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Adjust user balance (buff)
   * @param req
   * @param res
   * @returns
   */

  settingBuff: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = SettingBuffSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid input", status: false });
        return;
      }

      const { phone, amount, type, reason } = validation.data;
      const user = await findUserByPhone(db, phone);

      if (!user) {
        res.status(404).json({ message: "User not found", status: false });
        return;
      }

      const adjustment = type === "add" ? amount : -amount;
      await updateUserBalance(db, user.id, adjustment);

      // Log the adjustment
      await db.execute(
        `INSERT INTO balanceAdjustments (userId, amount, type, reason, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [user.id, amount, type, reason, getCurrentTimestamp()],
      );

      res.json({
        message: `Balance ${type === "add" ? "added" : "subtracted"} successfully`,
        status: true,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Setting buff error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Create bonus/red envelope
   * @param req
   * @param res
   * @returns
   */

  createBonus: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = CreateBonusSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid input", status: false });
        return;
      }

      const { amount, count, userId } = validation.data;
      const envelopeId = generateOrderId("ENV");
      const expiredAt = getCurrentTimestamp() + 24 * 60 * 60 * 1000; // 24 hours

      const envelopeDbId = await createRedEnvelope(db, {
        envelopeId,
        creatorId: userId,
        totalAmount: amount,
        totalCount: count,
        expiredAt,
      });

      res.json({
        message: "Red envelope created",
        status: true,
        data: { envelopeId, id: envelopeDbId },
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Create bonus error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * List red envelopes
   * @param req
   * @param res
   */

  listRedenvelops: async (req: Request, res: Response): Promise<void> => {
    try {
      const { creatorId } = req.query;
      const envelopes = await getRedEnvelopes(
        db,
        creatorId ? parseInt(creatorId as string) : undefined,
      );

      res.json({
        message: "Success",
        status: true,
        data: envelopes,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("List red envelopes error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Get all settings
   * @param req
   * @param res
   */

  settingGet: async (req: Request, res: Response): Promise<void> => {
    try {
      const configs = await getAdminConfigs(db);
      const paymentMethods = await getPaymentMethods(db);

      res.json({
        message: "Success",
        status: true,
        data: {
          configs,
          paymentMethods,
        },
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Setting get error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },

  /**
   * Update bank/UPI settings
   * @param req
   * @param res
   * @returns
   */

  settingBank: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = SettingBankSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: "Invalid input", status: false });
        return;
      }

      const { type, ...data } = validation.data;
      await updatePaymentMethod(db, type, data);

      res.json({
        message: "Payment method updated",
        status: true,
        timeStamp: getCurrentTimestamp(),
      });
    } catch (error) {
      console.error("Setting bank error:", error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  },
});

// Helper function for commission distribution
async function distributeDepositCommission(
  connection: any,
  userId: number,
  amount: number,
  depositId: number,
): Promise<void> {
  // Get referrer chain
  let currentId = userId;
  const referrers: Array<{ id: number; level: number }> = [];

  for (let i = 0; i < 4; i++) {
    const [rows] = await connection.execute("SELECT invitedBy FROM users WHERE id = ?", [
      currentId,
    ]);

    if ((rows as any[]).length === 0 || !(rows as any[])[0].invitedBy) break;
    currentId = (rows as any[])[0].invitedBy;
    referrers.push({ id: currentId, level: i + 1 });
  }

  if (referrers.length === 0) return;

  // Get commission rates
  const [levelRows] = await connection.execute(
    "SELECT rateF1, rateF2, rateF3, rateF4 FROM commissionLevels WHERE level = 0 LIMIT 1",
  );

  if ((levelRows as any[]).length === 0) return;

  const rates = (levelRows as any[])[0];

  for (const ref of referrers) {
    const rateKey = `rateF${ref.level}` as keyof typeof rates;
    const rate = rates[rateKey] as number;

    if (!rate || rate <= 0) continue;

    const commission = (amount / 100) * rate;

    if (commission <= 0) continue;

    await connection.execute(
      `INSERT INTO commissionRecords (userId, fromUserId, level, amount, sourceType, sourceId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ref.id, userId, ref.level, commission, "deposit", depositId, Date.now()],
    );

    await connection.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [
      commission,
      ref.id,
    ]);
  }
}
