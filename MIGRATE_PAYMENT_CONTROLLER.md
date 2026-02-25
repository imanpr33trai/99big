# Payment Controller Migration Task - JavaScript to TypeScript

## Overview

You are tasked with migrating the legacy JavaScript payment controller (`src/controllersOld/paymentController.ts`) to a modern, type-safe TypeScript implementation. This is a **GREENFIELD MIGRATION** - do not reference any existing migrated code. Build everything from scratch following the specifications below.

---

## Project Context

### Application Type
- **99BigDaddy** - Online lottery and betting platform
- **Payment Methods**: UPI Gateway, UPI Manual, USDT Manual, WowPay
- **Payment Flow**: Deposit → Verification → Balance Credit

### Tech Stack
- **Runtime**: Node.js with Express
- **Language**: TypeScript (strict mode)
- **Database**: MySQL with modern schema (see `src/config/schema_best.sql`)
- **Validation**: Zod schemas
- **Database Driver**: mysql2/promise with Pool
- **External APIs**: EKQR (UPI Gateway), WowPay, SMS Gateway

---

## Payment Methods

### 1. UPI Gateway (Automated)
- **Provider**: EKQR API
- **Flow**: User → Gateway → Callback → Auto-credit
- **Minimum**: Configurable (env: MINIMUM_MONEY)
- **Features**: 
  - Payment intent links (BHIM, PhonePe, Paytm, GPay)
  - Automatic verification via callback
  - Order status checking

### 2. UPI Manual (Semi-automated)
- **Flow**: User → QR Code → UTR Submission → Admin Approval
- **Minimum**: Configurable
- **Features**:
  - Dynamic QR code generation
  - UTR (12 digits) required
  - Admin approval required

### 3. USDT Manual (Crypto)
- **Flow**: User → USDT Address → Transaction Hash → Admin Approval
- **Conversion**: 1 USDT = ₹82 (configurable)
- **Minimum**: Configurable
- **Features**:
  - USDT wallet address display
  - Manual verification

### 4. WowPay (Payment Gateway)
- **Provider**: WowPay Global
- **Flow**: User → WowPay → Callback → Auto-credit
- **Minimum**: Configurable
- **Features**:
  - MD5 signature verification
  - Webhook callback
  - Auto-credit on success

---

## Database Schema Reference

### Key Tables You Will Use

#### `deposits` Table (replaces `recharge`)
```sql
- id: INT UNSIGNED (PK)
- orderId: VARCHAR(50) UNIQUE
- transactionId: VARCHAR(100)
- userId: INT UNSIGNED (FK to users)
- amount: DECIMAL(15,2)
- paymentMethodId: INT UNSIGNED (FK to paymentMethods)
- status: TINYINT (0=pending, 1=processing, 2=completed, 3=failed)
- utrNumber: VARCHAR(100)
- receiptUrl: VARCHAR(255)
- processedAt: BIGINT
- processedBy: INT UNSIGNED (FK to users)
- remarks: VARCHAR(255)
- ipAddress: VARCHAR(45)
- createdAt: BIGINT
```

#### `paymentMethods` Table (replaces `bank_recharge`)
```sql
- id: INT UNSIGNED (PK)
- type: ENUM('bank', 'upi', 'crypto', 'wallet')
- bankName: VARCHAR(100)
- accountName: VARCHAR(100)
- accountNumber: VARCHAR(50)
- ifscCode: VARCHAR(20)
- upiId: VARCHAR(100)
- cryptoAddress: VARCHAR(255)
- qrCodeUrl: VARCHAR(255)
- isActive: BOOLEAN
- displayOrder: INT
- createdAt: BIGINT
```

#### `users` Table
```sql
- id: INT UNSIGNED (PK)
- phone: VARCHAR(20) UNIQUE
- userName: VARCHAR(100)
- balance: DECIMAL(15,2)
- referralCode: VARCHAR(50) UNIQUE
- invitedBy: INT UNSIGNED (FK to users.id)
- firstDepositBonus: BOOLEAN
- freeBonus: DECIMAL(15,2)
- createdAt: BIGINT
- updatedAt: BIGINT
```

#### `salaryRecords` Table
```sql
- id: INT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- amount: DECIMAL(15,2)
- type: VARCHAR(50)
- description: VARCHAR(255)
- periodStart: DATE
- periodEnd: DATE
- isPaid: BOOLEAN
- paidAt: BIGINT
- createdAt: BIGINT
```

#### `transactionLogs` Table
```sql
- id: BIGINT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- relatedUserId: INT UNSIGNED
- typeId: TINYINT UNSIGNED (FK to transactionTypes)
- amount: DECIMAL(15,2)
- balanceBefore: DECIMAL(15,2)
- balanceAfter: DECIMAL(15,2)
- referenceId: INT UNSIGNED
- referenceType: VARCHAR(50)
- description: VARCHAR(255)
- ipAddress: VARCHAR(45)
- userAgent: VARCHAR(255)
- createdAt: BIGINT
```

