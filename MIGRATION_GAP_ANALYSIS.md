# TypeScript Migration Gap Analysis

## Executive Summary

**Migration Status: ~55% Complete** (Updated after thorough review)

**Last Updated:** 2026-02-25 (Comprehensive Review)

This document provides a comprehensive analysis of the JavaScript to TypeScript migration, identifying all missing functions, types, queries, routes, and other critical artifacts.

### Critical Findings (New)

1. **web.ts still uses OLD controllers** - The main route file (`src/routes/web.ts`) imports from `controllersOld/` for:
   - `winGoController` - ALL Wingo routes use old JS controllers
   - `dailyController` - ALL CTV routes use old JS controllers
   - `k5Controller` - K5D routes use old JS controllers
   - `k3Controller` - K3 routes use old JS controllers
   - `homeController` - EJS page routes use old JS controllers
   - `accountController` - Auth pages use old JS controllers
   - `middlewareController` - Uses old JS middleware
   - `paymentController` - Payment routes use old JS controllers
   - `adminController` - Admin routes use old JS controllers

2. **Wingo Game - 100% Missing** - No TypeScript migration at all
3. **Daily/CTV System - 100% Missing** - No TypeScript migration at all
4. **Socket.io - 100% Missing** - No migration
5. **Cron Jobs - 100% Missing** - No migration
6. **homeController - 100% Missing** - EJS views (low priority)
7. **accountController - 100% Missing** - Auth page renders (low priority)

---

## Table of Contents

