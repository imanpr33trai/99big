# Admin Controller Migration Task - JavaScript to TypeScript

## Overview

You are tasked with migrating the legacy JavaScript admin controller (`src/controllersOld/adminController.ts`) to a modern, type-safe TypeScript implementation. This is a **GREENFIELD MIGRATION** - do not reference any existing migrated code. Build everything from scratch following the specifications below.

---

## Project Context

### Application Type
- **99BigDaddy** - Online lottery and betting platform
- **Games**: Wingo (1min, 3min, 5min, 10min), 5D Lottery, K3 Lottery
- **User Levels**: Regular users (level 0), CTV/Agents (level 2), Admins (level 1)
- **Multi-level Referral System**: F1 (direct), F2, F3, F4 (up to 4 levels)

### Tech Stack
- **Runtime**: Node.js with Express
- **Language**: TypeScript (strict mode)
- **Database**: MySQL with modern schema (see `src/config/schema_best.sql`)
- **Validation**: Zod schemas
- **Password Hashing**: bcrypt (NOT md5 - this is critical)
- **Database Driver**: mysql2/promise with Pool

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
- status: TINYINT (0=active, 1=suspended, 2=banned)
- userLevel: TINYINT (0=user, 1=admin, 2=ctv)
- createdAt: BIGINT (timestamp)
- ... (commission fields, bonus fields)
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
- fee: DECIMAL(15,2)
- netAmount: DECIMAL(15,2)
- status: TINYINT (0=pending, 1=processing, 2=completed, 3=rejected)
- rejectionReason: VARCHAR(255)
- requestedAt: BIGINT
```

#### `bets` Table (replaces `minutes_1`)
```sql
- id: INT UNSIGNED (PK)
- sessionId: INT UNSIGNED (FK to gameSessions)
- userId: INT UNSIGNED (FK)
- gameTypeId: TINYINT UNSIGNED (FK to gameTypes)
- betAmount: DECIMAL(15,2)
- selection: VARCHAR(50)
- betType: VARCHAR(50) -- 'big', 'small', 'odd', 'even', 'red', 'green', 'violet'
- status: TINYINT (0=pending, 1=won, 2=lost, 3=cancelled)
- createdAt: BIGINT
```

#### `gameSessions` Table
```sql
- id: INT UNSIGNED (PK)
- period: VARCHAR(50)
- gameTypeId: TINYINT UNSIGNED
- result: VARCHAR(50)
- status: TINYINT (0=pending, 1=open, 2=closed, 3=completed)
- createdAt: BIGINT
```

#### `adminConfigs` Table (replaces `admin`)
```sql
- id: INT UNSIGNED (PK)
- configKey: VARCHAR(50) UNIQUE
- configValue: TEXT
- description: VARCHAR(255)
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

#### `salaryRecords` Table
```sql
- id: INT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- amount: DECIMAL(15,2)
- type: VARCHAR(50)
- periodStart: DATE
- periodEnd: DATE
- isPaid: BOOLEAN
- createdAt: BIGINT
```

#### `userBankAccounts` Table (replaces `user_bank`)
```sql
- id: INT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- type: ENUM('bank', 'upi', 'crypto')
- bankName: VARCHAR(100)
- accountNumber: VARCHAR(50)
- ifscCode: VARCHAR(20)
- isDefault: BOOLEAN
```

#### `paymentMethods` Table (replaces `bank_recharge`)
```sql
- id: INT UNSIGNED (PK)
- type: ENUM('bank', 'upi', 'crypto', 'wallet')
- bankName: VARCHAR(100)
- accountName: VARCHAR(100)
- upiId: VARCHAR(100)
- cryptoAddress: VARCHAR(255)
- qrCodeUrl: VARCHAR(255)
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

---

## Files to Create

### 1. Types File: `src/types/admin.types.ts`

Create comprehensive Zod schemas and TypeScript types:

```typescript
// REQUIRED SCHEMAS TO CREATE:
- AdminLoginSchema
- AdminRegisterSchema
- PaginationSchema
- UserInfoSchema
- RechargeActionSchema
- WithdrawActionSchema
- SettingBankSchema
- SettingCskhSchema
- BannedSchema
- CreateBonusSchema
- SettingBuffSchema
- ChangeAdminSchema
- TotalJoinSchema
- EditResultSchema
- CreateSalarySchema
- UpdateLevelSchema
- ListCTVSchema

