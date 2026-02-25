# TypeScript Migration - Complete File Structure Guide

## Overview

This guide shows the complete file structure for the migrated TypeScript codebase, including all controllers, services, types, routes, middleware, and utilities.

---

## 📁 Complete Directory Structure

```
src/
├── index.ts                          # Main application entry point
├── app.ts                            # Express app configuration
├── server.ts                         # Server startup (HTTP + Socket.io)
│
├── config/
│   ├── database.ts                   # Database connection pool
│   ├── redis.ts                      # Redis connection (optional)
│   ├── cors.ts                       # CORS configuration
│   └── env.ts                        # Environment variables validation
│
├── controllers/
│   ├── admin/
│   │   ├── adminAuth.controller.ts   # Admin login, register, settings
│   │   └── adminMember.controller.ts # Member management, statistics
│   │
│   ├── auth/
│   │   ├── login.controller.ts
│   │   ├── register.controller.ts
│   │   ├── forgotPass.controller.ts
│   │   ├── verifyCode.controller.ts
│   │   ├── verifyCodePass.controller.ts
│   │   └── customerService.controller.ts
│   │
│   ├── daily/                        # CTV/Daily level controllers
│   │   ├── ctvDashboard.controller.ts
│   │   ├── ctvSettings.controller.ts
│   │   └── ctvMembers.controller.ts
│   │
│   ├── k3/
│   │   ├── betK3.controller.ts
│   │   ├── listOrderOld.controller.ts
│   │   ├── getMyEmerdList.controller.ts
│   │   ├── addK3.controller.ts
│   │   ├── commission.controller.ts
│   │   └── validate.controller.ts
│   │
│   ├── k5/                           # 5D Lottery controllers
│   │   ├── bet5d.controller.ts
│   │   ├── listOrderOld.controller.ts
│   │   ├── getMyEmerdList.controller.ts
│   │   └── add5d.controller.ts
│   │
│   ├── payment/
│   │   ├── upiGateway.controller.ts
│   │   ├── manualPayment.controller.ts
│   │   ├── wowpay.controller.ts
│   │   └── callback.controller.ts
│   │
│   ├── user/
│   │   ├── verifyCode.controller.ts
│   │   ├── userInfo.controller.ts
│   │   ├── changeUser.controller.ts
│   │   ├── changePassword.controller.ts
│   │   ├── checkIn.controller.ts
│   │   ├── aviator.controller.ts
│   │   ├── promotion.controller.ts
│   │   ├── myTeam.controller.ts
│   │   ├── listMyTeam.controller.ts
│   │   ├── recharge.controller.ts
│   │   ├── cancelRecharge.controller.ts
│   │   ├── recharge2.controller.ts
│   │   ├── listRecharge.controller.ts
│   │   ├── confirmRecharge.controller.ts
│   │   ├── updateRecharge.controller.ts
│   │   ├── withdrawal.controller.ts
│   │   ├── listWithdraw.controller.ts
│   │   ├── addBank.controller.ts
│   │   ├── infoUserBank.controller.ts
│   │   ├── transfer.controller.ts
│   │   ├── transferHistory.controller.ts
│   │   ├── useRedEnvelope.controller.ts
│   │   ├── search.controller.ts
│   │   ├── callbackBank.controller.ts
│   │   └── confirmUSDTRecharge.controller.ts
│   │
│   └── wingo/
│       ├── betWingo.controller.ts
│       ├── listOrderOld.controller.ts
│       ├── getMyEmerdList.controller.ts
│       ├── addWingo.controller.ts
│       └── handlingWingo.controller.ts
│
├── services/
│   ├── auth/
│   │   ├── auth.service.ts           # Authentication logic
│   │   ├── customerService.service.ts
│   │   └── sms.service.ts            # SMS OTP sending
│   │
│   ├── k3/
│   │   ├── k3.service.ts
│   │   ├── k3Game.service.ts         # Game period management
│   │   ├── k3Result.service.ts       # Result processing
│   │   ├── k3Payout.service.ts       # Payout calculation
│   │   └── k3Commission.service.ts   # Commission distribution
│   │
│   ├── k5/
│   │   ├── 5dGame.service.ts
│   │   ├── 5dResult.service.ts
│   │   ├── 5dPayout.service.ts
│   │   └── 5dCommission.service.ts
│   │
│   ├── payment/
│   │   ├── paymentHelpers.service.ts
│   │   ├── upiGateway.service.ts     # EKQR API integration
│   │   ├── wowpay.service.ts         # WowPay integration
│   │   ├── upiQr.service.ts          # QR code generation
│   │   └── deposit.service.ts        # Deposit processing
│   │
│   ├── socket/
│   │   └── gameSocket.service.ts     # Socket.io event handlers
│   │
│   ├── user/
│   │   ├── user.service.ts
│   │   ├── sms.service.ts
│   │   ├── referral.service.ts       # Referral hierarchy
│   │   ├── checkIn.service.ts        # Check-in rewards
│   │   ├── transfer.service.ts       # Balance transfers
│   │   └── redEnvelope.service.ts    # Red envelope claims
│   │
│   └── wingo/
│       ├── wingoBet.service.ts       # Bet validation & calculation
│       ├── wingoResult.service.ts    # Result processing (smart algorithm)
│       ├── wingoPayout.service.ts    # Payout calculation
│       ├── wingoGame.service.ts      # Game period management
│       └── wingoCommission.service.ts # Commission distribution
│
├── db/                               # Database queries (raw SQL)
│   ├── admin.queries.ts
│   ├── auth.queries.ts
│   ├── daily.queries.ts
│   ├── k3.queries.ts
│   ├── k5.queries.ts
│   ├── payment.queries.ts
│   ├── user.queries.ts
│   └── wingo.queries.ts
│
├── middleware/
│   ├── adminAuth.middleware.ts       # Admin authentication
│   ├── userAuth.middleware.ts        # User authentication
│   ├── dailyAuth.middleware.ts       # CTV authentication
│   ├── socketAuth.middleware.ts      # Socket.io authentication
│   ├── paymentAuth.middleware.ts     # Payment endpoint auth
│   └── validation.middleware.ts      # Zod validation middleware
│
├── types/                            # TypeScript types & Zod schemas
│   ├── admin.types.ts
│   ├── auth.types.ts
│   ├── daily.types.ts
│   ├── game.types.ts                 # Common game types
│   ├── k3.types.ts
│   ├── k5.types.ts
│   ├── payment.types.ts
│   ├── user.types.ts
│   ├── wingo.types.ts
│   └── common.types.ts               # Shared types (ApiResponse, etc.)
│
├── utils/                            # Helper functions
│   ├── admin.helpers.ts
│   ├── auth.helpers.ts
│   ├── common.helpers.ts             # Shared helpers (formatTime, etc.)
│   ├── crypto.helpers.ts             # Hashing, encryption
│   ├── daily.helpers.ts
│   ├── game.helpers.ts               # Game-specific helpers
│   ├── k3.helpers.ts
│   ├── k5.helpers.ts
│   ├── payment.helpers.ts
│   ├── user.helpers.ts
│   └── wingo.helpers.ts
│
├── jobs/                             # Cron jobs & scheduled tasks
│   ├── gameScheduler.ts              # Main game cron scheduler
│   ├── dailyReset.scheduler.ts       # Daily reset jobs
│   └── index.ts                      # Job exports
│
├── routes/
│   ├── admin.routes.ts
│   ├── auth.routes.ts
│   ├── daily.routes.ts
│   ├── k3.routes.ts
│   ├── k5.routes.ts
│   ├── payment.routes.ts
│   ├── user.routes.ts
│   ├── wingo.routes.ts
│   └── web.ts                        # Main router (combines all routes)
│
├── public/                           # Static files (if needed)
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/                            # EJS templates (if keeping SSR)
│   ├── admin/
│   ├── daily/
│   ├── bet/
│   ├── wallet/
│   ├── member/
│   └── promotion/
│
└── controllersOld/                   # ⚠️ DELETE AFTER MIGRATION
    ├── adminController.ts
    ├── dailyController.ts
    ├── homeController.ts
    ├── k3Controller.ts
    ├── k5Controller.ts
    ├── middlewareController.ts
    ├── paymentController.ts
    ├── socketIoController.ts
    ├── userController.ts
    └── winGoController.ts
```