---

## Files to Create

### 1. Types File: `src/types/payment.types.ts`

Create comprehensive Zod schemas and TypeScript types:

```typescript
// REQUIRED SCHEMAS TO CREATE:

// Payment Methods
export const PaymentMethodSchema = z.object({
  type: z.enum(['bank', 'upi', 'crypto', 'wallet']),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().email().optional(),
  cryptoAddress: z.string().optional(),
  qrCodeUrl: z.string().url().optional(),
});

// UPI Payment
export const UPIPaymentSchema = z.object({
  money: z.number().int().positive(),
});

export const UPIPaymentVerifySchema = z.object({
  client_txn_id: z.string(),
});

// Manual Payment
export const ManualPaymentSchema = z.object({
  money: z.number().int().positive(),
  utr: z.string().length(12),
});

// USDT Payment
export const USDTPaymentSchema = z.object({
  money: z.number().int().positive(),
  utr: z.string().min(1),
});

// WowPay
export const WowPaySchema = z.object({
  money: z.number().int().positive(),
});

// WowPay Callback
export const WowPayCallbackSchema = z.object({
  mchId: z.string(),
  amount: z.string(),
  mchOrderNo: z.string(),
  merRetMsg: z.string(),
  orderDate: z.string(),
  orderNo: z.string(),
  oriAmount: z.string(),
  tradeResult: z.string(),
  signType: z.string(),
  sign: z.string(),
});

// REQUIRED TYPES TO CREATE:
export interface PaymentApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  urls?: {
    web_url: string;
    bhim_link: string;
    phonepe_link: string;
    paytm_link: string;
    gpay_link: string;
  };
  [key: string]: unknown;
}

export enum PaymentStatus {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4,
}

export enum PaymentMethodType {
  UPI_GATEWAY = 'upi_gateway',
  UPI_MANUAL = 'upi_manual',
  USDT_MANUAL = 'usdt_manual',
  WOW_PAY = 'wow_pay',
  BANK = 'bank',
  CRYPTO = 'crypto',
}

export interface PaymentMethod {
  id: number;
  type: PaymentMethodType;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  upiId: string | null;
  cryptoAddress: string | null;
  qrCodeUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface DepositRecord {
  id: number;
  orderId: string;
  transactionId: string | null;
  userId: number;
  amount: number;
  paymentMethodId: number | null;
  status: PaymentStatus;
  utrNumber: string | null;
  receiptUrl: string | null;
  processedAt: number | null;
  processedBy: number | null;
  remarks: string | null;
  ipAddress: string | null;
  createdAt: number;
}

export interface EKQRResponse {
  status: boolean;
  msg?: string;
  data: {
    payment_url: string;
    upi_intent?: {
      bhim_link: string;
      phonepe_link: string;
      paytm_link: string;
      gpay_link: string;
    };
    status: 'created' | 'scanning' | 'success' | 'failure' | 'close';
  };
}

export interface WowPayResponse {
  respCode: string;
  respMsg: string;
  payInfo: string;
  mchOrderNo: string;
  sign: string;
}

export interface WowPayCallbackParams {
  mchId: string;
  amount: string;
  mchOrderNo: string;
  merRetMsg: string;
  orderDate: string;
  orderNo: string;
  oriAmount: string;
  tradeResult: string;
  signType: string;
  sign: string;
}

export interface DepositBonus {
  isFirstDeposit: boolean;
  bonusPercentage: number;
  freeBonus: number;
  salary: number;
}

// Payment Gateway Config
export interface EKQRConfig {
  key: string;
  p_info: string;
  email: string;
  redirect_url: string;
}

export interface WowPayConfig {
  mch_id: string;
  mch_key: string;
  pay_type: string;
  notify_url: string;
  page_url: string;
}
```

### 2. Middleware: `src/middleware/paymentAuth.middleware.ts`

```typescript
// Create:
- paymentAuthMiddleware(db: Pool) - validates user token for payments
- webhookAuthMiddleware(db: Pool) - validates webhook signatures
- Optional: rate limiting for payment endpoints
```

### 3. Database Queries: `src/db/payment.queries.ts`

