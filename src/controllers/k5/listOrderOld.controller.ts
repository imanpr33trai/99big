import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { K5DHistorySchema, K5DApiResponse, K5DHistoryResponse } from '../../types/5d.types';
import { get5DHistory, getCurrent5DSession, get5DControlSettings } from '../../db/5d.queries';

/\*\*

- Handler for getting 5D game history
  \*/
  export const listOrderOld5dHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  try {
  // 1. Validate input
  const validationResult = K5DHistorySchema.safeParse(req.body);

      if (!validationResult.success) {
        const response: K5DApiResponse = {
          message: 'Invalid parameters',
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      const { gameJoin, pageno, pageto } = validationResult.data;

      // 2. Get game history
      const history = await get5DHistory(db, parseInt(gameJoin), pageno, pageto);

      // 3. Get current period
      const currentSession = await getCurrent5DSession(db, parseInt(gameJoin));
      const currentPeriod = currentSession?.period || '';

      // 4. Get settings
      const settings = await get5DControlSettings(db, parseInt(gameJoin));

      const response: K5DApiResponse<K5DHistoryResponse> = {
        code: 0,
        msg: 'Get success',
        data: {
          gameslist: history,
        },
        period: currentPeriod,
        page: pageno,
        status: true,
      };

      res.json(response);

} catch (error) {
console.error('History fetch error:', error);
const response: K5DApiResponse = {
message: 'Internal server error',
status: false,
timeStamp: Date.now(),
};
res.status(500).json(response);
}
};
