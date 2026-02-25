// ============================================================================
// File: src/types/5d.types.ts
// ============================================================================

import { z } from 'zod';

// Bet Validation Schema
export const K5DBetSchema = z.object({
join: z.enum(['a', 'b', 'c', 'd', 'e', 'total']),
list_join: z.string().min(1).max(10),
x: z.string().regex(/^\d+$/, 'x must be a positive integer'),
money: z.number().int().positive(),
game: z.enum(['1', '3', '5', '10']),
});

// Game History Schema
export const K5DHistorySchema = z.object({
gameJoin: z.enum(['1', '3', '5', '10']),
pageno: z.number().int().min(0),
pageto: z.number().int().min(1),
});

// User Bets Schema
export const K5DMyBetsSchema = z.object({
gameJoin: z.enum(['1', '3', '5', '10']),
pageno: z.number().int().min(0),
pageto: z.number().int().min(1),
});

// Admin Edit Result Schema
export const K5DEditResultSchema = z.object({
game: z.number().int().min(1).max(10),
list: z.string(),
});

// TypeScript Types
export type K5DBetInput = z.infer<typeof K5DBetSchema>;
export type K5DHistoryInput = z.infer<typeof K5DHistorySchema>;
export type K5DMyBetsInput = z.infer<typeof K5DMyBetsSchema>;
export type K5DEditResultInput = z.infer<typeof K5DEditResultSchema>;

export interface K5DApiResponse<T = unknown> {
message: string;
status: boolean;
data?: T;
timeStamp?: number;
[key: string]: unknown;
}

export interface K5DGameSession {
id: number;
period: string;
gameTypeId: number;
result: string | null;
status: number;
startedAt: number;
closedAt: number | null;
resultAt: number | null;
}

export interface K5DBetRecord {
id: number;
sessionId: number;
userId: number;
gameTypeId: number;
stage: number;
betAmount: number;
potentialWin: number;
fee: number;
actualWin: number;
selection: string;
betType: string;
result: string | null;
isWin: boolean | null;
status: number;
createdAt: number;
}

export interface K5DBetCalculation {
total: number;
fee: number;
price: number;
}

export interface K5DResult {
message: string;
status: boolean;
money?: number;
change?: number;
}

export interface K5DHistoryResponse {
gameslist: K5DGameSession[];
period?: string;
page?: number;
}

export interface K5DMyBetsResponse {
gameslist: Partial<K5DBetRecord>[];
page: number;
}

// Bet type constants
export type K5DGameDuration = '1' | '3' | '5' | '10';
export type K5DPosition = 'a' | 'b' | 'c' | 'd' | 'e' | 'total';
export type K5DCategory = 'b' | 's' | 'c' | 'l'; // small, big, odd, even

export interface K5DUser {
id: number;
phone: string;
userName: string;
balance: number;
authToken: string;
userLevel: number;
invitedBy: number | null;
status: number;
}

export interface K5DCommissionLevel {
id: number;
level: number;
rateF1: number;
rateF2: number;
rateF3: number;
rateF4: number;
}

// ============================================================================
// File: src/utils/5d.helpers.ts
// ============================================================================

/\*\*

- Generate random 5-digit result (0-9 each digit)
  _/
  export const generate5DResult = (): string => {
  let result = '';
  for (let i = 0; i < 5; i++) {
  result += Math.floor(Math.random() _ 10).toString();
  }
  return result;
  };

/\*\*

- Calculate total sum of 5 digits
  \*/
  export const calculateTotal = (result: string): number => {
  return result.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  };

/\*\*

- Parse result string to array of digits
  \*/
  export const parseResult = (result: string): string[] => {
  return result.split('');
  };

/\*\*

- Check if digit is small (0-4)
  \*/
  export const isSmall = (digit: string): boolean => {
  const num = parseInt(digit, 10);
  return num >= 0 && num <= 4;
  };

/\*\*

- Check if digit is big (5-9)
  \*/
  export const isBig = (digit: string): boolean => {
  const num = parseInt(digit, 10);
  return num >= 5 && num <= 9;
  };

/\*\*

- Check if digit is even
  \*/
  export const isEven = (digit: string): boolean => {
  const num = parseInt(digit, 10);
  return num % 2 === 0;
  };

/\*\*

- Check if digit is odd
  \*/
  export const isOdd = (digit: string): boolean => {
  const num = parseInt(digit, 10);
  return num % 2 !== 0;
  };

/\*\*

- Check if total is small (0-22)
  \*/
  export const isTotalSmall = (total: number): boolean => {
  return total <= 22;
  };

/\*\*

- Check if total is big (23-45)
  \*/
  export const isTotalBig = (total: number): boolean => {
  return total > 22;
  };

/\*\*

- Format time in IST (Indian Standard Time)
  \*/
  export const formatTimeIST = (timestamp?: number): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  });
  };

/\*\*

- Get today's date string in YYYYMMDD format
  \*/
  export const getTodayString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
  };

/\*\*

