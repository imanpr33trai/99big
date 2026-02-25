
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, ReferralData } from '../../types/user.types';
import { findUserByToken } from '../../db/user.queries';
import { getCommissionLevels } from '../../db/user.queries';
import { calculateReferralHierarchy, getTeamMembers } from '../../services/user/referral.service';

/\*\*

- Get comprehensive promotion/referral data
  \*/
  export const promotionHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
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

        // Calculate referral hierarchy (F1-F4)
        const referralData: ReferralData = await calculateReferralHierarchy(db, user.referralCode);

        // Get team members
        const teamMembers = await getTeamMembers(db, user.referralCode, 4);

        // Calculate total commission (placeholder - implement based on your commission logic)
        const totalCommission = teamMembers.reduce((sum, member) => sum + (member.total_money * 0.05), 0);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            user: {
              id: user.id,
              code: user.referralCode,
              name: user.userName,
              level: user.userLevel,
            },
            commission_levels: levels,
            referral_data: {
              ...referralData,
              roses_all: totalCommission,
              roses_today: Math.floor(totalCommission * 0.1), // Placeholder
            },
            team_summary: {
              total_members: teamMembers.length,
              direct_referrals: referralData.f1,
              total_team_betting: teamMembers.reduce((sum, m) => sum + m.total_turn_over, 0),
            },
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('promotionHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