```typescript
// REQUIRED QUERY FUNCTIONS TO CREATE:

// Deposit Queries
export const findDepositByOrderId = async (db: Pool, orderId: string) => {...}
export const findDepositById = async (db: Pool, id: number) => {...}
export const findPendingDepositsByPhone = async (db: Pool, phone: string) => {...}
export const findDepositsByUserId = async (db: Pool, userId: number, status?: number) => {...}
export const createDeposit = async (db: Pool, data: object) => {...}
export const updateDepositStatus = async (db: Pool, id: number, status: number) => {...}
export const updateDepositStatusByOrderId = async (db: Pool, orderId: string, status: number) => {...}
export const cancelDeposit = async (db: Pool, id: number) => {...}
export const deletePendingDeposits = async (db: Pool, phone: string) => {...}

// Payment Method Queries
export const getPaymentMethods = async (db: Pool, activeOnly?: boolean) => {...}
export const getPaymentMethodByType = async (db: Pool, type: string) => {...}
export const updatePaymentMethod = async (db: Pool, type: string, data: object) => {...}
export const createPaymentMethod = async (db: Pool, data: object) => {...}

// User Balance Queries
export const updateUserBalance = async (db: Pool, userId: number, amount: number) => {...}
export const findUserByPhone = async (db: Pool, phone: string) => {...}
export const findUserByAuthToken = async (db: Pool, token: string) => {...}
export const setFirstDepositBonus = async (db: Pool, userId: number) => {...}
export const updateFreeBonus = async (db: Pool, userId: number, amount: number) => {...}

// Commission Queries
export const findReferrerByCode = async (db: Pool, code: string) => {...}
export const createSalaryRecord = async (db: Pool, data: object) => {...}
export const getDepositBonusConfig = async (db: Pool) => {...}

// Transaction Log Queries
export const createTransactionLog = async (db: Pool, data: object) => {...}

// Helper Functions
export const formatTimeIST = (timestamp?: number) => {...}
export const getTodayString = () => {...}
export const getCurrentTimeForTodayField = () => {...}
export const getDMYDateOfTodayField = (today: string) => {...}
```

### 4. Services

#### 4.1 `src/services/payment/paymentHelpers.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- generateOrderId(): string
- getUserDataByAuthToken(db: Pool, authToken: string): Promise<object>
- calculateDepositBonus(amount: number, isFirstDeposit: boolean, freeBonus: number): DepositBonus
- processDepositCredit(db: Pool, deposit: object): Promise<void>
- validateUTR(utr: string): boolean
- validateAmount(amount: number, minimum: number): boolean
```

#### 4.2 `src/services/payment/upiGateway.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- initiateEKQRPayment(data: object): Promise<EKQRResponse>
- verifyEKQRPayment(orderId: string, txnDate: string): Promise<EKQRResponse>
- parseEKQRResponse(response: any): EKQRResponse
- getUPIIntentLinks(data: EKQRResponse): object
- handleEKQRError(error: any): Error
```

#### 4.3 `src/services/payment/wowpay.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- generateWowPaySign(params: object, secretKey: string): string
- validateWowPaySign(signSource: string, key: string, retSign: string): boolean
- initiateWowPayPayment(data: object): Promise<WowPayResponse>
- verifyWowPayCallback(params: WowPayCallbackParams): boolean
- getCurrentDate(): string
- parseWowPayCallback(data: any): WowPayCallbackParams
```

#### 4.4 `src/services/payment/upiQr.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- generateUPIQRCode(upiId: string, amount: number): Promise<string>
- parseUPIString(upiString: string): object
- validateUPIId(upiId: string): boolean
```

#### 4.5 `src/services/payment/deposit.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- createDepositRecord(db: Pool, data: object): Promise<object>
- cancelPendingDeposits(db: Pool, phone: string): Promise<void>
- processManualDeposit(db: Pool, deposit: object): Promise<void>
- processGatewayDeposit(db: Pool, deposit: object): Promise<void>
- handleDepositVerification(db: Pool, deposit: object): Promise<void>
```

### 5. Controllers

#### 5.1 `src/controllers/payment/upiGateway.controller.ts`

```typescript
// REQUIRED FUNCTIONS:

