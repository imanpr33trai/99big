import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { z } from 'zod';
import {
  WingoApiResponse,
  WingoBetSchema,
} from '../../types/wingo.types';
import {
  findUserByToken,
  updateUserBalance,
  getCurrentWingoSession,
} from '../../db/wingo.queries';
import {
  validateBet,
  calculateBetAmount,
  processWingoBet,
  generateBetConfirmationHTML,
} from '../../services/wingo/wingoBet.service';
import { getGameName, formatTimeIST } from '../../utils/wingo.helpers';

export const betWingoHandler = (db: Pool) => async (
  req: Request,
  res: Response<WingoApiResponse>
): Promise<void> => {
  try {
    // 1. Validate input with Zod
    const parsed = WingoBetSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Invalid input: ' + parsed.error.errors.map(e => e.message).join(', '),
        status: false,
        timeStamp: Date.now(),
      });
      return;
    }

    const { typeid, join, x, money } = parsed.data;
    const auth = req.cookies?.auth || req.headers?.authorization?.replace('Bearer ', '');

    if (!auth) {
      res.status(401).json({
        message: 'Authentication required',
        status: false,
        timeStamp: Date.now(),
      });
      return;
    }

    // 2. Validate game type
    if (!['1', '3', '5', '10'].includes(typeid)) {
      res.status(400).json({
        message: 'Invalid game type',
        status: false,
        timeStamp: Date.now(),
      });
      return;
    }

    // 3. Get current game session
    const game = getGameName(typeid);
    const session = await getCurrentWingoSession(db, game);

    if (!session) {
      res.status(400).json({
        message: 'No active game session',
        status: false,
        timeStamp: Date.now(),
      });
      return;
    }

    // Check if betting is still open
    const now = Date.now();
    if (session.closedAt && now >= session.closedAt) {
      res.status(400).json({
        message: 'Betting is closed for this period',
        status: false,
        timeStamp: Date.now(),
      });
      return;
    }

    // 4. Get user and check balance
    const user = await findUserByToken(db, auth);
    if (!user) {
      res.status(401).json({
        message: 'Unauthorized',
        status: false,
        timeStamp: Date.now(),
      });
      return;
    }

    // 5. Validate bet selection
    if (!validateBet(join)) {
      res.status(400).json({
        message: 'Invalid bet selection',
        status: false,
        timeStamp: Date.now(),
      });
      return;
    }

    // 6. Calculate total bet amount and fee
    const xValue = parseInt(x);
    const calculation = calculateBetAmount(join, money, xValue);

    // 7. Check sufficient balance
    if (user.balance < calculation.total) {
      res.status(400).json({
        message: 'The amount is not enough',
        status: false,
        timeStamp: Date.now(),
      });
      return;
    }

    // 8. Create bet record (includes commission distribution)
    const bet = await processWingoBet(db, user.id, {
      sessionId: session.id,
      stage: session.period,
      betAmount: calculation.total,
      fee: calculation.fee,
      selection: join,
      game: game,
    });

    // 9. Deduct balance
    await updateUserBalance(db, user.id, -calculation.total);

    // 10. Generate HTML confirmation
    const formatTime = formatTimeIST();
    const htmlData = generateBetConfirmationHTML(bet, session.period, formatTime);

    // 11. Get updated balance
    const newBalance = user.balance - calculation.total;

    // 12. Return success response
    res.status(200).json({
      message: 'Successful bet',
      status: true,
      data: htmlData,
      money: newBalance,
      change: user.userLevel,
      timeStamp: Date.now(),
    });

  } catch (error) {
    console.error('betWingoHandler error:', error);
    res.status(500).json({
      message: 'Failed to place bet',
      status: false,
      timeStamp: Date.now(),
    });
  }
};
