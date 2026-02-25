# Remaining Controllers Migration Task - JavaScript to TypeScript

## Overview

This document covers the migration of the remaining 5 controllers from `src/controllersOld/`:
1. **cronJobContronler.ts** - Cron jobs for game automation (P0 CRITICAL)
2. **dailyController.ts** - CTV/Daily level controller (P1 HIGH)
3. **homeController.ts** - EJS page renders (P3 LOW)
4. **socketIoController.ts** - Socket.io event handlers (P1 HIGH)
5. **middlewareController.ts** - User authentication middleware (P1 HIGH)

---

## 1. Cron Job Controller (`cronJobContronler.ts`)

### Priority: **P0 - CRITICAL BLOCKER**

Without cron jobs:
- ❌ Game results are NOT generated automatically
- ❌ Payouts are NOT processed
- ❌ Real-time updates NOT sent to users
- ❌ Daily resets NOT performed

### Current Functionality

```typescript
// Runs every 1 minute for each game duration (1, 3, 5, 10 min)
- Add new game period
- Process results
- Emit Socket.io events for real-time updates

// Runs daily at midnight
- Reset roses_today to 0
- Reset point_list money to 0
```

### Files to Create

#### `src/jobs/gameScheduler.ts`

```typescript
import cron from 'node-cron';
import { Pool } from 'mysql2/promise';
import { addWingoHandler } from '../services/wingo/wingoGame.service';
import { handlingWingoHandler } from '../services/wingo/wingoResult.service';
import { add5dHandler } from '../services/5d/5dGame.service';
import { handling5DHandler } from '../services/5d/5dResult.service';
import { addK3Handler } from '../services/k3/k3Game.service';
import { handlingK3Handler } from '../services/k3/k3Result.service';
import { Server } from 'socket.io';

export const createGameScheduler = (db: Pool, io: Server) => {
  // Wingo 1 minute
  cron.schedule('*/1 * * * *', async () => {
    await processWingoGame(db, io, 1);
  });

  // Wingo 3 minutes
  cron.schedule('*/3 * * * *', async () => {
    await processWingoGame(db, io, 3);
  });

  // Wingo 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    await processWingoGame(db, io, 5);
  });

  // Wingo 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    await processWingoGame(db, io, 10);
  });

  // 5D games
  cron.schedule('*/1 * * * *', async () => {
    await process5DGame(db, io, 1);
  });

  cron.schedule('*/3 * * * *', async () => {
    await process5DGame(db, io, 3);
  });

  cron.schedule('*/5 * * * *', async () => {
    await process5DGame(db, io, 5);
  });

  cron.schedule('*/10 * * * *', async () => {
    await process5DGame(db, io, 10);
  });

  // K3 games
  cron.schedule('*/1 * * * *', async () => {
    await processK3Game(db, io, 1);
  });

  cron.schedule('*/3 * * * *', async () => {
    await processK3Game(db, io, 3);
  });

  cron.schedule('*/5 * * * *', async () => {
    await processK3Game(db, io, 5);
  });

  cron.schedule('*/10 * * * *', async () => {
    await processK3Game(db, io, 10);
  });

  // Daily reset at midnight
  cron.schedule('0 0 * * *', async () => {
    await resetDailyCounters(db);
  });
};

const processWingoGame = async (db: Pool, io: Server, duration: number) => {
  try {
    // 1. Add new period
    await addWingoHandler(db)(duration);

    // 2. Process results and payouts
    await handlingWingoHandler(db)(duration);

    // 3. Get latest results
    const game = getWingoGameName(duration);
    const [results] = await db.execute(
      `SELECT * FROM wingo WHERE game = ? ORDER BY id DESC LIMIT 2`,
      [game]
    );

    // 4. Emit to Socket.io
    io.emit('data-server', { data: results });
  } catch (error) {
    console.error(`Error processing Wingo ${duration}min:`, error);
  }
};

const process5DGame = async (db: Pool, io: Server, duration: number) => {
  try {
    await add5dHandler(db)(duration);
    await handling5DHandler(db)(duration);

    const [results] = await db.execute(
      `SELECT * FROM 5d WHERE game = ? ORDER BY id DESC LIMIT 2`,
      [duration]
    );

    io.emit('data-server-5d', { data: results, game: String(duration) });
  } catch (error) {
    console.error(`Error processing 5D ${duration}min:`, error);
  }
};

const processK3Game = async (db: Pool, io: Server, duration: number) => {
  try {
    await addK3Handler(db)(duration);
    await handlingK3Handler(db)(duration);

    const [results] = await db.execute(
      `SELECT * FROM k3 WHERE game = ? ORDER BY id DESC LIMIT 2`,
      [duration]
    );

    io.emit('data-server-k3', { data: results, game: String(duration) });
  } catch (error) {
    console.error(`Error processing K3 ${duration}min:`, error);
  }
};

const resetDailyCounters = async (db: Pool) => {
  try {
    await db.execute('UPDATE users SET roses_today = 0');
    await db.execute('UPDATE userPoints SET points = 0 WHERE currentLevel = 2');
    console.log('Daily counters reset successfully');
  } catch (error) {
    console.error('Error resetting daily counters:', error);
  }
};

const getWingoGameName = (duration: number): string => {
  const names: Record<number, string> = {
    1: 'wingo',
    3: 'wingo3',
    5: 'wingo5',
    10: 'wingo10',
  };
  return names[duration] || 'wingo';
};
```

