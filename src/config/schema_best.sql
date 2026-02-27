-- ============================================
-- 99BIGDADDY DATABASE SCHEMA v2.0
-- Modernized with camelCase, FK constraints, and audit trails
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- ENUMS & LOOKUP TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS `gameTypes` (
  `id` TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255),
  `createdAt` BIGINT DEFAULT 0
) ENGINE=InnoDB;

INSERT INTO `gameTypes` (`code`, `name`) VALUES
('wingo', 'Wingo Lottery'),
('5d', '5D Lottery'),
('k3', 'K3 Lottery');

CREATE TABLE IF NOT EXISTS `transactionTypes` (
  `id` TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL,
  `direction` ENUM('in', 'out', 'neutral') DEFAULT 'neutral'
) ENGINE=InnoDB;

INSERT INTO `transactionTypes` (`code`, `name`, `direction`) VALUES
('deposit', 'Deposit', 'in'),
('withdraw', 'Withdrawal', 'out'),
('bet', 'Bet Placed', 'out'),
('win', 'Win Prize', 'in'),
('bonus', 'Bonus', 'in'),
('transfer_in', 'Transfer Received', 'in'),
('transfer_out', 'Transfer Sent', 'out'),
('commission', 'Commission', 'in'),
('check_in', 'Daily Check-in', 'in');

