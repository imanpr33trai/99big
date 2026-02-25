# User Controller Migration Task - JavaScript to TypeScript

## Overview

You are tasked with migrating the legacy JavaScript user controller (`src/controllersOld/userController.ts`) to a modern, type-safe TypeScript implementation. This is a **GREENFIELD MIGRATION** - do not reference any existing migrated code. Build everything from scratch following the specifications below.

---

## Project Context

### Application Type
- **99BigDaddy** - Online lottery and betting platform
- **User Features**: Authentication, wallet, referrals, check-ins, promotions
- **User Levels**: Regular users (level 0), CTV/Agents (level 2), Admins (level 1)

### Tech Stack
- **Runtime**: Node.js with Express
- **Language**: TypeScript (strict mode)
- **Database**: MySQL with modern schema (see `src/config/schema_best.sql`)
- **Validation**: Zod schemas
- **Password Hashing**: bcrypt (NOT md5 - this is critical)
- **Database Driver**: mysql2/promise with Pool

---

## ⚠️ CRITICAL SECURITY ISSUES IN OLD CODE

### 1. MD5 Password Hashing - MUST USE BCRYPT

```typescript
// ❌ WRONG (from old code - SECURITY VULNERABILITY):
import md5 from 'md5';
const hash = md5(password);
const isValid = md5(password) === storedHash;

// ✅ CORRECT:
import bcrypt from 'bcrypt';
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
const isValid = await bcrypt.compare(password, hash);
```

### 2. Hardcoded SMS Gateway Credentials

```typescript
// ❌ WRONG (from old code - SECURITY RISK):
request(`http://47.243.168.18:9090/sms/batch/v2?appkey=NFJKdK&appsecret=brwkTw&phone=84${user.phone}...`)

// ✅ CORRECT:
// Use environment variables for API credentials
const smsApiKey = process.env.SMS_API_KEY;
const smsApiSecret = process.env.SMS_API_SECRET;
const smsBaseUrl = process.env.SMS_BASE_URL;
```

### 3. SQL Injection Risk

```typescript
// ❌ WRONG (from old code):
await connection.query(`SELECT * FROM users WHERE phone = ${phone}`);