// REQUIRED TYPES TO CREATE:
- AdminApiResponse<T>
- AdminAuthPayload
- UserFinancialData
- StatisticalData
- CTVInfoData
- RechargeStats
- WithdrawStats
- GameStatistics
- ReferralHierarchy
- CommissionData
```

### 2. Middleware: `src/middleware/adminAuth.middleware.ts`

```typescript
// Create:
- adminAuthMiddleware(db: Pool) - validates admin token, checks level=1
- Optional: rate limiting for admin endpoints
```

### 3. Database Queries: `src/db/admin.queries.ts`

```typescript
// REQUIRED QUERY FUNCTIONS TO CREATE:

// User Queries
export const findAdminByToken = async (db: Pool, token: string) => {...}
export const findUserByPhone = async (db: Pool, phone: string) => {...}
export const findUserById = async (db: Pool, id: number) => {...}
export const listMembers = async (db: Pool, page: number, limit: number) => {...}
export const listCTV = async (db: Pool, page: number, limit: number) => {...}
export const getDirectSubordinates = async (db: Pool, userId: number) => {...}
export const getSubordinatesByLevel = async (db: Pool, userIds: number[]) => {...}

// Financial Queries
export const getPendingDeposits = async (db: Pool) => {...}
export const getProcessedDeposits = async (db: Pool) => {...}
export const getPendingWithdrawals = async (db: Pool) => {...}
export const getProcessedWithdrawals = async (db: Pool) => {...}
export const getDepositById = async (db: Pool, id: number) => {...}
export const getWithdrawalById = async (db: Pool, id: number) => {...}
export const updateDepositStatus = async (db: Pool, id: number, status: number) => {...}
export const updateWithdrawalStatus = async (db: Pool, id: number, status: number, reason?: string) => {...}

// Statistics Queries
export const getGameStatistics = async (db: Pool) => {...}
export const getTodayDeposits = async (db: Pool) => {...}
export const getTodayWithdrawals = async (db: Pool) => {...}
export const getTotalJoin = async (db: Pool, game: string) => {...}

// Settings Queries
export const getAdminConfigs = async (db: Pool) => {...}
export const updateAdminConfig = async (db: Pool, key: string, value: string) => {...}
export const getPaymentMethods = async (db: Pool) => {...}
export const updatePaymentMethod = async (db: Pool, type: string, data: object) => {...}

// Commission Queries
export const getCommissionLevels = async (db: Pool) => {...}
export const updateCommissionLevel = async (db: Pool, id: number, rates: object) => {...}

// Salary Queries
export const getSalaryRecords = async (db: Pool, phone?: string) => {...}
export const createSalaryRecord = async (db: Pool, data: object) => {...}

// User Balance Queries
export const updateUserBalance = async (db: Pool, userId: number, amount: number) => {...}
export const setFirstDepositBonus = async (db: Pool, userId: number) => {...}
export const updateFreeBonus = async (db: Pool, userId: number, amount: number) => {...}

// Red Envelope Queries
export const getRedEnvelopes = async (db: Pool, creatorId?: number) => {...}
export const createRedEnvelope = async (db: Pool, data: object) => {...}

