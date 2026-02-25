
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserFinancialData } from '../../types/user.types';
import { getUserFinancialSummary } from '../../services/user/user.service';

/\*\*

- Get user information and financial summary
  \*/
  export const userInfoHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse<UserFinancialData>>): Promise<void> => {
  try {
  const auth = req.cookies.auth;
  const timeNow = Date.now();

        const user = await getUserFinancialSummary(db, auth);

        if (!user) {
          res.status(401).json({
            message: 'Unauthorized',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        res.status(200).json({
          message: 'Success',
          status: true,
          data: user,
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('userInfoHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