// Initiate UPI Payment
export const initiateUPIPaymentHandler = (db: Pool) => async (req: Request, res: Response<PaymentApiResponse>): Promise<void> => {
  try {
    // 1. Validate input with Zod
    const parsed = UPIPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', status: false });
      return;
    }

    const { money } = parsed.data;
    const auth = req.cookies.auth;
    const timeNow = new Date().toISOString();

    // 2. Check minimum amount
    const minimumMoney = parseInt(process.env.MINIMUM_MONEY || '100');
    if (money < minimumMoney) {
      res.status(400).json({
        message: `Money is required and it should be ₹${minimumMoney} or above!`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    // 3. Get user data
    const user = await getUserDataByAuthToken(db, auth);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow });
      return;
    }

    // 4. Cancel pending deposits
    await cancelPendingDeposits(db, user.phone);

    // 5. Generate order ID
    const orderId = generateOrderId();

    // 6. Call EKQR API
    const ekqrResponse = await initiateEKQRPayment({
      key: process.env.UPI_GATEWAY_PAYMENT_KEY,
      client_txn_id: orderId,
      amount: String(money),
      p_info: process.env.PAYMENT_INFO,
      customer_name: user.username,
      customer_email: process.env.PAYMENT_EMAIL,
      customer_mobile: user.phone,
      redirect_url: `${process.env.APP_BASE_URL}/wallet/verify/upi`,
    });

    // 7. Handle error
    if (!ekqrResponse || !ekqrResponse.status) {
      console.error('Gateway error from ekqr!', ekqrResponse);
      if (ekqrResponse?.msg === 'Plan Expired. Please Renew Plan') {
        res.status(400).json({
          message: 'Payment gateway plan has expired. Please contact support to renew the plan.',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }
      throw new Error('Gateway error from ekqr!');
    }

    // 8. Create deposit record
    const deposit = await createDepositRecord(db, {
      orderId,
      transactionId: null,
      utr: null,
      phone: user.phone,
      money,
      type: PaymentMethodType.UPI_GATEWAY,
      status: PaymentStatus.PENDING,
      today: getCurrentTimeForTodayField(),
      url: ekqrResponse.data.payment_url,
      time: timeNow,
    });

    // 9. Get UPI intent links
    const upiLinks = getUPIIntentLinks(ekqrResponse);

    // 10. Return success
    res.status(200).json({
      message: 'Payment initiated successfully',
      recharge: deposit,
      urls: upiLinks,
      status: true,
      timeStamp: timeNow,
    });
  } catch (error) {
    console.error('Error executing payment initiation:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
      error,
    });
  }
};

// Verify UPI Payment
export const verifyUPIPaymentHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = req.cookies.auth;
    const orderId = req.query.client_txn_id as string;
    const timeNow = new Date().toISOString();

    // 1. Validate input
    if (!auth || !orderId) {
      res.status(400).json({ message: 'orderId is Required!', status: false, timeStamp: timeNow });
      return;
    }

    // 2. Get user and deposit
    const user = await getUserDataByAuthToken(db, auth);
    const deposit = await findDepositByOrderId(db, orderId);

    if (!deposit) {
      res.status(400).json({ message: 'Unable to find recharge with this order id!', status: false, timeStamp: timeNow });
      return;
    }

    // 3. Verify with EKQR
    const txnDate = getDMYDateOfTodayField(deposit.today);
    const ekqrResponse = await verifyEKQRPayment(orderId, txnDate);

    if (!ekqrResponse || !ekqrResponse.status) {
      throw new Error('Gateway error from ekqr!');
    }

    // 4. Handle different statuses
    if (ekqrResponse.data.status === 'created') {
      res.status(200).json({ message: 'Your payment request is just created', status: false, timeStamp: timeNow });
      return;
    }

    if (ekqrResponse.data.status === 'scanning') {
      res.status(200).json({ message: 'Waiting for confirmation', status: false, timeStamp: timeNow });
      return;
    }

    if (ekqrResponse.data.status === 'success') {
      // 5. Update deposit status
      if (deposit.status === PaymentStatus.PENDING || deposit.status === PaymentStatus.CANCELLED) {
        await updateDepositStatus(db, deposit.id, PaymentStatus.COMPLETED);
        await processDepositCredit(db, deposit);
      }

      // 6. Redirect to record page
      res.redirect('/wallet/rechargerecord');
      return;
    }

    // 7. Handle failure
    if (ekqrResponse.data.status === 'failure' || ekqrResponse.data.status === 'close') {
      await updateDepositStatus(db, deposit.id, PaymentStatus.FAILED);
      res.status(200).json({ message: 'Payment failed', status: false, timeStamp: timeNow });
      return;
    }
  } catch (error) {
    console.error('verifyUPIPaymentHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
      error,
    });
  }
};
```

#### 5.2 `src/controllers/payment/manualPayment.controller.ts`

```typescript
// REQUIRED FUNCTIONS:

