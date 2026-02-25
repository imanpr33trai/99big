# Wingo Lottery Controller Migration Task - JavaScript to TypeScript

## Overview

You are tasked with migrating the legacy JavaScript Wingo lottery controller (`src/controllersOld/winGoController.ts`) to a modern, type-safe TypeScript implementation. This is a **GREENFIELD MIGRATION** - do not reference any existing migrated code. Build everything from scratch following the specifications below.

---

## ⚠️ CRITICAL: This is a BLOCKER Migration

**The Wingo game is the CORE feature of the platform.** Without this migration:
- ❌ Users cannot place bets
- ❌ Game results are not generated
- ❌ Payouts are not processed
- ❌ Commission is not distributed
- ❌ The entire platform is non-functional

**Priority: P0 - CRITICAL BLOCKER**

---

## Project Context

### Application Type
- **99BigDaddy** - Online lottery and betting platform
- **Wingo Lottery** - Number/color betting game (numbers 0-9)
- **Game Durations**: 1 minute, 3 minutes, 5 minutes, 10 minutes
- **User Levels**: Regular users (level 0), CTV/Agents (level 2), Admins (level 1)

### Tech Stack
- **Runtime**: Node.js with Express
- **Language**: TypeScript (strict mode)
- **Database**: MySQL with modern schema (see `src/config/schema_best.sql`)
- **Validation**: Zod schemas
- **Database Driver**: mysql2/promise with Pool

---

## Wingo Game Rules

### Result Format
- **Single digit**: 0-9
- **Colors**: Red, Green, Violet
- **Size**: Big (5-9), Small (0-4)

### Bet Types and Payouts

| Bet | Description | Payout |
|-----|-------------|--------|
| **0-9** | Specific number | 9x |
| **l** (Big) | Result is 5-9 | 2x |
| **n** (Small) | Result is 0-4 | 2x |
| **d** (Red) | Result is Red | 2x |
| **x** (Green) | Result is Green | 2x |
| **t** (Violet) | Result is Violet | 4.5x |

### Color Rules

| Number | Color | Size |
|--------|-------|------|
| 0 | Red + Violet | Small |
| 1 | Green | Small |
| 2 | Red | Small |
| 3 | Green | Small |
| 4 | Red | Small |
| 5 | Green + Violet | Big |
| 6 | Red | Big |
| 7 | Green | Big |
| 8 | Red | Big |
| 9 | Green | Big |

### Special Payout Rules

```
Result = 0:
  - Number 0: 9x
  - Violet (t): 4.5x
  - Red (d): 2x
  - Small (n): 2x

Result = 5:
  - Number 5: 9x
  - Violet (t): 4.5x
  - Green (x): 2x
  - Big (l): 2x

Result = 1,2,3,4,6,7,8,9:
  - Specific number: 9x
  - Color (Red/Green): 2x
  - Size (Big/Small): 2x
```

### Commission Distribution

```
When user places bet (turnover):
- F1 (direct referral): (turnover / 100) * rateF1
- F2: (turnover / 100) * rateF2
- F3: (turnover / 100) * rateF3
- F4: (turnover / 100) * rateF4

Requirements:
- Minimum turnover: ₹100
- Referrer must have sufficient user_level
```

---

## Database Schema Reference

### Key Tables You Will Use

#### `gameSessions` Table (replaces `wingo`)
```sql
- id: INT UNSIGNED (PK)
- period: VARCHAR(50)
- gameTypeId: TINYINT UNSIGNED (1=Wingo)
- result: VARCHAR(50) -- e.g., "0", "5", "9"
- amount: INT -- The result number
- status: TINYINT (0=pending, 1=open, 2=closed, 3=completed)
- startedAt: BIGINT
- closedAt: BIGINT
- resultAt: BIGINT
- createdAt: BIGINT
```

#### `bets` Table (replaces `minutes_1`)
```sql
- id: INT UNSIGNED (PK)
- sessionId: INT UNSIGNED (FK to gameSessions)
- userId: INT UNSIGNED (FK)
- gameTypeId: TINYINT UNSIGNED
- stage: INT -- period number
- betAmount: DECIMAL(15,2)
- potentialWin: DECIMAL(15,2)
- fee: DECIMAL(15,2) -- 2% of bet
- actualWin: DECIMAL(15,2)
- selection: VARCHAR(50) -- user's bet selection (0-9, l, n, d, x, t)
- betType: VARCHAR(50) -- 'number', 'big', 'small', 'red', 'green', 'violet'
- result: VARCHAR(50) -- game result
- isWin: BOOLEAN
- status: TINYINT (0=pending, 1=won, 2=lost, 3=cancelled)
- createdAt: BIGINT
```