- Generate product/transaction ID
  _/
  export const generateProductId = (): string => {
  const date = new Date();
  const years = String(date.getFullYear());
  const months = String(date.getMonth() + 1).padStart(2, '0');
  const days = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() _ 1000000000000000);
  return years + months + days + random;
  };

/\*\*

- Check if string is numeric
  \*/
  export const isNumber = (str: string): boolean => {
  return /^\d+$/.test(str);
  };

/\*\*

- Format timer join (helper for time formatting)
  \*/
  export const timerJoin = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
  };

/\*\*

- Validate if list_join contains only valid category characters or digits
  \*/
  export const validateListJoin = (listJoin: string, joinType: string): boolean => {
  if (joinType === 'total') {
  // For total, only category bets allowed (b, s, c, l)
  return /^[bscl]+$/.test(listJoin);
  }
  // For positions, can be specific digits (0-9) or categories (b, s, c, l)
  return /^[\dbscl]+$/.test(listJoin);
  };

/\*\*

- Get position index (0-4) from position character
  \*/
  export const getPositionIndex = (position: string): number => {
  const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
  return map[position] ?? -1;
  };

// ============================================================================
// File: src/middleware/5dAuth.middleware.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { K5DUser } from '../types/5d.types';

// Extend Express Request type
declare global {
namespace Express {
interface Request {
user?: K5DUser;
}
}
}

/\*\*

- Authentication middleware for 5D lottery routes
- Validates auth token and attaches user to request
  \*/
  export const k5dAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
  const authToken = req.headers.authorization?.replace('Bearer ', '') ||
  req.body.token ||
  req.query.token;

        if (!authToken) {
          res.status(401).json({
            message: 'Authentication required',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        const [rows] = await db.execute(
          'SELECT id, phone, userName, balance, authToken, userLevel, invitedBy, status FROM users WHERE authToken = ? LIMIT 1',
          [authToken]
        );

        const users = rows as K5DUser[];

        if (users.length === 0) {
          res.status(401).json({
            message: 'Invalid token',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        const user = users[0];

        if (user.status !== 0) {
          res.status(403).json({
            message: 'Account suspended or banned',
            status: false,
            timeStamp: Date.now(),
          });
          return;
        }

        req.user = user;
        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
          message: 'Internal server error',
          status: false,
          timeStamp: Date.now(),
        });
      }

  };
  };

// ============================================================================
// File: src/db/5d.queries.ts
// ============================================================================

import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { K5DGameSession, K5DBetRecord, K5DCommissionLevel } from '../types/5d.types';

// Game Session Queries

/\*\*

- Get current active game session
  \*/
  export const getCurrent5DSession = async (db: Pool, game: number): Promise<K5DGameSession | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
  `SELECT id, period, gameTypeId, result, status, startedAt, closedAt, resultAt 
     FROM gameSessions 
     WHERE gameTypeId = ? AND status IN (0, 1) 
     ORDER BY id DESC LIMIT 1`,
  [2] // gameTypeId for 5D is 2
  );

return rows.length > 0 ? (rows[0] as K5DGameSession) : null;
};

/\*\*

- Get latest completed result
  \*/
  export const getLatest5DResult = async (db: Pool, game: number): Promise<K5DGameSession | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
  `SELECT id, period, gameTypeId, result, status, startedAt, closedAt, resultAt 
     FROM gameSessions 
     WHERE gameTypeId = ? AND result IS NOT NULL 
     ORDER BY id DESC LIMIT 1`,
  [2]
  );

return rows.length > 0 ? (rows[0] as K5DGameSession) : null;
};

/\*\*

- Create new game session
  \*/
  export const create5DSession = async (db: Pool, period: string, game: number): Promise<number> => {
  const now = Date.now();
  const [result] = await db.execute<ResultSetHeader>(
  `INSERT INTO gameSessions (period, gameTypeId, result, status, startedAt, closedAt, resultAt, createdAt) 
     VALUES (?, ?, NULL, 1, ?, NULL, NULL, ?)`,
  [period, 2, now, now]
  );

return result.insertId;
};

/\*\*

- Update game result
  \*/
  export const update5DResult = async (db: Pool, period: string, result: string, game: number): Promise<void> => {
  const now = Date.now();
  await db.execute(
  `UPDATE gameSessions 
     SET result = ?, status = 3, resultAt = ? 
     WHERE period = ? AND gameTypeId = ?`,
  [result, now, period, 2]
  );
  };

/\*\*

- Get game history with pagination
  _/
  export const get5DHistory = async (
  db: Pool,
  game: number,
  page: number,
  limit: number
  ): Promise<K5DGameSession[]> => {
  const offset = page _ limit;
  const [rows] = await db.execute<RowDataPacket[]>(
  `SELECT id, period, gameTypeId, result, status, startedAt, closedAt, resultAt 
     FROM gameSessions 
     WHERE gameTypeId = ? AND result IS NOT NULL 
     ORDER BY id DESC 
     LIMIT ? OFFSET ?`,
  [2, limit, offset]
  );

return rows as K5DGameSession[];
};

