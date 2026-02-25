
import { Pool } from 'mysql2/promise';
import { RedEnvelope } from '../../types/user.types';
import {
findRedEnvelope,
hasClaimedEnvelope,
claimRedEnvelope,
updateUserBalance
} from '../../db/user.queries';
import crypto from 'crypto';

/\*\*

- Generate unique red envelope ID
  \*/
  export const generateEnvelopeId = (): string => {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
  };

/\*\*

- Validate envelope before claiming
  \*/
  export const validateEnvelope = async (
  db: Pool,
  envelope: RedEnvelope,
  userId: number
  ): Promise<{ valid: boolean; message?: string }> => {
  if (envelope.status !== 0) {
  return { valid: false, message: 'Red envelope is no longer active' };
  }

if (envelope.expiredAt < Date.now()) {
return { valid: false, message: 'Red envelope has expired' };
}

if (envelope.claimedCount >= envelope.totalCount) {
return { valid: false, message: 'Red envelope has been fully claimed' };
}

const alreadyClaimed = await hasClaimedEnvelope(db, envelope.id, userId);
if (alreadyClaimed) {
return { valid: false, message: 'You have already claimed this red envelope' };
}

return { valid: true };
};

/\*\*

- Claim red envelope and credit user
  \*/
  export const claimEnvelope = async (db: Pool, envelopeId: string, userId: number): Promise<number> => {
  const envelope = await findRedEnvelope(db, envelopeId);

if (!envelope) {
throw new Error('Red envelope not found');
}

const validation = await validateEnvelope(db, envelope, userId);
if (!validation.valid) {
throw new Error(validation.message);
}

// Calculate random amount (simplified - implement your own logic)
const remainingAmount = envelope.totalAmount - (envelope.claimedCount \* (envelope.totalAmount / envelope.totalCount));
const remainingCount = envelope.totalCount - envelope.claimedCount;
const amount = remainingCount === 1 ? remainingAmount : Math.floor(remainingAmount / remainingCount);

// Claim envelope
await claimRedEnvelope(db, envelope.id, userId, amount);

// Credit user balance
await updateUserBalance(db, userId, amount);

return amount;
};