// ✅ CORRECT:
const [users] = await db.execute(
  'SELECT * FROM users WHERE phone = ?',
  [phone]
);
```

---

## Database Schema Reference

### Key Tables You Will Use

#### `users` Table
```sql
- id: INT UNSIGNED (PK)
- phone: VARCHAR(20) UNIQUE
- userName: VARCHAR(100)
- passwordHash: VARCHAR(255) -- bcrypt hash, NOT md5
- authToken: VARCHAR(255)
- balance: DECIMAL(15,2)
- referralCode: VARCHAR(50) UNIQUE
- invitedBy: INT UNSIGNED (FK to users.id)
- isVerified: BOOLEAN
- otpCode: VARCHAR(10)
- otpExpiresAt: BIGINT
- otpAttempts: TINYINT UNSIGNED
- status: TINYINT (0=active, 1=suspended, 2=banned)
- userLevel: TINYINT (0=user, 1=admin, 2=ctv)
- createdAt: BIGINT
- updatedAt: BIGINT
- freeBonus: INT
- firstDepositBonus: BOOLEAN
```

#### `deposits` Table (replaces `recharge`)
```sql
- id: INT UNSIGNED (PK)
- orderId: VARCHAR(50) UNIQUE
- userId: INT UNSIGNED (FK)
- amount: DECIMAL(15,2)
- status: TINYINT (0=pending, 1=processing, 2=completed, 3=failed)
- utrNumber: VARCHAR(100)
- createdAt: BIGINT
```

#### `withdrawals` Table
```sql
- id: INT UNSIGNED (PK)
- orderId: VARCHAR(50) UNIQUE
- userId: INT UNSIGNED (FK)
- amount: DECIMAL(15,2)
- status: TINYINT (0=pending, 1=processing, 2=completed, 3=rejected)
- rejectionReason: VARCHAR(255)
- requestedAt: BIGINT
```

#### `userBankAccounts` Table (replaces `user_bank`)
```sql
- id: INT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- type: ENUM('bank', 'upi', 'crypto')
- bankName: VARCHAR(100)
- accountName: VARCHAR(100)
- accountNumber: VARCHAR(50)
- ifscCode: VARCHAR(20)
- isDefault: BOOLEAN
- isVerified: BOOLEAN
```

#### `balanceTransfers` Table (replaces direct transfer queries)
```sql
- id: INT UNSIGNED (PK)
- senderId: INT UNSIGNED (FK)
- receiverId: INT UNSIGNED (FK)
- amount: DECIMAL(15,2)
- status: TINYINT (0=failed, 1=success)
- createdAt: BIGINT
```

#### `redEnvelopes` Table (replaces `redenvelopes`)
```sql
- id: INT UNSIGNED (PK)
- envelopeId: VARCHAR(50) UNIQUE
- creatorId: INT UNSIGNED (FK)
- totalAmount: DECIMAL(15,2)
- totalCount: INT
- claimedCount: INT
- status: TINYINT (0=active, 1=completed, 2=expired)
- expiredAt: BIGINT
```

#### `redEnvelopeClaims` Table (replaces `redenvelopes_used`)
```sql
- id: INT UNSIGNED (PK)
- envelopeId: INT UNSIGNED (FK)
- claimerId: INT UNSIGNED (FK)
- amount: DECIMAL(15,2)
- claimedAt: BIGINT
```

#### `checkInRecords` Table
```sql
- id: INT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- consecutiveDays: INT
- rewardAmount: DECIMAL(15,2)
- checkInDate: DATE
- createdAt: BIGINT
```

#### `userPoints` Table (replaces `point_list`)
```sql
- id: INT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- points: DECIMAL(15,2)
- pointsUs: DECIMAL(15,2)
- totalWeek1-7: DECIMAL(15,2)
- currentLevel: TINYINT UNSIGNED
- updatedAt: BIGINT
```

#### `commissionLevels` Table (replaces `level`)
```sql
- id: TINYINT UNSIGNED (PK)
- level: TINYINT UNSIGNED
- rateF1: DECIMAL(5,4)
- rateF2: DECIMAL(5,4)
- rateF3: DECIMAL(5,4)
- rateF4: DECIMAL(5,4)
- minTurnover: DECIMAL(15,2)
```

---

## Files to Create

### 1. Types File: `src/types/user.types.ts`

Create comprehensive Zod schemas and TypeScript types:

```typescript
// REQUIRED SCHEMAS TO CREATE:

// Authentication
export const UserVerifyCodeSchema = z.object({
  // OTP verification
});

export const UserChangePasswordSchema = z.object({
  password: z.string().min(6),
  newPassWord: z.string().min(6),
});

export const UserChangeInfoSchema = z.object({
  name: z.string().min(3).max(50),
  type: z.enum(['editname']),
});

// Check-in
export const UserCheckInSchema = z.object({
  data: z.number().optional(),
});

// Banking
export const UserBankSchema = z.object({
  name_bank: z.string().min(3),
  name_user: z.string().min(3),
  stk: z.string().min(5),
  email: z.string().email(),
  tinh: z.string(),
});

export const UserInfoBankSchema = z.object({
  // No body required
});

// Withdrawal
export const UserWithdrawSchema = z.object({
  money: z.number().int().min(299),
  password: z.string().min(6),
});

// Transfer
export const UserTransferSchema = z.object({
  amount: z.number().int().positive(),
  phone: z.string().min(10),
});

// Red Envelope
export const UserRedEnvelopeSchema = z.object({
  code: z.string().min(1),
});

// Recharge
export const UserRechargeSchema = z.object({
  money: z.number().int().positive(),
  type: z.string().optional(),
});

export const UserUpdateRechargeSchema = z.object({
  money: z.number().int().positive(),
  id_order: z.string(),
  inputData: z.string(),
});

export const UserConfirmRechargeSchema = z.object({
  client_txn_id: z.string(),
});

