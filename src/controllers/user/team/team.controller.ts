
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse } from '../../../types/user.types';
import { findUserByToken } from '../../../db/user.queries';
import { getCommissionLevels } from '../../../db/user.queries';
import { calculateReferralHierarchy } from '../../../services/user/referral.service';

/\*\*

- Get basic team information
  \
 */
  export const myTeamHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
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

        // Get commission levels
        const levels = await getCommissionLevels(db);

        // Get referral stats
        const referralData = await calculateReferralHierarchy(db, user.referralCode);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            referral_code: user.referralCode,
            total_referrals: referralData.total_f,
            direct_referrals: referralData.f1,
            team_levels: {
              f1: referralData.f1,
              f2: referralData.f2,
              f3: referralData.f3,
              f4: referralData.f4,
            },
            commission_rates: levels.map(l => ({
              level: l.level,
              f1: l.rateF1,
              f2: l.rateF2,
              f3: l.rateF3,
              f4: l.rateF4,
            })),
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('myTeamHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