/\*\*

- Initialize game if no session exists
  \*/
  export const initialize5DGame = async (db: Pool, game: number): Promise<void> => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const period = `${today}001`;

const [existing] = await db.execute<RowDataPacket[]>(
'SELECT id FROM gameSessions WHERE gameTypeId = ? AND period = ?',
[2, period]
);

if (existing.length === 0) {
await create5DSession(db, period, game);
}
};

// Bet Queries

/\*\*

- Create new bet record
  \*/
  export const create5DBet = async (db: Pool, betData: {
  sessionId: number;
  userId: number;
  gameTypeId: number;
  stage: number;
  betAmount: number;
  potentialWin: number;
  fee: number;
  selection: string;
  betType: string;
  }): Promise<number> => {
  const now = Date.now();
  const [result] = await db.execute<ResultSetHeader>(
  `INSERT INTO bets (sessionId, userId, gameTypeId, stage, betAmount, potentialWin, fee, actualWin, 
                       selection, betType, result, isWin, status, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NULL, NULL, 0, ?)`,
  [
  betData.sessionId,
  betData.userId,
  betData.gameTypeId,
  betData.stage,
  betData.betAmount,
  betData.potentialWin,
  betData.fee,
  betData.selection,
  betData.betType,
  now
  ]
  );

return result.insertId;
};

/\*\*

- Get user's bets with pagination
  _/
  export const getUser5DBets = async (
  db: Pool,
  userId: number,
  game: number,
  page: number,
  limit: number
  ): Promise<Partial<K5DBetRecord>[]> => {
  const offset = page _ limit;
  const [rows] = await db.execute<RowDataPacket[]>(
  `SELECT b.id, b.sessionId, b.stage, b.betAmount, b.potentialWin, b.fee, 
            b.actualWin, b.selection, b.betType, b.result, b.isWin, b.status, b.createdAt,
            gs.period
     FROM bets b
     JOIN gameSessions gs ON b.sessionId = gs.id
     WHERE b.userId = ? AND b.gameTypeId = ? 
     ORDER BY b.id DESC 
     LIMIT ? OFFSET ?`,
  [userId, 2, limit, offset]
  );

return rows as Partial<K5DBetRecord>[];
};

/\*\*

- Get pending bets for result processing
  \*/
  export const getPending5DBets = async (
  db: Pool,
  sessionId: number
  ): Promise<K5DBetRecord[]> => {
  const [rows] = await db.execute<RowDataPacket[]>(
  `SELECT id, sessionId, userId, gameTypeId, stage, betAmount, potentialWin, fee, 
            actualWin, selection, betType, result, isWin, status, createdAt
     FROM bets 
     WHERE sessionId = ? AND status = 0`,
  [sessionId]
  );

return rows as K5DBetRecord[];
};

/\*\*

- Update bet status
  \*/
  export const update5DBetStatus = async (
  db: Pool,
  betId: number,
  status: number,
  winAmount: number = 0,
  isWin: boolean = false
  ): Promise<void> => {
  await db.execute(
  `UPDATE bets 
     SET status = ?, actualWin = ?, isWin = ? 
     WHERE id = ?`,
  [status, winAmount, isWin, betId]
  );
  };

/\*\*

- Update bets by period with result
  \*/
  export const update5DBetsByPeriod = async (
  db: Pool,
  period: string,
  result: string
  ): Promise<void> => {
  await db.execute(
  `UPDATE bets b
     JOIN gameSessions gs ON b.sessionId = gs.id
     SET b.result = ?
     WHERE gs.period = ? AND b.gameTypeId = ?`,
  [result, period, 2]
  );
  };

// User Queries

/\*\*

- Find user by auth token
  \*/
  export const findUserByToken = async (db: Pool, token: string): Promise<K5DUser | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
  `SELECT id, phone, userName, balance, authToken, userLevel, invitedBy, status 
     FROM users WHERE authToken = ? LIMIT 1`,
  [token]
  );

return rows.length > 0 ? (rows[0] as K5DUser) : null;
};

/\*\*

- Update user balance (add or subtract)
  \*/
  export const updateUserBalance = async (db: Pool, userId: number, amount: number): Promise<void> => {
  await db.execute(
  'UPDATE users SET balance = balance + ?, updatedAt = ? WHERE id = ?',
  [amount, Date.now(), userId]
  );
  };

/\*\*

- Get user with lock for transaction
  \*/
  export const getUserWithLock = async (db: Pool, userId: number): Promise<K5DUser | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
  `SELECT id, phone, userName, balance, authToken, userLevel, invitedBy, status 
     FROM users WHERE id = ? FOR UPDATE`,
  [userId]
  );

return rows.length > 0 ? (rows[0] as K5DUser) : null;
};

// Commission Queries

/\*\*

- Get commission rates for level
  \*/
  export const getCommissionRates = async (db: Pool, level: number): Promise<K5DCommissionLevel | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
  'SELECT id, level, rateF1, rateF2, rateF3, rateF4 FROM commissionLevels WHERE level = ?',
  [level]
  );