1. [Controllers Migration Status](#1-controllers-migration-status)
2. [Missing Functions by Controller](#2-missing-functions-by-controller)
3. [Missing Types](#3-missing-types)
4. [Missing Database Queries](#4-missing-database-queries)
5. [Missing Routes](#5-missing-routes)
6. [Missing Middleware](#6-missing-middleware)
7. [Missing Services](#7-missing-services)
8. [Cron Jobs Migration](#8-cron-jobs-migration)
9. [Priority Matrix](#9-priority-matrix)
10. [Action Items](#10-action-items)

---

## 1. Controllers Migration Status

### 1.1 adminController.ts (47 functions)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 26 | 55% |
| ❌ Missing | 8 | 17% |
| 🔄 Renamed | 13 | 28% |
| ⚠️ Commented (EJS) | 14 | 30% |

**Migrated Functions:**
- `login`, `register`, `changeAdmin`, `settingCskh`, `banned`
- `listMember`, `listCTV`, `userInfo`, `statistical2`, `recharge`, `rechargeDuyet`
- `handlWithdraw`, `profileUser`, `listRechargeMem`, `listWithdrawMem`, `listBet`
- `infoCtv`, `getLevelInfo`, `updateLevel`, `CreatedSalary`, `getSalary`
- `settingBuff`, `createBonus`, `listRedenvelops`, `settingGet`, `settingBank`

**❌ CRITICAL MISSING:**
1. `infoCtv2` - CTV info with custom date filtering
2. `listRedenvelope` - Get redenvelope by phone with pagination
3. `totalJoin` - Get game join statistics by typeid
4. `editResult2` - Edit K3 result settings

**⚠️ COMMENTED OUT (EJS Views - Not Migrated):**
- `adminPage`, `adminPage3`, `adminPage5`, `adminPage10`, `adminPage5d`, `adminPageK3`
- `membersPage`, `ctvPage`, `infoMember`, `statistical`, `rechargePage`, `rechargeRecord`
- `withdraw`, `withdrawRecord`, `levelSetting`, `settings`, `CreatedSalaryRecord`
- `ctvProfilePage`, `giftPage`

---

### 1.2 userController.ts (32 functions)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 30 | 94% |
| ❌ Missing | 2 | 6% |

**Migrated Functions:**
- `userInfo`, `changeUser`, `changePassword`, `verifyCode`
- `promotion`, `myTeam`, `listMyTeam`
- `recharge`, `recharge2`, `listRecharge`, `listWithdraw`
- `addBank`, `infoUserBank`, `withdrawal3` → `withdrawalController`, `transfer`, `transferHistory`
- `useRedenvelope`, `search`, `updateRecharge`, `confirmRecharge`, `cancelRecharge`
- `confirmUSDTRecharge`, `checkInHandling`, `aviator`
- `callback_bank` → `callbackBankController` ✅ **FOUND MIGRATED**

**❌ MISSING:**
1. `wowpay` - WowPay payment handler (placeholder function - low priority)
2. `withdrawal` - Alternative withdrawal function (consolidated into `withdrawalController`)

---

### 1.3 k3Controller.ts (6 functions)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 5 | 83% |
| ⚠️ In Use | 1 | 17% |

**Migrated Functions:**
- `betK3` → `betK3Handler` ✅
- `addK3` → `addK3Handler` ✅
- `listOrderOld` → `listOrderOldHandler` ✅
- `GetMyEmerdList` → `getMyEmerdListHandler` ✅
- `handlingK3` → `processK3Results` (in services) + `handleK3Game` ✅

**⚠️ IN USE BUT NOT MIGRATED:**
- `K3Page` - EJS view - **web.ts still uses old controller**

---

### 1.4 k5Controller.ts (9 functions)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 5 | 56% |
| ❌ Missing | 2 | 22% |
| ⚠️ In Use | 2 | 22% |

**Migrated Functions:**
- `betK5D` → `bet5dHandler` ✅
- `listOrderOld` → `listOrderOld5dHandler` ✅
- `GetMyEmerdList` → `getMyEmerdList5dHandler` ✅
- `add5D` → `add5dPeriod` (in db/queries) ✅
- `handling5D` → `process5dResults` + `process5dPayouts` + `handle5dGame` (in services) ✅

**❌ MISSING:**
- `K5DPage`, `K5DPage3`, `K5DPage5`, `K5DPage10` - EJS views

**⚠️ IN USE BUT NOT MIGRATED:**
- `K5DPage` - **web.ts still uses old controller**

---

### 1.5 winGoController.ts (8 functions)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 0 | 0% |
| ❌ Missing | 8 | 100% |

**❌ ALL MISSING - CRITICAL:**
1. `winGoPage`, `winGoPage3`, `winGoPage5`, `winGoPage10` - EJS views
2. `betWinGo` - **BLOCKER** Wingo game betting function
3. `listOrderOld` - Game history
4. `GetMyEmerdList` - User bet history
5. `addWinGo` - **BLOCKER** Game period creation
6. `handlingWinGo1P` - **BLOCKER** Result processing & payouts

**⚠️ IN USE:** web.ts imports old controller for ALL Wingo routes

---

### 1.6 dailyController.ts (20 functions)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 0 | 0% |
| ❌ Missing | 20 | 100% |

**❌ ALL MISSING - CRITICAL:**
1. `dailyPage`, `listMeber`, `profileMember`, `pageInfo`
2. `settingPage`, `listRecharge`, `listWithdraw`
3. `giftPage`, `support`, `settings`
4. `middlewareDailyController` - **BLOCKER** CTV authentication
5. `statistical` - CTV statistics
6. `userInfo` - Daily-level user info
7. `infoCtv`, `infoCtv2` - **BLOCKER** CTV dashboard data
8. `createBonus`, `listRedenvelops`
9. `listMember`, `listRechargeP`, `listWithdrawP`
10. `listRechargeMem`, `listWithdrawMem`, `listRedenvelope`, `listBet`
11. `buffMoney` - **BLOCKER** Balance adjustment for CTV

**⚠️ IN USE:** web.ts imports old controller for ALL CTV/Daily routes

---

### 1.7 paymentController.ts (10+ functions)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 8 | 80% |
| ⚠️ In Use | 2 | 20% |

**Migrated Functions:**
- `initiateUPIPayment`, `verifyUPIPayment` ✅
- `initiateWowPayPayment`, `verifyWowPayPayment` ✅
- `initiateManualUPIPayment`, `addManualUPIPaymentRequest` ✅
- `initiateManualUSDTPayment`, `addManualUSDTPaymentRequest` ✅

**⚠️ IN USE BUT NOT MIGRATED:**
- Payment routes in web.ts still use old controller imports

---

### 1.8 homeController.ts (21 functions)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 0 | 0% |
| ⚠️ EJS Views | 21 | 100% |

**ALL EJS VIEWS (Not Priority):**
- `homePage`, `checkInPage`, `checkDes`, `checkRecord`
- `promotionPage`, `promotionmyTeamPage`, `promotionDesPage`, `tutorialPage`, `bonusRecordPage`
- `walletPage`, `rechargePage`, `rechargerecordPage`, `withdrawalPage`, `withdrawalrecordPage`
- `transfer`, `mianPage`, `aboutPage`, `recordsalary`, `privacyPolicy`
- `newtutorial`, `forgot`, `redenvelopes`, `riskAgreement`, `myProfilePage`, `getSalaryRecord`, `addBank`

**⚠️ IN USE:** web.ts imports old controller

---

### 1.9 middlewareController.ts

| Status | Count |
|--------|-------|
| ✅ Migrated | 1 (as `authenticate` in auth.middleware.ts) |
| ⚠️ In Use | 1 (web.ts still uses old controller) |

---

### 1.10 socketIoController.ts

| Status | Count |
|--------|-------|
| ❌ Missing | 1 (`sendMessageAdmin`) |

**⚠️ IN USE:** Not imported in web.ts but likely used elsewhere for Socket.io

---

### 1.11 accountController.ts (NEW DISCOVERY)

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Migrated | 0 | 0% |
| ❌ Missing | 6 | 100% |

**❌ ALL MISSING:**
1. `loginPage`, `registerPage`, `forgotPage` - Auth page renders
2. `verifyCode`, `verifyCodePass` - OTP verification
3. `forGotPassword` - Password reset

**⚠️ IN USE:** web.ts imports old controller for auth page routes

---

## 2. Missing Functions by Controller

### 2.1 Critical Missing Functions (Must Have - BLOCKERS)

| # | Function | Original File | Purpose | Impact | Status |
|---|----------|---------------|---------|--------|--------|
| 1 | `betWinGo` | winGoController.ts | Wingo game betting | **BLOCKER** - Game not functional | ❌ Not migrated |
| 2 | `addWinGo` | winGoController.ts | Create Wingo game periods | **BLOCKER** - No game sessions | ❌ Not migrated |
| 3 | `handlingWinGo1P` | winGoController.ts | Process Wingo results & payouts | **BLOCKER** - No result processing | ❌ Not migrated |
| 4 | `middlewareDailyController` | dailyController.ts | CTV authentication | **BLOCKER** - No CTV auth | ❌ Not migrated |
| 5 | `infoCtv` | dailyController.ts | CTV dashboard data | **BLOCKER** - CTV features broken | ❌ Not migrated |
| 6 | `infoCtv2` | dailyController.ts | CTV dashboard with date filter | **BLOCKER** - CTV features broken | ❌ Not migrated |
| 7 | `buffMoney` | dailyController.ts | CTV balance adjustment | **BLOCKER** - CTV operations broken | ❌ Not migrated |
| 8 | `betWinGo` | winGoController.ts | Wingo betting endpoint | **BLOCKER** - Core game feature | ❌ Not migrated |

### 2.2 High Priority Missing Functions

| # | Function | Original File | Purpose | Impact |
|---|----------|---------------|---------|--------|
| 9 | `listOrderOld` (Wingo) | winGoController.ts | Game history | Game history unavailable |
| 10 | `GetMyEmerdList` (Wingo) | winGoController.ts | User bet history | Users can't see bets |
| 11 | `listOrderOld` (K3/K5D) | k3Controller.ts, k5Controller.ts | Admin game history | Admin features limited |
| 12 | `K3Page`, `K5DPage*` | k3Controller.ts, k5Controller.ts | Game pages | Frontend broken |
| 13 | `winGoPage*` | winGoController.ts | Wingo pages | Frontend broken |
| 14 | `dailyPage` | dailyController.ts | CTV dashboard page | CTV frontend broken |
| 15 | `listMember` (Daily) | dailyController.ts | CTV member list | CTV features broken |
| 16 | `listRechargeP`, `listWithdrawP` | dailyController.ts | CTV transaction lists | CTV features broken |
| 17 | `statistical` (Daily) | dailyController.ts | CTV statistics | CTV dashboard incomplete |
| 18 | `createBonus`, `listRedenvelops` (Daily) | dailyController.ts | CTV bonus features | CTV features broken |

### 2.3 Medium Priority Missing Functions

| # | Function | Original File | Purpose |
|---|----------|---------------|---------|
| 19 | `totalJoin` | adminController.ts | Game statistics |
| 20 | `listRedenvelope` | adminController.ts | Red envelope pagination |
| 21 | `editResult2` | adminController.ts | K3 result editing |
| 22 | `sendMessageAdmin` | socketIoController.ts | Socket.io admin events |
| 23 | `getPhoneByInvite` | adminController.ts | Helper function |
| 24 | `getUserByCode` | adminController.ts | Helper function |
| 25 | `getReferredUsers` | adminController.ts | Helper function |

### 2.4 Low Priority Missing Functions (EJS Views)

| # | Function | Original File | Purpose |
|---|----------|---------------|---------|
| 26-45 | All `*Page` functions | homeController.ts, dailyController.ts | Frontend page renders |
| 46-50 | Auth page renders | accountController.ts | Login/Register pages |

---

## 3. Missing Types

### 3.1 Missing Type Definitions (src/types/)

#### admin.types.ts - Missing Types:

```typescript
// ❌ MISSING: Response Types
interface TotalJoinResponse { /* ... */ }
interface InfoCtv2Data { /* ... */ }
interface ListRedenvelopeData { /* ... */ }
interface EditResultResponse { /* ... */ }

// ❌ MISSING: Input Types
interface TotalJoinInput {
  typeid: "1" | "2" | "3" | "4";
}

interface InfoCtv2Input {
  timeDate: string;
}

// ❌ MISSING: Helper Types
interface GameStatistics {
  win: number;
  loss: number;
  totalBets: number;
}

interface CTVDashboardData {
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  totalRecharge: number;
  totalWithdraw: number;
  // ...
}
```

#### user.types.ts - Missing Types:

```typescript
// ❌ MISSING
interface CallbackBankRequest {
  transaction_id: string;
  client_transaction_id: string;
  amount: number;
  status: number;
}

interface TransferHistoryResponse {
  receive: TransferRecord[];
  datas: TransferRecord[];
}
```

#### game.types.ts - Missing Types:

```typescript
// ❌ MISSING: Wingo Types
interface WingoBet {
  id: number;
  phone: string;
  period: string;
  money: number;
  bet: string;
  status: number;
  get: number;
}

interface WingoGameSession {
  id: number;
  period: string;
  game: string;
  amount: number;
  status: number;
}

interface WingoResult {
  result: number;
  payouts: WingoPayout[];
}

// ❌ MISSING: K3 Types (incomplete)
interface K3Bet { /* ... */ }
interface K3GameSession { /* ... */ }

// ❌ MISSING: 5D Types (incomplete)
interface K5DBet { /* ... */ }
interface K5DGameSession { /* ... */ }
```

#### auth.type.ts - Missing Types:

```typescript
// ❌ MISSING
interface DailyAuthPayload {
  phone: string;
  level: 2; // CTV level
}

interface SocketAuthPayload {
  socketId: string;
  userId: number;
}
```

---

## 4. Missing Database Queries

### 4.1 Missing Query Functions (src/db/)

#### admin.queries.ts - Missing:

```typescript
// ❌ MISSING: CTV Queries
export const getCTVInfo = async (db: Pool, phone: string, timeDate?: string) => { /* ... */ };
export const getCTVMembers = async (db: Pool, ctvPhone: string) => { /* ... */ };
export const getCTVStatistics = async (db: Pool, ctvPhone: string) => { /* ... */ };
export const getCTVRecharges = async (db: Pool, ctvPhone: string) => { /* ... */ };
export const getCTVWithdrawals = async (db: Pool, ctvPhone: string) => { /* ... */ };

// ❌ MISSING: Game Statistics Queries
export const getTotalJoin = async (db: Pool, typeid: string) => { /* ... */ };
export const getGameStatistics = async (db: Pool, game: string) => { /* ... */ };

// ❌ MISSING: Red Envelope Queries
export const getRedEnvelopeByPhone = async (db: Pool, phone: string, page: number, limit: number) => { /* ... */ };
export const getUsedRedEnvelopes = async (db: Pool, phone: string) => { /* ... */ };

// ❌ MISSING: Financial Details Queries
export const getFinancialDetails = async (db: Pool, phone: string) => { /* ... */ };
export const getFinancialDetailsToday = async (db: Pool, phone: string) => { /* ... */ };
```

#### user.queries.ts - Missing:

```typescript
// ❌ MISSING: Payment Callback Queries
export const updateRechargeByTransactionId = async (db: Pool, transactionId: string, status: number) => { /* ... */ };
export const getRechargeByClientTxnId = async (db: Pool, clientTxnId: string) => { /* ... */ };

// ❌ MISSING: Transfer Queries
export const getTransferHistory = async (db: Pool, phone: string) => { /* ... */ };
export const createTransferRecord = async (db: Pool, sender: string, receiver: string, amount: number) => { /* ... */ };

// ❌ MISSING: Team Queries
export const getDirectReferrals = async (db: Pool, code: string) => { /* ... */ };
export const getAllReferrals = async (db: Pool, code: string, depth?: number) => { /* ... */ };
export const getReferralStatistics = async (db: Pool, phone: string) => { /* ... */ };
```

#### game.queries.ts - **ENTIRELY MISSING**:

```typescript
// ❌ MISSING: Wingo Queries (NEW FILE NEEDED)
export const getWingoSession = async (db: Pool, game: string, period?: string) => { /* ... */ };
export const createWingoPeriod = async (db: Pool, game: string, period: number) => { /* ... */ };
export const updateWingoResult = async (db: Pool, period: string, amount: number) => { /* ... */ };
export const getWingoBets = async (db: Pool, period: string, game: string) => { /* ... */ };
export const updateWingoBetStatus = async (db: Pool, betId: number, status: number, winAmount: number) => { /* ... */ };
export const processWingoPayouts = async (db: Pool, period: string, game: string) => { /* ... */ };

// ❌ MISSING: K3 Queries (incomplete)
// ❌ MISSING: 5D Queries (incomplete)
```

---

## 5. Missing Routes

### 5.1 Missing Route Files

| Route File | Status | Missing Endpoints |
|------------|--------|-------------------|
| `src/routes/wingo.routes.ts` | ❌ **MISSING** | All Wingo endpoints |
| `src/routes/daily.routes.ts` | ❌ **MISSING** | All CTV/Daily endpoints |
| `src/routes/socket.routes.ts` | ❌ **MISSING** | Socket.io event handlers |
| `src/routes/callback.routes.ts` | ❌ **MISSING** | Payment webhooks |

### 5.2 Missing API Endpoints

#### Wingo Routes (CRITICAL):
```typescript
POST   /api/wingo/bet          // Place bet
GET    /api/wingo/history      // Get game history
GET    /api/wingo/my-bets      // Get user's bets
POST   /api/wingo/listOrderOld // Admin: Get orders
```

#### Daily/CTV Routes:
```typescript
GET    /api/daily/dashboard    // CTV dashboard
GET    /api/daily/members      // CTV member list
GET    /api/daily/recharges    // CTV recharge list
GET    /api/daily/withdrawals  // CTV withdrawal list
POST   /api/daily/buff-money   // Adjust user balance
GET    /api/daily/info-ctv     // CTV info
GET    /api/daily/info-ctv2    // CTV info with date
```

#### Callback Routes:
```typescript
POST   /api/callback/bank      // Payment gateway webhook
POST   /api/callback/wowpay    // WowPay webhook
```

#### Socket Routes:
```typescript
// Socket.io events
ON     'data-server'    // Game result updates
ON     'data-server-5d' // 5D updates
ON     'data-server-k3' // K3 updates
```

---

## 6. Missing Middleware

### 6.1 Missing Middleware Functions

| Middleware | Purpose | Status |
|------------|---------|--------|
| `middlewareDailyController` | CTV authentication | ❌ Missing |
| `socketAuthMiddleware` | Socket.io authentication | ❌ Missing |
| `paymentWebhookMiddleware` | Payment webhook validation | ❌ Missing |
| `rateLimitMiddleware` | Custom rate limiting | ❌ Missing |

---

## 7. Missing Services

### 7.1 Missing Service Files

| Service File | Purpose | Status |
|--------------|---------|--------|
| `src/services/wingo/wingoResult.service.ts` | Wingo result processing | ❌ **MISSING** |
| `src/services/wingo/wingoBet.service.ts` | Wingo bet validation | ❌ **MISSING** |
| `src/services/wingo/wingoPayout.service.ts` | Wingo payout calculation | ❌ **MISSING** |
| `src/services/game/commission.service.ts` | Commission distribution | ❌ **MISSING** |
| `src/services/payment/callback.service.ts` | Payment callback handling | ❌ **MISSING** |
| `src/services/socket/gameSocket.service.ts` | Socket.io game events | ❌ **MISSING** |

---

## 8. Cron Jobs Migration

### 8.1 Current Status

**Old:** `src/controllersOld/cronJobContronler.ts`

**Missing:** Complete cron job system migration

### 8.2 Required Cron Jobs

```typescript
// ❌ MISSING: Cron job scheduler
import cron from 'node-cron';
import { processWingoResults } from './services/wingo/wingoResult.service';
import { processK3Results } from './services/k3/k3Result.service';
import { process5dResults } from './services/k5/5dResult.service';

// Every 1 minute - Game processing
cron.schedule('*/1 * * * *', async () => {
  // Wingo
  await addWinGo(1);
  await handlingWinGo1P(1);
  
  // 5D
  await add5D(1);
  await handling5D(1);
  
  // K3
  await addK3(1);
  await handlingK3(1);
});

// Daily reset (midnight)
cron.schedule('0 0 * * *', async () => {
  await resetDailyCounters();
});
```

---

## 9. Priority Matrix

### 9.1 P0 - Blocker (Fix Immediately - This Week)

| Priority | Component | Issue | Impact | Files to Create |
|----------|-----------|-------|--------|-----------------|
| 🔴 P0 | Wingo Game | ALL functions missing | **Entire game non-functional** | `src/controllers/wingo/*.ts` |
| 🔴 P0 | Wingo Services | ALL services missing | **No game logic** | `src/services/wingo/*.ts` |
| 🔴 P0 | Wingo Types | ALL types missing | **No type safety** | Add to `src/types/game.types.ts` |
| 🔴 P0 | Wingo Routes | ALL routes missing | **No API endpoints** | `src/routes/wingo.routes.ts` |
| 🔴 P0 | Daily/CTV | ALL controllers missing | **CTV dashboard broken** | `src/controllers/daily/*.ts` |
| 🔴 P0 | Daily/CTV Auth | `middlewareDailyController` missing | **No CTV authentication** | `src/middleware/dailyAuth.middleware.ts` |
| 🔴 P0 | Cron Jobs | Not migrated | **No automated game processing** | `src/jobs/gameScheduler.ts` |

### 9.2 P1 - High Priority (Fix Next Week)

| Priority | Component | Issue | Impact |
|----------|-----------|-------|--------|
| 🟠 P1 | Socket.io | `socketIoController` missing | **No real-time updates** |
| 🟠 P1 | K3/K5D Pages | EJS page controllers missing | **Game frontend broken** |
| 🟠 P1 | Account Pages | Auth page controllers missing | **Login/Register broken** |
| 🟠 P1 | Home Pages | EJS view controllers missing | **Site navigation broken** |
| 🟠 P1 | web.ts Migration | Still uses old controllers | **Mixed codebase** |
| 🟠 P1 | Game Types | Wingo/K3/5D types incomplete | **Type safety compromised** |

### 9.3 P2 - Medium Priority (Fix This Month)

| Priority | Component | Issue | Impact |
|----------|-----------|-------|--------|
| 🟡 P2 | Admin Functions | 8 functions missing | **Limited admin features** |
| 🟡 P2 | Database Queries | Game queries missing | **Code duplication** |
| 🟡 P2 | Routes | 4+ route files missing | **Endpoints not organized** |
| 🟡 P2 | Middleware | 3 middleware missing | **Security/validation gaps** |
| 🟡 P2 | Services | Payment callback service | **Manual processing** |

### 9.4 P3 - Low Priority (Backlog)

| Priority | Component | Issue | Impact |
|----------|-----------|-------|--------|
| 🟢 P3 | Helper Functions | Small utilities | **Can be recreated** |
| 🟢 P3 | Code Cleanup | Remove controllersOld | **Technical debt** |
| 🟢 P3 | Tests | No test coverage | **Quality assurance** |

---

## 10. Action Items

### 10.1 Immediate Actions (This Week - P0 Blockers)

#### 10.1.1 Create Wingo Game System

- [ ] **Create Wingo Controllers**
  - [ ] `src/controllers/wingo/betWingo.controller.ts` - Betting handler
  - [ ] `src/controllers/wingo/listOrderOld.controller.ts` - Game history
  - [ ] `src/controllers/wingo/getMyEmerdList.controller.ts` - User bet history
  - [ ] `src/controllers/wingo/wingoPage.controller.ts` - Page renders (optional)

- [ ] **Create Wingo Services**
  - [ ] `src/services/wingo/wingoResult.service.ts` - Result processing
  - [ ] `src/services/wingo/wingoPayout.service.ts` - Payout calculation
  - [ ] `src/services/wingo/addWinGo.service.ts` - Period creation
  - [ ] `src/services/wingo/wingoValidation.service.ts` - Bet validation

- [ ] **Create Wingo Types**
  - [ ] Add `WingoBet`, `WingoGameSession`, `WingoResult` to `src/types/game.types.ts`
  - [ ] Add validation schemas for Wingo betting

- [ ] **Create Wingo Routes**
  - [ ] `src/routes/wingo.routes.ts`
  - [ ] Export from `src/routes/web.ts`

#### 10.1.2 Create Daily/CTV System

- [ ] **Create Daily Controllers**
  - [ ] `src/controllers/daily/dashboard.controller.ts` - CTV dashboard
  - [ ] `src/controllers/daily/member.controller.ts` - Member management
  - [ ] `src/controllers/daily/buffMoney.controller.ts` - Balance adjustment
  - [ ] `src/controllers/daily/infoCtv.controller.ts` - CTV info
  - [ ] `src/controllers/daily/statistical.controller.ts` - Statistics

- [ ] **Create Daily Middleware**
  - [ ] `src/middleware/dailyAuth.middleware.ts` - CTV authentication

- [ ] **Create Daily Types**
  - [ ] Add CTV types to `src/types/admin.types.ts`

- [ ] **Create Daily Routes**
  - [ ] `src/routes/daily.routes.ts`

#### 10.1.3 Migrate Cron Jobs

- [ ] **Create Job Scheduler**
  - [ ] `src/jobs/gameScheduler.ts`
  - [ ] Import and use new service functions
  - [ ] Schedule for Wingo, K3, 5D games
  - [ ] Daily reset jobs

### 10.2 Short-term Actions (Next Week - P1 High Priority)

- [ ] **Migrate Socket.io**
  - [ ] `src/services/socket/gameSocket.service.ts`
  - [ ] `src/middleware/socketAuth.middleware.ts`

- [ ] **Migrate web.ts Routes**
  - [ ] Update K3 routes to use new controllers
  - [ ] Update K5D routes to use new controllers
  - [ ] Update Wingo routes to use new controllers
  - [ ] Update Daily routes to use new controllers
  - [ ] Update Admin routes to use new controllers
  - [ ] Update Payment routes to use new controllers

- [ ] **Create Auth Page Controllers**
  - [ ] `src/controllers/auth/pages.controller.ts` - Login/Register page renders

- [ ] **Create Home Page Controllers**
  - [ ] `src/controllers/home/pages.controller.ts` - EJS page renders

### 10.3 Medium-term Actions (This Month - P2)

- [ ] **Complete Missing Admin Functions**
  - [ ] `infoCtv2` controller
  - [ ] `listRedenvelope` controller
  - [ ] `totalJoin` controller
  - [ ] `editResult2` controller

- [ ] **Create Missing Database Queries**
  - [ ] Add Wingo queries to `src/db/game.queries.ts` (NEW FILE)
  - [ ] Add CTV queries to `src/db/admin.queries.ts`
  - [ ] Add game statistics queries

- [ ] **Complete Type Coverage**
  - [ ] Add response types for all endpoints
  - [ ] Add validation schemas for all inputs

- [ ] **Add Missing Middleware**
  - [ ] Payment webhook validation
  - [ ] Rate limiting for sensitive endpoints

### 10.4 Long-term Actions (Next Quarter - P3)

- [ ] **Code Cleanup**
  - [ ] Remove `src/controllersOld` folder
  - [ ] Update all imports across project
  - [ ] Remove old controller references from web.ts

- [ ] **Add Comprehensive Tests**
  - [ ] Unit tests for controllers
  - [ ] Integration tests for routes
  - [ ] E2E tests for game flows

- [ ] **Documentation**
  - [ ] API documentation
  - [ ] Architecture documentation
  - [ ] Migration completion report

---

## Appendix A: File Count Summary

| Category | Old Files | New Files | Missing | Coverage |
|----------|-----------|-----------|---------|----------|
| Controllers | 11 | ~35 | ~40 | 55% |
| Types | 0 | 6 | ~20 types | 50% |
| Database Queries | 0 | 5 | ~25 queries | 45% |
| Routes | 1 (web.ts) | 7 | 5 | 55% |
| Services | 0 | ~15 | ~10 | 60% |
| Middleware | 1 | 3 | 4 | 40% |

---

## Appendix D: web.ts Migration Status

### Current State: Uses OLD Controllers

The main route file `src/routes/web.ts` still imports from `controllersOld/`:

```typescript
// CURRENT (OLD) - web.ts line 3-13
import accountController from "../controllers/accountController.js";
import homeController from "../controllers/homeController.js";
import winGoController from "../controllers/winGoController.js";
import userController from "../controllers/userController.js";
import middlewareController from "../controllers/middlewareController.js";
import adminController from "../controllers/adminController.js";
import dailyController from "../controllers/dailyController.js";
import k5Controller from "../controllers/k5Controller.js";
import k3Controller from "../controllers/k3Controller.js";
import paymentController from "../controllers/paymentController.js";
```

### Required Migration

| Route Category | Old Controller | New Controller | Status |
|----------------|----------------|----------------|--------|
| Auth Pages | `accountController` | `src/controllers/auth/*.controller.ts` | ❌ Missing |
| Home Pages | `homeController` | `src/controllers/home/*.controller.ts` | ❌ Missing |
| Wingo Game | `winGoController` | `src/controllers/wingo/*.controller.ts` | ❌ Missing |
| K3 Game | `k3Controller` | `src/controllers/k3/*.controller.ts` | ⚠️ Partial |
| K5D Game | `k5Controller` | `src/controllers/k5/*.controller.ts` | ⚠️ Partial |
| User API | `userController` | `src/controllers/user/*.controller.ts` | ✅ Done |
| Admin API | `adminController` | `src/controllers/admin/*.controller.ts` | ⚠️ Partial |
| Daily/CTV | `dailyController` | `src/controllers/daily/*.controller.ts` | ❌ Missing |
| Payment | `paymentController` | `src/controllers/payment/*.controller.ts` | ⚠️ Partial |
| Middleware | `middlewareController` | `src/middleware/auth.middleware.ts` | ✅ Done |

### Migration Steps for web.ts

1. Create all missing controllers
2. Update imports in web.ts
3. Update route handlers to use new controllers
4. Test all routes
5. Remove old controller files

---

## Appendix E: Existing Type Files Status

### src/types/game.types.ts - EXISTS ✅

**Existing Types:**
- `GameSessionRecord`
- `GameWingoRecord` - Basic Wingo structure
- `Game5dRecord` - Basic 5D structure
- `GameK3Record` - Basic K3 structure
- `GameBetRecord` - Betting structure

**Missing Types:**
- `WingoBetInput` - Validation schema
- `WingoResult` - Result with payouts
- `WingoPayout` - Payout calculation
- Game-specific validation schemas

### src/types/k3.type.ts - EXISTS ✅

**Existing Types:**
- `CommissionLevel`, `ReferrerInfo`, `CommissionDistribution`
- `K3BetInput`, `K3GameJoin`, `K3GameSession`
- `betK3Schema`, `getMyEmerdListSchema`
- K3 constants: `K3_GAME_DURATIONS`, `K3_BET_AMOUNTS`, etc.

**Status:** Mostly complete for K3

### src/types/admin.types.ts - EXISTS ✅

**Existing Types:**
- User, Deposit, Withdrawal, Bet row types
- CommissionLevelRow, AdminConfigRow, SalaryRecordRow
- PaymentMethodRow, UserBankAccountRow, TransactionLogRow
- Validation schemas: `LoginSchema`, `RegisterSchema`, etc.
- Response types: `ApiResponse`, `UserFinancialData`, etc.

**Missing Types:**
- `InfoCtv2Data`, `InfoCtv2Input`
- `ListRedenvelopeData`, `ListRedenvelopeInput`
- `TotalJoinResponse`, `TotalJoinInput`
- CTV-specific types

### src/types/user.types.ts - EXISTS ✅

**Existing Types:**
- User-related types and schemas

**Missing Types:**
- `CallbackBankRequest` (partially covered)
- `TransferHistoryResponse`
- More specific response types

### src/types/auth.type.ts - EXISTS ✅

**Existing Types:**
- Auth-related types

**Missing Types:**
- `DailyAuthPayload` - For CTV authentication
- `SocketAuthPayload` - For Socket.io

### src/types/payment.type.ts - EXISTS ✅

**Status:** Payment types exist

---

## Appendix F: Existing Database Query Files Status

### src/db/admin.queries.ts - EXISTS ✅

**Existing Queries:**
- `listMembers`, `listCTV`
- `findUserByPhone`, `getDirectSubordinates`, `getSubordinatesByLevel`
- `getDepositsByUser`, `getWithdrawalsByUser`, `getBetsByUser`
- `getActiveUsersCount`, `getTotalDeposits`, `getTodayDeposits`
- `getCommissionLevels`, `updateCommissionLevel`
- `getSalaryRecords`, `insertSalaryRecord`, `updateUserMoney`

**Missing Queries:**
- CTV-specific queries (`getCTVInfo`, `getCTVMembers`)
- `getTotalJoin` - Game statistics
- `getRedEnvelopeByPhone`
- `getFinancialDetails`

### src/db/user.queries.ts - EXISTS ✅

**Existing Queries:**
- `userQueryFindByToken`, `userQueryUpdateBalance`
- `userQueryDeductBalance`

**Missing Queries:**
- `getTransferHistory`
- `createTransferRecord`
- `getDirectReferrals`, `getAllReferrals`
- `getReferralStatistics`

### src/db/k3.queries.ts - EXISTS ✅

**Status:** K3 queries exist

### src/db/5d.queries.ts - EXISTS ✅

**Existing Queries:**
- `get5DGameSessions`, `get5DWaitingBets`, `getCurrent5DPeriod`
- `add5dPeriod`

**Missing Queries:**
- More 5D-specific queries

### src/db/payment.queries.ts - EXISTS ✅

**Existing Queries:**
- Payment-related queries

**Missing Queries:**
- `updateRechargeByTransactionId`
- `getRechargeByClientTxnId`

### src/db/game.queries.ts - MISSING ❌

**Required Queries (NEW FILE NEEDED):**
- `getWingoSession`, `createWingoPeriod`, `updateWingoResult`
- `getWingoBets`, `updateWingoBetStatus`, `processWingoPayouts`
- Common game queries

---

## Appendix G: Existing Service Files Status

### src/services/k3/ - EXISTS ✅

**Files:**
- `k3.service.ts`
- `k3Game.service.ts` - `handleK3Game` function
- `k3Payout.service.ts` - `processK3Payouts`
- `k3Result.service.ts` - `processK3Results`

**Status:** Complete for K3

### src/services/k5/ - EXISTS ✅

**Files:**
- `5dGame.service.ts` - `handle5dGame` function
- `5dResult.service.ts` - `process5dResults`, `process5dPayouts`
- `5dValidation.service.ts`
- `commission.service.ts`

**Status:** Complete for 5D

### src/services/payment/ - EXISTS ✅

**Files:**
- `paymentHelpers.service.ts`
- `upiQr.service.ts`
- `wowpay.service.ts`

**Missing:**
- `callback.service.ts` - Payment callback handling

### src/services/user/ - EXISTS ✅

**Files:**
- `sms.service.ts`
- `user.service.ts`

### src/services/auth/ - EXISTS ✅

**Files:**
- `auth.service.ts`
- `customerSevice.service.ts`
- `sms.service.ts`

### src/services/wingo/ - MISSING ❌

**Required Files (NEW DIRECTORY NEEDED):**
- `wingoResult.service.ts`
- `wingoPayout.service.ts`
- `addWinGo.service.ts`
- `wingoValidation.service.ts`

### src/services/socket/ - MISSING ❌

**Required Files:**
- `gameSocket.service.ts`

### src/services/jobs/ - MISSING ❌

**Required Files:**
- `gameScheduler.ts` - Cron job scheduler

---

## Appendix H: Summary of Critical Gaps

### BLOCKERS (Must Fix Before Launch)

1. **Wingo Game System** - 100% missing
   - No controllers, services, types, or routes
   - web.ts uses old controller

2. **Daily/CTV System** - 100% missing
   - No controllers or middleware
   - web.ts uses old controller
   - CTV dashboard completely non-functional

3. **Cron Jobs** - 100% missing
   - No automated game processing
   - Games won't auto-generate results

4. **web.ts Migration** - 0% complete
   - Still imports from controllersOld
   - Mixed old/new codebase

### HIGH PRIORITY (Fix Before Testing)

5. **Socket.io** - 100% missing
   - No real-time game updates

6. **K3/K5D Page Controllers** - Missing
   - Game frontend broken

7. **Auth/Home Page Controllers** - Missing
   - Site navigation broken

---

**Document Version:** 2.0 (Comprehensive Review)
**Last Updated:** 2026-02-25
**Next Review:** After P0 blockers completion
