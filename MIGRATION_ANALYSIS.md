# Migration Analysis: Express → Hono + Prisma + TypeScript

## 📊 Current Project Overview

| Metric                     | Value                            |
| -------------------------- | -------------------------------- |
| **Total Controller Lines** | ~18,600 lines                    |
| **Controllers**            | 22 files                         |
| **Routes**                 | 100+ endpoints                   |
| **Database Tables**        | 22 tables                        |
| **Real-time Features**     | Socket.IO (live game results)    |
| **Cron Jobs**              | 4 scheduled tasks (1/3/5/10 min) |

---

## ⚠️ Challenges You Will Face

### 1. **Framework Architecture Differences**

#### Express → Hono

| Aspect               | Express (Current)           | Hono (Target)                  |
| -------------------- | --------------------------- | ------------------------------ |
| **Request/Response** | `req.body`, `res.json()`    | `c.req.json()`, `c.json()`     |
| **Middleware**       | `app.use(fn)`               | `app.use('/path', fn)`         |
| **Route Handlers**   | `app.get('/path', handler)` | `app.get('/path', handler)`    |
| **Error Handling**   | `next(err)`                 | `try/catch` or `onError`       |
| **File Uploads**     | `multer`                    | Built-in or `hono/body-parser` |

**Migration Impact:** 🔴 HIGH

- All route handlers need rewriting
- Middleware signature changes
- Cookie parsing differs

---

### 2. **Database ORM Migration (mysql2 → Prisma)**

#### Current Raw SQL Queries

```javascript
// Current (mysql2)
const [rows] = await connection.query(
  "SELECT * FROM users WHERE token = ? AND veri = 1",
  [auth],
);

await connection.execute("UPDATE users SET money = money + ? WHERE phone = ?", [
  amount,
  phone,
]);
```

#### After Migration (Prisma)

```typescript
// Target (Prisma)
const rows = await prisma.users.findMany({
  where: { token: auth, veri: 1 },
});

await prisma.users.update({
  where: { phone },
  data: { money: { increment: amount } },
});
```

**Migration Impact:** 🔴 CRITICAL

- **1,000+ SQL queries** need conversion
- Complex queries with JOINs need Prisma relations
- Transactions syntax differs
- Raw queries still possible but defeat Prisma's purpose

---

### 3. **TypeScript Conversion**

#### Current JavaScript Issues

```javascript
// No type safety - common in current codebase
const userInfo = async (req, res) => {
  let auth = req.cookies.auth;  // Could be undefined
  const [rows] = await connection.query(...);  // Array destructuring
  const user = rows[0];  // Could be undefined
  // ... accessing user properties without checks
}
```

#### Required TypeScript Types

```typescript
// Need to define all these types
interface User {
  id: number;
  phone: string;
  name_user: string;
  money: number;
  token: string;
  veri: number;
  // ... 20+ more fields
}

interface AuthRequest extends Request {
  cookies: { auth: string };
}

// Every function needs types
const userInfo = async (c: Context): Promise<Response> => {
  const auth = c.req.cookie("auth");
  if (!auth) throw new HTTPException(401);
  // ...
};
```

**Migration Impact:** 🔴 HIGH

- Need types for 22 database tables
- All controllers need type annotations
- API request/response types needed
- Cookie/session types required

---

### 4. **Real-time Features (Socket.IO)**

#### Current Implementation

```javascript
// cronJobContronler.js
const cronJobGame1p = (io) => {
  cron.schedule("*/1 * * * *", async () => {
    await winGoController.addWinGo(1);
    const [winGo1] = await connection.execute("SELECT * FROM wingo...");
    io.emit("data-server", { data: winGo1 }); // Socket.IO emit
  });
};
```

#### Challenge with Hono

- Hono doesn't have built-in WebSocket
- Need separate WebSocket server or use `hono/websocket`
- Socket.IO compatibility issues

**Migration Impact:** 🟡 MEDIUM

- Socket.IO can run alongside Hono
- Consider using Hono's built-in WebSocket
- May need to refactor real-time architecture

---

### 5. **Cron Jobs & Background Tasks**

#### Current Implementation

```javascript
// Multiple cron schedules
cron.schedule("*/1 * * * *", async () => {
  /* 1 min game */
});
cron.schedule("*/3 * * * *", async () => {
  /* 3 min game */
});
cron.schedule("*/5 * * * *", async () => {
  /* 5 min game */
});
cron.schedule("*/10 * * * *", async () => {
  /* 10 min game */
});
cron.schedule("* * 0 * * *", async () => {
  /* Daily reset */
});
```