return rows.length > 0 ? (rows[0] as K5DCommissionLevel) : null;
};

/\*\*

- Create commission record
  \*/
  export const createCommissionRecord = async (db: Pool, data: {
  userId: number;
  fromUserId: number;
  level: number;
  amount: number;
  sourceType: string;
  sourceId: number;
  }): Promise<void> => {
  const now = Date.now();
  await db.execute(
  `INSERT INTO commissionRecords (userId, fromUserId, level, amount, sourceType, sourceId, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [data.userId, data.fromUserId, data.level, data.amount, data.sourceType, data.sourceId, now]
  );
  };

/\*\*

- Get user's referrer chain
  \*/
  export const getReferrerChain = async (db: Pool, userId: number): Promise<Array<{id: number, level: number}>> => {
  const chain: Array<{id: number; level: number}> = [];
  let currentId = userId;
  let currentLevel = 0;

while (currentLevel < 4) {
const [rows] = await db.execute<RowDataPacket[]>(
'SELECT invitedBy FROM users WHERE id = ?',
[currentId]
);

    if (rows.length === 0 || !rows[0].invitedBy) break;

    currentId = rows[0].invitedBy;
    currentLevel++;
    chain.push({ id: currentId, level: currentLevel });

}

return chain;
};

// Settings Queries

/\*\*

- Get 5D control settings
  \*/
  export const get5DControlSettings = async (db: Pool, game: number): Promise<string | null> => {
  const configKey = `5d${game}_control`;
  const [rows] = await db.execute<RowDataPacket[]>(
  'SELECT configValue FROM adminConfigs WHERE configKey = ?',
  [configKey]
  );

return rows.length > 0 ? rows[0].configValue : null;
};

/\*\*

- Update 5D control settings
  \*/
  export const update5DControlSettings = async (db: Pool, game: number, value: string): Promise<void> => {
  const configKey = `5d${game}_control`;
  const now = Date.now();

await db.execute(
`INSERT INTO adminConfigs (configKey, configValue, description, updatedAt) 
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE configValue = ?, updatedAt = ?`,
[configKey, value, `5D ${game} minute game control`, now, value, now]
);
};

// Helper Functions

/\*\*

- Calculate 5D total
  \*/
  export const calculate5DTotal = (result: string): number => {
  return result.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  };

/\*\*

- Parse 5D result to array
  \*/
  export const parse5DResult = (result: string): string[] => {
  return result.split('');
  };

// ============================================================================
// File: src/services/5d/5dBet.service.ts
// ============================================================================

import { Pool } from 'mysql2/promise';
import { K5DBetCalculation, K5DBetRecord, K5DPosition } from '../../types/5d.types';
import { validateListJoin, getPositionIndex } from '../../utils/5d.helpers';
import { create5DBet, getUserWithLock, updateUserBalance, getReferrerChain, getCommissionRates, createCommissionRecord } from '../../db/5d.queries';

const VALID_MONEY_VALUES = [1, 10, 100, 1000];
const FEE_RATE = 0.02;
const MIN_COMMISSION_BET = 10000;

/\*\*

- Validate bet selection based on position and list
  \*/
  export const validateBetSelection = (join: string, listJoin: string, game: number): boolean => {
  // Validate join type
  const validPositions: K5DPosition[] = ['a', 'b', 'c', 'd', 'e', 'total'];
  if (!validPositions.includes(join as K5DPosition)) {
  return false;
  }

// Validate list_join format
if (!validateListJoin(listJoin, join)) {
return false;
}

// Validate money values in list_join for specific number bets
if (join !== 'total') {
// Check if contains specific digits (0-9)
const hasDigits = /\d/.test(listJoin);
const hasCategories = /[bscl]/.test(listJoin);

    // Cannot mix digits and categories
    if (hasDigits && hasCategories) {
      return false;
    }

}

return true;
};

/\*\*

- Calculate bet amount breakdown
  _/
  export const calculateBetAmount = (
  join: string,
  listJoin: string,
  money: number,
  x: number
  ): K5DBetCalculation => {
  const selectionCount = listJoin.length;
  const total = money _ x _ selectionCount;
  const fee = Math.floor(total _ FEE_RATE);
  const price = total - fee;

return { total, fee, price };
};

/\*\*

- Calculate potential win amount
  \*/
  export const calculateWinAmount = (
  betType: string,
  selection: string,
  result: string,
  betAmount: number
  ): number => {
  // Parse result
  const digits = result.split('');

if (betType === 'total') {
const total = digits.reduce((sum, d) => sum + parseInt(d, 10), 0);

    // Check category bets
    for (const char of selection) {
      let won = false;
      switch (char) {
        case 'b': // small
          won = total <= 22;
          break;
        case 's': // big
          won = total > 22;
          break;
        case 'l': // even
          won = total % 2 === 0;
          break;
        case 'c': // odd
          won = total % 2 !== 0;
          break;
      }
      if (won) return betAmount * 2;
    }

} else {
// Position bet
const positionMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
const pos = positionMap[betType];
const digit = digits[pos];

    for (const char of selection) {
      if (char === digit) {
        // Specific number match - 9x payout
        return betAmount * 9;
      }

      let won = false;
      const num = parseInt(digit, 10);

      switch (char) {
        case 'b': // small (0-4)
          won = num >= 0 && num <= 4;
          break;
        case 's': // big (5-9)
          won = num >= 5 && num <= 9;
          break;
        case 'l': // even
          won = num % 2 === 0;
          break;
        case 'c': // odd
          won = num % 2 !== 0;
          break;
      }

      if (won) return betAmount * 2;
    }

}

return 0;
};

/\*\*

- Process 5D bet placement
  \*/
  export const process5DBet = async (
  db: Pool,
  userId: number,
  betData: {
  join: string;
  list_join: string;
  x: string;
  money: number;
  game: string;
  sessionId: number;
  stage: number;
  }
  ): Promise<K5DBetRecord> => {
  const connection = await db.getConnection();

try {
await connection.beginTransaction();

    // Lock user row
    const [userRows] = await connection.execute(
      'SELECT id, balance, invitedBy FROM users WHERE id = ? FOR UPDATE',
      [userId]
    );

    if ((userRows as any[]).length === 0) {
      throw new Error('User not found');
    }

    const user = (userRows as any[])[0];
    const x = parseInt(betData.x, 10);

    // Calculate amounts
    const { total, fee, price } = calculateBetAmount(
      betData.join,
      betData.list_join,
      betData.money,
      x
    );

    // Check balance
    if (user.balance < total) {
      throw new Error('Insufficient balance');
    }

    // Deduct balance
    await connection.execute(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [total, userId]
    );

    // Create bet record
    const [betResult] = await connection.execute(
      `INSERT INTO bets (sessionId, userId, gameTypeId, stage, betAmount, potentialWin, fee,
                         actualWin, selection, betType, result, isWin, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NULL, NULL, 0, ?)`,
      [
        betData.sessionId,
        userId,
        2, // gameTypeId for 5D
        betData.stage,
        total,
        price * 9, // Max potential win
        fee,
        betData.list_join,
        betData.join,
        Date.now()
      ]
    );

    const betId = (betResult as any).insertId;

    // Distribute commission if bet >= 10000
    if (total >= MIN_COMMISSION_BET) {
      await distributeCommission(connection, userId, total, betId);
    }

    await connection.commit();

    // Return created bet
    return {
      id: betId,
      sessionId: betData.sessionId,
      userId,
      gameTypeId: 2,
      stage: betData.stage,
      betAmount: total,
      potentialWin: price * 9,
      fee,
      actualWin: 0,
      selection: betData.list_join,
      betType: betData.join,
      result: null,
      isWin: null,
      status: 0,
      createdAt: Date.now(),
    };

} catch (error) {
await connection.rollback();
throw error;
} finally {
connection.release();
}
};

/\*\*

- Distribute commission to referrer chain
  \*/
  const distributeCommission = async (
  connection: any,
  userId: number,
  betAmount: number,
  betId: number
  ): Promise<void> => {
  // Get referrer chain
  const chain: Array<{id: number; level: number}> = [];
  let currentId = userId;

for (let i = 0; i < 4; i++) {
const [rows] = await connection.execute(
'SELECT invitedBy FROM users WHERE id = ?',
[currentId]
);

    if ((rows as any[]).length === 0 || !(rows as any[])[0].invitedBy) break;
    currentId = (rows as any[])[0].invitedBy;
    chain.push({ id: currentId, level: i + 1 });

}

if (chain.length === 0) return;

// Get commission rates for level 0 (default)
const [levelRows] = await connection.execute(
'SELECT rateF1, rateF2, rateF3, rateF4 FROM commissionLevels WHERE level = 0'
);

if ((levelRows as any[]).length === 0) return;

const rates = (levelRows as any[])[0];

// Distribute to each level
for (const ref of chain) {
const rateKey = `rateF${ref.level}` as keyof typeof rates;
const rate = rates[rateKey] as number;

    if (!rate || rate <= 0) continue;

    const commission = (betAmount / 100) * rate;

    if (commission <= 0) continue;

    // Create commission record
    await connection.execute(
      `INSERT INTO commissionRecords (userId, fromUserId, level, amount, sourceType, sourceId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ref.id, userId, ref.level, commission, 'bet', betId, Date.now()]
    );

    // Update referrer balance
    await connection.execute(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [commission, ref.id]
    );

}
};