#### `users` Table
```sql
- id: INT UNSIGNED (PK)
- phone: VARCHAR(20) UNIQUE
- userName: VARCHAR(100)
- passwordHash: VARCHAR(255)
- authToken: VARCHAR(255)
- balance: DECIMAL(15,2)
- referralCode: VARCHAR(50) UNIQUE
- invitedBy: INT UNSIGNED (FK to users.id)
- isVerified: BOOLEAN
- status: TINYINT (0=active, 1=suspended, 2=banned)
- userLevel: TINYINT (0=user, 1=admin, 2=ctv)
- createdAt: BIGINT
- updatedAt: BIGINT
- totalMoney: DECIMAL(15,2) -- For commission eligibility
```

#### `commissionLevels` Table (replaces `level`)
```sql
- id: TINYINT UNSIGNED (PK)
- level: TINYINT UNSIGNED
- name: VARCHAR(50)
- rateF1: DECIMAL(5,4)
- rateF2: DECIMAL(5,4)
- rateF3: DECIMAL(5,4)
- rateF4: DECIMAL(5,4)
- minTurnover: DECIMAL(15,2)
- createdAt: BIGINT
```

#### `commissionRecords` Table (replaces `roses`)
```sql
- id: INT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- fromUserId: INT UNSIGNED (FK)
- level: TINYINT -- F1=1, F2=2, etc
- amount: DECIMAL(15,2)
- sourceType: VARCHAR(50) -- 'bet', 'deposit', etc
- sourceId: INT UNSIGNED
- createdAt: BIGINT
```

#### `turnoverRecords` Table
```sql
- id: INT UNSIGNED (PK)
- userId: INT UNSIGNED (FK)
- dailyTurnover: DECIMAL(15,2)
- totalTurnover: DECIMAL(15,2)
- recordDate: DATE
- updatedAt: BIGINT
```

#### `adminConfigs` Table (replaces `admin`)
```sql
- id: INT UNSIGNED (PK)
- configKey: VARCHAR(50) UNIQUE
- configValue: TEXT
- description: VARCHAR(255)
- updatedAt: BIGINT
```

Config keys for Wingo:
- `wingo1_control` - 1 minute Wingo
- `wingo3_control` - 3 minute Wingo
- `wingo5_control` - 5 minute Wingo
- `wingo10_control` - 10 minute Wingo
- `bs1`, `bs3`, `bs5`, `bs10` - Win rate settings

---

## Files to Create

### 1. Types File: `src/types/wingo.types.ts`

Create comprehensive Zod schemas and TypeScript types:

```typescript
// REQUIRED SCHEMAS TO CREATE:

// Bet Validation
export const WingoBetSchema = z.object({
  typeid: z.enum(['1', '3', '5', '10']),
  join: z.string(), // '0'-'9', 'l', 'n', 'd', 'x', 't'
  x: z.string().regex(/^\d+$/),
  money: z.number().int().positive(),
});

// Game History
export const WingoHistorySchema = z.object({
  typeid: z.enum(['1', '3', '5', '10']),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

// User Bets
export const WingoMyBetsSchema = z.object({
  typeid: z.enum(['1', '3', '5', '10']),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

// REQUIRED TYPES TO CREATE:
export interface WingoApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  [key: string]: unknown;
}

export interface WingoGameSession {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  amount: number;
  status: number;
  startedAt: number;
  closedAt: number | null;
  resultAt: number | null;
}

export interface WingoBetRecord {
  id: number;
  sessionId: number;
  userId: number;
  stage: number;
  betAmount: number;
  potentialWin: number;
  fee: number;
  actualWin: number;
  selection: string;
  betType: string;
  result: string | null;
  isWin: boolean | null;
  status: number;
  createdAt: number;
}

export interface WingoBetCalculation {
  total: number;
  fee: number;
  price: number;
}

export interface WingoPayout {
  bet: string;
  result: number;
  multiplier: number;
}

export interface WingoResult {
  message: string;
  status: boolean;
  data?: string; // HTML bet confirmation
  money?: number;
  change?: number;
}

export interface WingoHistoryResponse {
  gameslist: WingoGameSession[];
  period: string;
  page: number;
}

export interface WingoMyBetsResponse {
  gameslist: Partial<WingoBetRecord>[];
  page: number;
}

// Bet type constants
export type WingoGameDuration = '1' | '3' | '5' | '10';
export type WingoBetSelection = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'l' | 'n' | 'd' | 'x' | 't';
export type WingoColor = 'red' | 'green' | 'violet';
export type WingoSize = 'big' | 'small';

// Color/Size mapping
export const NUMBER_COLOR: Record<string, WingoColor[]> = {
  '0': ['red', 'violet'],
  '1': ['green'],
  '2': ['red'],
  '3': ['green'],
  '4': ['red'],
  '5': ['green', 'violet'],
  '6': ['red'],
  '7': ['green'],
  '8': ['red'],
  '9': ['green'],
};

export const NUMBER_SIZE: Record<string, WingoSize> = {
  '0': 'small', '1': 'small', '2': 'small', '3': 'small', '4': 'small',
  '5': 'big', '6': 'big', '7': 'big', '8': 'big', '9': 'big',
};

export const BET_PAYOUTS: Record<string, number> = {
  'number': 9,
  'big': 2,
  'small': 2,
  'red': 2,
  'green': 2,
  'violet': 4.5,
};
```

### 2. Middleware: `src/middleware/wingoAuth.middleware.ts`

```typescript
// Create:
- wingoAuthMiddleware(db: Pool) - validates user token for betting
- Optional: rate limiting for bet endpoints
```

### 3. Database Queries: `src/db/wingo.queries.ts`

```typescript
// REQUIRED QUERY FUNCTIONS TO CREATE:

// Game Session Queries
export const getCurrentWingoSession = async (db: Pool, game: string) => {...}
export const getLatestWingoResult = async (db: Pool, game: string) => {...}
export const createWingoSession = async (db: Pool, period: number, game: string) => {...}
export const updateWingoResult = async (db: Pool, period: string, amount: number, game: string) => {...}
export const getWingoHistory = async (db: Pool, game: string, page: number, limit: number) => {...}

// Bet Queries
export const createWingoBet = async (db: Pool, betData: object) => {...}
export const getUserWingoBets = async (db: Pool, userId: number, game: string, page: number, limit: number) => {...}
export const getPendingWingoBets = async (db: Pool, game: string) => {...}
export const updateWingoBetStatus = async (db: Pool, betId: number, status: number, winAmount?: number) => {...}
export const updateWingoBetsByPeriod = async (db: Pool, period: string, game: string, result: number) => {...}

// User Queries
export const findUserByToken = async (db: Pool, token: string) => {...}
export const updateUserBalance = async (db: Pool, userId: number, amount: number) => {...}
export const getUserCommissionLevel = async (db: Pool, userId: number) => {...}
export const updateUserTotalMoney = async (db: Pool, userId: number, amount: number) => {...}

// Commission Queries
export const getCommissionRates = async (db: Pool) => {...}
export const createCommissionRecord = async (db: Pool, data: object) => {...}
export const distributeWingoCommission = async (db: Pool, userId: number, turnover: number) => {...}

// Settings Queries
export const getWingoControlSettings = async (db: Pool, game: string) => {...}
export const updateWingoControlSettings = async (db: Pool, game: string, value: string) => {...}

// Helper Functions
export const formatTimeIST = (timestamp?: number) => {...}
export const getTodayString = () => {...}
```

### 4. Services

