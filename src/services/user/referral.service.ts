
import { Pool } from 'mysql2/promise';
import { ReferralData, TeamMember, User } from '../../types/user.types';
import { getDirectReferrals, getReferralsByLevel } from '../../db/user.queries';
import { getStartOfDay, getEndOfDay, maskPhoneNumber } from '../../utils/user.helpers';

/\*\*

- Calculate complete referral hierarchy (F1-F4)
  \*/
  export const calculateReferralHierarchy = async (db: Pool, code: string): Promise<ReferralData> => {
  // F1: Direct referrals
  const f1Users = await getDirectReferrals(db, code);
  const f1Ids = f1Users.map(u => u.id);

// F2: Referrals of F1
const f2Users = await getReferralsByLevel(db, f1Ids);
const f2Ids = f2Users.map(u => u.id);

// F3: Referrals of F2
const f3Users = await getReferralsByLevel(db, f2Ids);
const f3Ids = f3Users.map(u => u.id);

// F4: Referrals of F3
const f4Users = await getReferralsByLevel(db, f3Ids);

const todayStart = getStartOfDay();
const todayEnd = getEndOfDay();

// Calculate today's new referrals
const f1Today = f1Users.filter(u => u.createdAt >= todayStart && u.createdAt <= todayEnd).length;
const fAllToday = f1Today +
f2Users.filter(u => u.createdAt >= todayStart && u.createdAt <= todayEnd).length +
f3Users.filter(u => u.createdAt >= todayStart && u.createdAt <= todayEnd).length +
f4Users.filter(u => u.createdAt >= todayStart && u.createdAt <= todayEnd).length;

return {
f1: f1Users.length,
f2: f2Users.length,
f3: f3Users.length,
f4: f4Users.length,
total_f: f1Users.length + f2Users.length + f3Users.length + f4Users.length,
f1_today: f1Today,
f_all_today: fAllToday,
roses_f1: 0, // Calculate based on commission rates
roses_f: 0,
roses_all: 0,
roses_today: 0,
};
};

/\*\*

- Get team members with full hierarchy
  \*/
  export const getTeamMembers = async (db: Pool, code: string, maxDepth: number = 6): Promise<TeamMember[]> => {
  const members: TeamMember[] = [];
  const processedCodes = new Set<string>();

const processLevel = async (currentCode: string, depth: number): Promise<void> => {
if (depth > maxDepth || processedCodes.has(currentCode)) return;

    processedCodes.add(currentCode);
    const users = await getDirectReferrals(db, currentCode);

    for (const user of users) {
      const inviteCount = await getDirectReferrals(db, user.referralCode).then(u => u.length);

      members.push({
        id_user: user.id,
        name_user: user.userName,
        phone: maskPhoneNumber(user.phone),
        code: user.referralCode,
        invite: currentCode,
        rank: depth,
        total_money: 0, // Calculate from deposits
        invite_count: inviteCount,
        user_level: user.userLevel,
        daily_turn_over: 0, // Calculate from bets
        total_turn_over: 0,
      });

      await processLevel(user.referralCode, depth + 1);
    }

};

await processLevel(code, 1);
return members;
};

/\*\*

- Calculate commission for a bet
  _/
  export const calculateCommission = (betAmount: number, rate: number): number => {
  return Math.floor(betAmount _ rate);
  };

/\*\*

- Distribute commission up the referral chain
  \*/
  export const distributeCommission = async (db: Pool, userId: number, betAmount: number): Promise<void> => {
  // Implementation depends on your commission structure
  // This is a placeholder for the commission distribution logic
  console.log(`Distribute commission for user ${userId}, bet ${betAmount}`);
  };