// ============================================================================
// File: src/services/5d/5dResult.service.ts
// ============================================================================

import { Pool } from 'mysql2/promise';
import { K5DBetRecord } from '../../types/5d.types';
import { generate5DResult, calculateTotal, isSmall, isBig, isEven, isOdd, isTotalSmall, isTotalBig } from '../../utils/5d.helpers';
import { getPending5DBets, update5DBetStatus, update5DResult, get5DControlSettings } from '../../db/5d.queries';

/\*\*

- Generate random 5-digit result
  _/
  export const generate5DResult = (): string => {
  let result = '';
  for (let i = 0; i < 5; i++) {
  result += Math.floor(Math.random() _ 10).toString();
  }
  return result;
  };

/\*\*

- Evaluate position bet (a, b, c, d, e)
  \*/
  export const evaluatePositionBet = (
  bet: K5DBetRecord,
  result: string[],
  position: string
  ): boolean => {
  const posMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
  const pos = posMap[position];
  const digit = result[pos];

for (const char of bet.selection) {
// Specific number match
if (char === digit) return true;

    // Category checks
    switch (char) {
      case 'b': // small
        if (isSmall(digit)) return true;
        break;
      case 's': // big
        if (isBig(digit)) return true;
        break;
      case 'l': // even
        if (isEven(digit)) return true;
        break;
      case 'c': // odd
        if (isOdd(digit)) return true;
        break;
    }

}

return false;
};

