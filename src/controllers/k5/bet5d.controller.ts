import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { K5DBetSchema, K5DApiResponse } from '../../types/5d.types';
import { getCurrent5DSession } from '../../db/5d.queries';
import { validateBetSelection, process5DBet, calculateBetAmount } from '../../services/5d/5dBet.service';

/\*\*

- Handler for placing 5D bets
  \*/
  export const bet5dHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  try {
  // 1. Validate input with Zod
  const validationResult = K5DBetSchema.safeParse(req.body);

      if (!validationResult.success) {
        const response: K5DApiResponse = {
          message: 'Invalid bet data: ' + validationResult.error.errors.map(e => e.message).join(', '),
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      const betData = validationResult.data;

      // 2. Get current game session
      const session = await getCurrent5DSession(db, parseInt(betData.game));

      if (!session) {
        const response: K5DApiResponse = {
          message: 'No active game session',
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      if (session.status !== 1) {
        const response: K5DApiResponse = {
          message: 'Game session is not open for betting',
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      // 3. Get authenticated user (attached by middleware)
      const user = req.user;
      if (!user) {
        const response: K5DApiResponse = {
          message: 'User not authenticated',
          status: false,
          timeStamp: Date.now(),
        };
        res.status(401).json(response);
        return;
      }

      // 4. Validate bet selection
      if (!validateBetSelection(betData.join, betData.list_join, parseInt(betData.game))) {
        const response: K5DApiResponse = {
          message: 'Invalid bet selection',
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      // 5. Calculate bet amount
      const x = parseInt(betData.x, 10);
      const { total, fee, price } = calculateBetAmount(
        betData.join,
        betData.list_join,
        betData.money,
        x
      );

      // 6. Check sufficient balance
      if (user.balance < total) {
        const response: K5DApiResponse = {
          message: 'The amount is not enough',
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      // 7. Create bet record and process
      const bet = await process5DBet(db, user.id, {
        join: betData.join,
        list_join: betData.list_join,
        x: betData.x,
        money: betData.money,
        game: betData.game,
        sessionId: session.id,
        stage: parseInt(session.period),
      });

      // 8. Return success response
      const newBalance = user.balance - total;
      const response: K5DApiResponse = {
        message: 'Successful bet',
        status: true,
        money: newBalance,
        change: user.userLevel,
        timeStamp: Date.now(),
      };

      res.json(response);

} catch (error) {
console.error('Bet processing error:', error);
const response: K5DApiResponse = {
message: error instanceof Error ? error.message : 'Internal server error',
status: false,
timeStamp: Date.now(),
};
res.status(500).json(response);
}
};
