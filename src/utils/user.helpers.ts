/**
 * Generate unique referral code (5 letters + 5 digits)
 */
export const generateReferralCodeUser = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const randomNum = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  result += String(randomNum);
  return result;
};

/**
 * Generate random referral code (from admin.helpers.ts)
 */
export const generateReferralCodeAdmin = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Mask phone number for privacy (91 + first digit + **** + last 4 digits)
 */
export const maskPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 5) return cleanPhone;
  return '91' + cleanPhone.slice(0, 1) + '****' + cleanPhone.slice(-4);
};

/**
 * Get check-in reward amount for specific day
 */
export const getCheckInReward = (day: number): number => {
  const rewards = [300, 3000, 6000, 12000, 28000, 100000, 200000];
  return rewards[day - 1] || 0;
};

/**
 * Get required deposit amount for specific check-in day
 */
export const getRequiredDeposit = (day: number): number => {
  const deposits = [300, 3000, 6000, 12000, 28000, 100000, 200000];
  return deposits[day - 1] || 0;
};

/**
 * Validate Indian phone number format
 */
export const isValidIndianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanPhone);
};
