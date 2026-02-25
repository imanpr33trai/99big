import { Pool } from "mysql2/promise";
import { addK3Period } from "../../services/k3/k3Game.service";

export const addK3Handler =
  (db: Pool) =>
  async (game: number): Promise<void> => {
    try {
      // 1. Generate random result (3 dice)
      // 2. Get current period
      // 3. Get predefined result from settings
      // 4. Update current session with result
      // 5. Create new session
      // 6. Update admin settings

      await addK3Period(db, game);
    } catch (error) {
      console.error("addK3Handler error:", error);
      throw error;
    }
  };
