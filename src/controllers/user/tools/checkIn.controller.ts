
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserCheckInSchema, CheckInReward } from '../../../types/user.types';
import { findUserByToken, getCheckInRecords } from '../../../db/user.queries';
import {
getCheckInRewards,
canClaimReward,
claimCheckInReward,
isRewardClaimed,
getConsecutiveCheckInDays
} from '../../../services/user/checkIn.service';

/\*\*

- Handle check-in operations
  \
 */
  export const checkInHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserCheckInSchema.safeParse(req.body);
  const auth = req.cookies.auth;
  const timeNow = Date.now();

      const user = await findUserByToken(db, auth);
      if (!user) {
        res.status(401).json({
          message: 'Unauthorized',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      // If no data provided, return check-in records and rewards
      if (!parsed.success || !parsed.data.data) {
        const records = await getCheckInRecords(db, user.id);
        const rewards = getCheckInRewards();
        const consecutiveDays = await getConsecutiveCheckInDays(db, user.id);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            records,
            rewards,
            consecutiveDays,
            canClaimToday: consecutiveDays < 7,
          },
          timeStamp: timeNow,
        });
        return;
      }

      // Claim reward for specific day
      const day = parsed.data.data;

      // Check if already claimed
      const alreadyClaimed = await isRewardClaimed(db, user.id, day);
      if (alreadyClaimed) {
        res.status(400).json({
          message: `Day ${day} reward already claimed`,
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      // Check deposit requirement
      const canClaim = await canClaimReward(db, user.id, day);
      if (!canClaim) {
        const rewards = getCheckInRewards();
        const requiredDeposit = rewards[day -

continue
Edit
Copy
Share
I'll continue from where we left off, completing the check-in controller and all remaining controllers.
6.5 src/controllers/user/checkIn.controller.ts (continued)
TypeScript
Copy

    if (!canClaim) {
      const rewards = getCheckInRewards();
      const requiredDeposit = rewards[day - 1]?.requiredDeposit || 0;
      res.status(400).json({
        message: `Deposit at least ₹${requiredDeposit} to claim Day ${day} reward`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // Claim reward
    const rewardAmount = await claimCheckInReward(db, user.id, day);

    res.status(200).json({
      message: `Successfully claimed Day ${day} reward of ₹${rewardAmount}`,
      status: true,
      data: {
        day,
        reward: rewardAmount,
        consecutiveDays: await getConsecutiveCheckInDays(db, user.id),
      },
      timeStamp: timeNow,
    });

} catch (error) {
console.error('checkInHandler error:', error);
res.status(500).json({
message: 'Something went wrong!',
status: false,
timeStamp: Date.now(),
});
}
};
