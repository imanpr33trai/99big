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
 * Calculate total sum of 5 digits
 */
export const calculateTotal = (result: string): number => {
  return result.split("").reduce((sum, digit) => sum + parseInt(digit, 10), 0);
};

/**
 * Parse result string to array of digits
 */
export const parseResult = (result: string): string[] => {
  return result.split("");
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
 * Check if digit is even
 */
export const isEven = (digit: string): boolean => {
  const num = parseInt(digit, 10);
  return num % 2 === 0;
};

/**
 * Check if digit is odd
 */
export const isOdd = (digit: string): boolean => {
  const num = parseInt(digit, 10);
  return num % 2 !== 0;
};

/**
 * Check if total is small (0-22)
 */
export const isTotalSmall = (total: number): boolean => {
  return total <= 22;
};

/**
 * Check if total is big (23-45)
 */
export const isTotalBig = (total: number): boolean => {
  return total > 22;
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