/\*\*

- Evaluate total bet
  \*/
  export const evaluateTotalBet = (bet: K5DBetRecord, total: number): boolean => {
  for (const char of bet.selection) {
  switch (char) {
  case 'b': // small (0-22)
  if (isTotalSmall(total)) return true;
  break;
  case 's': // big (23-45)
  if (isTotalBig(total)) return true;
  break;
  case 'l': // even
  if (total % 2 === 0) return true;
  break;
  case 'c': // odd
  if (total % 2 !== 0) return true;
  break;
  }
  }

return false;
};

/\*\*

- Calculate win amount for a bet
  \*/
  export const calculateBetWinAmount = (bet: K5DBetRecord, result: string): number => {
  const digits = result.split('');
  const { price } = calculatePriceFromBet(bet);

if (bet.betType === 'total') {
const total = calculateTotal(result);

    for (const char of bet.selection) {
      let won = false;
      switch (char) {
        case 'b': won = isTotalSmall(total); break;
        case 's': won = isTotalBig(total); break;
        case 'l': won = total % 2 === 0; break;
        case 'c': won = total % 2 !== 0; break;
      }
      if (won) return price * 2;
    }

} else {
const posMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
const pos = posMap[bet.betType];
const digit = digits[pos];

    for (const char of bet.selection) {
      if (char === digit) return price * 9; // Specific number

      let won = false;
      switch (char) {
        case 'b': won = isSmall(digit); break;
        case 's': won = isBig(digit); break;
        case 'l': won = isEven(digit); break;
        case 'c': won = isOdd(digit); break;
      }
      if (won) return price * 2;
    }

}

return 0;
};

/\*\*

- Helper to calculate price from bet record
  \*/
  const calculatePriceFromBet = (bet: K5DBetRecord): { total: number; fee: number; price: number } => {
  const fee = bet.fee;
  const total = bet.betAmount;
  const price = total - fee;
  return { total, fee, price };
  };

/\*\*

- Process 5D results - evaluate all pending bets
  \*/
  export const process5DResults = async (db: Pool, sessionId: number, result: string): Promise<void> => {
  const bets = await getPending5DBets(db, sessionId);

for (const bet of bets) {
const winAmount = calculateBetWinAmount(bet, result);
const isWin = winAmount > 0;

    // Status: 0=pending, 1=won, 2=lost
    const status = isWin ? 0 : 2; // Keep as 0 for payout processing, 2 for lost

    await update5DBetStatus(db, bet.id, status, isWin ? winAmount : 0, isWin);

}
};

// ============================================================================
// File: src/services/5d/5dPayout.service.ts
// ============================================================================

import { Pool } from 'mysql2/promise';
import { K5DBetRecord } from '../../types/5d.types';
import { getPending5DBets, update5DBetStatus, updateUserBalance } from '../../db/5d.queries';
import { calculateBetWinAmount } from './5dResult.service';

/\*\*

- Calculate payout for a bet
  \*/
  export const calculatePayout = (bet: K5DBetRecord, result: string): number => {
  return calculateBetWinAmount(bet, result);
  };

/\*\*

- Process payouts for winning bets
  \*/
  export const process5DPayouts = async (db: Pool, sessionId: number, result: string): Promise<void> => {
  const connection = await db.getConnection();

try {
await connection.beginTransaction();

    // Get all pending bets (status=0 means evaluated but not paid)
    const [bets] = await connection.execute(
      `SELECT id, userId, betAmount, fee, selection, betType, isWin, actualWin
       FROM bets WHERE sessionId = ? AND status = 0`,
      [sessionId]
    );

    for (const bet of bets as any[]) {
      if (bet.isWin && bet.actualWin > 0) {
        // Update bet status to won (1)
        await connection.execute(
          'UPDATE bets SET status = 1 WHERE id = ?',
          [bet.id]
        );

        // Add winnings to user balance
        await connection.execute(
          'UPDATE users SET balance = balance + ? WHERE id = ?',
          [bet.actualWin, bet.userId]
        );
      }
    }

    await connection.commit();

} catch (error) {
await connection.rollback();
throw error;
} finally {
connection.release();
}
};