#### 4.1 `src/services/wingo/wingoBet.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- validateBetSelection(join: string): boolean
- calculateBetAmount(join: string, money: number, x: number): WingoBetCalculation
- calculateWinAmount(selection: string, result: number, betAmount: number): number
- getPayoutMultiplier(selection: string, result: number): number
- processWingoBet(db: Pool, userId: number, betData: object): Promise<WingoBetRecord>
- generateBetConfirmationHTML(bet: object, period: string, formatTime: string): string
```

#### 4.2 `src/services/wingo/wingoResult.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- generateWingoResult(): number -- Random 0-9 with smart algorithm
- processWingoResults(db: Pool, game: string): Promise<void> -- Mark losing bets
- evaluateNumberBet(selection: string, result: number): boolean
- evaluateColorBet(selection: string, result: number): boolean
- evaluateSizeBet(selection: string, result: number): boolean
- getSmartResult(db: Pool, game: string): Promise<number> -- Minimize platform risk
```

#### 4.3 `src/services/wingo/wingoPayout.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- processWingoPayouts(db: Pool, game: string): Promise<void>
- calculatePayout(bet: WingoBetRecord, result: number): number
- payWinningBets(db: Pool, bets: WingoBetRecord[]): Promise<void>
```

#### 4.4 `src/services/wingo/wingoGame.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- handleWingoGame(db: Pool, typeId: number): Promise<void>
- addWingoPeriod(db: Pool, game: number): Promise<void>
- getPredefinedResult(db: Pool, game: string): string | null
- calculateSmartAmount(db: Pool, game: string, pendingBets: object[]): Promise<number>
```

#### 4.5 `src/services/wingo/wingoCommission.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- distributeCommission(db: Pool, userId: number, turnover: number): Promise<void>
- getReferrerChain(db: Pool, userId: number): Promise<object[]>
- calculateCommissionAmount(turnover: number, level: number, rate: number): number
- createTurnoverRecord(db: Pool, userId: number, amount: number): Promise<void>
```

### 5. Controllers

#### 5.1 `src/controllers/wingo/betWingo.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const betWingoHandler = (db: Pool) => async (req: Request, res: Response<WingoApiResponse>): Promise<void> => {
  try {
    // 1. Validate input with Zod
    const parsed = WingoBetSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', status: false });
      return;
    }

    const { typeid, join, x, money } = parsed.data;
    const auth = req.cookies.auth;

    // 2. Validate game type
    if (!['1', '3', '5', '10'].includes(typeid)) {
      res.status(400).json({ message: 'Invalid game type', status: false });
      return;
    }

    // 3. Get current game session
    const game = getGameName(typeid); // wingo, wingo3, wingo5, wingo10
    const session = await getCurrentWingoSession(db, game);
    if (!session) {
      res.status(400).json({ message: 'No active game session', status: false });
      return;
    }

    // 4. Get user and check balance
    const user = await findUserByToken(db, auth);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized', status: false });
      return;
    }

    // 5. Validate bet selection
    if (!validateBetSelection(join)) {
      res.status(400).json({ message: 'Invalid bet selection', status: false });
      return;
    }

    // 6. Calculate total bet amount and fee
    const calculation = calculateBetAmount(join, money, parseInt(x));
    
    // 7. Check sufficient balance
    if (user.balance < calculation.total) {
      res.status(400).json({ message: 'Insufficient balance', status: false });
      return;
    }

    // 8. Create bet record
    const bet = await processWingoBet(db, user.id, {
      sessionId: session.id,
      stage: session.period,
      betAmount: calculation.total,
      fee: calculation.fee,
      selection: join,
      game: game,
    });

    // 9. Deduct balance
    await updateUserBalance(db, user.id, -calculation.total);

    // 10. Calculate and distribute commission
    await distributeWingoCommission(db, user.id, calculation.total);

    // 11. Generate HTML confirmation
    const formatTime = formatTimeIST();
    const htmlData = generateBetConfirmationHTML(bet, session.period, formatTime);

    // 12. Return success response
    res.status(200).json({
      message: 'Successful bet',
      status: true,
      data: htmlData,
      money: user.balance - calculation.total,
      change: user.userLevel,
      timeStamp: Date.now(),
    });
  } catch (error) {
    console.error('betWingoHandler error:', error);
    res.status(500).json({
      message: 'Failed to place bet',
      status: false,
      timeStamp: Date.now(),
    });
  }
}
```

#### 5.2 `src/controllers/wingo/listOrderOld.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const listOrderOldWingoHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate game type and pagination
  // 2. Get game history from database
  // 3. Get current period
  // 4. Return formatted response
}
```

#### 5.3 `src/controllers/wingo/getMyEmerdList.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const getMyEmerdListWingoHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Get user's bet history
  // 4. Calculate total winnings for current stage
  // 5. Return paginated response
}
```

#### 5.4 `src/controllers/wingo/addWingo.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const addWingoHandler = (db: Pool) => async (game: number): Promise<void> => {
  // 1. Get current period
  // 2. Get pending bets
  // 3. Calculate smart result (minimize platform risk)
  // 4. Get predefined result from settings
  // 5. Update current session with result
  // 6. Create new session
  // 7. Update admin settings
}
```

#### 5.5 `src/controllers/wingo/handlingWingo.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const handlingWingoHandler = (db: Pool) => async (typeId: number): Promise<void> => {
  // 1. Get latest result
  // 2. Update all pending bets with result
  // 3. Mark losing bets as status=2
  // 4. Process payouts for winning bets
  // 5. Update user balances
}
```

### 6. Routes: `src/routes/wingo.routes.ts`

```typescript
import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { betWingoHandler } from '../controllers/wingo/betWingo.controller';
import { listOrderOldWingoHandler } from '../controllers/wingo/listOrderOld.controller';
import { getMyEmerdListWingoHandler } from '../controllers/wingo/getMyEmerdList.controller';
import { addWingoHandler } from '../controllers/wingo/addWingo.controller';
import { handlingWingoHandler } from '../controllers/wingo/handlingWingo.controller';
import { wingoAuthMiddleware } from '../middleware/wingoAuth.middleware';

