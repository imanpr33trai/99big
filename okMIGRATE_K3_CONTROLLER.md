# K3 Controller Migration Task - JavaScript to TypeScript

## Overview

You are tasked with migrating the legacy JavaScript K3 lottery controller (`src/controllersOld/k3Controller.ts`) to a modern, type-safe TypeScript implementation. This is a **GREENFIELD MIGRATION** - do not reference any existing migrated code. Build everything from scratch following the specifications below.

---

## Project Context

### Application Type
- **99BigDaddy** - Online lottery and betting platform
- **K3 Lottery** - Traditional Chinese dice game (3 dice, numbers 1-6)
- **Game Durations**: 1 minute, 3 minutes, 5 minutes, 10 minutes
- **User Levels**: Regular users (level 0), CTV/Agents (level 2), Admins (level 1)

### Tech Stack
- **Runtime**: Node.js with Express
- **Language**: TypeScript (strict mode)
- **Database**: MySQL with modern schema (see `src/config/schema_best.sql`)
- **Validation**: Zod schemas
- **Database Driver**: mysql2/promise with Pool

---

## K3 Game Rules

### Bet Types

1. **Total (gameJoin=1)**: Bet on total sum of 3 dice (3-18)
   - Big (11-18): 2x payout
   - Small (3-10): 2x payout
   - Even: 2x payout
   - Odd: 2x payout
   - Specific number: 9x payout

2. **Two Same (gameJoin=2)**: Bet on two dice showing same number
   - Specific pair: Higher payout
   - Any pair: Lower payout

3. **Three Same (gameJoin=3)**: Bet on all three dice showing same number
   - Specific triple (111, 222, etc.): 180x payout
   - Any triple: Higher payout

4. **Unlike (gameJoin=4)**: Bet on dice NOT showing specific patterns
   - Three different numbers
   - Consecutive numbers
   - Two different numbers

### Dice Values
- Each die shows: 1, 2, 3, 4, 5, or 6
- Result format: "123", "456", "111", etc.

---

## Database Schema Reference

### Key Tables You Will Use

#### `gameSessions` Table (replaces `k3`)
```sql
- id: INT UNSIGNED (PK)
- period: VARCHAR(50)
- gameTypeId: TINYINT UNSIGNED (1=K3)
- result: VARCHAR(50) -- e.g., "123", "456"
- status: TINYINT (0=pending, 1=open, 2=closed, 3=completed)
- startedAt: BIGINT
- closedAt: BIGINT
- resultAt: BIGINT
- createdAt: BIGINT
```

#### `bets` Table (replaces `result_k3`)
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
- betType: VARCHAR(50) -- 'total', 'two-same', 'three-same', 'unlike'
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

Config keys for K3:
- `k3d_control` - 1 minute K3
- `k3d3_control` - 3 minute K3
- `k3d5_control` - 5 minute K3
- `k3d10_control` - 10 minute K3

---

## Files to Create

### 1. Types File: `src/types/k3.types.ts`

Create comprehensive Zod schemas and TypeScript types:

```typescript
// REQUIRED SCHEMAS TO CREATE:

// Bet Validation
export const K3BetSchema = z.object({
  listJoin: z.string().min(1),
  game: z.enum(['1', '3', '5', '10']),
  gameJoin: z.enum(['1', '2', '3', '4']),
  xvalue: z.number().int().positive(),
  money: z.number().int().positive(),
});

// Game History
export const K3HistorySchema = z.object({
  gameJoin: z.enum(['1', '3', '5', '10']),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

// User Bets
export const K3MyBetsSchema = z.object({
  gameJoin: z.enum(['1', '3', '5', '10']),
  pageno: z.number().int().min(0),
  pageto: z.number().int().min(1),
});

// Admin: Edit Result
export const K3EditResultSchema = z.object({
  game: z.number().int().min(1).max(10),
  list: z.string(),
});

// REQUIRED TYPES TO CREATE:
export interface K3ApiResponse<T = unknown> {
  message: string;
  status: boolean;
  data?: T;
  timeStamp?: number;
  [key: string]: unknown;
}

export interface K3GameSession {
  id: number;
  period: string;
  gameTypeId: number;
  result: string | null;
  status: number;
  startedAt: number;
  closedAt: number | null;
  resultAt: number | null;
}

export interface K3BetRecord {
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

export interface K3BetCalculation {
  total: number;
  fee: number;
  price: number;
  typeGame: string;
}

export interface K3Result {
  message: string;
  status: boolean;
  money?: number;
  change?: number;
}

export interface K3HistoryResponse {
  gameslist: K3GameSession[];
  period?: string;
  page?: number;
  bet?: K3BetRecord[];
  settings?: any[];
  join?: string;
}

export interface K3MyBetsResponse {
  gameslist: Partial<K3BetRecord>[];
  page: number;
}

// Bet type constants
export type K3GameDuration = '1' | '3' | '5' | '10';
export type K3GameType = 'total' | 'two-same' | 'three-same' | 'unlike';
export type K3BetSelection = 'b' | 's' | 'c' | 'l' | string;
```

### 2. Middleware: `src/middleware/k3Auth.middleware.ts`

```typescript
// Create:
- k3AuthMiddleware(db: Pool) - validates user token for betting
- Optional: rate limiting for bet endpoints
```

### 3. Database Queries: `src/db/k3.queries.ts`

```typescript
// REQUIRED QUERY FUNCTIONS TO CREATE:

// Game Session Queries
export const getCurrentK3Session = async (db: Pool, game: number) => {...}
export const getLatestK3Result = async (db: Pool, game: number) => {...}
export const createK3Session = async (db: Pool, period: number, game: number) => {...}
export const updateK3Result = async (db: Pool, period: string, result: string, game: number) => {...}
export const getK3History = async (db: Pool, game: number, page: number, limit: number) => {...}

// Bet Queries
export const createK3Bet = async (db: Pool, betData: object) => {...}
export const getUserK3Bets = async (db: Pool, userId: number, game: number, page: number, limit: number) => {...}
export const getPendingK3Bets = async (db: Pool, game: number, betType?: string) => {...}
export const updateK3BetStatus = async (db: Pool, betId: number, status: number, winAmount?: number) => {...}
export const updateK3BetsByPeriod = async (db: Pool, period: string, game: number, result: string) => {...}

// User Queries
export const findUserByToken = async (db: Pool, token: string) => {...}
export const updateUserBalance = async (db: Pool, userId: number, amount: number) => {...}
export const getUserCommissionLevel = async (db: Pool, userId: number) => {...}

// Commission Queries
export const getCommissionRates = async (db: Pool) => {...}
export const createCommissionRecord = async (db: Pool, data: object) => {...}
export const distributeK3Commission = async (db: Pool, userId: number, betAmount: number) => {...}

// Settings Queries
export const getK3ControlSettings = async (db: Pool, game: number) => {...}
export const updateK3ControlSettings = async (db: Pool, game: number, value: string) => {...}

// Helper Functions
export const formatTimeIST = (timestamp?: number) => {...}
export const getTodayString = () => {...}
export const calculateK3Total = (result: string) => {...}
export const parseK3Result = (result: string) => number[] => {...}
```

### 4. Services

#### 4.1 `src/services/k3/k3Bet.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- validateBetSelection(join: string, listJoin: string, game: number): boolean
- calculateBetAmount(gameJoin: number, listJoin: string, money: number, xvalue: number): K3BetCalculation
- calculateWinAmount(betType: string, selection: string, result: string, betAmount: number): number
- processK3Bet(db: Pool, userId: number, betData: object): Promise<K3BetRecord>
```

#### 4.2 `src/services/k3/k3Result.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- generateK3Result(): string -- Random 3 dice (1-6)
- processK3Results(db: Pool, game: number): Promise<void> -- Mark losing bets
- evaluateTotalBet(bet: object, result: string): boolean
- evaluateTwoSameBet(bet: object, result: string): boolean
- evaluateThreeSameBet(bet: object, result: string): boolean
- evaluateUnlikeBet(bet: object, result: string): boolean
```

#### 4.3 `src/services/k3/k3Payout.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- processK3Payouts(db: Pool, game: number): Promise<void>
- calculatePayout(bet: K3BetRecord, result: string): number
- payWinningBets(db: Pool, bets: K3BetRecord[]): Promise<void>
```

#### 4.4 `src/services/k3/k3Game.service.ts`

```typescript
// REQUIRED FUNCTIONS:
- handleK3Game(db: Pool, typeId: number): Promise<void>
- addK3Period(db: Pool, game: number): Promise<void>
- getPredefinedResult(db: Pool, game: number): string | null
```

### 5. Controllers

#### 5.1 `src/controllers/k3/betK3.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const betK3Handler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
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

