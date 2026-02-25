import { Pool } from "mysql2/promise";
import { processK3Payouts } from "./k3Payout.service";
import { processK3Results } from "./k3Result.service";

export const handleK3Game =
  (db: Pool) =>
  async (typeId: number): Promise<void> => {
    const game = Number(typeId);

    // Process results (mark losing bets)
    await processK3Results(db)(game);

    // Process payouts (calculate and pay winning bets)
    await processK3Payouts(db)(game);
  };