export const createWingoRoutes = (db: Pool): Router => {
  const router = Router();

  // User routes (require user auth)
  router.post('/bet', wingoAuthMiddleware(db), betWingoHandler(db));
  router.post('/history', wingoAuthMiddleware(db), listOrderOldWingoHandler(db));
  router.post('/my-bets', wingoAuthMiddleware(db), getMyEmerdListWingoHandler(db));

  // Game management (internal/cron)
  router.post('/admin/add-period', async (req, res) => {
    const { game } = req.body;
    await addWingoHandler(db)(parseInt(game));
    res.json({ success: true });
  });

  router.post('/admin/handling', async (req, res) => {
    const { typeid } = req.body;
    await handlingWingoHandler(db)(parseInt(typeid));
    res.json({ success: true });
  });

  return router;
};
```

### 7. Utils: `src/utils/wingo.helpers.ts`

```typescript
// REQUIRED HELPER FUNCTIONS:

// Get game name from typeid
export const getGameName = (typeid: string): string => {
  const games: Record<string, string> = {
    '1': 'wingo',
    '3': 'wingo3',
    '5': 'wingo5',
    '10': 'wingo10',
  };
  return games[typeid] || '';
};

// Get typeid from game name
export const getTypeId = (game: string): string => {
  const typeids: Record<string, string> = {
    'wingo': '1',
    'wingo3': '3',
    'wingo5': '5',
    'wingo10': '10',
  };
  return typeids[game] || '1';
};

// Check if number is red
export const isRed = (num: number): boolean => {
  return [0, 2, 4, 6, 8].includes(num);
};

// Check if number is green
export const isGreen = (num: number): boolean => {
  return [1, 3, 5, 7, 9].includes(num);
};

// Check if number is violet
export const isViolet = (num: number): boolean => {
  return [0, 5].includes(num);
};

// Check if number is big
export const isBig = (num: number): boolean => {
  return num >= 5;
};

// Check if number is small
export const isSmall = (num: number): boolean => {
  return num <= 4;
};

// Get payout multiplier
export const getPayoutMultiplier = (selection: string, result: number): number => {
  // Number bet
  if (/^\d$/.test(selection)) {
    if (parseInt(selection) === result) {
      return 9;
    }
    return 0;
  }

  // Size bet
  if (selection === 'l' && isBig(result)) return 2;
  if (selection === 'n' && isSmall(result)) return 2;

  // Color bet
  if (selection === 'd' && isRed(result)) return 2;
  if (selection === 'x' && isGreen(result)) return 2;
  if (selection === 't' && isViolet(result)) return 4.5;

  return 0;
};

// Format time in IST
export const formatTimeIST = (timestamp?: number): string => {
  // Implementation
};

// Generate product ID
export const generateProductId = (): string => {
  const date = new Date();
  const years = String(date.getFullYear());
  const months = String(date.getMonth() + 1).padStart(2, '0');
  const days = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000000000000);
  return years + months + days + random;
};

// Check if string is numeric
export const isNumber = (str: string): boolean => {
  return /^\d+$/.test(str);
};