---

## 📝 File Naming Conventions

### Controllers
```typescript
// Pattern: [feature].controller.ts
✅ betWingo.controller.ts
✅ userInfo.controller.ts
❌ winGoController.ts (old camelCase)
❌ bet_wingo.controller.ts (snake_case)
```

### Services
```typescript
// Pattern: [feature].service.ts
✅ wingoBet.service.ts
✅ deposit.service.ts
❌ wingoBetService.ts (no .service)
```

### Types
```typescript
// Pattern: [feature].types.ts
✅ wingo.types.ts
✅ payment.types.ts
❌ wingoTypes.ts
```

### Database Queries
```typescript
// Pattern: [feature].queries.ts
✅ wingo.queries.ts
✅ payment.queries.ts
❌ wingoQueries.ts
```

### Middleware
```typescript
// Pattern: [authType].middleware.ts
✅ userAuth.middleware.ts
✅ adminAuth.middleware.ts
❌ userAuthMiddleware.ts
```

### Utils/Helpers
```typescript
// Pattern: [feature].helpers.ts OR [feature].utils.ts
✅ wingo.helpers.ts
✅ common.helpers.ts
❌ wingoHelpers.ts
```

---

## 🔗 Import/Export Patterns

### Controllers (Factory Pattern)

```typescript
// src/controllers/wingo/betWingo.controller.ts
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { WingoBetSchema } from '../../types/wingo.types';
import { processWingoBet } from '../../services/wingo/wingoBet.service';

export const createBetWingoController = (db: Pool) => {
  return async (req: Request, res: Response): Promise<void> => {
    // Controller logic using db
  };
};
```

