import { Pool } from "mysql2/promise";

export interface K3ResultInfo {
  result: string;
}

export interface BetRecord {
  id: number;
  bet: string;
}

export const getLatestK3Result = async (db: Pool, game: number): Promise<K3ResultInfo> => {
  const [rows] = await db.query(
    `SELECT * FROM k3 WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1`,
  );
  return (rows as K3ResultInfo[])[0];
};

export const updateBetResult = async (db: Pool, id: number, result: string): Promise<void> => {
  await db.execute(`UPDATE result_k3 SET result = ? WHERE status = 0 AND game = ?`, [result, id]);
};

export const getPendingBetsByType = async (
  db: Pool,
  game: number,
  typeGame: string,
): Promise<BetRecord[]> => {
  const [rows] = await db.execute(
    `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = '${typeGame}'`,
  );
  return rows as BetRecord[];
};

export const markBetAsLost = async (db: Pool, id: number): Promise<void> => {
  await db.execute(`UPDATE result_k3 SET status = 2 WHERE id = ?`, [id]);
};

export const resetBetStatus = async (db: Pool, id: number): Promise<void> => {
  await db.execute(`UPDATE result_k3 SET status = 0 WHERE id = ?`, [id]);
};

// ============================================================================
// RESULT CALCULATION HELPERS
// ============================================================================

export const calculateTotal = (result: string): number => {
  const digits = String(result).split("");
  return digits.reduce((sum, digit) => sum + Number(digit), 0);
};

export const getResultDigits = (result: string): string[] => {
  return String(result).split("");
};

export const getResultPairs = (result: string): string[] => {
  const digits = getResultDigits(result);
  return [digits[0] + digits[1], digits[1] + digits[2], digits[0] + digits[2]];
};

const handleTotalBets = async (
  db: Pool,
  game: number,
  total: number,
  result: string,
): Promise<void> => {
  const bets = await getPendingBetsByType(db, game, "total");

  for (const bet of bets) {
    const selections = bet.bet.split(",");

    // Check specific number bets
    const winningSelections = selections.filter((s) => s === String(total));

    // Check category bets
    let isSmall = total >= 3 && total <= 10 && selections.includes("s");
    let isBig = total >= 11 && total <= 18 && selections.includes("b");
    let isEven = total % 2 === 0 && selections.includes("c");
    let isOdd = total % 2 !== 0 && selections.includes("l");

    // If no winning condition met, mark as lost
    if (!isSmall && !isBig && !isEven && !isOdd && winningSelections.length === 0) {
      await markBetAsLost(db, bet.id);
    }

    // If has winning number selections, keep/reset status
    if (winningSelections.length >= 1) {
      await resetBetStatus(db, bet.id);
    }
  }
};

const handleTwoSameBets = async (
  db: Pool,
  game: number,
  resultInfo: K3ResultInfo,
): Promise<void> => {
  const bets = await getPendingBetsByType(db, game, "two-same");
  const resultDigits = getResultDigits(resultInfo.result);
  const resultPairs = getResultPairs(resultInfo.result);

  for (const bet of bets) {
    const parts = bet.bet.split("@");
    const id = bet.id;

    const hasPairSelection = parts[0].length > 0;
    const hasUniqueSelection = parts[1].length > 0;

    if (hasPairSelection && hasUniqueSelection) {
      // Both selections present
      const pairArray = parts[0].split(",");
      const uniquePairs = parts[1].split("&");

      let pairLost = false;
      let uniqueLost = false;

      // Check pair matches
      const pairMatch1 = pairArray.includes(resultPairs[0]);
      const pairMatch2 = pairArray.includes(resultPairs[1]);
      if (!pairMatch1 && !pairMatch2) {
        pairLost = true;
      }

      // Check unique selections
      for (const uniquePair of uniquePairs) {
        const [pair, digits] = uniquePair.split("|");
        const digitArray = digits.split(",");

        const matchPair0 = pair.includes(resultPairs[0]);
        const matchPair1 = pair.includes(resultPairs[1]);

        if (!matchPair0 && !matchPair1) {
          uniqueLost = true;
        } else if (matchPair0 && !matchPair1) {
          if (!digitArray.includes(resultDigits[2])) uniqueLost = true;
        } else if (!matchPair0 && matchPair1) {
          if (!digitArray.includes(resultDigits[0])) uniqueLost = true;
        }
      }

      if (pairLost && uniqueLost) {
        await markBetAsLost(db, id);
      }
    } else if (hasPairSelection && !hasUniqueSelection) {
      // Only pair selection
      const pairArray = parts[0].split(",");
      const match1 = pairArray.includes(resultPairs[0]);
      const match2 = pairArray.includes(resultPairs[1]);

      if (!match1 && !match2) {
        await markBetAsLost(db, id);
      }
    } else if (!hasPairSelection && hasUniqueSelection) {
      // Only unique selection
      const uniquePairs = parts[1].split("&");
      let hasWin = false;

      for (const uniquePair of uniquePairs) {
        const [pair, digits] = uniquePair.split("|");
        const digitArray = digits.split(",");

        const matchPair0 = pair.includes(resultPairs[0]);
        const matchPair1 = pair.includes(resultPairs[1]);
        const matchDigit0 = digitArray.includes(resultDigits[0]);
        const matchDigit2 = digitArray.includes(resultDigits[2]);

        if ((matchPair0 && matchDigit2) || (matchPair1 && matchDigit0)) {
          hasWin = true;
        }
      }

      if (!hasWin) {
        await markBetAsLost(db, id);
      }
    }
  }
};