// Search
export const UserSearchSchema = z.object({
  phone: z.string().min(10),
});

// REQUIRED TYPES TO CREATE:
export interface UserApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  [key: string]: unknown;
}

export interface UserAuthPayload {
  userId: number;
  phone: string;
  userLevel: number;
}

export interface UserFinancialData {
  code: string;
  id_user: number;
  name_user: string;
  phone_user: string;
  money_user: number;
  totalRecharge: number;
  totalWithdraw: number;
  freeBonus: number;
}

export interface ReferralData {
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  total_f: number;
  f1_today: number;
  f_all_today: number;
  roses_f1: number;
  roses_f: number;
  roses_all: number;
  roses_today: number;
}

export interface TeamMember {
  id_user: number;
  name_user: string;
  phone: string;
  code: string;
  invite: string;
  rank: number;
  total_money: number;
  invite_count: number;
  user_level: number;
  daily_turn_over: number;
  total_turn_over: number;
}

export interface CheckInReward {
  day: number;
  requiredDeposit: number;
  reward: number;
}

export const CHECK_IN_REWARDS: CheckInReward[] = [
  { day: 1, requiredDeposit: 300, reward: 300 },
  { day: 2, requiredDeposit: 3000, reward: 3000 },
  { day: 3, requiredDeposit: 6000, reward: 6000 },
  { day: 4, requiredDeposit: 12000, reward: 12000 },
  { day: 5, requiredDeposit: 28000, reward: 28000 },
  { day: 6, requiredDeposit: 100000, reward: 100000 },
  { day: 7, requiredDeposit: 200000, reward: 200000 },
];
```

### 2. Middleware: `src/middleware/userAuth.middleware.ts`

```typescript
// Create:
- userAuthMiddleware(db: Pool) - validates user token
- Optional: rate limiting for sensitive endpoints (password change, withdrawal)
```

### 3. Database Queries: `src/db/user.queries.ts`

```typescript
// REQUIRED QUERY FUNCTIONS TO CREATE:

// User Queries
export const findUserByToken = async (db: Pool, token: string) => {...}
export const findUserByPhone = async (db: Pool, phone: string) => {...}
export const findUserById = async (db: Pool, id: number) => {...}
export const updateUserAuthToken = async (db: Pool, userId: number, token: string) => {...}
export const updateUserPassword = async (db: Pool, userId: number, hash: string) => {...}
export const updateUserName = async (db: Pool, userId: number, name: string) => {...}
export const updateUserBalance = async (db: Pool, userId: number, amount: number) => {...}
export const deductUserBalance = async (db: Pool, userId: number, amount: number) => {...}
export const updateUserOTP = async (db: Pool, userId: number, otp: string, expiresAt: number) => {...}
export const setFirstDepositBonus = async (db: Pool, userId: number) => {...}
export const updateFreeBonus = async (db: Pool, userId: number, amount: number) => {...}

// OTP Queries
export const verifyUserOTP = async (db: Pool, userId: number, otp: string) => {...}
export const isOTPRateLimited = async (db: Pool, userId: number) => {...}

// Referral Queries
export const getDirectReferrals = async (db: Pool, code: string) => {...}
export const getAllReferrals = async (db: Pool, code: string, maxDepth?: number) => {...}
export const getReferralStatistics = async (db: Pool, userId: number) => {...}
export const getReferralHierarchy = async (db: Pool, code: string) => {...}

// Bank Account Queries
export const getUserBankAccounts = async (db: Pool, userId: number) => {...}
export const getDefaultBankAccount = async (db: Pool, userId: number) => {...}
export const createBankAccount = async (db: Pool, data: object) => {...}
export const updateBankAccount = async (db: Pool, userId: number, data: object) => {...}

// Transfer Queries
export const createTransfer = async (db: Pool, senderId: number, receiverId: number, amount: number) => {...}
export const getTransferHistory = async (db: Pool, userId: number) => {...}
export const findUserByPhoneForTransfer = async (db: Pool, phone: string) => {...}

