import { K3_CONFIG } from "src/config/config";
export const calculateCommission = (amount: number, rate: number): number => {
  return (amount / 100) * rate;
};

export const shouldDistributeCommission = (betAmount: number): boolean => {
  return betAmount >= K3_CONFIG.MINIMUM_BET_FOR_COMMISSION;
};

import {
  K3_BET_AMOUNTS,
  K3_GAME_DURATIONS,
  K3_JOIN_TYPES,
  K3_NUMBER_BETS,
  K3_STRING_BETS,
  K3BetAmount,
  K3BetType,
  K3BetValidationResult,
  K3GameDuration,
  K3GameJoin,
  K3JoinType,
  K3NumberBet,
  K3StringBet,
} from "../../types/k3.type";

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const isNumeric = (value: string): boolean => /^\d+$/.test(value);

const parseBetList = (listJoin: string): string[] => {
  return listJoin.split("");
};

const determineBetType = (listJoin: string): K3BetType => {
  return isNumeric(listJoin) ? "number" : "string";
};

// ============================================================================
// INDIVIDUAL VALIDATORS
// ============================================================================

const validateJoinType = (join: string): boolean => {
  return K3_JOIN_TYPES.includes(join as K3JoinType);
};

const validateGameDuration = (game: K3GameDuration): boolean => {
  return K3_GAME_DURATIONS.includes(game);
};

const validateBetAmount = (money: K3BetAmount): boolean => {
  return K3_BET_AMOUNTS.includes(money);
};

const validateMultiplier = (x: string): boolean => {
  return isNumeric(x) && parseInt(x) > 0;
};

const validateListJoinLength = (listJoin: string): boolean => {
  return listJoin.length > 0 && listJoin.length <= 10;
};

const validateNumberBets = (bets: K3NumberBet[]): boolean => {
  return bets.every((bet) => K3_NUMBER_BETS.includes(bet));
};

const validateStringBets = (bets: K3StringBet[]): boolean => {
  return bets.every((bet) => K3_STRING_BETS.includes(bet));
};

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validates K3 bet input
 * @param join - Bet category (a, b, c, d, e, total)
 * @param listJoin - Comma-separated or individual bet selections
 * @param multiplier - Bet multiplier (x)
 * @param money - Bet amount (1000, 10000, 100000, 1000000)
 * @param game - Game duration in minutes (1, 3, 5, 10)
 * @returns Validation result with details
 */