**Migration Impact:** 🟢 LOW

- `node-cron` works with Hono
- Consider moving to dedicated job queue (Bull)
- Prisma transactions in cron jobs need error handling

---

### 6. **View Engine (EJS → ?)**

#### Current Setup

```javascript
// server.js
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Controller
return res.render("bet/wingo/win.ejs");
```

#### Challenge with Hono

- Hono doesn't support EJS natively
- Need `hono/renderer/ejs` or switch to JSX

**Migration Impact:** 🟡 MEDIUM

- Option 1: Use `hono/renderer/ejs` (limited)
- Option 2: Migrate to React/JSX (major work)
- Option 3: Keep Express for views, Hono for API

---

### 7. **Authentication & Cookies**

#### Current Implementation

```javascript
// Cookie-based auth
const auth = req.cookies.auth;
const [rows] = await connection.query(
  "SELECT token, level, status FROM users WHERE token = ? AND veri = 1",
  [auth],
);
```

#### Migration Considerations

```typescript
// Hono cookie handling
import { getCookie, setCookie } from "hono/cookie";

const auth = getCookie(c, "auth");
setCookie(c, "auth", token, {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24,
});
```

**Migration Impact:** 🟡 MEDIUM

- JWT logic stays the same
- Cookie API differs slightly
- Session management needs review

---

### 8. **File Structure Reorganization**

#### Current Structure

```
src/
├── config/
├── controllers/     (22 files, 18K lines)
├── modal/
├── routes/
├── views/
└── public/
```

#### Recommended Hono + Prisma Structure

```
src/
├── lib/
│   ├── prisma.ts       # Prisma client
│   ├── websocket.ts    # WebSocket setup
│   └── cron.ts         # Cron jobs
├── routes/
│   ├── index.ts        # Route aggregator
│   ├── auth.ts
│   ├── games/
│   │   ├── wingo.ts
│   │   ├── 5d.ts
│   │   └── k3.ts
│   ├── user.ts
│   ├── wallet.ts
│   └── admin.ts
├── services/           # Business logic
│   ├── gameService.ts
│   ├── paymentService.ts
│   └── userService.ts
├── types/              # TypeScript types
│   ├── user.ts
│   ├── game.ts
│   └── api.ts
├── middleware/         # Hono middleware
│   ├── auth.ts
│   └── validation.ts
└── index.ts            # Hono app
```

**Migration Impact:** 🟡 MEDIUM

- Complete reorganization needed
- Separation of concerns improves
- Better for team collaboration

---

## 📋 Detailed Migration Checklist

### Phase 1: Setup & Configuration

- [ ] Initialize TypeScript project
- [ ] Install Hono, Prisma, dependencies
- [ ] Configure `tsconfig.json`
- [ ] Set up Prisma schema from `schema.sql`
- [ ] Generate Prisma client
- [ ] Create database migration

### Phase 2: Database Migration

- [ ] Convert all 22 table definitions to Prisma schema
- [ ] Define relations between tables
- [ ] Create Prisma seed script
- [ ] Test all queries with Prisma Client
- [ ] Handle table names starting with numbers (`5d`)

### Phase 3: Core Infrastructure

- [ ] Create Hono app instance
- [ ] Set up CORS
- [ ] Configure cookie handling
- [ ] Create authentication middleware
- [ ] Set up error handling
- [ ] Create logger middleware

### Phase 4: Route Migration (Largest Task)

- [ ] Migrate auth routes (login, register, forgot)
- [ ] Migrate user routes (profile, settings)
- [ ] Migrate game routes (Wingo, 5D, K3)
- [ ] Migrate wallet routes (deposit, withdrawal)
- [ ] Migrate admin routes
- [ ] Migrate payment routes

### Phase 5: Business Logic

- [ ] Convert controllers to services
- [ ] Add TypeScript types
- [ ] Implement validation (Zod/Valibot)
- [ ] Handle edge cases
- [ ] Add error boundaries

### Phase 6: Real-time Features

- [ ] Set up WebSocket server
- [ ] Migrate Socket.IO events
- [ ] Test live game updates
- [ ] Handle reconnection logic

### Phase 7: Cron Jobs

- [ ] Migrate cron schedules
- [ ] Add transaction handling
- [ ] Implement retry logic
- [ ] Add logging

### Phase 8: Testing

- [ ] Unit tests for services
- [ ] Integration tests for routes
- [ ] E2E tests for game flows
- [ ] Load testing