// Check-in Queries
export const getCheckInRecords = async (db: Pool, userId: number) => {...}
export const createCheckInRecord = async (db: Pool, userId: number, days: number, reward: number) => {...}
export const getTodayCheckIn = async (db: Pool, userId: number) => {...}
export const getUserPoints = async (db: Pool, userId: number) => {...}

// Red Envelope Queries
export const findRedEnvelope = async (db: Pool, envelopeId: string) => {...}
export const claimRedEnvelope = async (db: Pool, envelopeId: number, claimerId: number, amount: number) => {...}
export const hasClaimedEnvelope = async (db: Pool, envelopeId: number, claimerId: number) => {...}
export const getUserRedEnvelopeClaims = async (db: Pool, userId: number) => {...}

// Financial Summary Queries
export const getUserDeposits = async (db: Pool, userId: number, status?: number) => {...}
export const getUserWithdrawals = async (db: Pool, userId: number, status?: number) => {...}
export const getTotalDeposits = async (db: Pool, userId: number) => {...}
export const getTotalWithdrawals = async (db: Pool, userId: number) => {...}

// Helper Functions
export const formatTimeIST = (timestamp?: number) => {...}
export const getTodayString = () => {...}
```

### 4. Services

#### 4.1 `src/services/user/user.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- getUserFinancialSummary(db: Pool, userId: number): Promise<UserFinancialData>
- updateUserInfo(db: Pool, userId: number, data: object): Promise<void>
- generateReferralCode(): string
- generateOTP(): string
- isOTPRateLimited(otpExpiresAt: number): boolean
```

#### 4.2 `src/services/user/sms.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- sendOTP(phone: string, otp: string): Promise<boolean>
- validateSMSResponse(response: any): boolean
```

#### 4.3 `src/services/user/referral.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- calculateReferralHierarchy(db: Pool, code: string): Promise<ReferralData>
- getTeamMembers(db: Pool, code: string): Promise<TeamMember[]>
- calculateCommission(betAmount: number, level: number): number
- distributeCommission(db: Pool, userId: number, betAmount: number): Promise<void>
```

#### 4.4 `src/services/user/checkIn.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- getCheckInRewards(): CheckInReward[]
- canClaimReward(currentDeposit: number, required: number): boolean
- claimCheckInReward(db: Pool, userId: number, day: number): Promise<number>
- getConsecutiveCheckInDays(db: Pool, userId: number): Promise<number>
```

#### 4.5 `src/services/user/transfer.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- validateTransfer(sender: object, receiver: object, amount: number): boolean
- calculateTransferFee(amount: number): number
- executeTransfer(db: Pool, senderId: number, receiverId: number, amount: number): Promise<void>
```

#### 4.6 `src/services/user/redEnvelope.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- generateEnvelopeId(): string
- claimEnvelope(db: Pool, envelopeId: string, userId: number): Promise<number>
- validateEnvelope(envelope: object, userId: number): boolean
```

### 5. Controllers

#### 5.1 `src/controllers/user/verifyCode.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const verifyCodeHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Check OTP rate limit
  // 3. Generate OTP
  // 4. Send SMS
  // 5. Update user OTP in database
  // 6. Return success with expiry time
}
```

#### 5.2 `src/controllers/user/userInfo.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const userInfoHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Calculate total deposits
  // 3. Calculate total withdrawals
  // 4. Get free bonus
  // 5. Return user info (exclude sensitive fields)
}
```

#### 5.3 `src/controllers/user/changeUser.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const changeUserHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Update based on type (editname)
  // 4. Return success
}
```

#### 5.4 `src/controllers/user/changePassword.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const changePasswordHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Verify current password with bcrypt
  // 4. Hash new password with bcrypt
  // 5. Update password in database
  // 6. Generate new OTP
  // 7. Return success
}
```

#### 5.5 `src/controllers/user/checkIn.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const checkInHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. If no data: return check-in records
  // 3. If data (1-7): validate reward claim
  // 4. Check deposit requirement
  // 5. Check if already claimed
  // 6. Award reward
  // 7. Mark as claimed
  // 8. Return success
}
```

#### 5.6 `src/controllers/user/aviator.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const aviatorHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // Redirect to Aviator game with auth token
  res.redirect(`https://jetx.asia/theninja/src/api/userapi.php?action=loginandregisterbyauth&token=${auth}`);
}
```

#### 5.7 `src/controllers/user/promotion.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const promotionHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Get commission levels
  // 3. Calculate referral hierarchy (F1-F4)
  // 4. Calculate today's referrals
  // 5. Get all team members (recursive)
  // 6. Calculate roses/commissions
  // 7. Return comprehensive referral data
}
```

#### 5.8 `src/controllers/user/myTeam.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const myTeamHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Get commission levels
  // 3. Return basic team info
}
```

#### 5.9 `src/controllers/user/listMyTeam.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const listMyTeamHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Get direct referrals (F1)
  // 3. Get recent members (limited to 100)
  // 4. Get commission records
  // 5. Build full referral hierarchy (recursive, max depth 6)
  // 6. Get turnover data for each member
  // 7. Get invite counts
  // 8. Mask phone numbers for privacy
  // 9. Return comprehensive team data
}
```

#### 5.10 `src/controllers/user/recharge.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const rechargeHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Check minimum deposit amount
  // 4. Cancel pending deposits if type != 'cancel'
  // 5. Create new deposit record
  // 6. Generate order ID
  // 7. For UPI gateway: call payment API
  // 8. Return payment URL or deposit info
}
```

#### 5.11 `src/controllers/user/cancelRecharge.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const cancelRechargeHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Delete all pending deposits
  // 3. Return success with count
}
```

#### 5.12 `src/controllers/user/recharge2.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const recharge2Handler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Get pending deposit
  // 3. Get bank recharge info
  // 4. Return deposit and bank info
}
```

#### 5.13 `src/controllers/user/listRecharge.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const listRechargeHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Get all deposits ordered by date
  // 3. Return deposit history
}
```

#### 5.14 `src/controllers/user/confirmRecharge.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const confirmRechargeHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Get pending deposit by client_txn_id
  // 3. Call payment gateway API to check status
  // 4. If status = 'scanning': return waiting message
  // 5. If status = 'success': update deposit, add balance, calculate bonus
  // 6. If status = 'failure' or 'close': mark as failed
  // 7. Return appropriate response
}
```

#### 5.15 `src/controllers/user/updateRecharge.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const updateRechargeHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Check if UTR already exists
  // 3. Update deposit with UTR
  // 4. Return success
}
```

#### 5.16 `src/controllers/user/addBank.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const addBankHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Check if bank account exists
  // 4. Create or update bank account
  // 5. Return success
}
```

#### 5.17 `src/controllers/user/infoUserBank.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const infoUserBankHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Calculate net result (deposits - bets - fees)
  // 3. Get user's bank accounts
  // 4. Return bank info and financial summary
}
```

#### 5.18 `src/controllers/user/withdrawal.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const withdrawalHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Verify password
  // 4. Check bank account exists
  // 5. Check daily withdrawal limit (3 per day)
  // 6. Check balance
  // 7. Check bet requirement (total bets >= withdrawal)
  // 8. Create withdrawal record
  // 9. Deduct balance
  // 10. Return success
}
```

#### 5.19 `src/controllers/user/listWithdraw.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const listWithdrawHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Get all withdrawals ordered by date
  // 3. Return withdrawal history
}
```

#### 5.20 `src/controllers/user/transfer.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const transferHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user (sender)
  // 3. Check balance
  // 4. Check bet requirement
  // 5. Find receiver by phone
  // 6. Validate receiver exists and not same as sender
  // 7. Execute transfer
  // 8. Create transfer record
  // 9. Create deposit record for receiver
  // 10. Return success
}
```

#### 5.21 `src/controllers/user/transferHistory.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const transferHistoryHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Get sent transfers
  // 3. Get received transfers
  // 4. Return both histories
}
```

#### 5.22 `src/controllers/user/useRedEnvelope.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const useRedEnvelopeHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Find red envelope by code
  // 4. Check if already claimed
  // 5. Check if active
  // 6. Mark as used
  // 7. Add amount to user balance
  // 8. Create claim record
  // 9. Return success with amount
}
```

#### 5.23 `src/controllers/user/search.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const searchHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Get authenticated user
  // 2. Check user level
  // 3. If admin (level=1): return user info
  // 4. If CTV (level=2): return user info only if under their management
  // 5. If regular user: return error
}
```

#### 5.24 `src/controllers/user/callbackBank.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const callbackBankHandler = async (req: Request, res: Response): Promise<void> => {
  // Payment gateway webhook
  // 1. Validate transaction
  // 2. Update deposit status
  // 3. Add balance to user
  // 4. Return success
}
```

#### 5.25 `src/controllers/user/confirmUSDTRecharge.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const confirmUSDTRechargeHandler = async (req: Request, res: Response): Promise<void> => {
  // USDT payment confirmation
  // Similar to confirmRecharge but for USDT
}
```

### 6. Routes: `src/routes/user.routes.ts`

```typescript
import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { userAuthMiddleware } from '../middleware/userAuth.middleware';
import { verifyCodeHandler } from '../controllers/user/verifyCode.controller';
import { userInfoHandler } from '../controllers/user/userInfo.controller';
// ... import all controllers

