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