#### `src/jobs/index.ts`

```typescript
export { createGameScheduler } from './gameScheduler';
```

---

## 2. Daily Controller (`dailyController.ts`)

### Priority: **P1 - HIGH**

CTV (Customer Service Agent) dashboard functionality.

### Current Functionality (1547 lines)

| Function | Purpose | Status |
|----------|---------|--------|
| `dailyPage` | EJS render | P3 (skip) |
| `listMeber` | EJS render | P3 (skip) |
| `profileMember` | EJS render | P3 (skip) |
| `settingPage` | EJS render | P3 (skip) |
| `listRecharge` | EJS render | P3 (skip) |
| `listWithdraw` | EJS render | P3 (skip) |
| `pageInfo` | EJS render | P3 (skip) |
| `giftPage` | EJS render | P3 (skip) |
| `support` | EJS render | P3 (skip) |
| `settings` | Get/set Telegram | P2 |
| `middlewareDailyController` | CTV auth | P1 |
| `statistical` | Referral stats | P2 |
| `userInfo` | Member info | P2 |
| `infoCtv` | **CTV dashboard** | P1 |
| `infoCtv2` | CTV dashboard (date) | P1 |
| `createBonus` | Create red envelope | P2 |
| `listRedenvelops` | List envelopes | P2 |
| `listMember` | List CTV members | P2 |
| `listRechargeP` | CTV recharge list | P2 |
| `listWithdrawP` | CTV withdraw list | P2 |
| `listRechargeMem` | Member recharge | P2 |
| `listWithdrawMem` | Member withdraw | P2 |
| `listRedenvelope` | Member envelopes | P2 |
| `listBet` | Member bets | P2 |
| `buffMoney` | Adjust balance | P1 |

### Files to Create

#### `src/middleware/dailyAuth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';

export const createDailyAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const auth = req.cookies.auth;
      
      if (!auth) {
        res.redirect('/login');
        return;
      }

      const [rows] = await db.execute(
        'SELECT token, level, status FROM users WHERE token = ? AND isVerified = TRUE',
        [auth]
      );

      if (!rows || (rows as any[]).length === 0) {
        res.redirect('/login');
        return;
      }

      const user = (rows as any[])[0];

      if (auth !== user.token || user.status !== 1) {
        res.redirect('/login');
        return;
      }

      // CTV level = 2
      if (user.level !== 2) {
        res.redirect('/home');
        return;
      }

      next();
    } catch (error) {
      console.error('dailyAuthMiddleware error:', error);
      res.redirect('/login');
    }
  };
};
```

#### `src/controllers/daily/ctvDashboard.controller.ts`

```typescript
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { DailyApiResponse, CTVDashboardInput } from '../../types/daily.types';
import {
  findUserByToken,
  getDirectSubordinates,
  getSubordinatesByLevel,
  getDepositsByUser,
  getWithdrawalsByUser,
  getBetsByUser,
  getUserPoints,
} from '../../db/daily.queries';
import { formatTimeIST, getTodayString } from '../../utils/daily.helpers';