const router = Router();

// Auth & Account
router.post('/verify-code', userAuthMiddleware, verifyCodeHandler(db));
router.get('/user-info', userAuthMiddleware, userInfoHandler(db));
router.post('/change-user', userAuthMiddleware, changeUserHandler(db));
router.post('/change-password', userAuthMiddleware, changePasswordHandler(db));

// Check-in
router.post('/check-in', userAuthMiddleware, checkInHandler(db));

// Games
router.get('/aviator', userAuthMiddleware, aviatorHandler(db));

// Promotion & Team
router.get('/promotion', userAuthMiddleware, promotionHandler(db));
router.get('/my-team', userAuthMiddleware, myTeamHandler(db));
router.get('/list-my-team', userAuthMiddleware, listMyTeamHandler(db));

// Banking
router.post('/add-bank', userAuthMiddleware, addBankHandler(db));
router.get('/info-user-bank', userAuthMiddleware, infoUserBankHandler(db));

// Recharge
router.post('/recharge', userAuthMiddleware, rechargeHandler(db));
router.post('/cancel-recharge', userAuthMiddleware, cancelRechargeHandler(db));
router.get('/recharge2', userAuthMiddleware, recharge2Handler(db));
router.get('/list-recharge', userAuthMiddleware, listRechargeHandler(db));
router.post('/confirm-recharge', userAuthMiddleware, confirmRechargeHandler(db));
router.post('/update-recharge', userAuthMiddleware, updateRechargeHandler(db));

