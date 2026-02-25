
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, TeamMember } from '../../types/user.types';
import { findUserByToken, getDirectReferrals } from '../../db/user.queries';
import { getTeamMembers } from '../../services/user/referral.service';
import { maskPhoneNumber } from '../../utils/user.helpers';

/\*\*

- Get detailed team member list with full hierarchy
  \*/
  export const listMyTeamHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
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

        // Get F1 (direct referrals) - limited to 100
        const f1Users = await getDirectReferrals(db, user.referralCode);
        const limitedF1 = f1Users.slice(0, 100);

        // Get full team hierarchy (recursive, max depth 6)
        const allMembers = await getTeamMembers(db, user.referralCode, 6);

        // Format F1 members with additional data
        const f1Members = await Promise.all(
          limitedF1.map(async (u) => {
            const inviteCount = (await getDirectReferrals(db, u.referralCode)).length;
            return {
              id_user: u.id,
              name_user: u.userName,
              phone: maskPhoneNumber(u.phone),
              code: u.referralCode,
              invite: user.referralCode,
              rank: 1,
              total_money: 0, // Calculate from deposits
              invite_count: inviteCount,
              user_level: u.userLevel,
              daily_turn_over: 0,
              total_turn_over: 0,
              created_at: u.createdAt,
            };
          })
        );

        // Get recent members (last 100)
        const recentMembers = allMembers
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 100);

        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            f1_direct: f1Members,
            total_f1: f1Users.length,
            recent_members: recentMembers,
            total_team_size: allMembers.length,
            team_hierarchy: {
              f1: f1Members.length,
              f2: allMembers.filter(m => m.rank === 2).length,
              f3: allMembers.filter(m => m.rank === 3).length,
              f4: allMembers.filter(m => m.rank === 4).length,
              f5_plus: allMembers.filter(m => m.rank >= 5).length,
            },
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('listMyTeamHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
