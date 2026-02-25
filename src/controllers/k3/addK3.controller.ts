import { Pool } from "mysql2/promise";
import { makeid } from "../../utils/helpers";

// ============================================================================
// CONTROLLER
// ============================================================================

export const addK3Handler =
  (db: Pool) =>
  async (game: number): Promise<void> => {
    try {
      // Determine game type prefix
      let join = "";
      if (game === 1) join = "k3d";
      if (game === 3) join = "k3d3";
      if (game === 5) join = "k3d5";
      if (game === 10) join = "k3d10";

      // Generate random result
      const result2 = makeid(3);
      const timeNow = Date.now();

      // Get current period
      const [k5D] = await db.query(
        `SELECT period FROM k3 WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1`,
      );
      const [setting] = await db.query("SELECT * FROM `admin`");
      const period = k5D[0].period;

      // Determine next result from settings
      let nextResult = "";
      if (game === 1) nextResult = setting[0].k3d;
      if (game === 3) nextResult = setting[0].k3d3;
      if (game === 5) nextResult = setting[0].k3d5;
      if (game === 10) nextResult = setting[0].k3d10;

      let newArr = "";

      // Process result
      if (nextResult === "-1") {
        // Random result
        await db.execute(
          `UPDATE k3 SET result = ?, status = ? WHERE period = ? AND game = "${game}"`,
          [result2, 1, period],
        );
        newArr = "-1";
      } else {
        // Predefined result
        let result = "";
        const arr = nextResult.split("|");
        const check = arr.length;

        if (check === 1) {
          newArr = "-1";
        } else {
          for (let i = 1; i < arr.length; i++) {
            newArr += arr[i] + "|";
          }
          newArr = newArr.slice(0, -1);
        }

        result = arr[0];
        await db.execute(
          `UPDATE k3 SET result = ?, status = ? WHERE period = ? AND game = ${game}`,
          [result, 1, period],
        );
      }

      // Insert new period
      const sql = `INSERT INTO k3 SET period = ?, result = ?, game = ?, status = ?, time = ?`;
      await db.execute(sql, [Number(period) + 1, 0, game, 0, timeNow]);

      // Update admin settings
      if (game === 1) join = "k3d";
      if (game === 3) join = "k3d3";
      if (game === 5) join = "k3d5";
      if (game === 10) join = "k3d10";

      await db.execute(`UPDATE admin SET ${join} = ?`, [newArr]);
    } catch (error) {
      // Silent fail as per original
      if (error) {
        // Error handling intentionally left empty per original code
      }
    }
  };