```typescript
// src/routes/wingo.routes.ts
import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { createBetWingoController } from '../controllers/wingo/betWingo.controller';

export const createWingoRoutes = (db: Pool): Router => {
  const router = Router();
  const betWingoController = createBetWingoController(db);
  
  router.post('/bet', betWingoController);
  
  return router;
};
```

### Services

```typescript
// src/services/wingo/wingoBet.service.ts
import { Pool } from 'mysql2/promise';
import { WingoBetRecord } from '../../types/wingo.types';

export const processWingoBet = async (
  db: Pool,
  userId: number,
  betData: object
): Promise<WingoBetRecord> => {
  // Service logic
};

// OR as factory
export const createWingoBetService = (db: Pool) => ({
  processBet: async (userId: number, betData: object) => {
    // Service logic using db
  },
});
```

### Database Queries

```typescript
// src/db/wingo.queries.ts
import { Pool } from 'mysql2/promise';

export const findWingoSessionByPeriod = async (
  db: Pool,
  period: string,
  game: string
) => {
  const [rows] = await db.execute(
    'SELECT * FROM wingo WHERE period = ? AND game = ?',
    [period, game]
  );
  return rows as any[];
};

export const createWingoSession = async (
  db: Pool,
  data: { period: number; game: string; status: number }
) => {
  const [result] = await db.execute(
    'INSERT INTO wingo SET period = ?, game = ?, status = ?, time = ?',
    [data.period, data.game, data.status, Date.now()]
  );
  return result;
};
```

### Types

```typescript
// src/types/wingo.types.ts
import { z } from 'zod';

// Zod schemas
export const WingoBetSchema = z.object({
  typeid: z.enum(['1', '3', '5', '10']),
  join: z.string(),
  x: z.string().regex(/^\d+$/),
  money: z.number().int().positive(),
});

// TypeScript types
export interface WingoApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
}

export interface WingoGameSession {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  amount: number;
  status: number;
}

// Type exports
export type WingoBetInput = z.infer<typeof WingoBetSchema>;
```

### Middleware

```typescript
// src/middleware/userAuth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';

export const createUserAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const auth = req.cookies.auth;
    
    if (!auth) {
      res.redirect('/login');
      return;
    }
    
    // Validate token...
    next();
  };
};
```

---

## 📦 Module Organization

### By Feature (Recommended)

```
src/
├── controllers/
│   └── wingo/
│       ├── betWingo.controller.ts
│       └── index.ts              # Export all wingo controllers
├── services/
│   └── wingo/
│       ├── wingoBet.service.ts
│       ├── wingoResult.service.ts
│       └── index.ts              # Export all wingo services
├── types/
│   └── wingo.types.ts            # All wingo types in one file
├── db/
│   └── wingo.queries.ts          # All wingo queries
├── utils/
│   └── wingo.helpers.ts          # All wingo helpers
└── routes/
    └── wingo.routes.ts           # All wingo routes
```

### By Layer (Alternative)

```
src/
├── controllers/
│   ├── wingo.controller.ts
│   ├── k3.controller.ts
│   └── ...
├── services/
│   ├── wingo.service.ts
│   ├── k3.service.ts
│   └── ...
└── ...
```

**Recommendation:** Use **By Feature** for better scalability.

---

## 🚀 Entry Points

### Main Application (`src/index.ts`)