// Helper Queries
export const formatTimeIST = (timestamp?: number) => {...}
export const getTodayString = () => {...}
```

### 4. Controllers

#### 4.1 `src/controllers/admin/adminAuth.controller.ts`

```typescript
// REQUIRED FUNCTIONS:
- login(req, res) - Admin login with phone/password
- register(req, res) - Create new admin/CTV account
- changeAdmin(req, res) - Update game control settings
- settingCskh(req, res) - Update customer service settings
- banned(req, res) - Ban/unban users
```

#### 4.2 `src/controllers/admin/adminMember.controller.ts`

```typescript
// REQUIRED FUNCTIONS:
- listMember(req, res) - List all members with pagination
- listCTV(req, res) - List all CTVs with pagination
- userInfo(req, res) - Get detailed user info with referral hierarchy
- statistical2(req, res) - Get platform statistics
- recharge(req, res) - Get all deposits (pending + processed)
- rechargeDuyet(req, res) - Approve/reject deposits
- handlWithdraw(req, res) - Approve/reject withdrawals
- profileUser(req, res) - Get user profile with recent transactions
- listRechargeMem(req, res) - Get user's deposit history
- listWithdrawMem(req, res) - Get user's withdrawal history
- listBet(req, res) - Get user's bet history
- infoCtv(req, res) - Get CTV dashboard data
- getLevelInfo(req, res) - Get commission levels
- updateLevel(req, res) - Update commission rates
- CreatedSalary(req, res) - Create salary record for user
- getSalary(req, res) - Get salary records
- settingBuff(req, res) - Adjust user balance (buff)
- createBonus(req, res) - Create bonus/red envelope
- listRedenvelops(req, res) - List red envelopes
- settingGet(req, res) - Get all settings
- settingBank(req, res) - Update bank/UPI settings
```

#### 4.3 `src/controllers/admin/adminGame.controller.ts` (NEW)

```typescript
// REQUIRED FUNCTIONS:
- totalJoin(req, res) - Get game statistics by typeid
- listOrderOld(req, res) - Get historical game results
- listOrderOldK3(req, res) - Get K3 historical results
- editResult(req, res) - Edit 5D result settings
- editResult2(req, res) - Edit K3 result settings
- getPhoneByInvite(req, res) - Get phone by referral code
- getUserByCode(req, res) - Get user count by invite code
- getReferredUsers(req, res) - Get all referred users
```

### 5. Routes: `src/routes/admin.routes.ts`

```typescript
// Create Express Router with all endpoints:

// Public routes
POST /api/admin/login
POST /api/admin/register

// Protected routes (require admin auth middleware)
POST /api/admin/listMember
POST /api/admin/listCTV
POST /api/admin/userInfo
POST /api/admin/profileUser
POST /api/admin/infoCtv
GET  /api/admin/statistical2
GET  /api/admin/recharge
POST /api/admin/rechargeDuyet
POST /api/admin/handlWithdraw
POST /api/admin/listRechargeMem/:phone
POST /api/admin/listWithdrawMem/:phone
POST /api/admin/listBet/:phone
POST /api/admin/changeAdmin
GET  /api/admin/settingGet
POST /api/admin/settingBank
POST /api/admin/settingCskh
POST /api/admin/banned
POST /api/admin/createBonus
GET  /api/admin/listRedenvelops
POST /api/admin/settingbuff
GET  /api/admin/getLevelInfo
POST /api/admin/updateLevel
POST /api/admin/CreatedSalary
GET  /api/admin/getSalary
GET  /api/admin/totalJoin
POST /api/admin/listOrderOld
POST /api/admin/listOrderOldK3
POST /api/admin/editResult
POST /api/admin/editResult2
GET  /api/admin/getPhoneByInvite/:invite
GET  /api/admin/getUserCount/:code
GET  /api/admin/referredUsers/:code
```

### 6. Utils: `src/utils/admin.helpers.ts`

```typescript
// REQUIRED HELPER FUNCTIONS:
- generateReferralCode(): string
- generateRandomNumber(min: number, max: number): number
- getCurrentTimestamp(): number
- getIpAddress(req: Request): string
- hashPassword(password: string): Promise<string>
- verifyPassword(password: string, hash: string): Promise<boolean>
- formatTimeIST(timestamp?: number): string
- getTodayString(): string
- safeParseFloat(value: any): number
- calculatePagination(page: number, limit: number, total: number): object
```

---

## Critical Requirements

### 1. Password Hashing - USE BCRYPT (NOT MD5)

```typescript
// ❌ WRONG (from old code):
import md5 from 'md5';
const hash = md5(password);

// ✅ CORRECT:
import bcrypt from 'bcrypt';
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
const isValid = await bcrypt.compare(password, hash);
```

### 2. Zod Validation - ALL INPUTS MUST BE VALIDATED

```typescript
// Example schema:
export const AdminLoginSchema = z.object({
  phone: z.string().min(10).max(20),
  password: z.string().min(6),
});