// Generate bet confirmation HTML
export const generateBetHTML = (selection: string, period: string, formatTime: string): string => {
  // Generate color class
  let color = '';
  if (selection === 'l') color = 'big';
  else if (selection === 'n') color = 'small';
  else if (selection === 't') color = 'violet';
  else if (selection === 'd') color = 'red';
  else if (selection === 'x') color = 'green';
  else if (selection === '0') color = 'red-violet';
  else if (selection === '5') color = 'green-violet';
  else if (parseInt(selection) % 2 === 0) color = 'red';
  else color = 'green';

  // Generate bet display
  let checkJoin = '';
  if (!isNumber(selection) && (selection === 'l' || selection === 'n')) {
    checkJoin = `<img src="/images/${selection === 'n' ? 'small' : 'big'}.png">`;
  } else {
    checkJoin = `<span>${isNumber(selection) ? selection : ''}</span>`;
  }

  return `
    <div issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
      <div class="item c-row">
        <div class="result">
          <div class="select select-${color}">
            ${checkJoin}
          </div>
        </div>
        <div class="c-row c-row-between info">
          <div>
            <div class="issueName">${period}</div>
            <div class="tiem">${formatTime}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};
```

---

## Critical Requirements

### 1. Smart Result Algorithm (CRITICAL)

```typescript
// The result MUST minimize platform risk
// This is the CORE business logic

async function getSmartResult(db: Pool, game: string): Promise<number> {
  // 1. Get all pending bets
  const pendingBets = await getPendingWingoBets(db, game);

  // 2. Calculate total exposure for each possible result (0-9)
  const exposure: Record<number, number> = {};
  
  for (let result = 0; result <= 9; result++) {
    let totalPayout = 0;
    
    for (const bet of pendingBets) {
      const multiplier = getPayoutMultiplier(bet.selection, result);
      if (multiplier > 0) {
        totalPayout += bet.betAmount * multiplier;
      }
    }
    
    exposure[result] = totalPayout;
  }

  // 3. Find result with minimum payout
  const smartResult = Object.entries(exposure)
    .reduce((min, [num, payout]) => payout < min.payout ? { num: parseInt(num), payout } : min)
    .num;

  return smartResult;
}
```

### 2. Bet Validation

```typescript
// Valid selections:
- Numbers: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
- Size: 'l' (big), 'n' (small)
- Color: 'd' (red), 'x' (green), 't' (violet)

// Validation rules:
- x must be positive integer
- money must be positive
- typeid must be '1', '3', '5', or '10'
```

### 3. Commission Distribution

```typescript
// When user places bet (turnover):
// Calculate commission for F1, F2, F3, F4 levels

Requirements:
- Minimum turnover: ₹100
- Referrer must have sufficient user_level

const f1 = (turnover / 100) * level0.f1;
const f2 = (turnover / 100) * level0.f2;
const f3 = (turnover / 100) * level0.f3;
const f4 = (turnover / 100) * level0.f4;

// Insert into commissionRecords
// Update turnoverRecords
// Update user balances
```

### 4. Result Processing

```typescript
// When game session closes:
// 1. Get result from wingoGames table (0-9)
// 2. Update all pending bets with result
// 3. For each bet:
//    - Check if winning or losing
//    - Mark losing bets as status=2
//    - Keep winning bets as status=0 for payout

// Switch statement for each result:
switch (result) {
  case 0:
    // Mark all bets as lost EXCEPT:
    // - Big (l), Small (n), Red (d), Number 0, Violet (t)
    break;
  case 1:
    // Mark all bets as lost EXCEPT:
    // - Big (l), Small (n), Green (x), Number 1
    break;
  // ... etc for each result
}
```

### 5. Payout Processing

```typescript
// For each winning bet (status=0):
// 1. Calculate win amount based on:
//    - Number (0-9): 9x
//    - Violet (t) on 0 or 5: 4.5x
//    - Color (Red/Green): 2x
//    - Size (Big/Small): 2x
// 2. Update bet status to 1 (won)
// 3. Add winnings to user balance
// 4. Create transaction log
```

### 6. Response Format

```typescript
// Success response:
{
  message: "Successful bet",
  status: true,
  data: "<html>...</html>",  // Bet confirmation HTML
  money: 12345.67,  // User's new balance
  change: 0,        // User level
  timeStamp: 1234567890
}

// Error response:
{
  message: "The amount is not enough",
  status: false,
  timeStamp: 1234567890
}

// History response:
{
  code: 0,
  msg: "Receive success",
  data: {
    gameslist: [...]
  },
  period: "20240225001",
  page: 5,
  status: true
}
```

---

## Migration Checklist

### Phase 1: Foundation (Day 1)
- [ ] Create `src/types/wingo.types.ts` with all Zod schemas
- [ ] Create `src/utils/wingo.helpers.ts` with helper functions
- [ ] Create `src/middleware/wingoAuth.middleware.ts`
- [ ] Create `src/db/wingo.queries.ts` with all query functions

### Phase 2: Services (Day 1-2)
- [ ] Create `src/services/wingo/wingoBet.service.ts`
- [ ] Create `src/services/wingo/wingoResult.service.ts`
- [ ] Create `src/services/wingo/wingoPayout.service.ts`
- [ ] Create `src/services/wingo/wingoGame.service.ts`
- [ ] Create `src/services/wingo/wingoCommission.service.ts`

### Phase 3: Controllers (Day 2)
- [ ] Create `src/controllers/wingo/betWingo.controller.ts`
- [ ] Create `src/controllers/wingo/listOrderOld.controller.ts`
- [ ] Create `src/controllers/wingo/getMyEmerdList.controller.ts`
- [ ] Create `src/controllers/wingo/addWingo.controller.ts`
- [ ] Create `src/controllers/wingo/handlingWingo.controller.ts`

### Phase 4: Routes (Day 2)
- [ ] Create `src/routes/wingo.routes.ts`
- [ ] Export routes from `src/routes/web.ts`
- [ ] Update cron jobs to use new handlers

### Phase 5: Testing (Day 3)
- [ ] Test placing bets for all selection types
- [ ] Test bet validation
- [ ] Test balance deduction
- [ ] Test commission distribution
- [ ] Test game history retrieval
- [ ] Test user bet history
- [ ] Test smart result algorithm
- [ ] Test result processing
- [ ] Test payout calculation
- [ ] Test all payout multipliers (9x, 4.5x, 2x)

### Phase 6: Cleanup (Day 3)
- [ ] Remove old `src/controllersOld/winGoController.ts`
- [ ] Update all imports
- [ ] Verify no SQL injection vulnerabilities
- [ ] Load test with concurrent bets

---

## Function-by-Function Migration Map

| Old Function | New Controller/Service | Notes |
|--------------|------------------------|-------|
| `winGoPage*` | Remove (EJS views) | Not needed for API |
| `isNumber` | `src/utils/wingo.helpers.ts` | Utility function |
| `formateT` | `src/utils/wingo.helpers.ts` | Format helper |
| `timerJoin` | `src/utils/wingo.helpers.ts` | Time formatter |
| `rosesPlus` | `src/services/wingo/wingoCommission.service.ts` | Commission distribution |
| `betWinGo` | `src/controllers/wingo/betWingo.controller.ts` | Main betting endpoint |
| `addWinGo` | `src/services/wingo/wingoGame.service.ts` | Create game period with smart result |
| `handlingWinGo1P` | `src/services/wingo/wingoResult.service.ts` + `wingoPayout.service.ts` | Process results & payouts |
| `listOrderOld` | `src/controllers/wingo/listOrderOld.controller.ts` | Game history |
| `GetMyEmerdList` | `src/controllers/wingo/getMyEmerdList.controller.ts` | User bet history |

---

## Important Business Logic

### 1. Bet Placement Flow

```
1. User sends bet request
   ↓
2. Validate input (Zod schema)
   ↓
3. Get current game session
   ↓
4. Get user and check balance
   ↓
5. Validate bet selection
   ↓
6. Calculate total bet amount
   ↓
7. Calculate fee (2%)
   ↓
8. Check sufficient balance
   ↓
9. Create bet record in database
   ↓
10. Deduct balance from user
    ↓
11. Calculate commission (if turnover >= 100)
    ↓
12. Distribute commission to referrers (F1-F4)
    ↓
13. Update turnover records
    ↓
14. Generate HTML confirmation
    ↓
15. Return success response
```

### 2. Smart Result Algorithm

```
For each game period:
1. Get all pending bets
2. For each possible result (0-9):
   - Calculate total payout if this result wins
3. Select result with MINIMUM total payout
4. If predefined results exist in settings:
   - Use predefined result instead
5. Update game session with result
6. Create new session for next period
```

### 3. Commission Distribution

```
When user places bet (turnover):
- Check if turnover >= 100
- Get referrer chain (F1, F2, F3, F4)
- For each level:
  - Check if referrer has sufficient user_level
  - Calculate commission: (turnover / 100) * rate
  - Insert commission record
  - Update referrer balance
  - Update turnover records
```

### 4. Result Processing

```
For each game (1, 3, 5, 10 minute):
1. Get latest result from wingoGames
2. Update all pending bets with result
3. Use switch statement for each result:
   - Result 0: Lose all EXCEPT l, n, d, 0, t
   - Result 1: Lose all EXCEPT l, n, x, 1
   - Result 2: Lose all EXCEPT l, n, d, 2
   - Result 3: Lose all EXCEPT l, n, x, 3
   - Result 4: Lose all EXCEPT l, n, d, 4
   - Result 5: Lose all EXCEPT l, n, x, 5, t
   - Result 6: Lose all EXCEPT l, n, d, 6
   - Result 7: Lose all EXCEPT l, n, x, 7
   - Result 8: Lose all EXCEPT l, n, d, 8
   - Result 9: Lose all EXCEPT l, n, x, 9
4. Mark losing bets as status=2
5. Keep winning bets as status=0
```

### 5. Payout Processing

```
For each winning bet (status=0):
1. Calculate win amount:
   - Number (0-9): betAmount * 9
   - Violet (t) on 0 or 5: betAmount * 4.5
   - Color (Red/Green): betAmount * 2
   - Size (Big/Small): betAmount * 2
2. Update bet:
   - status = 1 (won)
   - actualWin = calculated amount
3. Update user balance:
   - balance += actualWin
4. Create transaction log
```

### 6. Game Control Settings

```
Admin can predefine results in adminConfigs:
- wingo1_control: "5|3|7|2|-1"
- wingo3_control: "0|8|4|-1"
- etc.

Format: "result1|result2|result3|-1"
- Each result is used for one period
- "-1" means use smart algorithm
- After using all, cycles back to "-1"
```

---

## Testing Requirements

After migration, verify:

1. **Bet Placement**
   - All selection types work (0-9, l, n, d, x, t)
   - Bet validation rejects invalid inputs
   - Balance is deducted correctly
   - Fee calculation is accurate (2%)

2. **Commission**
   - Commission calculated for turnover >= 100
   - F1, F2, F3, F4 rates applied correctly
   - Commission records created
   - Referrer balances updated
   - Turnover records updated

3. **Smart Result**
   - Result minimizes platform payout
   - Predefined results override smart algorithm
   - Result distribution is correct

4. **Game History**
   - Returns correct paginated results
   - Current period included

5. **User Bet History**
   - Returns user's bets only
   - Total winnings calculated correctly
   - Pagination works

6. **Result Processing**
   - Results generated correctly
   - All bet types evaluated correctly
   - Losing bets marked as status=2
   - Winning bets kept as status=0

7. **Payout Processing**
   - Win amounts calculated correctly (9x, 4.5x, 2x)
   - User balances updated
   - Bet status updated to 1

8. **Payout Multipliers**
   - Number 0-9: 9x ✓
   - Violet on 0 or 5: 4.5x ✓
   - Red/Green: 2x ✓
   - Big/Small: 2x ✓

---

## Dependencies

```json
{
  "dependencies": {
    "zod": "^3.22.4",
    "mysql2": "^3.9.0",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0"
  }
}
```

---

## Deliverables

1. **Complete TypeScript Implementation** - All files listed above
2. **Type Safety** - No `any` types except where absolutely necessary
3. **Validation** - All inputs validated with Zod
4. **Security** - Prepared statements for SQL
5. **Documentation** - JSDoc comments on all public functions
6. **Tests** - Unit tests for:
   - Payout multiplier calculations
   - Smart result algorithm
   - Commission distribution
   - Bet validation

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
- ✅ Commission distribution works correctly
- ✅ Smart result algorithm minimizes platform risk
- ✅ Payout calculation is accurate (9x, 4.5x, 2x)
- ✅ All bet types evaluated correctly
- ✅ Cron jobs use new handlers

---

**Start Date**: Today
**Priority**: P0 - CRITICAL BLOCKER
**Estimated Effort**: 2-3 days for complete migration
**Impact**: Entire platform functionality
