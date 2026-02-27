
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserChangeInfoSchema } from '../../../types/user.types';
import { findUserByToken, updateUserName } from '../../../db/user.queries';

/\*\*

- Update user information
  \
 */
  export const changeUserHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  // Validate input
  const parsed = UserChangeInfoSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { name, type } = parsed.data;
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

        if (type === 'editname') {
          await updateUserName(db, user.id, name);
        }

        res.status(200).json({
          message: 'Updated successfully',
          status: true,
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('changeUserHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
