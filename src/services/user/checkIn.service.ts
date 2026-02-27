
import { Pool } from 'mysql2/promise';
import { CheckInReward, CHECK_IN_REWARDS } from '../../types/user.types';
import {
getCheckInRecords,
createCheckInRecord,
getTotalDeposits,
updateUserBalance
} from '../../db/user.queries';
import { getTodayString, getCheckInReward, getRequiredDeposit } from '../../utils';

/\*\*

- Get all check-in rewards configuration
  \*/
  export const getCheckInRewards = (): CheckInReward[] => {
  return CHECK_IN_REWARDS;
  };

/\*\*

- Check if user can claim reward based on deposit requirement
  \*/
  export const canClaimReward = async (db: Pool, userId: number, day: number): Promise<boolean> => {
  const requiredDeposit = getRequiredDeposit(day);
  const totalDeposits = await getTotalDeposits(db, userId);
  return totalDeposits >= requiredDeposit;
  };

/\*\*

- Claim check-in reward for specific day
  \*/
  export const claimCheckInReward = async (db: Pool, userId: number, day: number): Promise<number> => {
  const reward = getCheckInReward(day);

// Create check-in record
await createCheckInRecord(db, userId, day, reward);

// Add reward to user balance
await updateUserBalance(db, userId, reward);

return reward;
};

/\*\*

- Get consecutive check-in days
  \*/
  export const getConsecutiveCheckInDays = async (db: Pool, userId: number): Promise<number> => {
  const records = await getCheckInRecords(db, userId);

if (records.length === 0) return 0;

// Sort by date descending
records.sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());

let consecutiveDays = 1;
const today = new Date();

for (let i = 0; i < records.length; i++) {
const recordDate = new Date(records[i].checkInDate);
const expectedDate = new Date(today);
expectedDate.setDate(today.getDate() - i);

    if (recordDate.toDateString() === expectedDate.toDateString()) {
      consecutiveDays = i + 1;
    } else {
      break;
    }

}

return Math.min(consecutiveDays, 7);
};

/\*\*

- Check if reward already claimed for day
  \*/
  export const isRewardClaimed = async (db: Pool, userId: number, day: number): Promise<boolean> => {
  const records = await getCheckInRecords(db, userId);
  return records.some(r => r.consecutiveDays === day);
  };