### Phase 9: Deployment

- [ ] Build TypeScript
- [ ] Configure Prisma for production
- [ ] Set up environment variables
- [ ] Deploy and test

---

## 🎯 Complexity Assessment

| Component            | Complexity    | Estimated Time |
| -------------------- | ------------- | -------------- |
| **Prisma Schema**    | Medium        | 2-3 days       |
| **TypeScript Types** | High          | 3-4 days       |
| **Route Migration**  | Very High     | 10-15 days     |
| **Service Layer**    | High          | 5-7 days       |
| **Socket.IO**        | Medium        | 2-3 days       |
| **Cron Jobs**        | Low           | 1 day          |
| **Testing**          | High          | 5-7 days       |
| **Documentation**    | Medium        | 2-3 days       |
| **Total**            | **Very High** | **30-45 days** |

---

## 💡 Recommendations

### Option A: Full Rewrite (Recommended for Long-term)

1. Start fresh with Hono + Prisma + TypeScript
2. Keep Express app running
3. Migrate route by route
4. Test thoroughly before switching

### Option B: Hybrid Approach (Faster)

1. Keep Express for views (EJS)
2. Use Hono for API routes only
3. Gradually migrate API endpoints
4. Run both servers behind reverse proxy

### Option C: Incremental TypeScript (Safest)

1. Add TypeScript to existing Express app first
2. Migrate to Prisma while keeping Express
3. Then migrate from Express to Hono
4. Smaller, safer steps

---

## 🚨 Critical Issues to Address

### 1. Table Name `5d`

```prisma
// Prisma doesn't support table names starting with numbers
// Must use @@map() workaround
model FiveD {
  id     Int    @id @default(autoincrement())
  period String
  result String @default("0")
  game   Int    @default(0)
  status Int    @default(0)
  time   BigInt @default(0)

  @@map("5d")  // Maps to actual table name
}
```

### 2. Raw SQL Dependencies

Some complex queries may need raw SQL:

```typescript
// Some queries are too complex for Prisma
const result = await prisma.$queryRaw`
  SELECT * FROM minutes_1 
  WHERE game = ${join} 
  AND status = 0 
  AND bet IN (${Prisma.join(bets)})
`;
```

### 3. Concurrent Game Logic

```typescript
// Current code has race conditions
// Need Prisma transactions + row locking
await prisma.$transaction(
  async (tx) => {
    const user = await tx.users.findUnique({
      where: { phone },
      lock: { mode: "optimistic" },
    });
    // ... update money
  },
  {
    timeout: 5000,
  },
);
```

### 4. Money Calculations

```typescript
// Current: Floating point math (dangerous!)
const rosesF = (money / 100) * level[levelIndex - 1].f1;

// Should use: Decimal library or store as integers
import Decimal from "decimal.js";
const rosesF = new Decimal(money).div(100).mul(level.f1);
```

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "hono": "^4.0.0",
    "@prisma/client": "^5.0.0",
    "@hono/node-server": "^1.0.0",
    "ws": "^8.0.0",
    "node-cron": "^3.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prisma": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/node-cron": "^3.0.0",
    "@types/ws": "^8.0.0",
    "tsx": "^4.0.0"
  }
}
```

---

## ✅ Is This Project Easy to Transfer?

### Short Answer: **NO** ❌

### Reasons:

1. **18,600+ lines** of untyped JavaScript
2. **1,000+ raw SQL queries** to convert
3. **Complex game logic** with timing dependencies
4. **Real-time Socket.IO** integration
5. **22 database tables** with complex relations
6. **No tests** currently (need to write from scratch)
7. **Race conditions** in money handling
8. **EJS templates** need migration strategy

### Estimated Effort:

- **Solo Developer:** 1.5 - 2 months (full-time)
- **Team of 3:** 3-4 weeks
- **With Tests:** Add 50% more time

### Recommendation:

If the current Express app works:

1. **Add TypeScript first** (keep Express)
2. **Migrate to Prisma** (keep Express)
3. **Then consider Hono** (only if needed)

Only migrate to Hono if you need:

- Better performance (Express is fine for this scale)
- Edge deployment (Cloudflare Workers)
- Smaller bundle size

---

## 📝 Next Steps

If you decide to proceed:

1. **Backup everything** (database + code)
2. **Create a new branch** or repository
3. **Start with Prisma schema** (lowest risk)
4. **Test with one simple route** first
5. **Gradually migrate** (don't rewrite everything at once)
6. **Keep both apps running** during migration
7. **Write tests** as you migrate each feature
