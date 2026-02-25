import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { z } from 'zod';
import { WingoApiResponse, WingoHistorySchema, WingoGameSession } from '../../types/wingo.types';
import { getWingoHistory, getCurrentWingoSession } from '../../db/wingo.queries';
import { getGameName } from '../../utils/wingo.helpers';

interface HistoryResponse {
  code: number;
  msg: string;
  data: {
    gameslist: WingoGameSession[];
  };
  period: string;
  page: number;
  status: boolean;
}

export const listOrderOldWingoHandler = (db: Pool) => async (
  req: Request,
  res: Response<HistoryResponse | WingoApiResponse>
): Promise<void> => {
  try {
    // 1. Validate input
    const parsed = WingoHistorySchema.safeParse(req.body);
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

    const game = getGameName(typeid);

    // 3. Get game history
    const history = await getWingoHistory(db, game, pageno, pageto);

    // 4. Get current period
    const currentSession = await getCurrentWingoSession(db, game);
    const currentPeriod = currentSession ? currentSession.period : '';

    // 5. Return formatted response
    const response: HistoryResponse = {
      code: 0,
      msg: 'Receive success',
      data: {
        gameslist: history,
      },
      period: currentPeriod,
      page: pageno,
      status: true,
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('listOrderOldWingoHandler error:', error);
    res.status(500).json({
      message: 'Failed to retrieve history',
      status: false,
      timeStamp: Date.now(),
    } as WingoApiResponse);
  }
};
