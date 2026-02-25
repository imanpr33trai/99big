import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { z } from 'zod';
import {
  WingoApiResponse,
  WingoMyBetsSchema,
  WingoMyBetsResponse,
} from '../../types/wingo.types';
import { getUserWingoBets, getCurrentWingoSession, findUserByToken } from '../../db/wingo.queries';
import { getGameName } from '../../utils/wingo.helpers';

export const getMyEmerdListWingoHandler = (db: Pool) => async (
  req: Request,
  res: Response<WingoMyBetsResponse | WingoApiResponse>
): Promise<void> => {
  try {
    // 1. Validate input
    const parsed = WingoMyBetsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Invalid input',
        status: false,
        timeStamp: Date.now(),
      } as WingoApiResponse);
      return;
    }

    const { typeid, pageno, pageto } = parsed.data;

    // 2. Validate game type
    if (!['1', '3', '5', '10'].includes(typeid)) {
      res.status(400).json({
        message: 'Invalid game type',
        status: false,
        timeStamp: Date.now(),
      } as WingoApiResponse);
      return;
    }

    // 3. Get authenticated user
    const auth = req.cookies?.auth || req.headers?.authorization?.replace('Bearer ', '');
    if (!auth) {
      res.status(401).json({
        message: 'Unauthorized',
        status: false,
        timeStamp: Date.now(),
      } as WingoApiResponse);
      return;
    }

    const user = await findUserByToken(db, auth);
    if (!user) {
      res.status(401).json({
        message: 'User not found',
        status: false,
        timeStamp: Date.now(),
      } as WingoApiResponse);
      return;
    }

    const game = getGameName(typeid);

    // 4. Get user's bets
    const bets = await getUserWingoBets(db, user.id, game, pageno, pageto);

    // 5. Calculate total winnings for current stage
    let totalWin = 0;
    if (bets.length > 0 && bets[0].stage !== undefined) {
      const winningBets = bets.filter(b => b.status === 1);
      totalWin = winningBets.reduce((sum, b) => sum + (b.actualWin || 0), 0);
    }

    // 6. Map bets to response format
    const datas = bets.map((data) => {
      const { id, userId, gameTypeId, get, ...others } = data;
      return { ...others, get: totalWin };
    });

    // 7. Return response
    const response: WingoMyBetsResponse = {
      gameslist: datas,
      page: pageno,
      totalWin,
    };

    res.status(200).json({
      code: 0,
      msg: 'Receive success',
      data: response,
      status: true,
    });

  } catch (error) {
    console.error('getMyEmerdListWingoHandler error:', error);
    res.status(500).json({
      message: 'Failed to retrieve bets',
      status: false,
      timeStamp: Date.now(),
    } as WingoApiResponse);
  }
};