// Withdrawal
router.post('/withdrawal', userAuthMiddleware, withdrawalHandler(db));
router.get('/list-withdraw', userAuthMiddleware, listWithdrawHandler(db));

// Transfer
router.post('/transfer', userAuthMiddleware, transferHandler(db));
router.get('/transfer-history', userAuthMiddleware, transferHistoryHandler(db));

// Red Envelope
router.post('/use-red-envelope', userAuthMiddleware, useRedEnvelopeHandler(db));

// Search
router.post('/search', userAuthMiddleware, searchHandler(db));

// Callbacks
router.post('/callback-bank', callbackBankHandler(db));
router.post('/confirm-usdt-recharge', confirmUSDTRechargeHandler(db));

export default router;
```

### 7. Utils: `src/utils/user.helpers.ts`

```typescript
// REQUIRED HELPER FUNCTIONS:

// Generate random number
export const generateRandomNumber = (min: number, max: number): string => {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

// Generate referral code
export const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += generateRandomNumber(10000, 99999);
  return result;
};

// Generate OTP
export const generateOTP = (): string => {
  return generateRandomNumber(100000, 999999);
};

// Format time in IST
export const formatTimeIST = (timestamp?: number): string => {
  // Implementation
};

// Generate order ID
export const generateOrderId = (): string => {
  const date = new Date();
  const id_time = String(date.getUTCFullYear()) + 
                  String(date.getUTCMonth() + 1) + 
                  String(date.getUTCDate());
  const id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  return id_time + id_order;
};

