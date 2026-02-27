
import { Pool } from 'mysql2/promise';
import {
getCurrentK3Session,
getLatestK3Result,
createK3Session,
updateK3Result,
closeK3Session,
getK3ControlSettings,
updateK3ControlSettings,
} from '../../../db/k3.queries';
import { processK3Results } from './k3Result.service';
import { processK3Payouts } from './k3Payout.service';
import {
generateK3Result,
parsePredefinedResults,
getNextPredefinedResult,
} from '../../../utils';

/\*\*

- Handle K3 game cycle
  \*/
  export const handleK3Game = async (
  db: Pool,
  typeId: number
  ): Promise<void> => {
  const game = typeId;

// Get current session
const currentSession = await getCurrentK3Session(db, game);

if (!currentSession) {
// No active session, create one
await addK3Period(db, game);
return;
}

// Check if session should be closed
const now = Date.now();
if (currentSession.closedAt && now >= currentSession.closedAt && currentSession.status === 1) {
// Close the session
await closeK3Session(db, currentSession.period, game);

    // Generate result and process
    await addK3Period(db, game);

}
};

/\*\*

- Add new K3 period and close previous
  \*/
  export const addK3Period = async (
  db: Pool,
  game: number
  ): Promise<void> => {
  // Get current session to close
  const currentSession = await getCurrentK3Session(db, game);

if (currentSession) {
// Close current session
await closeK3Session(db, currentSession.period, game);

    // Generate result
    const result = await getPredefinedResult(db, game);

    // Update with result
    await updateK3Result(db, currentSession.period, result, game);

    // Process results and payouts
    await processK3Results(db, game, currentSession.period, result);
    await processK3Payouts(db, game, currentSession.period, result);

}

// Generate new period number
const now = new Date();
const dateStr = now.getFullYear().toString() +
String(now.getMonth() + 1).padStart(2, '0') +
String(now.getDate()).padStart(2, '0');

// Get latest result to determine next period
const latestResult = await getLatestK3Result(db, game);
let nextPeriod: number;

if (latestResult) {
const latestPeriodNum = parseInt(latestResult.period);
const latestDateStr = String(latestPeriodNum).substring(0, 8);
if (latestDateStr === dateStr) {
nextPeriod = latestPeriodNum + 1;
} else {
nextPeriod = parseInt(dateStr + '001');
}
} else {
nextPeriod = parseInt(dateStr + '001');
}

// Create new session
await createK3Session(db, nextPeriod, game);
};

/\*\*

- Get predefined result or generate random
  \*/
  export const getPredefinedResult = async (
  db: Pool,
  game: number
  ): Promise<string> => {
  // Check for predefined results
  const controlSettings = await getK3ControlSettings(db, game);

if (controlSettings) {
const predefined = parsePredefinedResults(controlSettings);

    if (predefined.length > 0 && predefined[0] !== null) {
      // Use predefined result
      const { result, remaining } = getNextPredefinedResult(predefined);

      // Update settings
      await updateK3ControlSettings(db, game, remaining);

      if (result !== null) {
        return result;
      }
    }

}

// Generate random result
return generateK3Result();
};
