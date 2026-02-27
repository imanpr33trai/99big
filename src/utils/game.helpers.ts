/**
 * Generate random 3-digit K3 result (each digit 1-6)
 */
export const generateK3Result = (): string => {
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += Math.floor(Math.random() * 6) + 1;
  }
  return result;
};

/**
 * Calculate total of 3 dice
 */
export const calculateTotal = (result: string): number => {
  return result.split("").reduce((sum, digit) => sum + parseInt(digit), 0);
};

/**
 * Parse result to array of numbers
 */
export const parseResult = (result: string): number[] => {
  return result.split("").map((d) => parseInt(d));
};

/**
 * Check if total is big (11-18)
 */
export const isBig = (total: number): boolean => {
  return total >= 11 && total <= 18;
};

/**
 * Check if total is small (3-10)
 */
export const isTotalSmall = (total: number): boolean => {
  return total >= 3 && total <= 10;
};

/**
 * Check if digit is small (0-4)
 */
export const isSmall = (digit: string): boolean => {
  const num = parseInt(digit, 10);
  return num >= 0 && num <= 4;
};

/**
 * Check if digit is big (5-9)
 */
export const isBig = (digit: string): boolean => {
  const num = parseInt(digit, 10);
  return num >= 5 && num <= 9;
};
/**
 * Check if total is small (0-22) (for 5D)
 */
export const isTotalSmall = (total: number): boolean => {
  return total <= 22;
};

/**
 * Check if total is big (23-45) (for 5D)
 */
export const isTotalBig = (total: number): boolean => {
  return total > 22;
};
/**
 * Check if total is even
 */
export const isEven = (total: number): boolean => {
  return total % 2 === 0;
};

/**
 * Check if total is odd
 */
export const isOdd = (total: number): boolean => {
  return total % 2 !== 0;
};

/**
 * Check for pair in result
 * Returns [hasPair, pairValue]
 */
export const hasPair = (result: string): [boolean, number?] => {
  const dice = parseResult(result);
  if (dice[0] === dice[1]) return [true, dice[0]];
  if (dice[1] === dice[2]) return [true, dice[1]];
  if (dice[0] === dice[2]) return [true, dice[0]];
  return [false];
};

/**
 * Check for triple
 * Returns [isTriple, tripleValue]
 */
export const isTriple = (result: string): [boolean, number?] => {
  const dice = parseResult(result);
  if (dice[0] === dice[1] && dice[1] === dice[2]) {
    return [true, dice[0]];
  }
  return [false];
};

/**
 * Check if all three dice are different
 */
export const isThreeDifferent = (result: string): boolean => {
  const dice = parseResult(result);
  return dice[0] !== dice[1] && dice[1] !== dice[2] && dice[0] !== dice[2];
};

/**
 * Check if dice are consecutive (e.g., 123, 234, 456)
 */
export const isConsecutive = (result: string): boolean => {
  const dice = parseResult(result).sort((a, b) => a - b);
  return dice[1] === dice[0] + 1 && dice[2] === dice[1] + 1;
};

/**
 * Check if two different (one pair)
 */
export const isTwoDifferent = (result: string): boolean => {
  const dice = parseResult(result);
  return (
    (dice[0] === dice[1] && dice[1] !== dice[2]) ||
    (dice[0] !== dice[1] && dice[1] === dice[2]) ||
    (dice[0] === dice[2] && dice[0] !== dice[1])
  );
};

/**
 * Validate money values (1000, 10000, 100000, 1000000)
 */
export const validateMoney = (money: number): boolean => {
  return [1000, 10000, 100000, 1000000].includes(money);
};

/**
 * Parse predefined results string
 */
export const parsePredefinedResults = (input: string): (string | null)[] => {
  return input.split("|").map((r) => (r === "-1" ? null : r));
};

/**
 * Get next predefined result
 */
export const getNextPredefinedResult = (
  results: (string | null)[],
): { result: string | null; remaining: string } => {
  const [current, ...rest] = results;
  const remaining = rest.length > 0 ? [...rest].join("|") + "|-1" : "-1";
  return { result: current || null, remaining };
};

/**
 * Generate 5D game result
 */
export const generate5DResult = (): string => {
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

/**
 * Calculate total sum of 5 digits (for 5D)
 */
export const calculateTotal5D = (result: string): number => {
  return result.split("").reduce((sum, digit) => sum + parseInt(digit, 10), 0);
};

/**
 * Generate product/transaction ID
 */
export const generateProductId = (): string => {
  const date = new Date();
  const years = String(date.getFullYear());
  const months = String(date.getMonth() + 1).padStart(2, "0");
  const days = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000000000000000);
  return years + months + days + random;
};

/**
 * Validate if list_join contains only valid category characters or digits
 */
export const validateListJoin = (listJoin: string, joinType: string): boolean => {
  if (joinType === "total") {
    return /^[bscl]+$/.test(listJoin);
  }
  return /^[\dbscl]+$/.test(listJoin);
};

/**
 * Get position index (0-4) from position character
 */
export const getPositionIndex = (position: string): number => {
  const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
  return map[position] ?? -1;
};

/**
 * Generate red envelope code
 */
export const generateRedEnvelopeCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ==========================================
// WINGO HELPERS
// ==========================================

export const isRed = (result: number): boolean => {
  return [0, 2, 4, 6, 8].includes(result);
};

export const isGreen = (result: number): boolean => {
  return [1, 3, 5, 7, 9].includes(result);
};

export const isViolet = (result: number): boolean => {
  return [0, 5].includes(result);
};

export const isBigWingo = (result: number): boolean => {
  return result >= 5;
};

export const isSmallWingo = (result: number): boolean => {
  return result <= 4;
};

export const getGameName = (typeid: string): string => {
  const gameMap: Record<string, string> = {
    "1": "wingo",
    "3": "wingo3",
    "5": "wingo5",
    "10": "wingo10",
  };
  return gameMap[typeid] || "wingo";
};

export const getBetType = (selection: string): string => {
  if (/^\d$/.test(selection)) return "number";
  if (selection === "l" || selection === "n") return "size";
  if (selection === "d" || selection === "x" || selection === "t") return "color";
  return "unknown";
};

export const getPayoutMultiplier = (selection: string, result: number): number => {
  if (/^\d$/.test(selection)) {
    return parseInt(selection) === result ? 9 : 0;
  }

  if (selection === "l") return result >= 5 ? 2 : 0;
  if (selection === "n") return result <= 4 ? 2 : 0;

  if (selection === "d") {
    if (result === 0) return 1.5;
    return [2, 4, 6, 8].includes(result) ? 2 : 0;
  }

  if (selection === "x") {
    if (result === 5) return 1.5;
    return [1, 3, 7, 9].includes(result) ? 2 : 0;
  }

  if (selection === "t") {
    return [0, 5].includes(result) ? 4.5 : 0;
  }

  return 0;
};

export const validateBetSelection = (selection: string): boolean => {
  const valid = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "l", "n", "d", "x", "t"];
  return valid.includes(selection);
};

export const generateBetHTML = (selection: string, period: string, time: string): string => {
  return `<div class="bet-item"><span>${period}</span><span>${selection}</span><span>${time}</span></div>`;
};
