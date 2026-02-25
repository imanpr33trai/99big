import { Pool } from 'mysql2/promise';
import { add5DPeriod, getPredefinedResult } from '../../services/5d/5dGame.service';
import { update5DResult, getCurrent5DSession } from '../../db/5d.queries';
import { generate5DResult } from '../../utils/5d.helpers';
import { process5DResults } from '../../services/5d/5dResult.service';
import { process5DPayouts } from '../../services/5d/5dPayout.service';

/\*\*

- Handler for adding new 5D period (admin/internal use)
  \*/
  export const add5dHandler = (db: Pool) => async (game: number): Promise<void> => {
  try {
  // 1. Get current session
  const currentSession = await getCurrent5DSession(db, game);

      if (currentSession && currentSession.result === null) {
        // 2. Generate or get predefined result
        const result = await getPredefinedResult(db, game) || generate5DResult();

        // 3. Update current session with result
        await update5DResult(db, currentSession.period, result, game);

        // 4. Process results and payouts
        await process5DResults(db, currentSession.id, result);
        await process5DPayouts(db, currentSession.id, result);
      }

      // 5. Create new session
      await add5DPeriod(db, game);

} catch (error) {
console.error('Add period error:', error);
throw error;
}
};