const timeNow = Date.now();

export const createCTVDashboardController = (db: Pool) => ({
  // CTV Dashboard - Main
  infoCtv: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const auth = req.cookies.auth;
      const user = await findUserByToken(db, auth);

      if (!user) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow });
        return;
      }

      const phone = user.phone;

      // Get referral hierarchy (F1-F4)
      const f1s = await getDirectSubordinates(db, user.referralCode);
      const f2s = await getSubordinatesByLevel(db, f1s.map(f => f.referralCode));
      const f3s = await getSubordinatesByLevel(db, f2s.map(f => f.referralCode));
      const f4s = await getSubordinatesByLevel(db, f3s.map(f => f.referralCode));

      // Get CTV members
      const members = await getCTVMembers(db, phone);
      const bannedMembers = await getCTVBannedMembers(db, phone);

      // Calculate totals
      const totalRecharge = await calculateTotalRecharge(db, members);
      const totalWithdraw = await calculateTotalWithdraw(db, members);
      const totalRechargeToday = await calculateTotalRechargeToday(db, members);
      const totalWithdrawToday = await calculateTotalWithdrawToday(db, members);
      const win = await calculateWinToday(db, members);
      const loss = await calculateLossToday(db, members);

      // Get today's members
      const today = getTodayString();
      const membersToday = members.filter(m => formatTimeIST(m.createdAt) === today);

      // Get CTV points
      const userPoints = await getUserPoints(db, user.id);

      // Get recent transactions
      const rechargeNews = await getRecentRecharges(db, members);
      const withdrawNews = await getRecentWithdrawals(db, members);
      const redenvelopesUsed = await getRedEnvelopesUsedToday(db, phone);
      const financialDetails = await getFinancialDetailsToday(db, phone);

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,
        f1: f1s.length,
        f2: f2s.length,
        f3: f3s.length,
        f4: f4s.length,
        list_mems: membersToday,
        total_recharge: totalRecharge,
        total_withdraw: totalWithdraw,
        total_recharge_today: totalRechargeToday,
        total_withdraw_today: totalWithdrawToday,
        list_mem_baned: bannedMembers.length,
        win,
        loss,
        list_recharge_news: rechargeNews,
        list_withdraw_news: withdrawNews,
        moneyCTV: userPoints?.points || 0,
        redenvelopes_used: redenvelopesUsed,
        financial_details_today: financialDetails,
        timeStamp: timeNow,
      });
    } catch (error) {
      console.error('infoCtv error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  // CTV Dashboard with date filter
  infoCtv2: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const { timeDate } = req.body;
      const auth = req.cookies.auth;
      const user = await findUserByToken(db, auth);

      if (!user) {
        res.status(401).json({ message: 'Unauthorized', status: false, timeStamp: timeNow });
        return;
      }

      // Similar to infoCtv but filter by timeDate
      // ... implementation
    } catch (error) {
      console.error('infoCtv2 error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },

  // Balance adjustment (buff money)
  buffMoney: async (req: Request, res: Response<DailyApiResponse>): Promise<void> => {
    try {
      const { username: phone, select, money } = req.body;
      const auth = req.cookies.auth;

      if (!phone || !select || !money) {
        res.status(400).json({
          message: 'Missing required fields',
          status: false,
          timeStamp: timeNow,
        });
        return;
      }

      const ctvUser = await findUserByToken(db, auth);
      const targetUser = await findUserByPhone(db, phone);

      if (!targetUser) {
        res.status(404).json({ message: 'User not found', status: false, timeStamp: timeNow });
        return;
      }

      const ctvPoints = await getUserPoints(db, ctvUser.id);

      if (select === '1') {
        // Add money
        if (ctvPoints.pointsUs < money) {
          res.status(400).json({
            message: 'Insufficient balance',
            status: false,
            timeStamp: timeNow,
          });
          return;
        }

        await db.execute('UPDATE users SET balance = balance + ? WHERE phone = ?', [money, phone]);
        await db.execute('UPDATE userPoints SET pointsUs = pointsUs - ? WHERE userId = ?', [money, ctvUser.id]);

        // Log transaction
        await createFinancialDetail(db, ctvUser.id, targetUser.id, money, '1');
      } else {
        // Remove money
        await db.execute('UPDATE users SET balance = balance - ? WHERE phone = ?', [money, phone]);
        await db.execute('UPDATE userPoints SET pointsUs = pointsUs + ? WHERE userId = ?', [money, ctvUser.id]);

        // Log transaction
        await createFinancialDetail(db, ctvUser.id, targetUser.id, money, '2');
      }

      res.status(200).json({ message: 'Success', status: true, timeStamp: timeNow });
    } catch (error) {
      console.error('buffMoney error:', error);
      res.status(500).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
      });
    }
  },
});
```

#### `src/controllers/daily/ctvSettings.controller.ts`

```typescript
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

