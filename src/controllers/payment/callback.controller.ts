import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { PaymentStatus } from '../../types/payment.types';
import { findDepositByOrderId, updateDepositStatus } from '../../db/payment.queries';
import { processDepositCredit } from '../../services/payment/paymentHelpers.service';

/**
 * Payment gateway callback handler
 * This is called by payment gateways to notify payment status
 */
export const callbackBankHandler = (db: Pool) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      transaction_id,
      client_transaction_id,
      amount,
      status,
      requested_datetime,
      expired_datetime,
      payment_datetime,
    } = req.body;

    const timeNow = Date.now();

    // 1. Validate required fields
    if (!transaction_id) {
      res.status(400).json({
        message: 'Transaction ID is required',
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // 2. Find deposit by order ID
    const deposit = await findDepositByOrderId(db, client_transaction_id);

    if (!deposit) {
      res.status(404).json({
        message: 'Deposit not found',
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // 3. Process based on status
    if (status === 2 || status === 'success') {
      // Payment successful
      if (deposit.status === PaymentStatus.PENDING || deposit.status === PaymentStatus.CANCELLED) {
        await updateDepositStatus(db, deposit.id, PaymentStatus.COMPLETED);
        await processDepositCredit(db, deposit);
      }

      res.status(200).json({
        message: 'Payment confirmed',
        status: true,
        timeStamp: timeNow,
      });
    } else {
      // Payment failed/cancelled
      await updateDepositStatus(db, deposit.id, PaymentStatus.CANCELLED);

      res.status(200).json({
        message: 'Payment cancelled',
        status: true,
        timeStamp: timeNow,
      });
    }

  } catch (error) {
    console.error('callbackBankHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Callback processing failed',
      timeStamp: Date.now(),
    });
  }
};

/**
 * USDT recharge confirmation handler
 */
export const confirmUSDTRechargeHandler = (db: Pool) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // USDT confirmation logic would go here
    // This is typically handled by admin approval for manual USDT deposits
    
    res.status(200).json({
      message: 'USDT recharge confirmation received',
      status: true,
      timeStamp: Date.now(),
    });

  } catch (error) {
    console.error('confirmUSDTRechargeHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Confirmation failed',
      timeStamp: Date.now(),
    });
  }
};
