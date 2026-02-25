import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { PaymentApiResponse, PaymentMethodType, PaymentStatus } from '../../types/payment.types';
import { getPaymentMethodByType } from '../../db/payment.queries';
import { generateUPIQRCode } from '../../services/payment/upiQr.service';
import {
  getUserDataByAuthToken,
  cancelPendingDeposits,
  validateUTR,
  getMinimumDepositAmount
} from '../../services/payment/paymentHelpers.service';
import { createDepositRecord } from '../../services/payment/deposit.service';
import { getCurrentTimeForTodayField } from '../../utils/payment.helpers';

/**
 * Initiate Manual UPI Payment (Show QR Code Page)
 */
export const initiateManualUPIPaymentHandler = (db: Pool) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const amount = parseFloat(req.query.am as string);

    if (isNaN(amount) || amount <= 0) {
      res.status(400).json({ message: 'Invalid amount', status: false });
      return;
    }

    // 1. Get UPI details from database
    const paymentMethod = await getPaymentMethodByType(db, PaymentMethodType.UPI_MANUAL);
    if (!paymentMethod || !paymentMethod.upiId) {
      res.status(400).json({ message: 'Payment method not configured', status: false });
      return;
    }

    // 2. Generate QR code
    const qrCodeUrl = await generateUPIQRCode(paymentMethod.upiId, amount, paymentMethod.accountName || undefined);

    // 3. Render payment page
    res.render('wallet/manual_payment.ejs', {
      Amount: amount,
      UpiId: paymentMethod.upiId,
      QRCodeUrl: qrCodeUrl,
    });

  } catch (error) {
    console.error('initiateManualUPIPaymentHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
    });
  }
};

/**
 * Submit Manual UPI Payment Request
 */
export const addManualUPIPaymentRequestHandler = (db: Pool) => async (
  req: Request,
  res: Response<PaymentApiResponse>
): Promise<void> => {
  try {
    const { money, utr } = req.body;
    const auth = req.cookies.auth;
    const timeNow = new Date().toISOString();

    // 1. Validate input
    const minimumMoney = getMinimumDepositAmount();
    if (!money || money < minimumMoney) {
      res.status(400).json({
        message: `Money is Required and it should be ₹${minimumMoney} or above!`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    if (!utr || !validateUTR(utr)) {
      res.status(400).json({
        message: 'UPI Ref No. or UTR is Required And it should be 12 digit long',
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // 2. Get user
    const user = await getUserDataByAuthToken(db, auth);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow });
      return;
    }

    // 3. Cancel pending deposits
    await cancelPendingDeposits(db, user.phone);

    // 4. Create deposit
    const deposit = await createDepositRecord(db, {
      transactionId: null,
      utr,
      phone: user.phone,
      money,
      type: PaymentMethodType.UPI_MANUAL,
      status: PaymentStatus.PENDING,
      today: getCurrentTimeForTodayField(),
      url: 'NULL',
      time: timeNow,
      ipAddress: req.ip || null,
    });

    // 5. Return success
    res.status(200).json({
      message: 'Payment Requested successfully! Your balance will update shortly!',
      recharge: deposit,
      status: true,
      timeStamp: timeNow,
    });

  } catch (error) {
    console.error('addManualUPIPaymentRequestHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
    });
  }
};

/**
 * Initiate Manual USDT Payment (Show Address Page)
 */
export const initiateManualUSDTPaymentHandler = (db: Pool) => async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const amount = parseFloat(req.query.am as string);

    if (isNaN(amount) || amount <= 0) {
      res.status(400).json({ message: 'Invalid amount', status: false });
      return;
    }

    // 1. Get USDT details from database
    const paymentMethod = await getPaymentMethodByType(db, PaymentMethodType.USDT_MANUAL);
    if (!paymentMethod || !paymentMethod.cryptoAddress) {
      res.status(400).json({ message: 'Payment method not configured', status: false });
      return;
    }

    // 2. Render payment page
    res.render('wallet/usdt_manual_payment.ejs', {
      Amount: amount,
      UsdtWalletAddress: paymentMethod.cryptoAddress,
      ConversionRate: 82, // 1 USDT = ₹82
    });

  } catch (error) {
    console.error('initiateManualUSDTPaymentHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
    });
  }
};

/**
 * Submit Manual USDT Payment Request
 */
export const addManualUSDTPaymentRequestHandler = (db: Pool) => async (
  req: Request,
  res: Response<PaymentApiResponse>
): Promise<void> => {
  try {
    const { money, utr } = req.body;
    const auth = req.cookies.auth;
    const timeNow = new Date().toISOString();

    // 1. Validate input
    const minimumMoney = getMinimumDepositAmount();
    const conversionRate = 82; // 1 USDT = ₹82
    const moneyINR = money * conversionRate;

    if (!money || moneyINR < minimumMoney) {
      res.status(400).json({
        message: `Money is Required and it should be ₹${minimumMoney} or ${(minimumMoney / conversionRate).toFixed(2)} USDT or above!`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    if (!utr || utr.length < 10) {
      res.status(400).json({
        message: 'Transaction Hash/Ref No. is Required',
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // 2. Get user
    const user = await getUserDataByAuthToken(db, auth);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow });
      return;
    }

    // 3. Cancel pending deposits
    await cancelPendingDeposits(db, user.phone);

    // 4. Create deposit
    const deposit = await createDepositRecord(db, {
      transactionId: null,
      utr,
      phone: user.phone,
      money: moneyINR,
      type: PaymentMethodType.USDT_MANUAL,
      status: PaymentStatus.PENDING,
      today: getCurrentTimeForTodayField(),
      url: 'NULL',
      time: timeNow,
      ipAddress: req.ip || null,
    });

    // 5. Return success
    res.status(200).json({
      message: 'Payment Requested successfully! Your balance will update shortly!',
      recharge: deposit,
      status: true,
      timeStamp: timeNow,
    });

  } catch (error) {
    console.error('addManualUSDTPaymentRequestHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
    });
  }
};
