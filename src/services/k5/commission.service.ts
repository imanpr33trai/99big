import { Pool } from "mysql2/promise";

export const distributeCommissions =
  (db: Pool) =>
  async (auth: string, money: number): Promise<void> => {
    if (money < 10000) return;

    const [levelRows] = await db.execute(
      "SELECT * FROM commissionLevels ORDER BY level ASC LIMIT 1",
    );
    if ((levelRows as any[]).length === 0) return;

    const level0 = (levelRows as any[])[0];

    const [userRows] = await db.execute(
      "SELECT phone, referralCode, invitedBy FROM users WHERE authToken = ? AND isVerified = TRUE LIMIT 1",
      [auth],
    );
    if ((userRows as any[]).length === 0) return;

    const userInfo = (userRows as any[])[0];

    const [f1Rows] = await db.execute(
      "SELECT phone, referralCode, invitedBy FROM users WHERE referralCode = ? AND isVerified = TRUE LIMIT 1",
      [userInfo.invitedBy],
    );

    if (f1Rows.length > 0) {
      const infoF1 = (f1Rows as any[])[0];
      const rosesF1 = (money / 100) * level0.rateF1;

      await db.execute(
        "UPDATE users SET balance = balance + ?, commissionF1 = commissionF1 + ?, commissionF = commissionF + ?, commissionToday = commissionToday + ? WHERE phone = ?",
        [rosesF1, rosesF1, rosesF1, rosesF1, infoF1.phone],
      );

      const [f2Rows] = await db.execute(
        "SELECT phone, referralCode, invitedBy FROM users WHERE referralCode = ? AND isVerified = TRUE LIMIT 1",
        [infoF1.invitedBy],
      );

      if (f2Rows.length > 0) {
        const infoF2 = (f2Rows as any[])[0];
        const rosesF2 = (money / 100) * level0.rateF2;

        await db.execute(
          "UPDATE users SET balance = balance + ?, commissionF = commissionF + ?, commissionToday = commissionToday + ? WHERE phone = ?",
          [rosesF2, rosesF2, rosesF2, infoF2.phone],
        );

        const [f3Rows] = await db.execute(
          "SELECT phone, referralCode, invitedBy FROM users WHERE referralCode = ? AND isVerified = TRUE LIMIT 1",
          [infoF2.invitedBy],
        );

        if (f3Rows.length > 0) {
          const infoF3 = (f3Rows as any[])[0];
          const rosesF3 = (money / 100) * level0.rateF3;

          await db.execute(
            "UPDATE users SET balance = balance + ?, commissionF = commissionF + ?, commissionToday = commissionToday + ? WHERE phone = ?",
            [rosesF3, rosesF3, rosesF3, infoF3.phone],
          );

          const [f4Rows] = await db.execute(
            "SELECT phone, referralCode, invitedBy FROM users WHERE referralCode = ? AND isVerified = TRUE LIMIT 1",
            [infoF3.invitedBy],
          );

          if (f4Rows.length > 0) {
            const infoF4 = (f4Rows as any[])[0];
            const rosesF4 = (money / 100) * level0.rateF4;

            await db.execute(
              "UPDATE users SET balance = balance + ?, commissionF = commissionF + ?, commissionToday = commissionToday + ? WHERE phone = ?",
              [rosesF4, rosesF4, rosesF4, infoF4.phone],
            );
          }
        }
      }
    }
  };
