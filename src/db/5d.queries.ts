import { Pool } from "mysql2/promise";

export const get5dCurrentSession = async (db: Pool, game: number): Promise<any | null> => {
  const [rows] = await db.query(
    "SELECT period FROM 5dGames WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1",
    [game],
  );
  return (rows as any[])[0] || null;
};

export const create5dBet = async (db: Pool, bet: any): Promise<void> => {
  await db.execute(
    `INSERT INTO result5dBets (idProduct, phone, code, invitedBy, stage, level, money, price, amount, fee, game, joinBet, bet, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      bet.idProduct,
      bet.phone,
      bet.code,
      bet.invite,
      bet.stage,
      bet.level,
      bet.money,
      bet.price,
      bet.amount,
      bet.fee,
      bet.game,
      bet.joinBet,
      bet.bet,
      bet.status,
      bet.time,
    ],
  );
};

export const get5dHistory = async (
  db: Pool,
  game: number,
  offset: number,
  limit: number,
): Promise<any[]> => {
  const [rows] = await db.execute(
    "SELECT * FROM 5dGames WHERE status != 0 AND game = ? ORDER BY id DESC LIMIT ?, ?",
    [game, offset, limit],
  );
  return rows as any[];
};

export const count5dHistory = async (db: Pool, game: number): Promise<number> => {
  const [rows] = await db.execute(
    "SELECT COUNT(*) as total FROM 5dGames WHERE status != 0 AND game = ?",
    [game],
  );
  return (rows as any[])[0]?.total || 0;
};

export const get5dCurrentPeriod = async (db: Pool, game: number): Promise<any | null> => {
  const [rows] = await db.execute(
    "SELECT period FROM 5dGames WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1",
    [game],
  );
  return (rows as any[])[0] || null;
};

export const getUserBets5d = async (
  db: Pool,
  phone: string,
  game: number,
  offset: number,
  limit: number,
): Promise<any[]> => {
  const [rows] = await db.execute(
    "SELECT * FROM result5dBets WHERE phone = ? AND game = ? ORDER BY id DESC LIMIT ?, ?",
    [phone, game, offset, limit],
  );
  return rows as any[];
};

export const countUserBets5d = async (db: Pool, phone: string, game: number): Promise<number> => {
  const [rows] = await db.execute(
    "SELECT COUNT(*) as total FROM result5dBets WHERE phone = ? AND game = ?",
    [phone, game],
  );
  return (rows as any[])[0]?.total || 0;
};

export const add5dPeriod = async (db: Pool, game: number): Promise<void> => {
  const joinMap: Record<number, string> = { 1: "k5d", 3: "k5d3", 5: "k5d5", 10: "k5d10" };
  const join = joinMap[game];

  const result2 = Array(5)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join("");
  const timeNow = Date.now();

  const [k5dRows] = await db.query(
    "SELECT period FROM 5dGames WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1",
    [game],
  );

  if ((k5dRows as any[]).length === 0) {
    await db.execute(
      "INSERT INTO 5dGames (period, result, game, status, createdAt) VALUES (?, ?, ?, ?, ?)",
      [10000, 0, game, 0, timeNow],
    );
    return;
  }

  const period = (k5dRows as any[])[0].period;

  const [settingRows] = await db.query("SELECT * FROM adminConfigs LIMIT 1");
  const setting = (settingRows as any[])[0];
  const nextResult = setting?.[join] || "-1";

  let newArr = "";
  let result = "";

  if (nextResult === "-1") {
    await db.execute("UPDATE 5dGames SET result = ?, status = ? WHERE period = ? AND game = ?", [
      result2,
      1,
      period,
      game,
    ]);
    newArr = "-1";
  } else {
    const arr = nextResult.split("|");
    if (arr.length === 1) {
      newArr = "-1";
    } else {
      newArr = arr.slice(1).join("|");
    }
    result = arr[0];
    await db.execute("UPDATE 5dGames SET result = ?, status = ? WHERE period = ? AND game = ?", [
      result,
      1,
      period,
      game,
    ]);
  }

  await db.execute(
    "INSERT INTO 5dGames (period, result, game, status, createdAt) VALUES (?, ?, ?, ?, ?)",
    [Number(period) + 1, 0, game, 0, timeNow],
  );

  await db.execute(`UPDATE adminConfigs SET ${join} = ?`, [newArr]);
};
// db/5d.queries.ts
import { BetRow, GameSessionRow } from "../types/admin.types";

export const get5DGameSessions = async (
  db: Pool,
  game: number,
  status: number = 0,
  limit: number = 10,
): Promise<GameSessionRow[]> => {
  const [rows] = await db.execute<GameSessionRow[]>(
    `SELECT gs.* FROM gameSessions gs
     JOIN gameTypes gt ON gs.gameTypeId = gt.id
     WHERE gt.code = '5d' AND gs.game = ? AND gs.status != ?
     ORDER BY gs.id DESC LIMIT ?`,
    [game, status, limit],
  );
  return rows;
};

export const getCurrent5DPeriod = async (db: Pool, game: number): Promise<string | null> => {
  const [rows] = await db.execute<[{ period: string }]>(
    `SELECT period FROM gameSessions gs
     JOIN gameTypes gt ON gs.gameTypeId = gt.id
     WHERE gt.code = '5d' AND gs.game = ? AND gs.status = 0
     ORDER BY gs.id DESC LIMIT 1`,
    [game],
  );
  return rows.length > 0 ? rows[0].period : null;
};

export const get5DWaitingBets = async (db: Pool, game: number): Promise<BetRow[]> => {
  const [rows] = await db.execute<BetRow[]>(
    `SELECT u.phone, b.betAmount as money, b.odds as price, b.betAmount as amount, b.selection as bet
     FROM bets b
     JOIN users u ON b.userId = u.id
     JOIN gameSessions gs ON b.sessionId = gs.id
     JOIN gameTypes gt ON gs.gameTypeId = gt.id
     WHERE gt.code = '5d' AND gs.game = ? AND b.status = 0 AND b.userLevel = 0
     ORDER BY b.id ASC`,
    [game],
  );
  return rows;
};

export const get5DAdminConfig = async (db: Pool, game: number): Promise<string | null> => {
  const configKey = `5d${game}_control`;
  const [rows] = await db.execute<[{ configValue: string }]>(
    "SELECT configValue FROM adminConfigs WHERE configKey = ?",
    [configKey],
  );
  return rows.length > 0 ? rows[0].configValue : null;
};

export const update5DAdminConfig = async (db: Pool, game: number, value: string): Promise<void> => {
  const configKey = `5d${game}_control`;
  await db.execute("UPDATE adminConfigs SET configValue = ? WHERE configKey = ?", [
    value,
    configKey,
  ]);
};