#### 5.2 `src/controllers/k3/listOrderOld.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const listOrderOldHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate game type and pagination
  // 2. Get game history from database
  // 3. Get current period
  // 4. Get control settings
  // 5. Return formatted response
}
```

#### 5.3 `src/controllers/k3/getMyEmerdList.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const getMyEmerdListHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // 1. Validate input
  // 2. Get authenticated user
  // 3. Get user's bet history
  // 4. Calculate total winnings
  // 5. Return paginated response
}
```

#### 5.4 `src/controllers/k3/addK3.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const addK3Handler = (db: Pool) => async (game: number): Promise<void> => {
  // 1. Generate random result (3 dice)
  // 2. Get current period
  // 3. Get predefined result from settings
  // 4. Update current session with result
  // 5. Create new session
  // 6. Update admin settings
}
```

#### 5.5 `src/controllers/k3/validate.controller.ts` (Optional)

```typescript
// REQUIRED FUNCTION:
export const validateK3BetHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // Validate bet without placing it
  // Return potential win amount
}
```

#### 5.6 `src/controllers/k3/commission.controller.ts`

```typescript
// REQUIRED FUNCTION:
export const commissionDistributionHandler = (db: Pool) => async (req: Request, res: Response): Promise<void> => {
  // Manual commission distribution (if needed)
}
```

### 6. Routes: `src/routes/k3.routes.ts`

```typescript
import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { betK3Handler } from '../controllers/k3/betK3.controller';
import { listOrderOldHandler } from '../controllers/k3/listOrderOld.controller';
import { getMyEmerdListHandler } from '../controllers/k3/getMyEmerdList.controller';
import { addK3Handler } from '../controllers/k3/addK3.controller';
import { k3AuthMiddleware } from '../middleware/k3Auth.middleware';

export const createK3Routes = (db: Pool): Router => {
  const router = Router();

  // Public routes (admin only)
  router.post('/admin/add-period', async (req, res) => {
    const { game } = req.body;
    await addK3Handler(db)(parseInt(game));
    res.json({ success: true });
  });

  // Protected routes (require user auth)
  router.post('/bet', k3AuthMiddleware(db), betK3Handler(db));
  router.post('/history', k3AuthMiddleware(db), listOrderOldHandler(db));
  router.post('/my-bets', k3AuthMiddleware(db), getMyEmerdListHandler(db));

  return router;
};
```

### 7. Utils: `src/utils/k3.helpers.ts`

```typescript
// REQUIRED HELPER FUNCTIONS:

// Generate random dice result
export const generateK3Result = (): string => {
  const dice = [1, 2, 3, 4, 5, 6];
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(dice[Math.floor(Math.random() * dice.length)]);
  }
  return result.join('');
};

// Calculate total of dice
export const calculateTotal = (result: string): number => {
  return result.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
};

// Parse result to array
export const parseResult = (result: string): number[] => {
  return result.split('').map(d => parseInt(d));
};

// Check if big (11-18)
export const isBig = (total: number): boolean => total >= 11 && total <= 18;

// Check if small (3-10)
export const isSmall = (total: number): boolean => total >= 3 && total <= 10;

// Check if even
export const isEven = (total: number): boolean => total % 2 === 0;

// Check if odd
export const isOdd = (total: number): boolean => total % 2 !== 0;