// Initiate Manual UPI Payment (Show QR)
export const initiateManualUPIPaymentHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  try {
    const amount = parseFloat(req.query.am as string);

    // 1. Get UPI details from database
    const paymentMethod = await getPaymentMethodByType(db, PaymentMethodType.UPI_MANUAL);
    if (!paymentMethod) {
      res.status(400).json({ message: 'Payment method not configured', status: false });
      return;
    }

    // 2. Generate QR code
    const qrCodeUrl = await generateUPIQRCode(paymentMethod.upiId, amount);

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

// Submit Manual UPI Payment
export const addManualUPIPaymentRequestHandler = (db: Pool) => async (req: Request, res: Response<PaymentApiResponse>): Promise<void> => {
  try {
    const { money, utr } = req.body;
    const auth = req.cookies.auth;
    const timeNow = new Date().toISOString();

    // 1. Validate input
    const minimumMoney = parseInt(process.env.MINIMUM_MONEY || '100');
    if (!money || money < minimumMoney) {
      res.status(400).json({
        message: `Money is Required and it should be ₹${minimumMoney} or above!`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    if (!utr || utr.length !== 12) {
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
    const orderId = generateOrderId();
    const deposit = await createDepositRecord(db, {
      orderId,
      transactionId: 'NULL',
      utr,
      phone: user.phone,
      money,
      type: PaymentMethodType.UPI_MANUAL,
      status: PaymentStatus.PENDING,
      today: getCurrentTimeForTodayField(),
      url: 'NULL',
      time: timeNow,
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

// Initiate Manual USDT Payment
export const initiateManualUSDTPaymentHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  try {
    const amount = parseFloat(req.query.am as string);

    // 1. Get USDT details from database
    const paymentMethod = await getPaymentMethodByType(db, PaymentMethodType.USDT_MANUAL);
    if (!paymentMethod) {
      res.status(400).json({ message: 'Payment method not configured', status: false });
      return;
    }

    // 2. Render payment page
    res.render('wallet/usdt_manual_payment.ejs', {
      Amount: amount,
      UsdtWalletAddress: paymentMethod.cryptoAddress,
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

// Submit Manual USDT Payment
export const addManualUSDTPaymentRequestHandler = (db: Pool) => async (req: Request, res: Response<PaymentApiResponse>): Promise<void> => {
  try {
    const { money, utr } = req.body;
    const auth = req.cookies.auth;
    const timeNow = new Date().toISOString();

    // 1. Validate input
    const minimumMoney = parseInt(process.env.MINIMUM_MONEY || '100');
    const moneyINR = money * 82; // USDT to INR conversion

    if (!money || moneyINR < minimumMoney) {
      res.status(400).json({
        message: `Money is Required and it should be ₹${minimumMoney} or ${(minimumMoney / 82).toFixed(2)} USDT or above!`,
        status: false,
        timeStamp: timeNow,
      });
      return;
    }

    if (!utr) {
      res.status(400).json({
        message: 'Ref No. or UTR is Required',
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
    const orderId = generateOrderId();
    const deposit = await createDepositRecord(db, {
      orderId,
      transactionId: 'NULL',
      utr,
      phone: user.phone,
      money: moneyINR,
      type: PaymentMethodType.USDT_MANUAL,
      status: PaymentStatus.PENDING,
      today: getCurrentTimeForTodayField(),
      url: 'NULL',
      time: timeNow,
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
```

#### 5.3 `src/controllers/payment/wowpay.controller.ts`

```typescript
// REQUIRED FUNCTIONS:

// Initiate WowPay Payment
export const initiateWowPayPaymentHandler = (db: Pool) => async (req: Request, res: Response<PaymentApiResponse>): Promise<void> => {
  try {
    const { money } = req.query;
    const auth = req.cookies.auth;
    const timeNow = new Date().toISOString();

    // 1. Validate input
    const minimumMoney = parseInt(process.env.MINIMUM_MONEY || '100');
    const moneyNum = parseInt(money as string);

    if (!moneyNum || moneyNum < minimumMoney) {
      res.status(400).json({
        message: `Money is Required and it should be ₹${minimumMoney} or above!`,
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

    // 4. Generate order ID and date
    const orderId = generateOrderId();
    const date = getCurrentDate();

    // 5. Prepare WowPay parameters
    const params = {
      version: '1.0',
      mch_id: process.env.WOWPAY_MERCHANT_ID,
      mch_order_no: orderId,
      pay_type: '151',
      trade_amount: moneyNum,
      order_date: date,
      goods_name: user.phone,
      notify_url: `${process.env.APP_BASE_URL}/wallet/verify/wowpay`,
      mch_return_msg: user.phone,
      page_url: `${process.env.APP_BASE_URL}/wallet/verify/wowpay`,
    };

    // 6. Generate signature
    params.sign = generateWowPaySign(params, process.env.WOWPAY_MERCHANT_KEY);
    params.sign_type = 'MD5';

    // 7. Call WowPay API
    const response = await axios.post(
      'https://pay6de1c7.wowpayglb.com/pay/web',
      querystring.stringify(params)
    );

    // 8. Handle response
    if (response.data.respCode === 'SUCCESS' && response.data.payInfo) {
      res.status(200).json({
        message: 'Payment requested Successfully',
        payment_url: response.data.payInfo,
        status: true,
        timeStamp: timeNow,
      });
      return;
    }

    res.status(400).json({
      message: 'Payment request failed. Please try again or check details.',
      status: false,
      timeStamp: timeNow,
    });
  } catch (error) {
    console.error('initiateWowPayPaymentHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
    });
  }
};

// Verify WowPay Callback
export const verifyWowPayPaymentHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  try {
    let data = req.body;
    if (!req.body) {
      data = req.query;
    }

    const timeNow = Date.now();
    const merchant_key = process.env.WOWPAY_MERCHANT_KEY;

    // 1. Parse callback parameters
    const params: WowPayCallbackParams = {
      mchId: data.mchOrderNo || '',
      amount: data.amount || '',
      mchOrderNo: data.mchOrderNo || '',
      merRetMsg: data.merRetMsg || '',
      orderDate: data.orderDate || '',
      orderNo: data.orderNo || '',
      oriAmount: data.oriAmount || '',
      tradeResult: data.tradeResult || '',
      signType: data.signType || '',
      sign: data.sign || '',
    };

    // 2. Build sign string
    let signStr = '';
    signStr += 'amount=' + params.amount + '&';
    signStr += 'mchId=' + params.mchId + '&';
    signStr += 'mchOrderNo=' + params.mchOrderNo + '&';
    signStr += 'merRetMsg=' + params.merRetMsg + '&';
    signStr += 'orderDate=' + params.orderDate + '&';
    signStr += 'orderNo=' + params.orderNo + '&';
    signStr += 'oriAmount=' + params.oriAmount + '&';
    signStr += 'tradeResult=' + params.tradeResult;

    // 3. Validate signature
    const isValid = validateWowPaySign(signStr, merchant_key, params.sign);
    if (!isValid) {
      console.error('WowPay signature validation failed');
      res.status(400).json({
        status: false,
        message: 'Something went wrong!',
        timestamp: timeNow,
      });
      return;
    }

    // 4. Check if already processed
    const existingDeposit = await findDepositByOrderId(db, params.mchOrderNo);
    if (existingDeposit) {
      res.status(400).json({
        message: 'Recharge already verified!',
        status: true,
        timeStamp: timeNow,
      });
      return;
    }

    // 5. Create deposit record
    const newRechargeParams = {
      orderId: params.mchOrderNo,
      transactionId: 'NULL',
      utr: null,
      phone: params.merRetMsg,
      money: parseFloat(params.amount),
      type: PaymentMethodType.WOW_PAY,
      status: PaymentStatus.COMPLETED,
      today: getCurrentTimeForTodayField(),
      url: 'NULL',
      time: timeNow,
    };

    const deposit = await createDepositRecord(db, newRechargeParams);

    // 6. Credit user account with bonus
    await processDepositCredit(db, deposit);

    // 7. Redirect to record page
    res.redirect('/wallet/rechargerecord');
  } catch (error) {
    console.error('verifyWowPayPaymentHandler error:', error);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!',
      timestamp: Date.now(),
    });
  }
};
```

#### 5.4 `src/controllers/payment/callback.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const callbackBankHandler = async (req: Request, res: Response): Promise<void> => {
  // Payment gateway webhook for bank transfers
  // 1. Validate transaction
  // 2. Update deposit status
  // 3. Add balance to user
  // 4. Return success
};
```

### 6. Routes: `src/routes/payment.routes.ts`

```typescript
import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { initiateUPIPaymentHandler } from '../controllers/payment/upiGateway.controller';
import { verifyUPIPaymentHandler } from '../controllers/payment/upiGateway.controller';
import { initiateManualUPIPaymentHandler } from '../controllers/payment/manualPayment.controller';
import { addManualUPIPaymentRequestHandler } from '../controllers/payment/manualPayment.controller';
import { initiateManualUSDTPaymentHandler } from '../controllers/payment/manualPayment.controller';
import { addManualUSDTPaymentRequestHandler } from '../controllers/payment/manualPayment.controller';
import { initiateWowPayPaymentHandler } from '../controllers/payment/wowpay.controller';
import { verifyWowPayPaymentHandler } from '../controllers/payment/wowpay.controller';
import { paymentAuthMiddleware } from '../middleware/paymentAuth.middleware';

export const createPaymentRoutes = (db: Pool): Router => {
  const router = Router();

  // UPI Gateway
  router.post('/upi/initiate', paymentAuthMiddleware(db), initiateUPIPaymentHandler(db));
  router.get('/upi/verify', paymentAuthMiddleware(db), verifyUPIPaymentHandler(db));

  // WowPay
  router.get('/wowpay/initiate', paymentAuthMiddleware(db), initiateWowPayPaymentHandler(db));
  router.post('/wowpay/verify', verifyWowPayPaymentHandler(db));

  // Manual UPI
  router.get('/manual/upi', initiateManualUPIPaymentHandler(db));
  router.post('/manual/upi', paymentAuthMiddleware(db), addManualUPIPaymentRequestHandler(db));

  // Manual USDT
  router.get('/manual/usdt', initiateManualUSDTPaymentHandler(db));
  router.post('/manual/usdt', paymentAuthMiddleware(db), addManualUSDTPaymentRequestHandler(db));

  return router;
};
```

### 7. Utils: `src/utils/payment.helpers.ts`

```typescript
// REQUIRED HELPER FUNCTIONS:

// Generate order ID
export const generateOrderId = (): string => {
  const date = new Date();
  const id_time = String(date.getUTCFullYear()) + 
                  String(date.getUTCMonth() + 1) + 
                  String(date.getUTCDate());
  const id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};

// Format time in IST
export const formatTimeIST = (timestamp?: number): string => {
  // Implementation
};

// Get current time for today field
export const getCurrentTimeForTodayField = (): string => {
  return moment().format('YYYY-DD-MM h:mm:ss A');
};

// Get DMY date from today field
export const getDMYDateOfTodayField = (today: string): string => {
  return moment(today, 'YYYY-DD-MM h:mm:ss A').format('DD-MM-YYYY');
};

// Validate UTR
export const validateUTR = (utr: string): boolean => {
  return /^\d{12}$/.test(utr);
};

// Validate amount
export const validateAmount = (amount: number, minimum: number): boolean => {
  return amount >= minimum;
};

// Calculate deposit bonus
export const calculateDepositBonus = (
  amount: number,
  isFirstDeposit: boolean,
  freeBonus: number
): DepositBonus => {
  const tenPercent = 0.1 * amount;
  const incrementPercentage = isFirstDeposit ? 0.15 : 0.05;
  
  let salary = 0;
  if (amount >= 100 && amount <= 299) salary = 20;
  else if (amount >= 300 && amount <= 999) salary = 60;
  else if (amount >= 1000) salary = 150;

  let bonusMoney = amount + (amount * incrementPercentage);
  let usedFreeBonus = 0;

  if (freeBonus >= tenPercent) {
    bonusMoney += tenPercent;
    usedFreeBonus = tenPercent;
  } else {
    bonusMoney += freeBonus;
    usedFreeBonus = freeBonus;
  }

  return {
    isFirstDeposit,
    bonusPercentage: incrementPercentage,
    freeBonus: usedFreeBonus,
    salary,
  };
};

// Generate UPI string
export const generateUPIString = (upiId: string, amount: number, name?: string): string => {
  return `upi://pay?pa=${upiId}&pn=${name || 'UPI Payment'}&am=${amount}&cu=INR`;
};

// WowPay: Generate sign
export const generateWowPaySign = (params: object, secretKey: string): string => {
  const keys = Object.keys(params).sort();
  const stringArr = [];
  for (const key of keys) {
    if (key === 'sign') continue;
    stringArr.push(key + '=' + params[key]);
  }
  const signStr = stringArr.join('&') + '&key=' + secretKey;
  return crypto.createHash('md5').update(signStr).digest('hex');
};

// WowPay: Validate sign
export const validateWowPaySign = (signSource: string, key: string, retSign: string): boolean => {
  let signStr = signSource;
  if (key) {
    signStr += '&key=' + key;
  }
  const signKey = crypto.createHash('md5').update(signStr).digest('hex');
  return signKey === retSign;
};

// WowPay: Get current date
export const getCurrentDate = (): string => {
  return moment().format('YYYY-MM-DD H:mm:ss');
};
```

---

## Critical Requirements

### 1. Payment Security

```typescript
// All payment operations must:
1. Validate user authentication
2. Validate amount (minimum deposit)
3. Validate UTR format (12 digits for manual)
4. Cancel pending deposits before creating new one
5. Use prepared statements for SQL
6. Log all transactions
```

### 2. Gateway Integration

```typescript
// EKQR (UPI Gateway):
- API: https://api.ekqr.in/api/create_order
- Verify: https://api.ekqr.in/api/check_order_status
- Handle: 'created', 'scanning', 'success', 'failure', 'close'

// WowPay:
- API: https://pay6de1c7.wowpayglb.com/pay/web
- MD5 signature validation required
- Webhook callback handling
```

### 3. Deposit Bonus Logic

```typescript
// First deposit bonus:
- First deposit: 15% bonus
- Subsequent: 5% bonus
- Free bonus: Use if available (max 10% of amount)

// Salary bonus (for referrer):
- ₹100-299: ₹20
- ₹300-999: ₹60
- ₹1000+: ₹150
```

### 4. Payment Status Flow

```
PENDING (0) → PROCESSING (1) → COMPLETED (2)
                          ↓
                      FAILED (3)
                          ↓
                     CANCELLED (4)
```

### 5. Response Format

```typescript
// Success:
{
  message: "Payment initiated successfully",
  recharge: { ... },
  urls: {
    web_url: "...",
    bhim_link: "...",
    phonepe_link: "...",
    paytm_link: "...",
    gpay_link: "..."
  },
  status: true,
  timeStamp: 1234567890
}

// Error:
{
  message: "Something went wrong!",
  status: false,
  timeStamp: 1234567890
}
```

---

## Migration Checklist

### Phase 1: Foundation
- [ ] Create `src/types/payment.types.ts` with all Zod schemas
- [ ] Create `src/utils/payment.helpers.ts` with helper functions
- [ ] Create `src/middleware/paymentAuth.middleware.ts`
- [ ] Create `src/db/payment.queries.ts` with all query functions

### Phase 2: Services
- [ ] Create `src/services/payment/paymentHelpers.service.ts`
- [ ] Create `src/services/payment/upiGateway.service.ts`
- [ ] Create `src/services/payment/wowpay.service.ts`
- [ ] Create `src/services/payment/upiQr.service.ts`
- [ ] Create `src/services/payment/deposit.service.ts`

### Phase 3: Controllers
- [ ] Create `src/controllers/payment/upiGateway.controller.ts`
- [ ] Create `src/controllers/payment/manualPayment.controller.ts`
- [ ] Create `src/controllers/payment/wowpay.controller.ts`
- [ ] Create `src/controllers/payment/callback.controller.ts`

### Phase 4: Routes
- [ ] Create `src/routes/payment.routes.ts`
- [ ] Export routes from `src/routes/web.ts`

### Phase 5: Testing
- [ ] Test UPI Gateway payment flow
- [ ] Test manual UPI payment flow
- [ ] Test USDT manual payment flow
- [ ] Test WowPay payment flow
- [ ] Test payment verification
- [ ] Test deposit bonus calculation
- [ ] Test webhook callbacks
- [ ] Test error handling

### Phase 6: Cleanup
- [ ] Remove old `src/controllersOld/paymentController.ts`
- [ ] Update all imports
- [ ] Verify no SQL injection vulnerabilities
- [ ] Test with real payment gateways (sandbox mode)

---

## Function-by-Function Migration Map

| Old Function | New Controller | Notes |
|--------------|----------------|-------|
| `initiateManualUPIPayment` | `manualPayment.controller.ts` | Show QR code page |
| `initiateManualUSDTPayment` | `manualPayment.controller.ts` | Show USDT address |
| `addManualUPIPaymentRequest` | `manualPayment.controller.ts` | Submit UTR |
| `addManualUSDTPaymentRequest` | `manualPayment.controller.ts` | Submit USDT tx hash |
| `initiateUPIPayment` | `upiGateway.controller.ts` | EKQR API integration |
| `verifyUPIPayment` | `upiGateway.controller.ts` | Payment verification |
| `initiateWowPayPayment` | `wowpay.controller.ts` | WowPay integration |
| `verifyWowPayPayment` | `wowpay.controller.ts` | Webhook callback |
| `getUserDataByAuthToken` | `paymentHelpers.service.ts` | Helper function |
| `addUserAccountBalance` | `deposit.service.ts` | Credit user with bonus |
| `getRechargeOrderId` | `payment.helpers.ts` | Order ID generation |
| `rechargeTable.*` | `deposit.service.ts` | Deposit CRUD operations |
| `wowpay.*` | `wowpay.service.ts` | WowPay utilities |

---

## Testing Requirements

After migration, verify:

1. **UPI Gateway**
   - Payment initiation works
   - UPI intent links generated
   - Payment verification works
   - Balance credited correctly

2. **Manual UPI**
   - QR code generated
   - UTR submission works
   - Admin approval flow works

3. **USDT Manual**
   - USDT address displayed
   - Transaction submission works
   - Conversion rate applied (1 USDT = ₹82)

4. **WowPay**
   - Payment initiation works
   - Signature validation works
   - Webhook callback processed
   - Balance credited correctly

5. **Deposit Bonus**
   - First deposit bonus (15%)
   - Subsequent bonus (5%)
   - Free bonus applied correctly
   - Referrer salary calculated

6. **Error Handling**
   - Gateway errors handled
   - Invalid amounts rejected
   - Duplicate deposits prevented
   - Signature validation failures logged

---

## Dependencies

```json
{
  "dependencies": {
    "zod": "^3.22.4",
    "mysql2": "^3.9.0",
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "moment": "^2.29.4",
    "crypto": "^1.0.1",
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/qrcode": "^1.5.5",
    "typescript": "^5.3.0"
  }
}
```

---

## Success Criteria

- ✅ All functions from old controller migrated
- ✅ All inputs validated with Zod
- ✅ Full TypeScript type coverage
- ✅ All database queries use new schema tables
- ✅ Foreign key constraints respected
- ✅ Error handling on all async operations
- ✅ Consistent response format
- ✅ No SQL injection vulnerabilities
- ✅ All routes properly protected with auth middleware
- ✅ Payment gateway integrations working
- ✅ Signature validation for WowPay
- ✅ QR code generation for UPI
- ✅ Deposit bonus calculation correct
- ✅ Webhook callbacks handled securely

---

**Start Date**: Today
**Priority**: P1 - High Priority (Revenue-critical)
**Estimated Effort**: 1-2 days for complete migration