export const validateK3Bet = (
  join: string,
  listJoin: K3NumberBet[],
  multiplier: string,
  money: K3BetAmount,
  game: K3GameDuration,
): K3BetValidationResult => {
  const errors: string[] = [];

  // Validate join type
  if (!validateJoinType(join)) {
    errors.push(`Invalid join type: ${join}. Must be one of: ${K3_JOIN_TYPES.join(", ")}`);
  }

  // Validate list join length
  if (!validateListJoinLength(listJoin)) {
    errors.push(`Bet list too long: ${listJoin.length} characters (max 10)`);
  }

  // Validate multiplier
  if (!validateMultiplier(multiplier)) {
    errors.push(`Invalid multiplier: ${multiplier}. Must be a positive number`);
  }

  // Validate bet amount
  if (!validateBetAmount(money)) {
    errors.push(`Invalid bet amount: ${money}. Must be one of: ${K3_BET_AMOUNTS.join(", ")}`);
  }

  // Validate game duration
  if (!validateGameDuration(game)) {
    errors.push(`Invalid game duration: ${game}. Must be one of: ${K3_GAME_DURATIONS.join(", ")}`);
  }

  // Early return if basic validations failed
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  // Parse and validate individual bets
  const parsedBets = parseBetList(listJoin);
  const betType = determineBetType(listJoin);

  if (betType === "number") {
    if (!validateNumberBets(parsedBets)) {
      errors.push(`Invalid number bets. Must be 0-9`);
    }
  } else {
    if (!validateStringBets(parsedBets)) {
      errors.push(
        `Invalid string bets. Must be one of: c (chẵn/big), l (lẻ/small), b (big), s (small)`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    betType: errors.length === 0 ? betType : undefined,
    parsedBets: errors.length === 0 ? parsedBets : undefined,
  };
};

// ============================================================================
// CONVENIENCE WRAPPER (matches original signature)
// ============================================================================

/**
 * Simple boolean validation (backward compatible)
 * @deprecated Use validateK3Bet for detailed results
 */
export const isValidK3Bet = (
  join: string,
  listJoin: string,
  multiplier: string,
  money: string,
  game: string,
): boolean => {
  const result = validateK3Bet(join, listJoin, multiplier, money, game);
  return result.isValid;
};

// ============================================================================
// TYPES
// ============================================================================

interface CalculateK3BetParams {
  gameJoin: K3GameJoin;
  listJoin: string;
  xvalue: number;
  money: number;
}

interface K3BetResult {
  total: number;
}

interface K3FeeResult {
  fee: number;
  price: number;
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

export const calculateK3BetTotal = (params: CalculateK3BetParams): number => {
  const { gameJoin, listJoin, xvalue, money } = params;

  switch (gameJoin) {
    case "1":
      return calculateTotalBet(listJoin, xvalue, money);
    case "2":
      return calculateTwoSameBet(listJoin, xvalue, money);
    case "3":
      return calculateThreeSameBet(listJoin, xvalue, money);
    case "4":
      return calculateUnlikeBet(listJoin, xvalue, money);
    default:
      return 0;
  }
};

const calculateTotalBet = (listJoin: string, xvalue: number, money: number): number => {
  const selections = String(listJoin).split(",");
  return money * xvalue * selections.length;
};

const calculateTwoSameBet = (listJoin: string, xvalue: number, money: number): number => {
  const parts = listJoin.split("@");
  const twoSame = parts[0] || "";
  const oneUnique = parts[1] || "";

  let twoSameCount = 0;
  if (twoSame.length > 0) {
    twoSameCount = twoSame.split(",").length;
  }

  let uniqueCombinations = 0;
  let uniqueSelectionCount = 0;

  if (oneUnique.length > 0) {
    const pairs = oneUnique.split("&");
    uniqueCombinations = pairs.length;

    for (const pair of pairs) {
      const selections = pair.split("|");
      if (selections.length > 1) {
        uniqueSelectionCount = selections[1].split(",").length;
      }
    }
  }

  const twoSameTotal = twoSameCount * money * xvalue;
  const uniqueTotal = uniqueCombinations * uniqueSelectionCount * money * xvalue;

  return twoSameTotal + uniqueTotal;
};

const calculateThreeSameBet = (listJoin: string, xvalue: number, money: number): number => {
  const parts = listJoin.split("@");
  const threeUnique = parts[0] || "";
  const threeSame = parts[1] || "";

  let uniqueCount = 0;
  if (threeUnique.length > 0) {
    uniqueCount = threeUnique.split(",").length;
  }

  const sameCount = threeSame.length;

  const uniqueTotal = uniqueCount * money * xvalue;
  const sameTotal = sameCount * money * xvalue;

  return uniqueTotal + sameTotal;
};

const calculateUnlikeBet = (listJoin: string, xvalue: number, money: number): number => {
  const parts = listJoin.split("@");
  const threeUnlike = parts[0] || "";
  const twoConsecutive = parts[1] || "";
  const twoUnlike = parts[2] || "";

  // Three unlike numbers
  let threeUn = 0;
  if (threeUnlike.length > 0) {
    const count = threeUnlike.split(",").length;
    if (count <= 4) {
      threeUn = xvalue * (money * count);
    } else if (count === 5) {
      threeUn = xvalue * (money * count) * 2;
    } else if (count === 6) {
      threeUn = xvalue * (money * 5) * 4;
    }
  }

  // Two unlike numbers
  let twoUn = 0;
  if (twoUnlike.length > 0) {
    const count = twoUnlike.split(",").length;
    if (count <= 3) {
      twoUn = xvalue * (money * count);
    } else if (count === 4) {
      twoUn = xvalue * (money * count) * 1.5;
    } else if (count === 5) {
      twoUn = xvalue * (money * count) * 2;
    } else if (count === 6) {
      twoUn = xvalue * (money * count * 2.5);
    }
  }

  // Consecutive
  let consecutive = 0;
  if (twoConsecutive === "u") {
    consecutive = xvalue * money;
  }

  return threeUn + twoUn + consecutive;
};

export const calculateK3Fees = (total: number): K3FeeResult => {
  const fee = total * 0.02;
  const price = total - fee;
  return { fee, price };
};

export const generateK3ProductId = (): string => {
  const date = new Date();
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000000000000000);

  return `${year}${month}${day}${random}`;
};

export const determineK3GameType = (gameJoin: string): string => {
  const types: Record<string, string> = {
    "1": "total",
    "2": "two-same",
    "3": "three-same",
    "4": "unlike",
  };
  return types[gameJoin] || "unknown";
};

/**
 * Map game duration to admin config key
 */
export const getK3GameKey = (game: number): string => {
  const keys: Record<number, string> = {
    1: "k3d",
    3: "k3d3",
    5: "k3d5",
    10: "k3d10",
  };
  return keys[game] || "k3d";
};
