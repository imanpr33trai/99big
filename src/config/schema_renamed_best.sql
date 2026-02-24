-- Normalized/renamed schema with clearer identifiers
-- This is a clean-name version; it will not match existing code without a migration.
-- MySQL 8+, InnoDB, utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- USERS & AUTH
-- ============================================
CREATE TABLE IF NOT EXISTS `app_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `display_name` VARCHAR(100) DEFAULT '',
  `password_hash` VARCHAR(255) NOT NULL,
  `password_plain` VARCHAR(255) DEFAULT '',
  `auth_token` VARCHAR(255) DEFAULT '',
  `balance` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `invite_code` VARCHAR(50) NOT NULL,
  `referred_by` VARCHAR(50) DEFAULT '',
  `agent_code` INT DEFAULT 0,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `otp_code` VARCHAR(10) DEFAULT '',
  `otp_expires_at` BIGINT DEFAULT 0,
  `last_ip` VARCHAR(50) DEFAULT '',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `registered_at` BIGINT DEFAULT 0,
  `agent_level` INT DEFAULT 0,
  `user_level` INT DEFAULT 0,
  `total_deposit` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `commission_f1` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `commission_total` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `commission_today` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `rank` INT DEFAULT 0,
  `free_bonus` INT DEFAULT 0,
  `first_deposit_flag` INT DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_app_users_phone` (`phone`),
  UNIQUE KEY `uk_app_users_invite_code` (`invite_code`),
  KEY `idx_app_users_auth_token` (`auth_token`),
  KEY `idx_app_users_referred_by` (`referred_by`),
  KEY `idx_app_users_agent_code` (`agent_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `commission_levels` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `level` INT DEFAULT 0,
  `rate_f1` DECIMAL(10,4) DEFAULT 0,
  `rate_f2` DECIMAL(10,4) DEFAULT 0,
  `rate_f3` DECIMAL(10,4) DEFAULT 0,
  `rate_f4` DECIMAL(10,4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `wingo_1m` VARCHAR(50) DEFAULT '-1',
  `wingo_3m` VARCHAR(50) DEFAULT '-1',
  `wingo_5m` VARCHAR(50) DEFAULT '-1',
  `wingo_10m` VARCHAR(50) DEFAULT '-1',
  `lotto5d_1m` VARCHAR(50) DEFAULT '-1',
  `lotto5d_3m` VARCHAR(50) DEFAULT '-1',
  `lotto5d_5m` VARCHAR(50) DEFAULT '-1',
  `lotto5d_10m` VARCHAR(50) DEFAULT '-1',
  `win_rate` INT DEFAULT 80,
  `telegram` VARCHAR(255) DEFAULT '',
  `support_contact` VARCHAR(255) DEFAULT '',
  `app_link` VARCHAR(50) DEFAULT '#'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_points` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `balance` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `balance_us` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `telegram` VARCHAR(255) DEFAULT '',
  `total_1` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total_2` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total_3` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total_4` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total_5` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total_6` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total_7` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `level` INT DEFAULT 0,
  UNIQUE KEY `uk_user_points_phone` (`phone`),
  CONSTRAINT `fk_user_points_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- WALLET & PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS `bank_accounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `bank_name` VARCHAR(100) DEFAULT '',
  `account_name` VARCHAR(100) DEFAULT '',
  `account_number` VARCHAR(50) DEFAULT '',
  `type` VARCHAR(50) DEFAULT '',
  `qr_code_url` VARCHAR(255) DEFAULT '',
  `created_at` BIGINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `deposits` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `transaction_id` VARCHAR(100) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `method` VARCHAR(50) DEFAULT '',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `business_day` VARCHAR(50) DEFAULT '',
  `payment_url` VARCHAR(255) DEFAULT '',
  `created_at` BIGINT DEFAULT 0,
  `utr` VARCHAR(100) DEFAULT '',
  UNIQUE KEY `uk_deposits_order_id` (`order_id`),
  KEY `idx_deposits_phone_status` (`phone`,`status`),
  KEY `idx_deposits_created_at` (`created_at`),
  CONSTRAINT `fk_deposits_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_bank_accounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `bank_name` VARCHAR(100) DEFAULT '',
  `account_name` VARCHAR(100) DEFAULT '',
  `account_number` VARCHAR(50) DEFAULT '',
  `ifsc` VARCHAR(20) DEFAULT '',
  `city` VARCHAR(100) DEFAULT '',
  `email` VARCHAR(150) DEFAULT '',
  `phone_alt` VARCHAR(20) DEFAULT '',
  `state` VARCHAR(100) DEFAULT '',
  `branch` VARCHAR(100) DEFAULT '',
  `created_at` BIGINT DEFAULT 0,
  UNIQUE KEY `uk_user_bank_accounts_phone` (`phone`),
  KEY `idx_user_bank_accounts_account_number` (`account_number`),
  CONSTRAINT `fk_user_bank_accounts_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `withdrawals` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `account_number` VARCHAR(50) DEFAULT '',
  `bank_name` VARCHAR(100) DEFAULT '',
  `ifsc` VARCHAR(100) DEFAULT '',
  `account_name` VARCHAR(100) DEFAULT '',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `business_day` VARCHAR(50) DEFAULT '',
  `remark` VARCHAR(255) DEFAULT '',
  `created_at` BIGINT DEFAULT 0,
  UNIQUE KEY `uk_withdrawals_order_id` (`order_id`),
  KEY `idx_withdrawals_phone_status` (`phone`,`status`),
  KEY `idx_withdrawals_created_at` (`created_at`),
  CONSTRAINT `fk_withdrawals_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `balance_transfers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sender_phone` VARCHAR(20) NOT NULL,
  `receiver_phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_balance_transfers_sender` (`sender_phone`),
  KEY `idx_balance_transfers_receiver` (`receiver_phone`),
  CONSTRAINT `fk_balance_transfers_sender` FOREIGN KEY (`sender_phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_balance_transfers_receiver` FOREIGN KEY (`receiver_phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GAME RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS `wingo_rounds` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `game` VARCHAR(50) NOT NULL,
  `amount` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_wingo_rounds_game_status` (`game`,`status`),
  KEY `idx_wingo_rounds_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lotto_5d_rounds` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_lotto_5d_rounds_game_status` (`game`,`status`),
  KEY `idx_lotto_5d_rounds_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lotto_k3_rounds` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_lotto_k3_rounds_game_status` (`game`,`status`),
  KEY `idx_lotto_k3_rounds_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BETS & RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS `wingo_bets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT DEFAULT 0,
  `phone` VARCHAR(20) NOT NULL,
  `user_code` VARCHAR(50) NOT NULL,
  `invite_code` VARCHAR(50) NOT NULL,
  `round_id` INT DEFAULT 0,
  `level` INT DEFAULT 0,
  `stake` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `payout` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `game` VARCHAR(50) NOT NULL,
  `join_type` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `business_day` VARCHAR(50) DEFAULT '',
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_wingo_bets_phone_game` (`phone`,`game`),
  KEY `idx_wingo_bets_status_game` (`status`,`game`),
  KEY `idx_wingo_bets_round` (`round_id`),
  KEY `idx_wingo_bets_created_at` (`created_at`),
  CONSTRAINT `fk_wingo_bets_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lotto_5d_bets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT DEFAULT 0,
  `phone` VARCHAR(20) NOT NULL,
  `user_code` VARCHAR(50) NOT NULL,
  `invite_code` VARCHAR(50) NOT NULL,
  `round_id` INT DEFAULT 0,
  `level` INT DEFAULT 0,
  `stake` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `payout` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `game` INT DEFAULT 0,
  `join_type` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` VARCHAR(50) DEFAULT '0',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_lotto_5d_bets_phone_game` (`phone`,`game`),
  KEY `idx_lotto_5d_bets_status_game` (`status`,`game`),
  KEY `idx_lotto_5d_bets_round` (`round_id`),
  KEY `idx_lotto_5d_bets_created_at` (`created_at`),
  CONSTRAINT `fk_lotto_5d_bets_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lotto_k3_bets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT DEFAULT 0,
  `phone` VARCHAR(20) NOT NULL,
  `user_code` VARCHAR(50) NOT NULL,
  `invite_code` VARCHAR(50) NOT NULL,
  `round_id` INT DEFAULT 0,
  `level` INT DEFAULT 0,
  `stake` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `payout` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `game` INT DEFAULT 0,
  `join_type` VARCHAR(50) DEFAULT '',
  `bet_type` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` VARCHAR(50) DEFAULT '0',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_lotto_k3_bets_phone_game` (`phone`,`game`),
  KEY `idx_lotto_k3_bets_status_game` (`status`,`game`),
  KEY `idx_lotto_k3_bets_round` (`round_id`),
  KEY `idx_lotto_k3_bets_created_at` (`created_at`),
  CONSTRAINT `fk_lotto_k3_bets_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COMMISSIONS & REPORTING
-- ============================================
CREATE TABLE IF NOT EXISTS `commission_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `user_code` VARCHAR(50) NOT NULL,
  `invite_code` VARCHAR(50) NOT NULL,
  `f1` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `f2` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `f3` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `f4` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_commission_logs_phone` (`phone`),
  CONSTRAINT `fk_commission_logs_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `turnover` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `user_code` VARCHAR(50) NOT NULL,
  `invite_code` VARCHAR(50) NOT NULL,
  `daily_turnover` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total_turnover` DECIMAL(12,2) NOT NULL DEFAULT 0,
  UNIQUE KEY `uk_turnover_phone` (`phone`),
  CONSTRAINT `fk_turnover_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `salary_payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `type` VARCHAR(50) DEFAULT '',
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_salary_payments_phone` (`phone`),
  CONSTRAINT `fk_salary_payments_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PROMOTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS `red_envelopes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `envelope_code` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `is_used` TINYINT(1) NOT NULL DEFAULT 0,
  `quantity` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_red_envelopes_phone` (`phone`),
  KEY `idx_red_envelopes_status` (`status`),
  CONSTRAINT `fk_red_envelopes_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `red_envelope_usages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `used_by_phone` VARCHAR(20) NOT NULL,
  `envelope_code` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_red_envelope_usages_phone` (`phone`),
  KEY `idx_red_envelope_usages_used_by_phone` (`used_by_phone`),
  CONSTRAINT `fk_red_envelope_usages_phone` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_red_envelope_usages_used_by_phone` FOREIGN KEY (`used_by_phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `daily_checkins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `days` INT DEFAULT 0,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_daily_checkins_phone` (`phone`),
  CONSTRAINT `fk_daily_checkins_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `financial_ledger` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `counterparty_phone` VARCHAR(20) DEFAULT '',
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `type` VARCHAR(50) DEFAULT '',
  `created_at` BIGINT DEFAULT 0,
  KEY `idx_financial_ledger_phone` (`phone`),
  CONSTRAINT `fk_financial_ledger_user` FOREIGN KEY (`phone`) REFERENCES `app_users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
