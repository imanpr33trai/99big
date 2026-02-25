import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { DailyApiResponse, BuffMoneyInput, DateFilterInput } from '../../types/daily.types';
import { BuffMoneySchema, DateFilterSchema } from '../../types/daily.types';
import {
  findUserByToken,
  findUserByPhone,
  getDirectSubordinates,
  getSubordinatesByLevel,
  getCTVMembers,
  getCTVBannedMembers,
  getUserPoints,
  getDepositsByUsers,
  getWithdrawalsByUsers,
  getBetsByUsers,
  getRecentRecharges,
  getRecentWithdrawals,
  getRedEnvelopesUsedToday,
  getFinancialDetailsToday,
  createFinancialDetail,
  updateUserBalance,
  updateCTVPoints,
} from '../../db/daily.queries';
import { formatTimeIST, getTodayString, getStartOfDay, getEndOfDay } from '../../utils/daily.helpers';

const timeNow = () => Date.now();

export const createCTVDashboardController = (db: Pool) => ({
  // CTV Dashboard - Main
  infoCtv: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const auth = req.cookies.auth;
      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const user = await findUserByToken(db, auth);
      if (!user) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      // Get referral hierarchy (F1-F4)
      const f1s = await getDirectSubordinates(db, user.referralCode);
      const f2s = await getSubordinatesByLevel(db, f1s.map(f => f.referralCode));
      const f3s = await getSubordinatesByLevel(db, f2s.map(f => f.referralCode));
      const f4s = await getSubordinatesByLevel(db, f3s.map(f => f.referralCode));

      // Get CTV members
      const members = await getCTVMembers(db, user.phone);
      const bannedMembers = await getCTVBannedMembers(db, user.phone);
      const memberIds = members.map(m => m.id);

      // Calculate totals
      const allDeposits = await getDepositsByUsers(db, memberIds);
      const allWithdrawals = await getWithdrawalsByUsers(db, memberIds);

      const todayStart = getStartOfDay();
      const todayEnd = getEndOfDay();
      const todayDeposits = await getDepositsByUsers(db, memberIds, todayStart, todayEnd);
      const todayWithdrawals = await getWithdrawalsByUsers(db, memberIds, todayStart, todayEnd);
      const todayBets = await getBetsByUsers(db, memberIds, todayStart, todayEnd);

      const totalRecharge = allDeposits.reduce((sum, d) => sum + d.amount, 0);
      const totalWithdraw = allWithdrawals.reduce((sum, w) => sum + w.amount, 0);
      const totalRechargeToday = todayDeposits.reduce((sum, d) => sum + d.amount, 0);
      const totalWithdrawToday = todayWithdrawals.reduce((sum, w) => sum + w.amount, 0);

      const win = todayBets.filter(b => b.winAmount > 0).reduce((sum, b) => sum + b.winAmount, 0);
      const loss = todayBets.filter(b => b.winAmount === 0).reduce((sum, b) => sum + b.amount, 0);

      // Get today's members
      const today = getTodayString();
      const membersToday = members.filter(m => formatTimeIST(m.createdAt) === today);

      // Get CTV points
      const userPoints = await getUserPoints(db, user.id);

      // Get recent transactions
      const rechargeNews = await getRecentRecharges(db, members, 5);
      const withdrawNews = await getRecentWithdrawals(db, members, 5);
      const redenvelopesUsed = await getRedEnvelopesUsedToday(db, user.id);
      const financialDetails = await getFinancialDetailsToday(db, user.id);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,
        f1: f1s.length,
        f2: f2s.length,
        f3: f3s.length,
        f4: f4s.length,
        list_mems: membersToday,
        total_recharge: totalRecharge,
        total_withdraw: totalWithdraw,
        total_recharge_today: totalRechargeToday,
        total_withdraw_today: totalWithdrawToday,
        list_mem_baned: bannedMembers.length,
        win,
        loss,
        list_recharge_news: rechargeNews,
        list_withdraw_news: withdrawNews,
        moneyCTV: userPoints?.points || 0,
        redenvelopes_used: redenvelopesUsed,
        financial_details_today: financialDetails,
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('infoCtv error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow(),
      });
    }
  },

  // CTV Dashboard with date filter
  infoCtv2: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = DateFilterSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid date format', status: false, timeStamp: timeNow() });
        return;
      }

      const { timeDate } = validation.data;
      const auth = req.cookies.auth;

      if (!auth) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const user = await findUserByToken(db, auth);
      if (!user) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      // Parse date filter
      const filterDate = timeDate ? new Date(timeDate) : new Date();
      const startOfDay = new Date(filterDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filterDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Get members
      const members = await getCTVMembers(db, user.phone);
      const memberIds = members.map(m => m.id);

      // Get filtered data
      const dayDeposits = await getDepositsByUsers(db, memberIds, startOfDay, endOfDay);
      const dayWithdrawals = await getWithdrawalsByUsers(db, memberIds, startOfDay, endOfDay);
      const dayBets = await getBetsByUsers(db, memberIds, startOfDay, endOfDay);

      const totalRechargeDay = dayDeposits.reduce((sum, d) => sum + d.amount, 0);
      const totalWithdrawDay = dayWithdrawals.reduce((sum, w) => sum + w.amount, 0);
      const winDay = dayBets.filter(b => b.winAmount > 0).reduce((sum, b) => sum + b.winAmount, 0);
      const lossDay = dayBets.filter(b => b.winAmount === 0).reduce((sum, b) => sum + b.amount, 0);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,
        total_recharge_today: totalRechargeDay,
        total_withdraw_today: totalWithdrawDay,
        win: winDay,
        loss: lossDay,
        date: timeDate || getTodayString(),
        timeStamp: timeNow(),
      });
    } catch (error) {
      console.error('infoCtv2 error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow(),
      });
    }
  },

  // Balance adjustment (buff money)
  buffMoney: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const validation = BuffMoneySchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ message: 'Invalid input', status: false, timeStamp: timeNow() });
        return;
      }

      const { username: phone, select, money } = validation.data;
      const auth = req.cookies.auth;

      const ctvUser = await findUserByToken(db, auth);
      if (!ctvUser) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow() });
        return;
      }

      const targetUser = await findUserByPhone(db, phone);
      if (!targetUser) {
        res.status(404).json({ message: 'User not found', status: false, timeStamp: timeNow() });
        return;
      }

      const ctvPoints = await getUserPoints(db, ctvUser.id);
      if (!ctvPoints) {
        res.status(404).json({ message: 'CTV points not found', status: false, timeStamp: timeNow() });
        return;
      }

      if (select === '1') {
        // Add money
        if (ctvPoints.pointsUs < money) {
          res.status(400).json({ message: 'Insufficient balance', status: false, timeStamp: timeNow() });
          return;
        }

        await updateUserBalance(db, phone, money, 'add');
        await updateCTVPoints(db, ctvUser.id, money, 'subtract');

        await createFinancialDetail(db, ctvUser.id, targetUser.id, money, '1');
      } else {
        // Subtract money
        await updateUserBalance(db, phone, money, 'subtract');
        await updateCTVPoints(db, ctvUser.id, money, 'add');

        await createFinancialDetail(db, ctvUser.id, targetUser.id, money, '2');
      }

      res.status(200).json({ message: 'Success', status: true, timeStamp: timeNow() });
    } catch (error) {
      console.error('buffMoney error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow(),
      });
    }
  },
});