const handleThreeSameBets = async (
  db: Pool,
  game: number,
  resultInfo: K3ResultInfo,
): Promise<void> => {
  const bets = await getPendingBetsByType(db, game, "three-same");
  const result = String(resultInfo.result);
  const tripleNumbers = ["111", "222", "333", "444", "555", "666"];

  for (const bet of bets) {
    const parts = bet.bet.split("@");
    const id = bet.id;

    const hasUnique = parts[0].length > 0;
    const hasTriple = parts[1].length > 0;

    if (hasUnique && hasTriple) {
      // Both selections
      const uniqueArray = parts[0].split(",");
      const isUniqueWin = uniqueArray.includes(result);
      const isTripleWin = tripleNumbers.includes(result);

      if (!isUniqueWin && !isTripleWin) {
        await markBetAsLost(db, id);
      }
    } else if (hasUnique && !hasTriple) {
      // Only unique
      const uniqueArray = parts[0].split(",");
      if (!uniqueArray.includes(result)) {
        await markBetAsLost(db, id);
      }
    } else if (!hasUnique && hasTriple) {
      // Only triple
      if (!tripleNumbers.includes(result)) {
        await markBetAsLost(db, id);
      }
    }
  }
};

const handleUnlikeBets = async (
  db: Pool,
  game: number,
  resultInfo: K3ResultInfo,
): Promise<void> => {
  const bets = await getPendingBetsByType(db, game, "unlike");
  const resultDigits = getResultDigits(resultInfo.result);
  const resultPairs = getResultPairs(resultInfo.result);
  const consecutivePairs = ["11", "22", "33", "44", "55", "66"];

  for (const bet of bets) {
    const parts = bet.bet.split("@");
    const id = bet.id;

    const hasFirst = parts[0].length > 1;
    const hasMiddle = parts[1] === "u" || parts[1] === "y";
    const hasLast = parts[2].length > 1;

    // Full combination: first + consecutive + last
    if (hasFirst && parts[1] === "u" && hasLast) {
      const firstArray = parts[0].split(",");
      const lastArray = parts[2].split(",");

      let firstWin = false;
      let consecutiveWin = false;
      let lastWin = false;

      for (const digit of resultDigits) {
        if (firstArray.includes(digit)) firstWin = true;
        if (lastArray.includes(digit)) lastWin = true;
      }

      for (const pair of resultPairs) {
        if (consecutivePairs.includes(pair)) consecutiveWin = true;
      }

      if (firstWin && consecutiveWin && lastWin) {
        await markBetAsLost(db, id);
      }
    }
  }
};
export const processK3Results =
  (db: Pool) =>
  async (game: number): Promise<void> => {
    try {
      // Get latest result
      const resultInfo = await getLatestK3Result(db, game);

      // Update bet results
      await updateBetResult(db, game, resultInfo.result);

      // Calculate total
      const total = calculateTotal(resultInfo.result);

      // Process each bet type
      await handleTotalBets(db, game, total, resultInfo.result);
      await handleTwoSameBets(db, game, resultInfo);
      await handleThreeSameBets(db, game, resultInfo);
      await handleUnlikeBets(db, game, resultInfo);
    } catch (error) {
      // Silent fail as per original
      if (error) {
        // Error handling intentionally left empty per original code
      }
    }
  };
