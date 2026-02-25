import { Pool } from "mysql2/promise";

export const make5dId = (length: number): string => {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const process5dResults =
  (db: Pool) =>
  async (game: number): Promise<void> => {
    const [k5dRows] = await db.query(
      `SELECT * FROM 5dGames WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1`,
    );

    if ((k5dRows as any[]).length === 0) return;

    const k5dInfo = (k5dRows as any[])[0];
    const result = String(k5dInfo.result).split("");
    const [a, b, c, d, e] = result;
    const total = result.reduce((sum, digit) => sum + Number(digit), 0);

    await db.execute(`UPDATE result5dBets SET result = ? WHERE status = 0 AND game = ${game}`, [
      k5dInfo.result,
    ]);

    // Process positions a-e
    const positions = [
      { name: "a", value: a },
      { name: "b", value: b },
      { name: "c", value: c },
      { name: "d", value: d },
      { name: "e", value: e },
    ];

    for (const pos of positions) {
      await processPositionBets(db, game, pos.name, pos.value);
    }

    // Process total
    await processTotalBets(db, game, total);
  };

const processPositionBets = async (
  db: Pool,
  game: number,
  position: string,
  value: string,
): Promise<void> => {
  const [bets] = await db.execute(
    `SELECT id, bet FROM result5dBets WHERE status = 0 AND game = ? AND joinBet = ?`,
    [game, position],
  );

  for (const bet of bets as any[]) {
    const isNum = /^\d+$/.test(bet.bet);
    if (isNum) {
      const match = bet.bet.split("").includes(value);
      if (!match) {
        await db.execute("UPDATE result5dBets SET status = 2 WHERE id = ?", [bet.id]);
      }
    }
  }

  const numValue = Number(value);

  if (numValue <= 4) {
    await db.execute(
      `UPDATE result5dBets SET status = 2 WHERE game = ? AND joinBet = ? AND bet = 'b'`,
      [game, position],
    );
  } else {
    await db.execute(
      `UPDATE result5dBets SET status = 2 WHERE game = ? AND joinBet = ? AND bet = 's'`,
      [game, position],
    );
  }

  if (numValue % 2 === 0) {
    await db.execute(
      `UPDATE result5dBets SET status = 2 WHERE game = ? AND joinBet = ? AND bet = 'l'`,
      [game, position],
    );
  } else {
    await db.execute(
      `UPDATE result5dBets SET status = 2 WHERE game = ? AND joinBet = ? AND bet = 'c'`,
      [game, position],
    );
  }
};

const processTotalBets = async (db: Pool, game: number, total: number): Promise<void> => {
  const [bets] = await db.execute(
    `SELECT id FROM result5dBets WHERE status = 0 AND game = ? AND joinBet = 'total'`,
    [game],
  );

  if ((bets as any[]).length === 0) return;

  if (total <= 22) {
    await db.execute(
      `UPDATE result5dBets SET status = 2 WHERE game = ? AND joinBet = 'total' AND bet = 'b'`,
      [game],
    );
  } else {
    await db.execute(
      `UPDATE result5dBets SET status = 2 WHERE game = ? AND joinBet = 'total' AND bet = 's'`,
      [game],
    );
  }

  if (total % 2 === 0) {
    await db.execute(
      `UPDATE result5dBets SET status = 2 WHERE game = ? AND joinBet = 'total' AND bet = 'l'`,
      [game],
    );
  } else {
    await db.execute(
      `UPDATE result5dBets SET status = 2 WHERE game = ? AND joinBet = 'total' AND bet = 'c'`,
      [game],
    );
  }
};

export const process5dPayouts =
  (db: Pool) =>
  async (game: number): Promise<void> => {
    const [orderRows] = await db.execute(
      `SELECT id, phone, bet, price, money, fee, amount FROM result5dBets WHERE status = 0 AND game = ?`,
      [game],
    );

    for (const order of orderRows as any[]) {
      const isNum = /^\d+$/.test(order.bet);
      let payout = 0;

      if (isNum) {
        const arr = order.bet.split("");
        const base = order.money / arr.length / order.amount;
        const fee = base * 0.02;
        const price = base - fee;
        payout = price * 9;
      } else {
        payout = order.price * 2;
      }

      await db.execute("UPDATE result5dBets SET winAmount = ?, status = 1 WHERE id = ?", [
        payout,
        order.id,
      ]);

      await db.execute("UPDATE users SET balance = balance + ? WHERE phone = ?", [
        payout,
        order.phone,
      ]);
    }
  };