export const createCTVSettingsController = (db: Pool) => ({
  // Get/set Telegram
  settings: async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = req.cookies.auth;
      const { type, value } = req.body;

      const [userRows] = await db.execute(
        'SELECT phone FROM users WHERE token = ? AND isVerified = TRUE',
        [auth]
      );

      if ((userRows as any[]).length === 0) {
        res.status(401).json({ message: 'Error', status: false });
        return;
      }

      const user = (userRows as any[])[0];

      if (!type) {
        // Get settings
        const [pointList] = await db.execute(
          'SELECT telegramId FROM userPoints WHERE userId = ?',
          [user.id]
        );
        const [adminSettings] = await db.execute(
          'SELECT configValue FROM adminConfigs WHERE configKey = ?',
          ['telegram_link']
        );

        res.status(200).json({
          message: 'Get success',
          status: true,
          telegram: (adminSettings as any[])[0]?.configValue || '',
          telegram2: (pointList as any[])[0]?.telegramId || '',
        });
      } else {
        // Update Telegram
        await db.execute(
          'UPDATE userPoints SET telegramId = ? WHERE userId = ?',
          [value, user.id]
        );

        res.status(200).json({
          message: 'Successfully edited',
          status: true,
        });
      }
    } catch (error) {
      console.error('settings error:', error);
      res.status(500).json({ message: 'Error', status: false });
    }
  },

  // Create red envelope
  createBonus: async (req: Request, res: Response): Promise<void> => {
    // Implementation for CTV creating red envelopes
  },

  // List red envelopes
  listRedenvelops: async (req: Request, res: Response): Promise<void> => {
    // Implementation for listing CTV's red envelopes
  },
});
```

#### `src/controllers/daily/ctvMembers.controller.ts`

```typescript
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