```typescript
import { app } from './app';
import { createServer } from 'http';
import { initializeSocket } from './server';
import { createGameScheduler } from './jobs';
import { getDbPool } from './config/database';

const PORT = process.env.PORT || 3000;

const db = getDbPool();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// Start cron jobs
createGameScheduler(db, io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Express App (`src/app.ts`)

```typescript
import express from 'express';
import cookieParser from 'cookie-parser';
import { createAuthRoutes } from './routes/auth.routes';
import { createUserRoutes } from './routes/user.routes';
import { createWingoRoutes } from './routes/wingo.routes';
import { createK3Routes } from './routes/k3.routes';
import { createK5Routes } from './routes/k5.routes';
import { createPaymentRoutes } from './routes/payment.routes';
import { createAdminRoutes } from './routes/admin.routes';
import { createDailyRoutes } from './routes/daily.routes';

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const db = getDbPool();
app.use('/api/auth', createAuthRoutes(db));
app.use('/api/user', createUserRoutes(db));
app.use('/api/wingo', createWingoRoutes(db));
app.use('/api/k3', createK3Routes(db));
app.use('/api/k5', createK5Routes(db));
app.use('/api/payment', createPaymentRoutes(db));
app.use('/api/admin', createAdminRoutes(db));
app.use('/api/daily', createDailyRoutes(db));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});
```

---

## 📋 Migration Checklist by Folder

### Controllers
- [ ] `admin/` - 2 files
- [ ] `auth/` - 6 files
- [ ] `daily/` - 3 files
- [ ] `k3/` - 6 files
- [ ] `k5/` - 4 files
- [ ] `payment/` - 4 files
- [ ] `user/` - 25 files
- [ ] `wingo/` - 5 files
- **Total: 55 controller files**

### Services
- [ ] `auth/` - 3 files
- [ ] `k3/` - 5 files
- [ ] `k5/` - 4 files
- [ ] `payment/` - 5 files
- [ ] `socket/` - 1 file
- [ ] `user/` - 6 files
- [ ] `wingo/` - 5 files
- **Total: 29 service files**

### Database Queries
- [ ] `admin.queries.ts`
- [ ] `auth.queries.ts`
- [ ] `daily.queries.ts`
- [ ] `k3.queries.ts`
- [ ] `k5.queries.ts`
- [ ] `payment.queries.ts`
- [ ] `user.queries.ts`
- [ ] `wingo.queries.ts`
- **Total: 8 query files**

### Middleware
- [ ] `adminAuth.middleware.ts`
- [ ] `userAuth.middleware.ts`
- [ ] `dailyAuth.middleware.ts`
- [ ] `socketAuth.middleware.ts`
- [ ] `paymentAuth.middleware.ts`
- [ ] `validation.middleware.ts`
- **Total: 6 middleware files**

### Types
- [ ] `admin.types.ts`
- [ ] `auth.types.ts`
- [ ] `daily.types.ts`
- [ ] `game.types.ts`
- [ ] `k3.types.ts`
- [ ] `k5.types.ts`
- [ ] `payment.types.ts`
- [ ] `user.types.ts`
- [ ] `wingo.types.ts`
- [ ] `common.types.ts`
- **Total: 10 type files**

### Utils
- [ ] `admin.helpers.ts`
- [ ] `auth.helpers.ts`
- [ ] `common.helpers.ts`
- [ ] `crypto.helpers.ts`
- [ ] `daily.helpers.ts`
- [ ] `game.helpers.ts`
- [ ] `k3.helpers.ts`
- [ ] `k5.helpers.ts`
- [ ] `payment.helpers.ts`
- [ ] `user.helpers.ts`
- [ ] `wingo.helpers.ts`
- **Total: 11 helper files**

### Routes
- [ ] `admin.routes.ts`
- [ ] `auth.routes.ts`
- [ ] `daily.routes.ts`
- [ ] `k3.routes.ts`
- [ ] `k5.routes.ts`
- [ ] `payment.routes.ts`
- [ ] `user.routes.ts`
- [ ] `wingo.routes.ts`
- [ ] `web.ts`
- **Total: 9 route files**

### Jobs
- [ ] `gameScheduler.ts`
- [ ] `dailyReset.scheduler.ts`
- [ ] `index.ts`
- **Total: 3 job files**

---

## 🎯 Quick Reference

### Total Files to Create

| Category | Count |
|----------|-------|
| Controllers | 55 |
| Services | 29 |
| Database Queries | 8 |
| Middleware | 6 |
| Types | 10 |
| Utils | 11 |
| Routes | 9 |
| Jobs | 3 |
| **TOTAL** | **131 files** |

### Migration Priority

```
Phase 1 (P0 - Critical):
├── Cron Jobs (3 files)
├── Wingo (10 files)
└── Middleware (6 files)

Phase 2 (P1 - High):
├── Payment (10 files)
├── Socket.io (2 files)
├── 5D/K3 (15 files)
├── User (30 files)
└── Daily/CTV (10 files)

Phase 3 (P2 - Medium):
├── Admin (8 files)
└── Auth (10 files)

Phase 4 (P3 - Low):
└── Home/EJS (Skip for API)
```

---

## 📌 Post-Migration Cleanup

After completing migration:

```bash
# 1. Verify all imports work
npm run build

# 2. Test all endpoints
npm run test

# 3. Delete old controllers
rm -rf src/controllersOld/

# 4. Update package.json scripts
# 5. Update .gitignore
# 6. Update documentation
```

---

**Last Updated:** 2026-02-25
**Version:** 1.0
**Status:** Ready for Migration