/\*\*

- Pay winning bets (batch process)
  \*/
  export const payWinningBets = async (db: Pool, bets: K5DBetRecord[]): Promise<void> => {
  for (const bet of bets) {
  if (bet.isWin && bet.actualWin > 0) {
  await update5DBetStatus(db, bet.id, 1, bet.actualWin, true);
  await updateUserBalance(db, bet.userId, bet.actualWin);
  }
  }
  };

// ============================================================================
// File: src/services/5d/5dGame.service.ts
// ============================================================================

import { Pool } from 'mysql2/promise';
import { getCurrent5DSession, create5DSession, update5DResult, get5DControlSettings } from '../../db/5d.queries';
import { generate5DResult } from '../../utils/5d.helpers';
import { process5DResults } from './5dResult.service';
import { process5DPayouts } from './5dPayout.service';

/\*\*

- Handle 5D game cycle
  \*/
  export const handle5DGame = async (db: Pool, typeId: number): Promise<void> => {
  // Get current session
  const session = await getCurrent5DSession(db, typeId);

if (!session) {
// Initialize new game
await add5DPeriod(db, typeId);
return;
}

// If session is closed but no result, generate result
if (session.status === 2 && !session.result) {
const result = await getPredefinedResult(db, typeId) || generate5DResult();

    // Update result
    await update5DResult(db, session.period, result, typeId);

    // Process results
    await process5DResults(db, session.id, result);

    // Process payouts
    await process5DPayouts(db, session.id, result);

    // Create new period
    await add5DPeriod(db, typeId);

}
};

/\*\*

- Add new 5D period
  \*/
  export const add5DPeriod = async (db: Pool, game: number): Promise<void> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

// Get last period number
const [rows] = await db.execute(
`SELECT period FROM gameSessions 
     WHERE gameTypeId = ? AND period LIKE ? 
     ORDER BY id DESC LIMIT 1`,
[2, `${dateStr}%`]
);

let periodNumber = 1;
if ((rows as any[]).length > 0) {
const lastPeriod = (rows as any[])[0].period;
const lastNum = parseInt(lastPeriod.slice(-3), 10);
periodNumber = lastNum + 1;
}

const period = `${dateStr}${String(periodNumber).padStart(3, '0')}`;
await create5DSession(db, period, game);
};

/\*\*

- Get predefined result from admin settings
  \*/
  export const getPredefinedResult = async (db: Pool, game: number): Promise<string | null> => {
  const settings = await get5DControlSettings(db, game);

if (!settings) return null;

const parts = settings.split('|');
if (parts.length === 0) return null;

const nextResult = parts[0];

if (nextResult === '-1') return null;

// Update settings (remove used result)
const newSettings = parts.slice(1).join('|') || '-1';
await update5DControlSettings(db, game, newSettings);

return nextResult;
};

// ============================================================================
// File: src/controllers/5d/bet5d.controller.ts
// ============================================================================

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

// ============================================================================
// File: src/controllers/5d/listOrderOld.controller.ts
// ============================================================================

import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { K5DHistorySchema, K5DApiResponse, K5DHistoryResponse } from '../../types/5d.types';
import { get5DHistory, getCurrent5DSession, get5DControlSettings } from '../../db/5d.queries';

/\*\*

- Handler for getting 5D game history
  \*/
  export const listOrderOld5dHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  try {
  // 1. Validate input
  const validationResult = K5DHistorySchema.safeParse(req.body);

      if (!validationResult.success) {
        const response: K5DApiResponse = {
          message: 'Invalid parameters',
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      const { gameJoin, pageno, pageto } = validationResult.data;

      // 2. Get game history
      const history = await get5DHistory(db, parseInt(gameJoin), pageno, pageto);

      // 3. Get current period
      const currentSession = await getCurrent5DSession(db, parseInt(gameJoin));
      const currentPeriod = currentSession?.period || '';

      // 4. Get settings
      const settings = await get5DControlSettings(db, parseInt(gameJoin));

      const response: K5DApiResponse<K5DHistoryResponse> = {
        code: 0,
        msg: 'Get success',
        data: {
          gameslist: history,
        },
        period: currentPeriod,
        page: pageno,
        status: true,
      };

      res.json(response);

} catch (error) {
console.error('History fetch error:', error);
const response: K5DApiResponse = {
message: 'Internal server error',
status: false,
timeStamp: Date.now(),
};
res.status(500).json(response);
}
};

// ============================================================================
// File: src/controllers/5d/getMyEmerdList.controller.ts
// ============================================================================

import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { K5DMyBetsSchema, K5DApiResponse, K5DMyBetsResponse } from '../../types/5d.types';
import { getUser5DBets } from '../../db/5d.queries';

/\*\*

- Handler for getting user's 5D bet history
  \*/
  export const getMyEmerdList5dHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  try {
  // 1. Validate input
  const validationResult = K5DMyBetsSchema.safeParse(req.body);

      if (!validationResult.success) {
        const response: K5DApiResponse = {
          message: 'Invalid parameters',
          status: false,
          timeStamp: Date.now(),
        };
        res.status(400).json(response);
        return;
      }

      const { gameJoin, pageno, pageto } = validationResult.data;

      // 2. Get authenticated user
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

      // 3. Get user's bets
      const bets = await getUser5DBets(db, user.id, parseInt(gameJoin), pageno, pageto);

      const response: K5DApiResponse<K5DMyBetsResponse> = {
        code: 0,
        msg: 'Get success',
        data: {
          gameslist: bets,
          page: pageno,
        },
        status: true,
      };

      res.json(response);

} catch (error) {
console.error('My bets fetch error:', error);
const response: K5DApiResponse = {
message: 'Internal server error',
status: false,
timeStamp: Date.now(),
};
res.status(500).json(response);
}
};