export const createCTVMembersController = (db: Pool) => ({
  // List CTV members
  listMember: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pageno, limit } = req.body;
      const auth = req.cookies.auth;

      const [userRows] = await db.execute(
        'SELECT phone FROM users WHERE token = ? AND isVerified = TRUE',
        [auth]
      );

      if ((userRows as any[]).length === 0) {
        res.status(401).json({ message: 'Unauthorized', status: false });
        return;
      }

      const ctvPhone = (userRows as any[])[0].phone;

      const [members] = await db.execute(
        `SELECT id, phone, balance, totalMoney, status, createdAt 
         FROM users 
         WHERE invitedByPhone = ? AND isVerified = TRUE 
         ORDER BY id DESC LIMIT ?, ?`,
        [ctvPhone, pageno, limit]
      );

      const [total] = await db.execute(
        'SELECT COUNT(*) as count FROM users WHERE invitedByPhone = ? AND isVerified = TRUE',
        [ctvPhone]
      );

      res.status(200).json({
        message: 'Success',
        status: true,
        datas: members,
        page_total: Math.ceil((total as any[])[0].count / limit),
      });
    } catch (error) {
      console.error('listMember error:', error);
      res.status(500).json({ message: 'Failed', status: false });
    }
  },

  // List member recharges
  listRechargeMem: async (req: Request, res: Response): Promise<void> => {
    // Implementation
  },

  // List member withdrawals
  listWithdrawMem: async (req: Request, res: Response): Promise<void> => {
    // Implementation
  },

  // List member bets
  listBet: async (req: Request, res: Response): Promise<void> => {
    // Implementation
  },

  // List member red envelopes
  listRedenvelope: async (req: Request, res: Response): Promise<void> => {
    // Implementation
  },
});
```

---

## 3. Home Controller (`homeController.ts`)

### Priority: **P3 - LOW** (EJS views - can skip for API-only)

All functions are EJS page renders. For API-only migration, these can be skipped.

### Functions (26 total)

```typescript
// All return res.render() - EJS views
- homePage, checkInPage, checkDes, checkRecord, addBank
- promotionPage, promotionmyTeamPage, promotionDesPage, tutorialPage, bonusRecordPage
- walletPage, rechargePage, rechargerecordPage, withdrawalPage, withdrawalrecordPage, transfer
- mianPage, aboutPage, recordsalary, privacyPolicy, newtutorial
- redenvelopes, forgot, riskAgreement, myProfilePage, getSalaryRecord
```

### Decision: **SKIP** for API migration

If you need these for SSR, create:
- `src/controllers/home/pages.controller.ts`

---

## 4. Socket.io Controller (`socketIoController.ts`)

### Priority: **P1 - HIGH**

Real-time game result updates.

### Current Functionality

```typescript
// Socket.io event handlers for real-time updates
- data-server: Wingo results
- data-server_2: Unknown
- data-server-5: 5D results
- data-server-3: Unknown
```

### Files to Create

#### `src/services/socket/gameSocket.service.ts`

```typescript
import { Server, Socket } from 'socket.io';
import { Pool } from 'mysql2/promise';

