import { Pool } from "mysql2/promise";
import { process5dPayouts, process5dResults } from "./5dResult.service";

export const handle5dGame =
  (db: Pool) =>
  async (typeId: number): Promise<void> => {
    const game = Number(typeId);
    await process5dResults(db)(game);
    await process5dPayouts(db)(game);
  };
