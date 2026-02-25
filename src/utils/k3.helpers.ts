/**
 * Generate random 3-digit K3 result (each digit 1-6)
 */
export const generateK3Result = (): string => {
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += Math.floor(Math.random() * 6) + 1;
  }
  return result;
};

/**
 * Calculate total of 3 dice
 */
export const calculateTotal = (result: string): number => {
  return result.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
};

/**
 * Parse result to array of numbers
 */
export const parseResult = (result: string): number[] => {
  return result.split('').map(d => parseInt(d));
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
export const isSmall = (total: number): boolean => {
  return total >= 3 && total <= 10;
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
  return (dice[0] === dice[1] && dice[1] !== dice[2]) ||
         (dice[0] !== dice[1] && dice[1] === dice[2]) ||
         (dice[0] === dice[2] && dice[0] !== dice[1]);
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
  return input.split('|').map(r => r === '-1' ? null : r);
};

/**
 * Get next predefined result
 */
export const getNextPredefinedResult = (results: (string | null)[]): { result: string | null; remaining: string } => {
  const [current, ...rest] = results;
  const remaining = rest.length > 0 ? [...rest].join('|') + '|-1' : '-1';
  return { result: current || null, remaining };
};
