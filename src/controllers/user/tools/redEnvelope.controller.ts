
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { UserApiResponse, UserRedEnvelopeSchema } from '../../../types/user.types';
import { findUserByToken } from '../../../db/user.queries';
import { claimEnvelope } from '../../../services/user/redEnvelope.service';

/\*\*

- Claim red envelope gift
  \
 */
  export const useRedEnvelopeHandler = (db: Pool) => async (req: Request, res: Response<UserApiResponse>): Promise<void> => {
  try {
  const parsed = UserRedEnvelopeSchema.safeParse(req.body);
  if (!parsed.success) {
  res.status(400).json({
  message: parsed.error.errors.map(e => e.message).join(', '),
  status: false,
  timeStamp: Date.now(),
  });
  return;
  }

        const { code } = parsed.data;
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

        // Claim envelope
        const amount = await claimEnvelope(db, code, user.id);

        res.status(200).json({
          message: `Successfully claimed ₹${amount} from red envelope!`,
          status: true,
          data: {
            envelope_code: code,
            amount_claimed: amount,
            new_balance: user.balance + amount,
          },
          timeStamp: timeNow,
        });

  } catch (error) {
  console.error('useRedEnvelopeHandler error:', error);

        // Handle specific errors
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong!';

        res.status(400).json({
          message: errorMessage,
          status: false,
          timeStamp: Date.now(),
        });

  }
  };
