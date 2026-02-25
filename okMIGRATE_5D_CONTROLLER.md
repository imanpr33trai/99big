# 5D Lottery Controller Migration Task - JavaScript to TypeScript

## Overview

You are tasked with migrating the legacy JavaScript 5D lottery controller (`src/controllersOld/k5Controller.ts`) to a modern, type-safe TypeScript implementation. This is a **GREENFIELD MIGRATION** - do not reference any existing migrated code. Build everything from scratch following the specifications below.

---

## Project Context

### Application Type
- **99BigDaddy** - Online lottery and betting platform
- **5D Lottery** - 5-digit number lottery (each digit 0-9)
- **Game Durations**: 1 minute, 3 minutes, 5 minutes, 10 minutes
- **User Levels**: Regular users (level 0), CTV/Agents (level 2), Admins (level 1)

### Tech Stack
- **Runtime**: Node.js with Express
- **Language**: TypeScript (strict mode)
- **Database**: MySQL with modern schema (see `src/config/schema_best.sql`)
- **Validation**: Zod schemas
- **Database Driver**: mysql2/promise with Pool

---

## 5D Game Rules

### Result Format
- **5 digits**: Each digit is 0-9
- **Example**: "12345", "98765", "00000"
- **Positions**: a (1st), b (2nd), c (3rd), d (4th), e (5th)

### Bet Types

1. **Position Bets (join_bet = 'a', 'b', 'c', 'd', 'e')**:
   - Bet on specific digit at specific position
   - Example: join_bet='a', bet='5' means first digit is 5
   - **Payout**: 9x for specific number

2. **Category Bets (for each position)**:
   - **Small ('b')**: Digit 0-4 → 2x payout
   - **Big ('s')**: Digit 5-9 → 2x payout
   - **Even ('l')**: Digit is even → 2x payout
   - **Odd ('c')**: Digit is odd → 2x payout

3. **Total Bet (join_bet = 'total')**:
   - Bet on sum of all 5 digits (0-45)
   - **Small ('b')**: Total 0-22 → 2x payout
   - **Big ('s')**: Total 23-45 → 2x payout
   - **Even ('l')**: Total is even → 2x payout
   - **Odd ('c')**: Total is odd → 2x payout

### Payout Rules
- **Specific number** (0-9): 9x payout
- **Big/Small/Odd/Even**: 2x payout
- **Fee**: 2% of bet amount

---

## Database Schema Reference

### Key Tables You Will Use

#### `gameSessions` Table (replaces `5d`)
```sql
- id: INT UNSIGNED (PK)
- period: VARCHAR(50)
- gameTypeId: TINYINT UNSIGNED (2=5D)
- result: VARCHAR(50) -- e.g., "12345"
- status: TINYINT (0=pending, 1=open, 2=closed, 3=completed)
- startedAt: BIGINT
- closedAt: BIGINT
- resultAt: BIGINT
- createdAt: BIGINT
```

#### `bets` Table (replaces `result_5d`)
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
- selection: VARCHAR(50) -- user's bet selection
- betType: VARCHAR(50) -- 'a', 'b', 'c', 'd', 'e', 'total'
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
```

#### `commissionLevels` Table (replaces `level`)
```sql
- id: TINYINT UNSIGNED (PK)
- level: TINYINT UNSIGNED
- rateF1: DECIMAL(5,4) -- Direct referral rate
- rateF2: DECIMAL(5,4)
- rateF3: DECIMAL(5,4)
- rateF4: DECIMAL(5,4)
- minTurnover: DECIMAL(15,2)
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

#### `adminConfigs` Table (replaces `admin`)
```sql
- id: INT UNSIGNED (PK)
- configKey: VARCHAR(50) UNIQUE
- configValue: TEXT
- description: VARCHAR(255)
- updatedAt: BIGINT
```

Config keys for 5D:
- `5d1_control` - 1 minute 5D
- `5d3_control` - 3 minute 5D
- `5d5_control` - 5 minute 5D
- `5d10_control` - 10 minute 5D

---

## Files to Create

### 1. Types File: `src/types/5d.types.ts`

Create comprehensive Zod schemas and TypeScript types:

