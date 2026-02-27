
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { UserApiResponse, UserChangePasswordSchema } from '../../../types/user.types';
import { findUserByToken, updateUserPassword, updateUserOTP } from '../../../db/user.queries';
import { generateOTP } from '../../../utils';

/\*\*

- Change user password
  \
 */
  export const changePasswordHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  // Validate input
  const parsed = UserChangePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { password, newPassWord } = parsed.data;
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

        // Verify current password with bcrypt
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          res.status(400).json({
            message: 'Current password is incorrect',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Hash new password with bcrypt
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassWord, saltRounds);

        // Update password
        await updateUserPassword(db, user.id, newPasswordHash);

        // Generate new OTP for security
        const newOTP = generateOTP();
        await updateUserOTP(db, user.id, newOTP, timeNow + (10 * 60 * 1000));

        res.status(200).json({
          message: 'Password changed successfully',
          status: true,
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('changePasswordHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
