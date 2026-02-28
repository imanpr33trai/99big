# 99 Big Daddy - Lottery Platform

A multi-game lottery platform built with Node.js, Express, MySQL, and Socket.IO.

## 🎮 Games

- **Wingo** - 1, 3, 5, 10 minute lottery draws
- **5D (K5D)** - 5-digit lottery game
- **K3** - 3-digit lottery game

## 🛠️ Tech Stack

| Layer              | Technology                         |
| ------------------ | ---------------------------------- |
| **Backend**        | Node.js v25.5.0, Express.js        |
| **Frontend**       | EJS, Bootstrap, jQuery, Vanilla JS |
| **Database**       | MySQL (mysql2)                     |
| **Real-time**      | Socket.IO                          |
| **Authentication** | JWT, Cookies                       |
| **Scheduling**     | node-cron                          |
| **Payments**       | UPI, USDT, WowPay                  |

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Setup database (run schema.sql)

docker compose up db

pnpm database

pnpm db:init

# Initialize database with seed data
yarn database

# Start server
pnpm start
```

Server runs on: **http://localhost:3016**

## 🗄️ Database Tables

### Core Game Tables

#### 1. `wingo` - Wingo Game Results

| Column   | Type        | Description                             |
| -------- | ----------- | --------------------------------------- |
| `id`     | INT         | Primary Key (Auto Increment)            |
| `period` | VARCHAR(50) | Game period ID                          |
| `game`   | VARCHAR(50) | Game type (wingo/wingo3/wingo5/wingo10) |
| `amount` | INT         | Bet amount                              |
| `status` | INT         | Game status (0=pending, 1=completed)    |
| `time`   | BIGINT      | Timestamp                               |

#### 2. `5d` - 5D Lottery Results

| Column   | Type        | Description                          |
| -------- | ----------- | ------------------------------------ |
| `id`     | INT         | Primary Key (Auto Increment)         |
| `period` | VARCHAR(50) | Game period ID                       |
| `result` | VARCHAR(50) | Winning number (5 digits)            |
| `game`   | INT         | Game type (1/3/5/10 minutes)         |
| `status` | INT         | Game status (0=pending, 1=completed) |
| `time`   | BIGINT      | Timestamp                            |

#### 3. `k3` - K3 Lottery Results

| Column   | Type        | Description                          |
| -------- | ----------- | ------------------------------------ |
| `id`     | INT         | Primary Key (Auto Increment)         |
| `period` | VARCHAR(50) | Game period ID                       |
| `result` | VARCHAR(50) | Winning number (3 digits)            |
| `game`   | INT         | Game type (1/3/5/10 minutes)         |
| `status` | INT         | Game status (0=pending, 1=completed) |
| `time`   | BIGINT      | Timestamp                            |

### User & Authentication Tables

#### 4. `users` - User Accounts

| Column           | Type          | Description                   |
| ---------------- | ------------- | ----------------------------- |
| `id`             | INT           | Primary Key (Auto Increment)  |
| `phone`          | VARCHAR(20)   | User phone number (unique)    |
| `name_user`      | VARCHAR(100)  | User name                     |
| `password`       | VARCHAR(255)  | Hashed password               |
| `plain_password` | VARCHAR(255)  | Plain password (for recovery) |
| `money`          | DECIMAL(10,2) | Wallet balance                |
| `code`           | VARCHAR(50)   | User's referral code          |
| `invite`         | VARCHAR(50)   | Inviter's code                |
| `ctv`            | INT           | CTV level                     |
| `veri`           | INT           | Verification status           |
| `otp`            | VARCHAR(10)   | OTP code                      |
| `time_otp`       | BIGINT        | OTP expiry timestamp          |
| `ip_address`     | VARCHAR(50)   | User IP address               |
| `status`         | INT           | Account status                |
| `time`           | BIGINT        | Registration timestamp        |
| `user_level`     | INT           | User level (0-6)              |
| `total_money`    | DECIMAL(10,2) | Total money earned            |
| `roses_f`        | DECIMAL(10,2) | Commission from F1            |
| `roses_today`    | DECIMAL(10,2) | Today's commission            |
| `rank`           | INT           | User rank                     |
| `free_bonus`     | INT           | Free bonus status             |
| `first_deposit`  | INT           | First deposit status          |

#### 5. `level` - Commission Levels

| Column  | Type          | Description                  |
| ------- | ------------- | ---------------------------- |
| `id`    | INT           | Primary Key (Auto Increment) |
| `level` | INT           | Level (0-6)                  |
| `f1`    | DECIMAL(10,4) | F1 commission rate           |
| `f2`    | DECIMAL(10,4) | F2 commission rate           |
| `f3`    | DECIMAL(10,4) | F3 commission rate           |
| `f4`    | DECIMAL(10,4) | F4 commission rate           |

#### 6. `roses` - Commission Records

| Column   | Type          | Description                  |
| -------- | ------------- | ---------------------------- |
| `id`     | INT           | Primary Key (Auto Increment) |
| `phone`  | VARCHAR(20)   | User phone                   |
| `code`   | VARCHAR(50)   | User's referral code         |
| `invite` | VARCHAR(50)   | Inviter's code               |
| `f1`     | DECIMAL(10,2) | F1 commission                |
| `f2`     | DECIMAL(10,2) | F2 commission                |
| `f3`     | DECIMAL(10,2) | F3 commission                |
| `f4`     | DECIMAL(10,2) | F4 commission                |
| `time`   | BIGINT        | Timestamp                    |

#### 7. `turn_over` - Turnover Tracking

| Column            | Type          | Description                  |
| ----------------- | ------------- | ---------------------------- |
| `id`              | INT           | Primary Key (Auto Increment) |
| `phone`           | VARCHAR(20)   | User phone                   |
| `code`            | VARCHAR(50)   | User's referral code         |
| `invite`          | VARCHAR(50)   | Inviter's code               |
| `daily_turn_over` | DECIMAL(10,2) | Daily turnover               |
| `total_turn_over` | DECIMAL(10,2) | Total turnover               |

#### 8. `point_list` - User Points

| Column  | Type          | Description                  |
| ------- | ------------- | ---------------------------- |
| `id`    | INT           | Primary Key (Auto Increment) |
| `phone` | VARCHAR(20)   | User phone (unique)          |
| `money` | DECIMAL(10,2) | Points balance               |
| `level` | INT           | Point level                  |

### Wallet & Payment Tables

#### 9. `bank_recharge` - Bank/UPI Recharge Methods

| Column      | Type         | Description                   |
| ----------- | ------------ | ----------------------------- |
| `id`        | INT          | Primary Key (Auto Increment)  |
| `name_bank` | VARCHAR(100) | Bank name                     |
| `name_user` | VARCHAR(100) | Account holder name           |
| `stk`       | VARCHAR(50)  | Account number/UPI ID         |
| `type`      | VARCHAR(50)  | Payment type (bank/momo/usdt) |
| `time`      | BIGINT       | Timestamp                     |

#### 10. `recharge` - Deposit Records

| Column           | Type          | Description                             |
| ---------------- | ------------- | --------------------------------------- |
| `id`             | INT           | Primary Key (Auto Increment)            |
| `id_order`       | VARCHAR(50)   | Order ID                                |
| `transaction_id` | VARCHAR(100)  | Transaction ID                          |
| `phone`          | VARCHAR(20)   | User phone                              |
| `money`          | DECIMAL(10,2) | Amount                                  |
| `type`           | VARCHAR(50)   | Payment type                            |
| `status`         | INT           | Status (0=pending, 1=success, 2=failed) |
| `today`          | INT           | Day counter                             |
| `url`            | VARCHAR(255)  | Payment proof URL                       |
| `time`           | BIGINT        | Timestamp                               |
| `utr`            | VARCHAR(100)  | UTR number                              |

#### 11. `withdraw` - Withdrawal Records

| Column   | Type          | Description                  |
| -------- | ------------- | ---------------------------- |
| `id`     | INT           | Primary Key (Auto Increment) |
| `phone`  | VARCHAR(20)   | User phone                   |
| `money`  | DECIMAL(10,2) | Amount                       |
| `status` | INT           | Status                       |
| `time`   | BIGINT        | Timestamp                    |

#### 12. `user_bank` - User Bank Details

| Column      | Type         | Description                  |
| ----------- | ------------ | ---------------------------- |
| `id`        | INT          | Primary Key (Auto Increment) |
| `phone`     | VARCHAR(20)  | User phone                   |
| `name_bank` | VARCHAR(100) | Bank name                    |
| `name_user` | VARCHAR(100) | Account holder name          |
| `stk`       | VARCHAR(50)  | Account number               |
| `ifsc`      | VARCHAR(20)  | IFSC code                    |
| `time`      | BIGINT       | Timestamp                    |

#### 13. `balance_transfer` - Balance Transfer Records

| Column           | Type          | Description                  |
| ---------------- | ------------- | ---------------------------- |
| `id`             | INT           | Primary Key (Auto Increment) |
| `sender_phone`   | VARCHAR(20)   | Sender phone                 |
| `receiver_phone` | VARCHAR(20)   | Receiver phone               |
| `amount`         | DECIMAL(10,2) | Transfer amount              |
| `time`           | BIGINT        | Timestamp                    |

### Bet & Result Tables

#### 14. `minutes_1` - Wingo Bet Records (1 minute)

| Column     | Type          | Description                  |
| ---------- | ------------- | ---------------------------- |
| `id`       | INT           | Primary Key (Auto Increment) |
| `phone`    | VARCHAR(20)   | User phone                   |
| `code`     | VARCHAR(50)   | User code                    |
| `invite`   | VARCHAR(50)   | Inviter code                 |
| `stage`    | INT           | Stage number                 |
| `level`    | INT           | User level                   |
| `money`    | DECIMAL(10,2) | Bet amount                   |
| `price`    | DECIMAL(10,2) | Prize amount                 |
| `amount`   | INT           | Quantity                     |
| `fee`      | DECIMAL(10,2) | Fee                          |
| `game`     | VARCHAR(50)   | Game type                    |
| `join_bet` | VARCHAR(50)   | Bet type                     |
| `bet`      | VARCHAR(50)   | Bet value                    |
| `status`   | INT           | Status                       |
| `time`     | BIGINT        | Timestamp                    |

#### 15. `result_5d` - 5D Bet Results

| Column       | Type          | Description                  |
| ------------ | ------------- | ---------------------------- |
| `id`         | INT           | Primary Key (Auto Increment) |
| `id_product` | INT           | Product ID                   |
| `phone`      | VARCHAR(20)   | User phone                   |
| `code`       | VARCHAR(50)   | User code                    |
| `invite`     | VARCHAR(50)   | Inviter code                 |
| `stage`      | INT           | Stage number                 |
| `level`      | INT           | User level                   |
| `money`      | DECIMAL(10,2) | Bet amount                   |
| `price`      | DECIMAL(10,2) | Prize amount                 |
| `amount`     | INT           | Quantity                     |
| `fee`        | DECIMAL(10,2) | Fee                          |
| `game`       | INT           | Game type                    |
| `join_bet`   | VARCHAR(50)   | Bet type                     |
| `bet`        | VARCHAR(50)   | Bet value                    |
| `status`     | INT           | Status                       |
| `time`       | BIGINT        | Timestamp                    |

#### 16. `result_k3` - K3 Bet Results

| Column       | Type          | Description                  |
| ------------ | ------------- | ---------------------------- |
| `id`         | INT           | Primary Key (Auto Increment) |
| `id_product` | INT           | Product ID                   |
| `phone`      | VARCHAR(20)   | User phone                   |
| `code`       | VARCHAR(50)   | User code                    |
| `invite`     | VARCHAR(50)   | Inviter code                 |
| `stage`      | INT           | Stage number                 |
| `level`      | INT           | User level                   |
| `money`      | DECIMAL(10,2) | Bet amount                   |
| `price`      | DECIMAL(10,2) | Prize amount                 |
| `amount`     | INT           | Quantity                     |
| `fee`        | DECIMAL(10,2) | Fee                          |
| `game`       | INT           | Game type                    |
| `join_bet`   | VARCHAR(50)   | Bet type                     |
| `typeGame`   | VARCHAR(50)   | Game sub-type                |
| `bet`        | VARCHAR(50)   | Bet value                    |
| `status`     | INT           | Status                       |
| `time`       | BIGINT        | Timestamp                    |

### Admin & Management Tables

#### 17. `admin` - Admin Settings

| Column     | Type         | Description                  |
| ---------- | ------------ | ---------------------------- |
| `id`       | INT          | Primary Key (Auto Increment) |
| `wingo1`   | VARCHAR(50)  | Wingo 1min result control    |
| `wingo3`   | VARCHAR(50)  | Wingo 3min result control    |
| `wingo5`   | VARCHAR(50)  | Wingo 5min result control    |
| `wingo10`  | VARCHAR(50)  | Wingo 10min result control   |
| `k5d`      | VARCHAR(50)  | 5D 1min control              |
| `k5d3`     | VARCHAR(50)  | 5D 3min control              |
| `k5d5`     | VARCHAR(50)  | 5D 5min control              |
| `k5d10`    | VARCHAR(50)  | 5D 10min control             |
| `win_rate` | INT          | Win rate percentage          |
| `telegram` | VARCHAR(255) | Telegram link                |
| `cskh`     | VARCHAR(255) | Customer support link        |
| `app`      | VARCHAR(50)  | App status                   |

#### 18. `salary` - Salary/Commission Records

| Column   | Type          | Description                  |
| -------- | ------------- | ---------------------------- |
| `id`     | INT           | Primary Key (Auto Increment) |
| `phone`  | VARCHAR(20)   | User phone                   |
| `amount` | DECIMAL(10,2) | Amount                       |
| `type`   | VARCHAR(50)   | Type                         |
| `time`   | BIGINT        | Timestamp                    |

### Promotional Tables

#### 19. `redenvelopes` - Red Envelope Bonuses

| Column           | Type          | Description                  |
| ---------------- | ------------- | ---------------------------- |
| `id`             | INT           | Primary Key (Auto Increment) |
| `id_redenvelope` | VARCHAR(50)   | Red envelope ID              |
| `phone`          | VARCHAR(20)   | Creator phone                |
| `money`          | DECIMAL(10,2) | Amount per envelope          |
| `used`           | INT           | Used count                   |
| `amount`         | INT           | Total envelopes              |
| `status`         | INT           | Status                       |
| `time`           | BIGINT        | Timestamp                    |

#### 20. `redenvelopes_used` - Red Envelope Usage

| Column           | Type          | Description                  |
| ---------------- | ------------- | ---------------------------- |
| `id`             | INT           | Primary Key (Auto Increment) |
| `phone`          | VARCHAR(20)   | Creator phone                |
| `phone_used`     | VARCHAR(20)   | User who claimed             |
| `id_redenvelops` | VARCHAR(50)   | Red envelope ID              |
| `money`          | DECIMAL(10,2) | Amount claimed               |
| `time`           | BIGINT        | Timestamp                    |

#### 21. `check_in` - Daily Check-in Records

| Column  | Type          | Description                  |
| ------- | ------------- | ---------------------------- |
| `id`    | INT           | Primary Key (Auto Increment) |
| `phone` | VARCHAR(20)   | User phone                   |
| `days`  | INT           | Consecutive days             |
| `money` | DECIMAL(10,2) | Reward amount                |
| `time`  | BIGINT        | Timestamp                    |

### Additional Tables

#### 22. `financial_details` - Financial Transaction Log

| Column       | Type          | Description                  |
| ------------ | ------------- | ---------------------------- |
| `id`         | INT           | Primary Key (Auto Increment) |
| `phone`      | VARCHAR(20)   | User phone                   |
| `phone_used` | VARCHAR(20)   | Related phone                |
| `money`      | DECIMAL(10,2) | Amount                       |
| `type`       | VARCHAR(50)   | Transaction type             |
| `time`       | BIGINT        | Timestamp                    |

---

## 📁 Project Structure

```
99bigdaddy/
├── src/
│   ├── config/          # Database & view engine config
│   ├── controllers/     # Business logic
│   │   ├── accountController.js
│   │   ├── homeController.js
│   │   ├── userController.js
│   │   ├── winGoController.js
│   │   ├── k5Controller.js
│   │   ├── k3Controller.js
│   │   ├── adminController.js
│   │   ├── dailyController.js
│   │   ├── paymentController.js
│   │   └── ...
│   ├── modal/           # Database setup
│   ├── routes/          # Express routes
│   ├── views/           # EJS templates
│   ├── public/          # Static assets
│   └── server.js        # Entry point
├── .env                 # Environment variables
├── package.json
└── README.md
```

## 🔑 Environment Variables

| Variable                  | Description                 |
| ------------------------- | --------------------------- |
| `PORT`                    | Server port (default: 3016) |
| `DATABASE_HOST`           | MySQL host                  |
| `DATABASE_USER`           | MySQL username              |
| `DATABASE_PASSWORD`       | MySQL password              |
| `DATABASE_NAME`           | Database name               |
| `JWT_ACCESS_TOKEN`        | JWT secret key              |
| `USDT`                    | USDT wallet address         |
| `UPI_GATEWAY_PAYMENT_KEY` | UPI payment key             |
| `WOWPAY_MERCHANT_ID`      | WowPay merchant ID          |
| `WOWPAY_MERCHANT_KEY`     | WowPay merchant key         |
| `MINIMUM_MONEY`           | Minimum deposit amount      |

## 🎯 API Endpoints

### Authentication

- `POST /api/webapi/login` - User login
- `POST /api/webapi/register` - User registration
- `GET /api/webapi/GetUserInfo` - Get user info

### Games

- `GET /win` - Wingo game page
- `GET /5d` - 5D game page
- `GET /k3` - K3 game page
- `POST /api/webapi/action/join` - Place Wingo bet
- `POST /api/webapi/action/5d/join` - Place 5D bet
- `POST /api/webapi/action/k3/join` - Place K3 bet

### Wallet

- `GET /wallet/recharge` - Deposit page
- `GET /wallet/withdrawal` - Withdrawal page
- `POST /api/webapi/recharge` - Submit deposit
- `POST /api/webapi/withdrawal` - Submit withdrawal

### Admin

- `GET /admin/manager/index` - Admin dashboard
- `GET /admin/manager/recharge` - Manage deposits
- `GET /admin/manager/withdraw` - Manage withdrawals

## ⚠️ Important Notes

1. **Database Setup**: Run `schema.sql` first to create tables, then run `yarn database` to seed initial data
2. **Table Names**: Tables starting with numbers (like `5d`) must be wrapped in backticks: `` `5d` ``
3. **Cron Jobs**: Game results are generated automatically every 1/3/5/10 minutes via node-cron
4. **Real-time Updates**: Socket.IO broadcasts game results to all connected clients