```typescript
// REQUIRED SCHEMAS TO CREATE:

// Bet Validation
export const K5DBetSchema = z.object({
  join: z.enum(['a', 'b', 'c', 'd', 'e', 'total']),
  list_join: z.string().min(1).max(10),
  x: z.string().regex(/^\d+$/),
  money: z.number().int().positive(),
  game: z.enum(['1', '3', '5', '10']),
});

// Game History
export const K5DHistorySchema = z.object({
  gameJoin: z.enum(['1', '3', '5', '10']),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

// User Bets
export const K5DMyBetsSchema = z.object({
  gameJoin: z.enum(['1', '3', '5', '10']),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

// Admin: Edit Result
export const K5DEditResultSchema = z.object({
  game: z.number().int().min(1).max(10),
  list: z.string(),
});

// REQUIRED TYPES TO CREATE:
export interface K5DApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  [key: string]: unknown;
}

export interface K5DGameSession {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  status: number;
  startedAt: number;
  closedAt: number | null;
  resultAt: number | null;
}

export interface K5DBetRecord {
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

export interface K5DBetCalculation {
  total: number;
  fee: number;
  price: number;
}

export interface K5DResult {
  message: string;
  status: boolean;
  money?: number;
  change?: number;
}

export interface K5DHistoryResponse {
  gameslist: K5DGameSession[];
  period?: string;
  page?: number;
}

export interface K5DMyBetsResponse {
  gameslist: Partial<K5DBetRecord>[];
  page: number;
}

// Bet type constants
export type K5DGameDuration = '1' | '3' | '5' | '10';
export type K5DPosition = 'a' | 'b' | 'c' | 'd' | 'e' | 'total';
export type K5DCategory = 'b' | 's' | 'c' | 'l'; // small, big, odd, even
```

### 2. Middleware: `src/middleware/5dAuth.middleware.ts`

```typescript
// Create:
- k5dAuthMiddleware(db: Pool) - validates user token for betting
- Optional: rate limiting for bet endpoints
```

### 3. Database Queries: `src/db/5d.queries.ts`

```typescript
// REQUIRED QUERY FUNCTIONS TO CREATE:

// Game Session Queries
export const getCurrent5DSession = async (db: Pool, game: number) => {...}
export const getLatest5DResult = async (db: Pool, game: number) => {...}
export const create5DSession = async (db: Pool, period: number, game: number) => {...}
export const update5DResult = async (db: Pool, period: string, result: string, game: number) => {...}
export const get5DHistory = async (db: Pool, game: number, page: number, limit: number) => {...}
export const initialize5DGame = async (db: Pool, game: number) => {...}

// Bet Queries
export const create5DBet = async (db: Pool, betData: object) => {...}
export const getUser5DBets = async (db: Pool, userId: number, game: number, page: number, limit: number) => {...}
export const getPending5DBets = async (db: Pool, game: number, position?: string) => {...}
export const update5DBetStatus = async (db: Pool, betId: number, status: number, winAmount?: number) => {...}
export const update5DBetsByPeriod = async (db: Pool, period: string, game: number, result: string) => {...}

// User Queries
export const findUserByToken = async (db: Pool, token: string) => {...}
export const updateUserBalance = async (db: Pool, userId: number, amount: number) => {...}
export const getUserCommissionLevel = async (db: Pool, userId: number) => {...}

// Commission Queries
export const getCommissionRates = async (db: Pool) => {...}
export const createCommissionRecord = async (db: Pool, data: object) => {...}
export const distribute5DCommission = async (db: Pool, userId: number, betAmount: number) => {...}

// Settings Queries
export const get5DControlSettings = async (db: Pool, game: number) => {...}
export const update5DControlSettings = async (db: Pool, game: number, value: string) => {...}

// Helper Functions
export const formatTimeIST = (timestamp?: number) => {...}
export const getTodayString = () => {...}
export const calculate5DTotal = (result: string) => {...}
export const parse5DResult = (result: string) => string[] => {...}
```

### 4. Services