// Mask phone number
export const maskPhoneNumber = (phone: string): string => {
  return '91' + phone.slice(0, 1) + '****' + phone.slice(-4);
};

// Calculate check-in reward
export const getCheckInReward = (day: number): number => {
  const rewards = [300, 3000, 6000, 12000, 28000, 100000, 200000];
  return rewards[day - 1] || 0;
};

// Get required deposit for check-in
export const getRequiredDeposit = (day: number): number => {
  const deposits = [300, 3000, 6000, 12000, 28000, 100000, 200000];
  return deposits[day - 1] || 0;
};
```

---

## Critical Requirements

### 1. Password Security - USE BCRYPT

```typescript
// All password operations must use bcrypt:
import bcrypt from 'bcrypt';

// Hash password
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, passwordHash);
```

### 2. OTP Rate Limiting

```typescript
// Prevent SMS spam
const now = Date.now();
const otpExpiresAt = user.otpExpiresAt;

if (otpExpiresAt && otpExpiresAt > now) {
  return res.status(400).json({
    message: 'Please wait before requesting another OTP',
    status: false,
  });
}
```

### 3. Withdrawal Validation

```typescript
// Multiple checks required:
1. Bank account linked
2. Max 3 withdrawals per day
3. Sufficient balance
4. Total bets >= withdrawal amount (prevent bonus abuse)
```

### 4. Transfer Validation

```typescript
// Transfer rules:
1. Sender != Receiver
2. Receiver must exist
3. Sufficient balance
4. Bet requirement met
5. Create deposit record for receiver
```

### 5. Check-in Rewards

```typescript
// 7-tier reward system:
Day 1: Deposit >= 300 → Reward 300
Day 2: Deposit >= 3000 → Reward 3000
Day 3: Deposit >= 6000 → Reward 6000
Day 4: Deposit >= 12000 → Reward 12000
Day 5: Deposit >= 28000 → Reward 28000
Day 6: Deposit >= 100000 → Reward 100000
Day 7: Deposit >= 200000 → Reward 200000

Each reward can only be claimed once.
```

### 6. Referral Hierarchy

```typescript
// Multi-level referral tracking:
- F1: Direct referrals (WHERE invite = user.code)
- F2: F1's referrals
- F3: F2's referrals
- F4: F3's referrals