// ============================================================================
// File: src/controllers/5d/add5d.controller.ts
// ============================================================================

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

// ============================================================================
// File: src/controllers/admin/5d.controller.ts (Admin Controller)
// ============================================================================

import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { K5DEditResultSchema, K5DApiResponse } from '../../types/5d.types';
import { get5DHistory, getCurrent5DSession, update5DControlSettings } from '../../db/5d.queries';

/\*\*

- Create 5D admin controller
  \*/
  export const create5DController = (db: Pool) => ({
  /\*\*
  - List historical results (admin view)
    \*/
    listOrderOld: async (req: Request, res: Response): Promise<void> => {
    try {
    const { gameJoin, pageno, pageto } = req.body;

        const history = await get5DHistory(db, parseInt(gameJoin), pageno, pageto);
        const currentSession = await getCurrent5DSession(db, parseInt(gameJoin));

        const response: K5DApiResponse = {
          code: 0,
          msg: 'Get success',
          data: {
            gameslist: history,
          },
          period: currentSession?.period || '',
          page: pageno,
          status: true,
        };

        res.json(response);

    } catch (error) {
    console.error('Admin list error:', error);
    res.status(500).json({
    message: 'Internal server error',
    status: false,
    });
    }
    },

/\*\*

- Edit result settings (predefined results)
  \*/
  editResult: async (req: Request, res: Response): Promise<void> => {
  try {
  const validationResult = K5DEditResultSchema.safeParse(req.body);

        if (!validationResult.success) {
          res.status(400).json({
            message: 'Invalid parameters',
            status: false,
          });
          return;
        }

        const { game, list } = validationResult.data;

        // Validate list format (pipe-separated 5-digit numbers or -1)
        const parts = list.split('|');
        const isValid = parts.every(part =>
          part === '-1' || (/^\d{5}$/.test(part) && part.split('').every(d => parseInt(d) >= 0 && parseInt(d) <= 9))
        );

        if (!isValid) {
          res.status(400).json({
            message: 'Invalid result format. Use 5-digit numbers or -1 separated by |',
            status: false,
          });
          return;
        }

        await update5DControlSettings(db, game, list);

        res.json({
          message: 'Settings updated successfully',
          status: true,
        });
      } catch (error) {
        console.error('Edit result error:', error);
        res.status(500).json({
          message: 'Internal server error',
          status: false,
        });
      }

  },
  });

// ============================================================================
// File: src/routes/5d.routes.ts
// ============================================================================

import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { create5DController } from '../controllers/admin/5d.controller';
import { bet5dHandler } from '../controllers/5d/bet5d.controller';
import { listOrderOld5dHandler } from '../controllers/5d/listOrderOld.controller';
import { getMyEmerdList5dHandler } from '../controllers/5d/getMyEmerdList.controller';
import { add5dHandler } from '../controllers/5d/add5d.controller';
import { k5dAuthMiddleware } from '../middleware/5dAuth.middleware';

// Simple admin auth middleware (placeholder - implement based on your auth system)
const createAdminAuthMiddleware = (db: Pool) => {
return async (req: any, res: any, next: any) => {
// Implement admin authentication logic
// Check if user is admin (level 1)
next();
};
};

export const create5dRoutes = (db: Pool): Router => {
const router = Router();
const adminAuth = createAdminAuthMiddleware(db);

// User routes (require user auth)
router.post('/bet', k5dAuthMiddleware(db), bet5dHandler(db));
router.post('/history', k5dAuthMiddleware(db), listOrderOld5dHandler(db));
router.post('/my-bets', k5dAuthMiddleware(db), getMyEmerdList5dHandler(db));

// Admin routes (require admin auth)
router.use(adminAuth);
router.post('/listOrderOld', create5DController(db).listOrderOld);
router.post('/editResult', create5DController(db).editResult);

// Game management (internal)
router.post('/admin/add-period', async (req, res) => {
try {
const { game } = req.body;
await add5dHandler(db)(parseInt(game));
res.json({ success: true });
} catch (error) {
res.status(500).json({ success: false, error: 'Failed to add period' });
}
});

return router;
};

// ============================================================================
// Export routes for web.ts
// ============================================================================
export { create5dRoutes as default };