#### 4.1 `src/services/5d/5dBet.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- validateBetSelection(join: string, list_join: string, game: number): boolean
- calculateBetAmount(join: string, list_join: string, money: number, x: number): K5DBetCalculation
- calculateWinAmount(betType: string, selection: string, result: string, betAmount: number): number
- process5DBet(db: Pool, userId: number, betData: object): Promise<K5DBetRecord>
```

#### 4.2 `src/services/5d/5dResult.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- generate5DResult(): string -- Random 5 digits (0-9)
- process5DResults(db: Pool, game: number): Promise<void> -- Mark losing bets
- evaluatePositionBet(bet: object, result: string[], position: string): boolean
- evaluateCategoryBet(bet: object, digit: string): boolean
- evaluateTotalBet(bet: object, total: number): boolean
```

#### 4.3 `src/services/5d/5dPayout.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- process5DPayouts(db: Pool, game: number): Promise<void>
- calculatePayout(bet: K5DBetRecord, result: string): number
- payWinningBets(db: Pool, bets: K5DBetRecord[]): Promise<void>
```

#### 4.4 `src/services/5d/5dGame.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- handle5DGame(db: Pool, typeId: number): Promise<void>
- add5DPeriod(db: Pool, game: number): Promise<void>
- getPredefinedResult(db: Pool, game: number): string | null
```

### 5. Controllers

#### 5.1 `src/controllers/5d/bet5d.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const bet5dHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input with Zod
  // 2. Get current game session
  // 3. Get user and check balance
  // 4. Validate bet selection
  // 5. Calculate total bet amount and fee
  // 6. Check sufficient balance
  // 7. Create bet record
  // 8. Deduct balance
  // 9. Calculate and distribute commission
  // 10. Return success response
}
```

#### 5.2 `src/controllers/5d/listOrderOld.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const listOrderOld5dHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate game type and pagination
  // 2. Get game history from database
  // 3. Get current period
  // 4. Return formatted response
}
```

#### 5.3 `src/controllers/5d/getMyEmerdList.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const getMyEmerdList5dHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Get user's bet history
  // 4. Return paginated response
}
```

#### 5.4 `src/controllers/5d/add5d.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const add5dHandler = (db: Pool) => async (game: number): Promise<void> => {
  // 1. Generate random result (5 digits)
  // 2. Get current period
  // 3. Get predefined result from settings
  // 4. Update current session with result
  // 5. Create new session
  // 6. Update admin settings
}
```

#### 5.5 `src/controllers/5d/5d.controller.ts` (Admin Controller)

```typescript
// REQUIRED FUNCTIONS:
export const create5DController = (db: Pool) => ({
  // List historical results
  listOrderOld: async (req: Request, res: Response): Promise<void> => {
    // Get game history for admin
  },
  
  // Edit result settings
  editResult: async (req: Request, res: Response): Promise<void> => {
    // Update predefined results in adminConfigs
  },
});
```

### 6. Routes: `src/routes/5d.routes.ts`

```typescript
import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { create5DController } from '../controllers/admin/5d.controller';
import { bet5dHandler } from '../controllers/5d/bet5d.controller';
import { listOrderOld5dHandler } from '../controllers/5d/listOrderOld.controller';
import { getMyEmerdList5dHandler } from '../controllers/5d/getMyEmerdList.controller';
import { add5dHandler } from '../controllers/5d/add5d.controller';
import { k5dAuthMiddleware } from '../middleware/5dAuth.middleware';
import { createAdminAuthMiddleware } from '../middleware/adminAuth.middleware';

export const create5dRoutes = (db: Pool): Router => {
  const router = Router();
  const adminAuth = createAdminAuthMiddleware(db);

  // User routes (require user auth)
  router.post('/bet', k5dAuthMiddleware(db), bet5dHandler(db));
  router.post('/history', k5dAuthMiddleware(db), listOrderOld5dHandler(db));
  router.post('/my-bets', k5dAuthMiddleware(db), getMyEmerdList5dHandler(db));

  // Admin routes (require admin auth)
  router.use(adminAuth);
  router.post('/listOrderOld', create5DController(db).listOrderOld);
  router.post('/editResult', create5DController(db).editResult);

  // Game management (internal)
  router.post('/admin/add-period', async (req, res) => {
    const { game } = req.body;
    await add5dHandler(db)(parseInt(game));
    res.json({ success: true });
  });

  return router;
};
```

### 7. Utils: `src/utils/5d.helpers.ts`

```typescript
// REQUIRED HELPER FUNCTIONS:

// Generate random 5-digit result
export const generate5DResult = (): string => {
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

// Calculate total of 5 digits
export const calculateTotal = (result: string): number => {
  return result.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
};

// Parse result to array of digits
export const parseResult = (result: string): string[] => {
  return result.split('');
};

// Check if digit is small (0-4)
export const isSmall = (digit: string): boolean => {
  const num = parseInt(digit);
  return num >= 0 && num <= 4;
};

// Check if digit is big (5-9)
export const isBig = (digit: string): boolean => {
  const num = parseInt(digit);
  return num >= 5 && num <= 9;
};

// Check if digit is even
export const isEven = (digit: string): boolean => {
  const num = parseInt(digit);
  return num % 2 === 0;
};

// Check if digit is odd
export const isOdd = (digit: string): boolean => {
  const num = parseInt(digit);
  return num % 2 !== 0;
};

// Check if total is small (0-22)
export const isTotalSmall = (total: number): boolean => {
  return total <= 22;
};

// Check if total is big (23-45)
export const isTotalBig = (total: number): boolean => {
  return total > 22;
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
```

---

## Critical Requirements

### 1. Bet Validation - STRICT RULES

```typescript
// Valid bet types:
join = 'a', 'b', 'c', 'd', 'e', or 'total'

// Validation rules:
- list_join max length: 10 characters
- money must be: 1, 10, 100, or 1000
- game must be: '1', '3', '5', or '10'
- x must be positive integer
- list_join must be all digits OR all category chars (b,s,c,l)
```

### 2. Bet Amount Calculation

```typescript
// Simple calculation for 5D:
total = money * x * list_join.split('').length;

// Fee is always 2%
fee = total * 0.02;
price = total - fee;
```

### 3. Commission Distribution

```typescript
// When user places bet >= 10000:
// Calculate commission for F1, F2, F3, F4 levels
const f1 = (total_m / 100) * level0.f1;
const f2 = (total_m / 100) * level0.f2;
const f3 = (total_m / 100) * level0.f3;
const f4 = (total_m / 100) * level0.f4;

// Insert into commissionRecords
// Update user balances
```

### 4. Result Processing

```typescript
// When game session closes:
// 1. Get result from 5dGames table (5 digits)
// 2. Update all pending bets with result
// 3. For each position (a,b,c,d,e):
//    - Check specific number bets
//    - Check category bets (big/small/odd/even)
// 4. For total bets:
//    - Calculate sum of all 5 digits
//    - Check category bets
// 5. Mark losing bets as status=2
// 6. Keep winning bets as status=0 for payout
```

### 5. Payout Processing

```typescript
// For each winning bet:
// 1. Calculate win amount:
//    - Specific number: price * 9
//    - Category (big/small/odd/even): price * 2
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
  msg: "Get success",
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

### Phase 1: Foundation
- [ ] Create `src/types/5d.types.ts` with all Zod schemas
- [ ] Create `src/utils/5d.helpers.ts` with helper functions
- [ ] Create `src/middleware/5dAuth.middleware.ts`
- [ ] Create `src/db/5d.queries.ts` with all query functions

### Phase 2: Services
- [ ] Create `src/services/5d/5dBet.service.ts`
- [ ] Create `src/services/5d/5dResult.service.ts`
- [ ] Create `src/services/5d/5dPayout.service.ts`
- [ ] Create `src/services/5d/5dGame.service.ts`

### Phase 3: Controllers
- [ ] Create `src/controllers/5d/bet5d.controller.ts`
- [ ] Create `src/controllers/5d/listOrderOld.controller.ts`
- [ ] Create `src/controllers/5d/getMyEmerdList.controller.ts`
- [ ] Create `src/controllers/5d/add5d.controller.ts`
- [ ] Create `src/controllers/admin/5d.controller.ts` (admin functions)

### Phase 4: Routes
- [ ] Create `src/routes/5d.routes.ts`
- [ ] Export routes from `src/routes/web.ts`

### Phase 5: Testing
- [ ] Test placing bets for all positions (a,b,c,d,e,total)
- [ ] Test bet validation
- [ ] Test balance deduction
- [ ] Test commission distribution
- [ ] Test game history retrieval
- [ ] Test user bet history
- [ ] Test result processing
- [ ] Test payout calculation
- [ ] Test admin result editing

### Phase 6: Cleanup
- [ ] Remove old `src/controllersOld/k5Controller.ts`
- [ ] Update all imports
- [ ] Verify no SQL injection vulnerabilities

---

## Function-by-Function Migration Map

| Old Function | New Controller/Service | Notes |
|--------------|------------------------|-------|
| `K5DPage*` | Remove (EJS views) | Not needed for API |
| `isNumber` | `src/utils/5d.helpers.ts` | Utility function |
| `formateT` | `src/utils/5d.helpers.ts` | Format helper |
| `timerJoin` | `src/utils/5d.helpers.ts` | Time formatter |
| `rosesPlus` | `src/services/5d/5dCommission.service.ts` | Commission distribution |
| `validateBet` | `src/services/5d/5dBet.service.ts` | Bet validation |
| `betK5D` | `src/controllers/5d/bet5d.controller.ts` | Main betting endpoint |
| `makeid` | `src/utils/5d.helpers.ts` | Random ID generator |
| `add5D` | `src/services/5d/5dGame.service.ts` | Create game period |
| `funHanding` | `src/services/5d/5dResult.service.ts` | Process results (5 positions) |
| `handling5D` | `src/services/5d/5dPayout.service.ts` | Process payouts |
| `listOrderOld` | `src/controllers/5d/listOrderOld.controller.ts` | Game history |
| `GetMyEmerdList` | `src/controllers/5d/getMyEmerdList.controller.ts` | User bet history |

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
11. Calculate commission (if bet >= 10000)
    ↓
12. Distribute commission to referrers
    ↓
13. Return success response
```

### 2. Commission Distribution

```
When user places bet >= 10000:
- F1 (direct referral): (total / 100) * rateF1
- F2: (total / 100) * rateF2
- F3: (total / 100) * rateF3
- F4: (total / 100) * rateF4

Insert into commissionRecords:
- userId: referrer's ID
- fromUserId: bettor's ID
- level: 1, 2, 3, or 4
- amount: calculated commission
- sourceType: 'bet'
- sourceId: bet ID
```

### 3. Result Processing (5 Positions)

```
For each game (1, 3, 5, 10 minute):
1. Get latest result from 5dGames (5 digits)
2. Parse result: ['1', '2', '3', '4', '5']
3. Calculate total: 1+2+3+4+5 = 15
4. Update all pending bets with result
5. For each position (a,b,c,d,e):
   - Check specific number bets
   - Check category bets (big/small/odd/even)
6. For total bets:
   - Check total category (big/small/odd/even)
7. Mark losing bets as status=2
8. Keep winning bets as status=0
```

### 4. Payout Processing

```
For each winning bet (status=0):
1. Calculate win amount:
   - If specific number (0-9): win = price * 9
   - If category (b/s/c/l): win = price * 2
2. Update bet:
   - status = 1 (won)
   - actualWin = calculated amount
3. Update user balance:
   - balance += actualWin
4. Create transaction log
```

### 5. Game Control Settings

```
Admin can predefine results in adminConfigs:
- 5d1_control: "12345|67890|54321|-1"
- 5d3_control: "11111|22222|-1"
- etc.

Format: "result1|result2|result3|-1"
- Each result is used for one period
- "-1" means random result
- After using all, cycles back to "-1"
```

---

## Bet Type Evaluation Rules

### Position Bets (a, b, c, d, e)

```typescript
// Position 'a' (first digit)
const digit = result[0]; // e.g., '1' from "12345"

// Specific number
if (bet === digit) → WIN (9x payout)

// Small (0-4)
if (bet === 'b' && parseInt(digit) <= 4) → WIN (2x)

// Big (5-9)
if (bet === 's' && parseInt(digit) >= 5) → WIN (2x)

// Even
if (bet === 'l' && parseInt(digit) % 2 === 0) → WIN (2x)

// Odd
if (bet === 'c' && parseInt(digit) % 2 !== 0) → WIN (2x)
```

### Total Bet

```typescript
// Calculate total of all 5 digits
const total = result.split('').reduce((sum, d) => sum + parseInt(d), 0);
// e.g., "12345" → 1+2+3+4+5 = 15

// Small (0-22)
if (bet === 'b' && total <= 22) → WIN (2x)

// Big (23-45)
if (bet === 's' && total > 22) → WIN (2x)

// Even
if (bet === 'l' && total % 2 === 0) → WIN (2x)

// Odd
if (bet === 'c' && total % 2 !== 0) → WIN (2x)
```

---

## Testing Requirements

After migration, verify:

1. **Bet Placement**
   - All position types (a,b,c,d,e) work correctly
   - Total bets work correctly
   - Bet validation rejects invalid inputs
   - Balance is deducted correctly
   - Fee calculation is accurate (2%)

2. **Commission**
   - Commission calculated for bets >= 10000
   - F1, F2, F3, F4 rates applied correctly
   - Commission records created
   - Referrer balances updated

3. **Game History**
   - Returns correct paginated results
   - Current period included
   - Settings included

4. **User Bet History**
   - Returns user's bets only
   - Pagination works

5. **Result Processing**
   - Results generated correctly (5 digits)
   - All 5 positions evaluated
   - Total calculated correctly
   - Losing bets marked as status=2
   - Winning bets kept as status=0

6. **Payout Processing**
   - Win amounts calculated correctly (9x or 2x)
   - User balances updated
   - Bet status updated to 1

7. **Admin Functions**
   - Result editing works
   - Settings persist correctly

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
6. **Tests** - Basic unit tests for critical functions

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
- ✅ Result processing marks all 5 positions correctly
- ✅ Payout calculation is accurate (9x for specific, 2x for category)

---

**Start Date**: Today
**Priority**: P1 - High Priority
**Estimated Effort**: 1-2 days for complete migration
