
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse } from '../../types/user.types';
import { findUserByToken, isOTPRateLimited, updateUserOTP } from '../../db/user.queries';
import { generateOTP } from '../../utils/user.helpers';
import { sendOTP } from '../../services/user/sms.service';

/\*\*

- Send OTP to user's phone
  \*/
  export const verifyCodeHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const auth = req.cookies.auth;
  const timeNow = Date.now();

        // Get authenticated user
        const user = await findUserByToken(db, auth);
        if (!user) {
          res.status(401).json({
            message: 'Unauthorized',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Check OTP rate limit (60 seconds between requests)
        const isRateLimited = await isOTPRateLimited(db, user.id);
        if (isRateLimited) {
          res.status(429).json({
            message: 'Please wait 60 seconds before requesting another OTP',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = timeNow + (10 * 60 * 1000); // 10 minutes expiry

        // Send SMS
        const smsSent = await sendOTP(user.phone, otp);

        if (!smsSent && process.env.NODE_ENV !== 'development') {
          res.status(500).json({
            message: 'Failed to send OTP. Please try again later.',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        // Save OTP to database
        await updateUserOTP(db, user.id, otp, expiresAt);

        res.status(200).json({
          message: 'OTP sent successfully',
          status: true,
          timeStamp: timeNow,
          // Only return OTP in development
          ...(process.env.NODE_ENV === 'development' && { otp }),
        });

  } catch (error) {
  console.error('verifyCodeHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