export const createGameSocketService = (io: Server, db: Pool) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Wingo results
    socket.on('data-server', (msg) => {
      io.emit('data-server', msg);
    });

    // Unknown event
    socket.on('data-server_2', (msg) => {
      io.emit('data-server_2', msg);
    });

    // 5D results
    socket.on('data-server-5', (msg) => {
      io.emit('data-server-5', msg);
    });

    // Unknown event
    socket.on('data-server-3', (msg) => {
      io.emit('data-server-3', msg);
    });

    // Game-specific rooms
    socket.on('join-game', (game: string) => {
      socket.join(`game-${game}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Helper methods for emitting from cron jobs
  return {
    emitWingoResults: (data: any) => {
      io.emit('data-server', { data });
    },
    emit5DResults: (data: any, game: string) => {
      io.emit('data-server-5d', { data, game });
    },
    emitK3Results: (data: any, game: string) => {
      io.emit('data-server-k3', { data, game });
    },
  };
};
```

#### `src/middleware/socketAuth.middleware.ts`

```typescript
import { Socket } from 'socket.io';
import { Pool } from 'mysql2/promise';

export const createSocketAuthMiddleware = (db: Pool) => {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const [rows] = await db.execute(
        'SELECT id, phone, status FROM users WHERE token = ? AND isVerified = TRUE',
        [token]
      );

      if ((rows as any[]).length === 0) {
        return next(new Error('Invalid token'));
      }

      const user = (rows as any[])[0];

      if (user.status !== 1) {
        return next(new Error('Account suspended'));
      }

      // Attach user to socket
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  };
};
```

---

## 5. Middleware Controller (`middlewareController.ts`)

### Priority: **P1 - HIGH**

User authentication middleware for regular users.

### Current Functionality

```typescript
// Validates user token from cookies
// Checks user status is active (1)
// Redirects to login if invalid
```

### Files to Create

#### `src/middleware/userAuth.middleware.ts` (already partially exists)

```typescript
import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';

export const createUserAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const auth = req.cookies.auth;

      if (!auth) {
        res.redirect('/login');
        return;
      }

      const [rows] = await db.execute(
        'SELECT token, status FROM users WHERE token = ? AND isVerified = TRUE',
        [auth]
      );

      if (!rows || (rows as any[]).length === 0) {
        res.clearCookie('auth');
        res.redirect('/login');
        return;
      }

      const user = (rows as any[])[0];

      if (auth !== user.token || user.status !== 1) {
        res.clearCookie('auth');
        res.redirect('/login');
        return;
      }

      // Attach user to request
      (req as any).user = user;
      next();
    } catch (error) {
      console.error('userAuthMiddleware error:', error);
      res.redirect('/login');
    }
  };
};

// Optional auth - doesn't redirect if invalid
export const createOptionalUserAuthMiddleware = (db: Pool) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const auth = req.cookies.auth;

      if (auth) {
        const [rows] = await db.execute(
          'SELECT token, status FROM users WHERE token = ? AND isVerified = TRUE',
          [auth]
        );

        if (rows && (rows as any[]).length > 0) {
          const user = (rows as any[])[0];
          if (user.status === 1) {
            (req as any).user = user;
          }
        }
      }

      next();
    } catch (error) {
      console.error('optionalUserAuthMiddleware error:', error);
      next();
    }
  };
};
```

---

## Migration Checklist

### Cron Jobs (P0)
- [ ] Create `src/jobs/gameScheduler.ts`
- [ ] Create `src/jobs/index.ts`
- [ ] Integrate with Socket.io service
- [ ] Test all game durations (1, 3, 5, 10 min)
- [ ] Test daily reset

### Daily/CTV (P1)
- [ ] Create `src/middleware/dailyAuth.middleware.ts`
- [ ] Create `src/controllers/daily/ctvDashboard.controller.ts`
- [ ] Create `src/controllers/daily/ctvSettings.controller.ts`
- [ ] Create `src/controllers/daily/ctvMembers.controller.ts`
- [ ] Create `src/types/daily.types.ts`
- [ ] Create `src/db/daily.queries.ts`
- [ ] Create `src/utils/daily.helpers.ts`
- [ ] Create `src/routes/daily.routes.ts`

### Socket.io (P1)
- [ ] Create `src/services/socket/gameSocket.service.ts`
- [ ] Create `src/middleware/socketAuth.middleware.ts`
- [ ] Integrate with cron jobs
- [ ] Test real-time updates

### Middleware (P1)
- [ ] Create `src/middleware/userAuth.middleware.ts`
- [ ] Create `src/middleware/optionalUserAuth.middleware.ts`
- [ ] Test authentication flow

### Home (P3 - Optional)
- [ ] Skip for API-only migration
- [ ] OR create `src/controllers/home/pages.controller.ts`

---

## Summary

| Controller | Priority | Files | Status |
|------------|----------|-------|--------|
| **cronJobContronler** | P0 | 2 | Must migrate |
| **dailyController** | P1 | 7 | Must migrate |
| **socketIoController** | P1 | 2 | Must migrate |
| **middlewareController** | P1 | 1 | Must migrate |
| **homeController** | P3 | 0 | Skip (EJS) |

**Total:** 12 files to create (excluding homeController)

---

**Priority Order:**
1. **cronJobContronler** - Platform won't function without it
2. **middlewareController** - Required for user auth
3. **socketIoController** - Required for real-time updates
4. **dailyController** - CTV features
5. **homeController** - Skip (EJS views)