Calculate:
- Total count at each level
- Today's new referrals at each level
- Commission earned at each level
- Total team size (recursive)
```

---

## Migration Checklist

### Phase 1: Foundation
- [ ] Create `src/types/user.types.ts` with all Zod schemas
- [ ] Create `src/utils/user.helpers.ts` with helper functions
- [ ] Create `src/middleware/userAuth.middleware.ts`
- [ ] Create `src/db/user.queries.ts` with all query functions

### Phase 2: Services
- [ ] Create `src/services/user/user.service.ts`
- [ ] Create `src/services/user/sms.service.ts`
- [ ] Create `src/services/user/referral.service.ts`
- [ ] Create `src/services/user/checkIn.service.ts`
- [ ] Create `src/services/user/transfer.service.ts`
- [ ] Create `src/services/user/redEnvelope.service.ts`

### Phase 3: Controllers
- [ ] Create all 25 controller files in `src/controllers/user/`

### Phase 4: Routes
- [ ] Create `src/routes/user.routes.ts`
- [ ] Export routes from `src/routes/web.ts`

### Phase 5: Testing
- [ ] Test OTP verification
- [ ] Test password change
- [ ] Test check-in rewards
- [ ] Test referral hierarchy
- [ ] Test bank account management
- [ ] Test deposits
- [ ] Test withdrawals
- [ ] Test transfers
- [ ] Test red envelope claims

### Phase 6: Cleanup
- [ ] Remove old `src/controllersOld/userController.ts`
- [ ] Update all imports
- [ ] Remove md5 dependency from package.json
- [ ] Verify no SQL injection vulnerabilities

---

## Function-by-Function Migration Map

| Old Function | New Controller | Notes |
|--------------|----------------|-------|
| `verifyCode` | `verifyCode.controller.ts` | Use bcrypt, env vars for SMS |
| `aviator` | `aviator.controller.ts` | Simple redirect |
| `userInfo` | `userInfo.controller.ts` | Use new tables |
| `changeUser` | `changeUser.controller.ts` | Simple update |
| `changePassword` | `changePassword.controller.ts` | USE BCRYPT |
| `checkInHandling` | `checkIn.controller.ts` | 7-tier rewards |
| `promotion` | `promotion.controller.ts` | Referral hierarchy |
| `myTeam` | `myTeam.controller.ts` | Basic team info |
| `listMyTeam` | `listMyTeam.controller.ts` | Full hierarchy |
| `wowpay` | Remove (placeholder) | Not implemented |
| `recharge` | `recharge.controller.ts` | Payment gateway integration |
| `cancelRecharge` | `cancelRecharge.controller.ts` | Delete pending |
| `recharge2` | `recharge2.controller.ts` | Get pending deposit |
| `listRecharge` | `listRecharge.controller.ts` | Deposit history |
| `confirmRecharge` | `confirmRecharge.controller.ts` | Payment verification |
| `updateRecharge` | `updateRecharge.controller.ts` | Update UTR |
| `addBank` | `addBank.controller.ts` | Bank account CRUD |
| `infoUserBank` | `infoUserBank.controller.ts` | Financial summary |
| `withdrawal3` | `withdrawal.controller.ts` | Withdrawal processing |
| `transfer` | `transfer.controller.ts` | Balance transfer |
| `transferHistory` | `transferHistory.controller.ts` | Transfer history |
| `callback_bank` | `callbackBank.controller.ts` | Payment webhook |
| `confirmUSDTRecharge` | `confirmUSDTRecharge.controller.ts` | USDT confirmation |
| `useRedenvelope` | `useRedEnvelope.controller.ts` | Claim gift |
| `search` | `search.controller.ts` | User search |

---

## Testing Requirements

After migration, verify:

1. **Authentication**
   - OTP sent successfully
   - OTP rate limiting works
   - Password change with bcrypt works
   - Old passwords cannot be used

2. **Check-in System**
   - All 7 reward tiers work
   - Deposit requirements enforced
   - Cannot claim same reward twice

3. **Referrals**
   - F1-F4 hierarchy calculated correctly
   - Today's referrals counted accurately
   - Commission distribution works

4. **Wallet**
   - Deposits created correctly
   - Payment gateway integration works
   - Withdrawals validated properly
   - Transfer between users works
   - Balance updates correctly

5. **Bank Accounts**
   - Create/update works
   - Validation enforced

6. **Red Envelopes**
   - Claim logic works
   - Cannot claim twice
   - Balance updated

---

## Dependencies

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "@types/bcrypt": "^5.0.2",
    "zod": "^3.22.4",
    "mysql2": "^3.9.0",
    "express": "^4.18.2",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0"
  }
}
```

Remove:
```json
{
  "md5": "^2.3.0",  // REMOVE THIS - SECURITY RISK
  "request": "^2.88.2"  // DEPRECATED - use axios
}
```

---

## Success Criteria

- ✅ All functions from old controller migrated
- ✅ NO md5 usage anywhere (bcrypt only)
- ✅ All inputs validated with Zod
- ✅ Full TypeScript type coverage
- ✅ All database queries use new schema tables
- ✅ Foreign key constraints respected
- ✅ Error handling on all async operations
- ✅ Consistent response format
- ✅ No SQL injection vulnerabilities
- ✅ All routes properly protected with auth middleware
- ✅ SMS credentials in environment variables
- ✅ OTP rate limiting implemented
- ✅ Withdrawal validation complete
- ✅ Transfer validation complete
- ✅ Check-in rewards working

---

**Start Date**: Today
**Priority**: P1 - High Priority (User-facing features)
**Estimated Effort**: 2-3 days for complete migration
