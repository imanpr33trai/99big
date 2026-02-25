
import { Pool } from 'mysql2/promise';
import { User } from '../../types/user.types';
import {
deductUserBalance,
updateUserBalance,
createTransfer,
getTotalBets
} from '../../db/user.queries';

/\*\*

- Validate transfer request
  \*/
  export const validateTransfer = async (
  db: Pool,
  sender: User,
  receiver: User,
  amount: number
  ): Promise<{ valid: boolean; message?: string }> => {
  if (sender.id === receiver.id) {
  return { valid: false, message: 'Cannot transfer to yourself' };
  }

if (sender.balance < amount) {
return { valid: false, message: 'Insufficient balance' };
}

// Check bet requirement (total bets must be >= withdrawal/transfer amount)
const totalBets = await getTotalBets(db, sender.id);
if (totalBets < amount) {
return { valid: false, message: 'Betting requirement not met. Total bets must be greater than or equal to transfer amount.' };
}

return { valid: true };
};

/\*\*

- Calculate transfer fee (if any)
  \*/
  export const calculateTransferFee = (amount: number): number => {
  // No fee for now, can be modified
  return 0;
  };

/\*\*

- Execute balance transfer between users
  \*/
  export const executeTransfer = async (
  db: Pool,
  senderId: number,
  receiverId: number,
  amount: number
  ): Promise<void> => {
  const connection = await db.getConnection();

try {
await connection.beginTransaction();

    // Deduct from sender
    const deducted = await deductUserBalance(db, senderId, amount);
    if (!deducted) {
      throw new Error('Insufficient balance');
    }

    // Add to receiver
    await updateUserBalance(db, receiverId, amount);

    // Create transfer record
    await createTransfer(db, senderId, receiverId, amount);

    await connection.commit();

} catch (error) {
await connection.rollback();
throw error;
} finally {
connection.release();
}
};
