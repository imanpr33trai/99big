
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse } from '../../../types/user.types';
import { findUserByToken } from '../../../db/user.queries';

/\*\*

- Redirect to Aviator game with authentication
  \
 */
  export const aviatorHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
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

        // Redirect to Aviator game with auth token
        const aviatorUrl = `https://jetx.asia/theninja/src/api/userapi.php?action=loginandregisterbyauth&token=${auth}`;
        res.redirect(aviatorUrl);

  } catch (error) {
  console.error('aviatorHandler error:', error);
  res.status(500).json({
  message: 'Something went wrong!',
  status: false,
  timeStamp: Date.now(),
  });
  }
  };