// In controller:
const parsed = AdminLoginSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({
    message: 'Invalid input',
    errors: parsed.error.errors,
  });
}
```

### 3. TypeScript Types - STRICT TYPING

```typescript
// Use proper types for ALL functions:
export const createAdminAuthController = (db: Pool) => ({
  login: async (req: Request, res: Response<AdminApiResponse>): Promise<void> => {
    // Implementation
  },
});
```

### 4. Database Queries - USE PREPARED STATEMENTS

```typescript
// ❌ WRONG (SQL injection risk):
await connection.query(`SELECT * FROM users WHERE phone = ${phone}`);

// ✅ CORRECT:
const [users] = await db.execute(
  'SELECT * FROM users WHERE phone = ?',
  [phone]
);
```

### 5. Error Handling - TRY/CATCH WITH PROPER RESPONSES

```typescript
try {
  // Business logic
} catch (error) {
  console.error('Specific operation error:', error);
  res.status(500).json({
    message: 'Operation failed',
    error: error instanceof Error ? error.message : 'Unknown error',
  });
}
```

### 6. Response Format - CONSISTENT STRUCTURE

```typescript
// Success response:
{
  message: "Success",
  status: true,
  data: { ... },
  timeStamp: 1234567890
}

// Error response:
{
  message: "Error description",
  status: false,
  timeStamp: 1234567890
}
```

---

## Migration Checklist

### Phase 1: Foundation
- [ ] Create `src/types/admin.types.ts` with all Zod schemas
- [ ] Create `src/utils/admin.helpers.ts` with helper functions
- [ ] Create `src/middleware/adminAuth.middleware.ts`
- [ ] Create `src/db/admin.queries.ts` with all query functions

### Phase 2: Controllers
- [ ] Create `src/controllers/admin/adminAuth.controller.ts`
- [ ] Create `src/controllers/admin/adminMember.controller.ts`
- [ ] Create `src/controllers/admin/adminGame.controller.ts`

### Phase 3: Routes
- [ ] Create `src/routes/admin.routes.ts`
- [ ] Export routes from `src/routes/web.ts`

### Phase 4: Testing
- [ ] Test admin login
- [ ] Test user listing
- [ ] Test deposit approval
- [ ] Test withdrawal approval
- [ ] Test statistics endpoints
- [ ] Test settings endpoints
- [ ] Test referral hierarchy

### Phase 5: Cleanup
- [ ] Remove old `src/controllersOld/adminController.ts`
- [ ] Update all imports
- [ ] Remove md5 dependency from package.json
- [ ] Add bcrypt dependency if not present

---

## Function-by-Function Migration Map

| Old Function | New Controller | Notes |
|--------------|----------------|-------|
| `middlewareAdminController` | `adminAuth.middleware.ts` | Replace token validation |
| `totalJoin` | `adminGame.controller.ts` | Use new gameSessions table |
| `listMember` | `adminMember.controller.ts` | Use users table with new schema |
| `listCTV` | `adminMember.controller.ts` | Filter by userLevel=2 |
| `getPhoneByInvite` | `adminGame.controller.ts` | Simple lookup |
| `getUserByCode` | `adminGame.controller.ts` | COUNT query |
| `getReferredUsers` | `adminGame.controller.ts` | WHERE invite = ? |
| `statistical2` | `adminMember.controller.ts` | Use bets, deposits, withdrawals tables |
| `changeAdmin` | `adminAuth.controller.ts` | Update adminConfigs |
| `userInfo` | `adminMember.controller.ts` | Complex referral hierarchy |
| `recharge` | `adminMember.controller.ts` | Query deposits table |
| `settingGet` | `adminMember.controller.ts` | Query adminConfigs + paymentMethods |
| `rechargeDuyet` | `adminMember.controller.ts` | Complex: update deposit, user balance, commission |
| `updateLevel` | `adminMember.controller.ts` | Update commissionLevels |
| `handlWithdraw` | `adminMember.controller.ts` | Update withdrawal status |
| `settingBank` | `adminMember.controller.ts` | Update paymentMethods |
| `settingCskh` | `adminAuth.controller.ts` | Update adminConfigs |
| `banned` | `adminAuth.controller.ts` | Update user status |
| `createBonus` | `adminMember.controller.ts` | Create redEnvelope |
| `listRedenvelops` | `adminMember.controller.ts` | Query redEnvelopes |
| `settingbuff` | `adminMember.controller.ts` | Adjust user balance |
| `register` | `adminAuth.controller.ts` | Create user with bcrypt password |
| `profileUser` | `adminMember.controller.ts` | User profile + transactions |
| `infoCtv` | `adminMember.controller.ts` | CTV dashboard data |
| `listRechargeMem` | `adminMember.controller.ts` | User deposit history |
| `listWithdrawMem` | `adminMember.controller.ts` | User withdrawal history |
| `listBet` | `adminMember.controller.ts` | User bet history |
| `getLevelInfo` | `adminMember.controller.ts` | Query commissionLevels |
| `listOrderOld` | `adminGame.controller.ts` | 5D game history |
| `listOrderOldK3` | `adminGame.controller.ts` | K3 game history |
| `editResult` | `adminGame.controller.ts` | Update 5D settings |
| `editResult2` | `adminGame.controller.ts` | Update K3 settings |
| `CreatedSalary` | `adminMember.controller.ts` | Create salary record |
| `getSalary` | `adminMember.controller.ts` | Query salaryRecords |

---

## Important Business Logic

### 1. Deposit Approval (rechargeDuyet)

When approving a deposit:
1. Update deposit status to 2 (completed)
2. Check if first deposit
3. Calculate bonus: 15% for first deposit, 5% for subsequent
4. Apply free bonus if available
5. Calculate referral commission (F1 level)
6. Insert salary record for referrer
7. Update referrer balance
8. Update user balance

### 2. Withdrawal Approval (handlWithdraw)

When approving:
1. Update withdrawal status to 2 (completed)

When rejecting:
1. Update withdrawal status to 3 (rejected)
2. Add rejection reason
3. Refund amount to user balance

### 3. Referral Hierarchy (userInfo, infoCtv)

Calculate F1, F2, F3, F4:
- F1: Direct referrals (WHERE invite = user.code)
- F2: F1's referrals
- F3: F2's referrals
- F4: F3's referrals

Also calculate today's new referrals for each level.

### 4. Commission Calculation

Based on `commissionLevels` table:
- F1 rate: Direct referral commission
- F2-F4 rates: Indirect referral commissions
- Applied to bet amounts when >= 10000

### 5. Game Control Settings

Keys in `adminConfigs`:
- `wingo1_control`, `wingo3_control`, `wingo5_control`, `wingo10_control`
- `5d1_control`, `5d3_control`, etc.
- `bs1`, `bs3`, `bs5`, `bs10` (win rate settings)

---

## Testing Requirements

After migration, verify:

1. **Authentication**
   - Admin can login with correct credentials
   - Admin cannot login with wrong password
   - Non-admin users cannot access admin endpoints

2. **User Management**
   - List members returns paginated results
   - User info shows correct referral hierarchy
   - Banning users updates status correctly

3. **Financial Operations**
   - Deposit approval adds correct amount + bonus
   - First deposit gets 15% bonus, subsequent gets 5%
   - Referral commission calculated correctly
   - Withdrawal rejection refunds to user

4. **Settings**
   - Game control settings update correctly
   - Bank/UPI settings persist
   - Customer service settings update

5. **Statistics**
   - Platform statistics accurate
   - Today's totals calculated correctly
   - Game statistics by typeid work

---

## Dependencies to Add/Update

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "@types/bcrypt": "^5.0.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0"
  }
}
```

Remove:
```json
{
  "md5": "^2.3.0"  // REMOVE THIS
}
```

---

## Deliverables

1. **Complete TypeScript Implementation** - All files listed above
2. **Type Safety** - No `any` types except where absolutely necessary
3. **Validation** - All inputs validated with Zod
4. **Security** - bcrypt for passwords, prepared statements for SQL
5. **Documentation** - JSDoc comments on all public functions
6. **Tests** - Basic unit tests for critical functions

---

## Success Criteria

- ✅ All functions from old controller migrated
- ✅ No md5 usage anywhere (bcrypt only)
- ✅ All inputs validated with Zod
- ✅ Full TypeScript type coverage
- ✅ All database queries use new schema tables
- ✅ Foreign key constraints respected
- ✅ Error handling on all async operations
- ✅ Consistent response format
- ✅ No SQL injection vulnerabilities
- ✅ All routes properly protected with auth middleware

---

**Start Date**: Today
**Priority**: P0 - Blocker
**Estimated Effort**: 2-3 days for complete migration
