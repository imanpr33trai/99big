
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserSearchSchema, UserLevel } from '../../../types/user.types';
import { findUserByToken, findUserByPhone } from '../../../db/user.queries';
import { maskPhoneNumber } from '../../../utils';

/\*\*

- Search user (Admin/CTV only)
  \
 */
  export const searchHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserSearchSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { phone } = parsed.data;
        const auth = req.cookies.auth;
        const timeNow = Date.now();

        const searcher = await findUserByToken(db, auth);
        if (!searcher) {
          res.status(401).json({
            message: 'Unauthorized',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Check permissions (Admin or CTV only)
        if (searcher.userLevel === UserLevel.USER) {
          res.status(403).json({
            message: 'Insufficient privileges',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Find target user
        const targetUser = await findUserByPhone(db, phone);
        if (!targetUser) {
          res.status(404).json({
            message: 'User not found',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // CTV can only search users under their management
        if (searcher.userLevel === UserLevel.CTV) {
          // Check if target is in searcher's downline
          // This is a simplified check - implement full hierarchy check if needed
          const isInDownline = targetUser.invitedBy === searcher.id;
          if (!isInDownline) {
            res.status(403).json({
              message: 'You can only search users in your team',
              status: false,
              timeStamp: timeNow,
            });
            return;
          }
        }

        // Return user info (exclude sensitive fields)
        res.status(200).json({
          message: 'Success',
          status: true,
          data: {
            id: targetUser.id,
            phone: maskPhoneNumber(targetUser.phone),
            name: targetUser.userName,
            balance: targetUser.balance,
            referral_code: targetUser.referralCode,
            user_level: targetUser.userLevel,
            status: targetUser.status,
            created_at: targetUser.createdAt,
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('searchHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