// Check for pairs
export const hasPair = (result: string): [boolean, number?] => {
  const dice = parseResult(result);
  if (dice[0] === dice[1]) return [true, dice[0]];
  if (dice[1] === dice[2]) return [true, dice[1]];
  if (dice[0] === dice[2]) return [true, dice[0]];
  return [false];
};

// Check for triple
export const isTriple = (result: string): [boolean, number?] => {
  const dice = parseResult(result);
  if (dice[0] === dice[1] && dice[1] === dice[2]) {
    return [true, dice[0]];
  }
  return [false];
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
```

---

## Critical Requirements

### 1. Bet Validation - STRICT RULES

```typescript
// Valid bet types for each gameJoin:
gameJoin=1 (Total): 'b', 's', 'c', 'l', or numbers '3'-'18'
gameJoin=2 (Two Same): Specific pairs or any pair
gameJoin=3 (Three Same): Specific triples or any triple
gameJoin=4 (Unlike): Different number combinations

// Validation rules:
- listJoin max length: 10 characters
- money must be: 1000, 10000, 100000, or 1000000
- game must be: '1', '3', '5', or '10'
- xvalue must be positive integer
```

### 2. Bet Amount Calculation

```typescript
// Complex calculation based on gameJoin:
if (gameJoin === 1) {
  total = money * xvalue * listJoin.split(',').length;
} else if (gameJoin === 2) {
  // Two Same: complex parsing with @ and & separators
  total = money * xvalue * (lengthArr * count) + twoSame * money * xvalue;
} else if (gameJoin === 3) {
  // Three Same
  total = money * xvalue * countBaDuyNhat + threeSame * money * xvalue;
} else if (gameJoin === 4) {
  // Unlike: multiple conditions
  total = threeUn + twoUn + UnlienTiep;
}

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
// 1. Get result from k3Games table
// 2. Update all pending bets with result
// 3. Mark losing bets as status=2
// 4. Keep winning bets as status=0 for payout

// Evaluate each bet type:
- Total: Check if total matches or category (big/small/odd/even)
- Two Same: Check if pair exists in result
- Three Same: Check if triple matches
- Unlike: Check various conditions
```

### 5. Payout Processing

```typescript
// For each winning bet:
// 1. Calculate win amount based on odds
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
- [ ] Create `src/types/k3.types.ts` with all Zod schemas
- [ ] Create `src/utils/k3.helpers.ts` with helper functions
- [ ] Create `src/middleware/k3Auth.middleware.ts`
- [ ] Create `src/db/k3.queries.ts` with all query functions

### Phase 2: Services
- [ ] Create `src/services/k3/k3Bet.service.ts`
- [ ] Create `src/services/k3/k3Result.service.ts`
- [ ] Create `src/services/k3/k3Payout.service.ts`
- [ ] Create `src/services/k3/k3Game.service.ts`

### Phase 3: Controllers
- [ ] Create `src/controllers/k3/betK3.controller.ts`
- [ ] Create `src/controllers/k3/listOrderOld.controller.ts`
- [ ] Create `src/controllers/k3/getMyEmerdList.controller.ts`
- [ ] Create `src/controllers/k3/addK3.controller.ts`
- [ ] Create `src/controllers/k3/validate.controller.ts` (optional)
- [ ] Create `src/controllers/k3/commission.controller.ts`

### Phase 4: Routes
- [ ] Create `src/routes/k3.routes.ts`
- [ ] Export routes from `src/routes/web.ts`

### Phase 5: Testing
- [ ] Test placing bets for all gameJoin types
- [ ] Test bet validation
- [ ] Test balance deduction
- [ ] Test commission distribution
- [ ] Test game history retrieval
- [ ] Test user bet history
- [ ] Test result processing
- [ ] Test payout calculation

### Phase 6: Cleanup
- [ ] Remove old `src/controllersOld/k3Controller.ts`
- [ ] Update all imports
- [ ] Verify no SQL injection vulnerabilities

---

## Function-by-Function Migration Map

| Old Function | New Controller/Service | Notes |
|--------------|------------------------|-------|
| `K3Page` | Remove (EJS view) | Not needed for API |
| `isNumber` | `src/utils/k3.helpers.ts` | Utility function |
| `formateT` | `src/utils/k3.helpers.ts` | Format helper |
| `timerJoin` | `src/utils/k3.helpers.ts` | Time formatter |
| `rosesPlus` | `src/services/k3/k3Commission.service.ts` | Commission distribution |
| `validateBet` | `src/services/k3/k3Bet.service.ts` | Bet validation |
| `betK3` | `src/controllers/k3/betK3.controller.ts` | Main betting endpoint |
| `makeid` | `src/utils/k3.helpers.ts` | Random ID generator |
| `addK3` | `src/services/k3/k3Game.service.ts` | Create game period |
| `funHanding` | `src/services/k3/k3Result.service.ts` | Process results |
| `handlingK3` | `src/services/k3/k3Payout.service.ts` | Process payouts |
| `listOrderOld` | `src/controllers/k3/listOrderOld.controller.ts` | Game history |
| `GetMyEmerdList` | `src/controllers/k3/getMyEmerdList.controller.ts` | User bet history |

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

### 3. Result Processing

```
For each game (1, 3, 5, 10 minute):
1. Get latest result from k3Games
2. Update all pending bets with result
3. For each bet type:
   - Total: Check sum of dice
   - Two Same: Check for pairs
   - Three Same: Check for triples
   - Unlike: Check various conditions
4. Mark losing bets as status=2
5. Keep winning bets as status=0
```

### 4. Payout Processing

```
For each winning bet (status=0):
1. Calculate win amount based on:
   - Bet type
   - Selection
   - Result
   - Original bet amount
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
- k3d_control: "123|456|789|-1"
- k3d3_control: "111|222|-1"
- etc.

Format: "result1|result2|result3|-1"
- Each result is used for one period
- "-1" means random result
- After using all, cycles back to "-1"
```

---

## Bet Type Evaluation Rules

### Total (gameJoin=1)

```typescript
// Big: 11-18
if (total >= 11 && total <= 18 && selection === 'b') → WIN

// Small: 3-10
if (total >= 3 && total <= 10 && selection === 's') → WIN

// Even
if (total % 2 === 0 && selection === 'c') → WIN

// Odd
if (total % 2 !== 0 && selection === 'l') → WIN

// Specific number
if (selection === String(total)) → WIN (9x payout)
```

### Two Same (gameJoin=2)

```typescript
// Check if any two dice match
const dice = [1, 2, 3]; // example
if (dice[0] === dice[1] || dice[1] === dice[2] || dice[0] === dice[2]) → Pair exists

// Specific pair selection
if (selection === '11' && result === '112') → WIN
```

### Three Same (gameJoin=3)

```typescript
// All three dice same
if (dice[0] === dice[1] && dice[1] === dice[2]) → Triple exists

// Specific triple
if (selection === '111' && result === '111') → WIN (180x payout)
```

### Unlike (gameJoin=4)

```typescript
// Three different numbers
if (dice[0] !== dice[1] && dice[1] !== dice[2] && dice[0] !== dice[2]) → All different

// Consecutive numbers
if (Math.abs(dice[0] - dice[1]) === 1 && Math.abs(dice[1] - dice[2]) === 1) → Consecutive

// Two different numbers
const unique = new Set(dice).size;
if (unique === 2) → Two different
```

---

## Testing Requirements

After migration, verify:

1. **Bet Placement**
   - All gameJoin types work correctly
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
   - Total winnings calculated correctly
   - Pagination works

5. **Result Processing**
   - Results generated correctly
   - Losing bets marked as status=2
   - Winning bets kept as status=0

6. **Payout Processing**
   - Win amounts calculated correctly
   - User balances updated
   - Bet status updated to 1

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
- ✅ Result processing marks bets correctly
- ✅ Payout calculation is accurate

---

**Start Date**: Today
**Priority**: P1 - High Priority
**Estimated Effort**: 1-2 days for complete migration