-- ============================================
-- CORE GAME TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS `gameSessions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `gameTypeId` TINYINT UNSIGNED NOT NULL,
  `result` VARCHAR(50) DEFAULT NULL,
  `status` TINYINT DEFAULT 0 COMMENT '0=pending, 1=open, 2=closed, 3=completed',
  `startedAt` BIGINT DEFAULT 0,
  `closedAt` BIGINT DEFAULT 0,
  `resultAt` BIGINT DEFAULT 0,
  `createdAt` BIGINT DEFAULT 0,

  UNIQUE KEY `uk_period_game` (`period`, `gameTypeId`),
  CONSTRAINT `fk_sessions_gameType` FOREIGN KEY (`gameTypeId`) REFERENCES `gameTypes`(`id`),
  INDEX `idx_status_time` (`status`, `createdAt`)
) ENGINE=InnoDB;

-- Legacy table migrations (deprecated, use gameSessions)
CREATE TABLE IF NOT EXISTS `wingoGames` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL UNIQUE,
  `game` VARCHAR(50) NOT NULL,
  `amount` INT DEFAULT 0,
  `status` TINYINT DEFAULT 0,
  `time` BIGINT DEFAULT 0,
  `sessionId` INT UNSIGNED DEFAULT NULL,

  CONSTRAINT `fk_wingo_session` FOREIGN KEY (`sessionId`) REFERENCES `gameSessions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `5dGames` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL UNIQUE,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` TINYINT DEFAULT 0,
  `time` BIGINT DEFAULT 0,
  `sessionId` INT UNSIGNED DEFAULT NULL,

  CONSTRAINT `fk_5d_session` FOREIGN KEY (`sessionId`) REFERENCES `gameSessions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `k3Games` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL UNIQUE,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` TINYINT DEFAULT 0,
  `time` BIGINT DEFAULT 0,
  `sessionId` INT UNSIGNED DEFAULT NULL,

  CONSTRAINT `fk_k3_session` FOREIGN KEY (`sessionId`) REFERENCES `gameSessions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- USER & AUTHENTICATION TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `userName` VARCHAR(100) DEFAULT '',
  `passwordHash` VARCHAR(255) NOT NULL,
  `plainPassword` VARCHAR(255) DEFAULT '' COMMENT 'Temporary, remove in production',
  `authToken` VARCHAR(255) DEFAULT NULL,
  `balance` DECIMAL(15,2) DEFAULT 0.00,
  `referralCode` VARCHAR(50) NOT NULL UNIQUE,
  `invitedBy` INT UNSIGNED DEFAULT NULL,
  `isCollaborator` BOOLEAN DEFAULT FALSE,
  `isVerified` BOOLEAN DEFAULT FALSE,
  `otpCode` VARCHAR(10) DEFAULT NULL,
  `otpExpiresAt` BIGINT DEFAULT 0,
  `otpAttempts` TINYINT UNSIGNED DEFAULT 0,
  `lastLoginIp` VARCHAR(45) DEFAULT NULL,
  `status` TINYINT DEFAULT 0 COMMENT '0=active, 1=suspended, 2=banned',
  `createdAt` BIGINT DEFAULT 0,
  `updatedAt` BIGINT DEFAULT 0,
  `userLevel` TINYINT UNSIGNED DEFAULT 0,
  `commissionLevel` TINYINT UNSIGNED DEFAULT 0,
  `totalDeposited` DECIMAL(15,2) DEFAULT 0.00,
  `totalWithdrawn` DECIMAL(15,2) DEFAULT 0.00,
  `totalBet` DECIMAL(15,2) DEFAULT 0.00,
  `totalWon` DECIMAL(15,2) DEFAULT 0.00,
  `commissionF1` DECIMAL(15,2) DEFAULT 0.00,
  `commissionF2` DECIMAL(15,2) DEFAULT 0.00,
  `commissionF3` DECIMAL(15,2) DEFAULT 0.00,
  `commissionF4` DECIMAL(15,2) DEFAULT 0.00,
  `commissionToday` DECIMAL(15,2) DEFAULT 0.00,
  `rank` INT UNSIGNED DEFAULT 0,
  `freeBonus` INT DEFAULT 0,
  `firstDepositBonus` BOOLEAN DEFAULT FALSE,

  CONSTRAINT `fk_user_inviter` FOREIGN KEY (`invitedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_phone` (`phone`),
  INDEX `idx_referral` (`referralCode`),
  INDEX `idx_invitedBy` (`invitedBy`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `commissionLevels` (
  `id` TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `level` TINYINT UNSIGNED NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL,
  `rateF1` DECIMAL(5,4) DEFAULT 0.0000 COMMENT 'Direct referral rate',
  `rateF2` DECIMAL(5,4) DEFAULT 0.0000 COMMENT 'Level 2 rate',
  `rateF3` DECIMAL(5,4) DEFAULT 0.0000 COMMENT 'Level 3 rate',
  `rateF4` DECIMAL(5,4) DEFAULT 0.0000 COMMENT 'Level 4 rate',
  `minTurnover` DECIMAL(15,2) DEFAULT 0.00,
  `createdAt` BIGINT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `commissionRecords` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL,
  `fromUserId` INT UNSIGNED NOT NULL,
  `level` TINYINT UNSIGNED NOT NULL COMMENT 'F1=1, F2=2, etc',
  `amount` DECIMAL(15,2) DEFAULT 0.00,
  `sourceType` VARCHAR(50) NOT NULL COMMENT 'bet/deposit/etc',
  `sourceId` INT UNSIGNED DEFAULT NULL,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_commission_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_commission_from` FOREIGN KEY (`fromUserId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_time` (`userId`, `createdAt`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `turnoverRecords` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL,
  `dailyTurnover` DECIMAL(15,2) DEFAULT 0.00,
  `totalTurnover` DECIMAL(15,2) DEFAULT 0.00,
  `recordDate` DATE NOT NULL,
  `updatedAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_turnover_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_date` (`userId`, `recordDate`),
  INDEX `idx_date` (`recordDate`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `userPoints` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL,
  `points` DECIMAL(15,2) DEFAULT 0.00,
  `pointsUs` DECIMAL(15,2) DEFAULT 0.00 COMMENT 'USDT equivalent',
  `telegramId` VARCHAR(255) DEFAULT NULL,
  `totalWeek1` DECIMAL(15,2) DEFAULT 0.00,
  `totalWeek2` DECIMAL(15,2) DEFAULT 0.00,
  `totalWeek3` DECIMAL(15,2) DEFAULT 0.00,
  `totalWeek4` DECIMAL(15,2) DEFAULT 0.00,
  `totalWeek5` DECIMAL(15,2) DEFAULT 0.00,
  `totalWeek6` DECIMAL(15,2) DEFAULT 0.00,
  `totalWeek7` DECIMAL(15,2) DEFAULT 0.00,
  `currentLevel` TINYINT UNSIGNED DEFAULT 0,
  `updatedAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_points_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_points` (`userId`)
) ENGINE=InnoDB;

-- ============================================
-- WALLET & PAYMENT TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS `paymentMethods` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('bank', 'upi', 'crypto', 'wallet') NOT NULL,
  `bankName` VARCHAR(100) DEFAULT NULL,
  `accountName` VARCHAR(100) DEFAULT NULL,
  `accountNumber` VARCHAR(50) DEFAULT NULL,
  `ifscCode` VARCHAR(20) DEFAULT NULL,
  `upiId` VARCHAR(100) DEFAULT NULL,
  `cryptoAddress` VARCHAR(255) DEFAULT NULL,
  `qrCodeUrl` VARCHAR(255) DEFAULT NULL,
  `isActive` BOOLEAN DEFAULT TRUE,
  `displayOrder` INT DEFAULT 0,
  `createdAt` BIGINT DEFAULT 0,

  INDEX `idx_type_active` (`type`, `isActive`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `deposits` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `orderId` VARCHAR(50) NOT NULL UNIQUE,
  `transactionId` VARCHAR(100) DEFAULT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(15,2) DEFAULT 0.00,
  `paymentMethodId` INT UNSIGNED DEFAULT NULL,
  `status` TINYINT DEFAULT 0 COMMENT '0=pending, 1=processing, 2=completed, 3=failed, 4=cancelled',
  `utrNumber` VARCHAR(100) DEFAULT NULL,
  `receiptUrl` VARCHAR(255) DEFAULT NULL,
  `processedAt` BIGINT DEFAULT NULL,
  `processedBy` INT UNSIGNED DEFAULT NULL,
  `remarks` VARCHAR(255) DEFAULT NULL,
  `ipAddress` VARCHAR(45) DEFAULT NULL,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_deposit_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_deposit_method` FOREIGN KEY (`paymentMethodId`) REFERENCES `paymentMethods`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_deposit_processor` FOREIGN KEY (`processedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_user_status` (`userId`, `status`),
  INDEX `idx_created` (`createdAt`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `withdrawals` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `orderId` VARCHAR(50) NOT NULL UNIQUE,
  `userId` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(15,2) DEFAULT 0.00,
  `fee` DECIMAL(15,2) DEFAULT 0.00,
  `netAmount` DECIMAL(15,2) DEFAULT 0.00,
  `bankName` VARCHAR(100) DEFAULT NULL,
  `accountName` VARCHAR(100) DEFAULT NULL,
  `accountNumber` VARCHAR(50) DEFAULT NULL,
  `ifscCode` VARCHAR(20) DEFAULT NULL,
  `upiId` VARCHAR(100) DEFAULT NULL,
  `status` TINYINT DEFAULT 0 COMMENT '0=pending, 1=processing, 2=completed, 3=rejected',
  `requestedAt` BIGINT DEFAULT 0,
  `processedAt` BIGINT DEFAULT NULL,
  `processedBy` INT UNSIGNED DEFAULT NULL,
  `remarks` VARCHAR(255) DEFAULT NULL,
  `rejectionReason` VARCHAR(255) DEFAULT NULL,
  `ipAddress` VARCHAR(45) DEFAULT NULL,

  CONSTRAINT `fk_withdrawal_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_withdrawal_processor` FOREIGN KEY (`processedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_user_status` (`userId`, `status`),
  INDEX `idx_requested` (`requestedAt`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `userBankAccounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL,
  `type` ENUM('bank', 'upi', 'crypto') DEFAULT 'bank',
  `bankName` VARCHAR(100) DEFAULT NULL,
  `accountName` VARCHAR(100) DEFAULT NULL,
  `accountNumber` VARCHAR(50) DEFAULT NULL,
  `ifscCode` VARCHAR(20) DEFAULT NULL,
  `upiId` VARCHAR(100) DEFAULT NULL,
  `cryptoAddress` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `province` VARCHAR(100) DEFAULT NULL,
  `branch` VARCHAR(100) DEFAULT NULL,
  `isDefault` BOOLEAN DEFAULT FALSE,
  `isVerified` BOOLEAN DEFAULT FALSE,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_bank_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_default` (`userId`, `isDefault`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `balanceTransfers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `senderId` INT UNSIGNED NOT NULL,
  `receiverId` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(15,2) DEFAULT 0.00,
  `fee` DECIMAL(15,2) DEFAULT 0.00,
  `netAmount` DECIMAL(15,2) DEFAULT 0.00,
  `status` TINYINT DEFAULT 1 COMMENT '0=failed, 1=success',
  `description` VARCHAR(255) DEFAULT NULL,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_transfer_sender` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transfer_receiver` FOREIGN KEY (`receiverId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_sender_time` (`senderId`, `createdAt`),
  INDEX `idx_receiver_time` (`receiverId`, `createdAt`)
) ENGINE=InnoDB;

-- ============================================
-- BET & RESULT TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS `bets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sessionId` INT UNSIGNED NOT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `gameTypeId` TINYINT UNSIGNED NOT NULL,
  `stage` INT UNSIGNED DEFAULT 0,
  `betAmount` DECIMAL(15,2) DEFAULT 0.00,
  `odds` DECIMAL(8,2) DEFAULT 0.00,
  `potentialWin` DECIMAL(15,2) DEFAULT 0.00,
  `fee` DECIMAL(15,2) DEFAULT 0.00,
  `actualWin` DECIMAL(15,2) DEFAULT 0.00,
  `selection` VARCHAR(50) NOT NULL COMMENT 'User bet selection',
  `betType` VARCHAR(50) DEFAULT NULL COMMENT 'big/small/odd/even/etc',
  `result` VARCHAR(50) DEFAULT NULL,
  `isWin` BOOLEAN DEFAULT NULL,
  `status` TINYINT DEFAULT 0 COMMENT '0=pending, 1=open, 2=closed, 3=completed',
  `settledAt` BIGINT DEFAULT NULL,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_bet_session` FOREIGN KEY (`sessionId`) REFERENCES `gameSessions`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bet_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bet_gameType` FOREIGN KEY (`gameTypeId`) REFERENCES `gameTypes`(`id`),
  INDEX `idx_user_created` (`userId`, `createdAt`),
  INDEX `idx_session` (`sessionId`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB;

-- Legacy bet tables (migrate to bets table)
CREATE TABLE IF NOT EXISTS `wingoBets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `productId` INT DEFAULT 0,
  `userId` INT UNSIGNED NOT NULL,
  `referralCode` VARCHAR(50) DEFAULT NULL,
  `invitedBy` INT UNSIGNED DEFAULT NULL,
  `stage` INT DEFAULT 0,
  `userLevel` INT DEFAULT 0,
  `betAmount` DECIMAL(15,2) DEFAULT 0.00,
  `odds` DECIMAL(10,2) DEFAULT 0.00,
  `quantity` INT DEFAULT 0,
  `fee` DECIMAL(15,2) DEFAULT 0.00,
  `winAmount` DECIMAL(15,2) DEFAULT 0.00,
  `game` VARCHAR(50) NOT NULL,
  `joinBet` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` INT DEFAULT 0,
  `status` TINYINT DEFAULT 0,
  `recordDate` VARCHAR(50) DEFAULT '',
  `createdAt` BIGINT DEFAULT 0,
  `modernBetId` INT UNSIGNED DEFAULT NULL,

  CONSTRAINT `fk_wingobet_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wingobet_modern` FOREIGN KEY (`modernBetId`) REFERENCES `bets`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `5dBets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `productId` INT DEFAULT 0,
  `userId` INT UNSIGNED NOT NULL,
  `referralCode` VARCHAR(50) DEFAULT NULL,
  `invitedBy` INT UNSIGNED DEFAULT NULL,
  `stage` INT DEFAULT 0,
  `userLevel` INT DEFAULT 0,
  `betAmount` DECIMAL(15,2) DEFAULT 0.00,
  `odds` DECIMAL(10,2) DEFAULT 0.00,
  `quantity` INT DEFAULT 0,
  `fee` DECIMAL(15,2) DEFAULT 0.00,
  `winAmount` DECIMAL(15,2) DEFAULT 0.00,
  `game` INT DEFAULT 0,
  `joinBet` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` VARCHAR(50) DEFAULT '0',
  `status` TINYINT DEFAULT 0,
  `createdAt` BIGINT DEFAULT 0,
  `modernBetId` INT UNSIGNED DEFAULT NULL,

  CONSTRAINT `fk_5dbet_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_5dbet_modern` FOREIGN KEY (`modernBetId`) REFERENCES `bets`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `k3Bets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `productId` INT DEFAULT 0,
  `userId` INT UNSIGNED NOT NULL,
  `referralCode` VARCHAR(50) DEFAULT NULL,
  `invitedBy` INT UNSIGNED DEFAULT NULL,
  `stage` INT DEFAULT 0,
  `userLevel` INT DEFAULT 0,
  `betAmount` DECIMAL(15,2) DEFAULT 0.00,
  `odds` DECIMAL(10,2) DEFAULT 0.00,
  `quantity` INT DEFAULT 0,
  `fee` DECIMAL(15,2) DEFAULT 0.00,
  `winAmount` DECIMAL(15,2) DEFAULT 0.00,
  `game` INT DEFAULT 0,
  `joinBet` VARCHAR(50) DEFAULT '',
  `gameType` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` VARCHAR(50) DEFAULT '0',
  `status` TINYINT DEFAULT 0,
  `createdAt` BIGINT DEFAULT 0,
  `modernBetId` INT UNSIGNED DEFAULT NULL,

  CONSTRAINT `fk_k3bet_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_k3bet_modern` FOREIGN KEY (`modernBetId`) REFERENCES `bets`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- ADMIN & CONFIGURATION TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS `adminConfigs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `configKey` VARCHAR(50) NOT NULL UNIQUE,
  `configValue` TEXT,
  `description` VARCHAR(255) DEFAULT NULL,
  `updatedBy` INT UNSIGNED DEFAULT NULL,
  `updatedAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_config_updater` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Migrate legacy admin data
INSERT INTO `adminConfigs` (`configKey`, `configValue`) VALUES
('wingo1_control', '-1'),
('wingo3_control', '-1'),
('wingo5_control', '-1'),
('wingo10_control', '-1'),
('5d1_control', '-1'),
('5d3_control', '-1'),
('5d5_control', '-1'),
('5d10_control', '-1'),
('global_win_rate', '80'),
('telegram_link', ''),
('customer_service', ''),
('app_download_link', '#');

CREATE TABLE IF NOT EXISTS `adminUsers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL,
  `role` ENUM('super', 'admin', 'moderator', 'finance') DEFAULT 'moderator',
  `permissions` JSON DEFAULT NULL,
  `isActive` BOOLEAN DEFAULT TRUE,
  `lastLoginAt` BIGINT DEFAULT NULL,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_admin_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_role` (`userId`, `role`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `salaryRecords` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(15,2) DEFAULT 0.00,
  `type` VARCHAR(50) DEFAULT '',
  `description` VARCHAR(255) DEFAULT NULL,
  `periodStart` DATE DEFAULT NULL,
  `periodEnd` DATE DEFAULT NULL,
  `isPaid` BOOLEAN DEFAULT FALSE,
  `paidAt` BIGINT DEFAULT NULL,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_salary_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_period` (`userId`, `periodStart`, `periodEnd`)
) ENGINE=InnoDB;

-- ============================================
-- PROMOTIONAL TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS `redEnvelopes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `envelopeId` VARCHAR(50) NOT NULL UNIQUE,
  `creatorId` INT UNSIGNED NOT NULL,
  `totalAmount` DECIMAL(15,2) DEFAULT 0.00,
  `totalCount` INT UNSIGNED DEFAULT 0,
  `claimedCount` INT UNSIGNED DEFAULT 0,
  `claimedAmount` DECIMAL(15,2) DEFAULT 0.00,
  `status` TINYINT DEFAULT 0 COMMENT '0=active, 1=completed, 2=expired',
  `expiredAt` BIGINT DEFAULT 0,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_envelope_creator` FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_creator_status` (`creatorId`, `status`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `redEnvelopeClaims` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `envelopeId` INT UNSIGNED NOT NULL,
  `claimerId` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(15,2) DEFAULT 0.00,
  `claimedAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_claim_envelope` FOREIGN KEY (`envelopeId`) REFERENCES `redEnvelopes`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_claim_user` FOREIGN KEY (`claimerId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_envelope_claimer` (`envelopeId`, `claimerId`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `checkInRecords` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL,
  `consecutiveDays` INT DEFAULT 0,
  `rewardAmount` DECIMAL(15,2) DEFAULT 0.00,
  `checkInDate` DATE NOT NULL,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_checkin_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_date` (`userId`, `checkInDate`),
  INDEX `idx_date` (`checkInDate`)
) ENGINE=InnoDB;

-- ============================================
-- AUDIT & LOGGING TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS `transactionLogs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED NOT NULL,
  `relatedUserId` INT UNSIGNED DEFAULT NULL,
  `typeId` TINYINT UNSIGNED NOT NULL,
  `amount` DECIMAL(15,2) DEFAULT 0.00,
  `balanceBefore` DECIMAL(15,2) DEFAULT 0.00,
  `balanceAfter` DECIMAL(15,2) DEFAULT 0.00,
  `referenceId` INT UNSIGNED DEFAULT NULL,
  `referenceType` VARCHAR(50) DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `ipAddress` VARCHAR(45) DEFAULT NULL,
  `userAgent` VARCHAR(255) DEFAULT NULL,
  `createdAt` BIGINT DEFAULT 0,

  CONSTRAINT `fk_txn_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_txn_related` FOREIGN KEY (`relatedUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_txn_type` FOREIGN KEY (`typeId`) REFERENCES `transactionTypes`(`id`),
  INDEX `idx_user_time` (`userId`, `createdAt`),
  INDEX `idx_type_time` (`typeId`, `createdAt`)
) ENGINE=InnoDB PARTITION BY RANGE (createdAt) (
  PARTITION p2024 VALUES LESS THAN (1735689600000),
  PARTITION p2025 VALUES LESS THAN (1767225600000),
  PARTITION pfuture VALUES LESS THAN MAXVALUE
);

CREATE TABLE IF NOT EXISTS `activityLogs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entityType` VARCHAR(50) DEFAULT NULL,
  `entityId` INT UNSIGNED DEFAULT NULL,
  `oldValues` JSON DEFAULT NULL,
  `newValues` JSON DEFAULT NULL,
  `ipAddress` VARCHAR(45) DEFAULT NULL,
  `userAgent` VARCHAR(255) DEFAULT NULL,
  `createdAt` BIGINT DEFAULT 0,

  INDEX `idx_user_action` (`userId`, `action`),
  INDEX `idx_created` (`createdAt`)
) ENGINE=InnoDB PARTITION BY RANGE (createdAt) (
  PARTITION p2024 VALUES LESS THAN (1735689600000),
  PARTITION p2025 VALUES LESS THAN (1767225600000),
  PARTITION pfuture VALUES LESS THAN MAXVALUE
);

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

CREATE OR REPLACE VIEW `userFinancialSummary` AS
SELECT
  u.id,
  u.phone,
  u.userName,
  u.balance,
  u.totalDeposited,
  u.totalWithdrawn,
  u.totalBet,
  u.totalWon,
  (u.totalWon - u.totalBet) as netProfit,
  u.commissionF1 + u.commissionF2 + u.commissionF3 + u.commissionF4 as totalCommission,
  u.createdAt
FROM users u;

CREATE OR REPLACE VIEW `dailyGameStats` AS
SELECT
  DATE(FROM_UNIXTIME(gs.createdAt / 1000)) as gameDate,
  gt.name as gameType,
  COUNT(DISTINCT gs.id) as totalSessions,
  COUNT(DISTINCT b.id) as totalBets,
  SUM(b.betAmount) as totalBetAmount,
  SUM(b.actualWin) as totalPayout,
  SUM(b.fee) as totalFees,
  (SUM(b.betAmount) - SUM(b.actualWin)) as houseProfit
FROM gameSessions gs
JOIN gameTypes gt ON gs.gameTypeId = gt.id
LEFT JOIN bets b ON gs.id = b.sessionId
GROUP BY DATE(FROM_UNIXTIME(gs.createdAt / 1000)), gt.name;

SET FOREIGN_KEY_CHECKS = 1;
