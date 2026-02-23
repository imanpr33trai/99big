-- Best-practice schema derived from controllers/queries
-- MySQL 8+, InnoDB, utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- CORE USERS & AUTH
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `name_user` VARCHAR(100) DEFAULT '',
  `password` VARCHAR(255) NOT NULL,
  `plain_password` VARCHAR(255) DEFAULT '',
  `token` VARCHAR(255) DEFAULT '',
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) DEFAULT '',
  `ctv` INT DEFAULT 0,
  `veri` TINYINT(1) NOT NULL DEFAULT 0,
  `otp` VARCHAR(10) DEFAULT '',
  `time_otp` BIGINT DEFAULT 0,
  `ip_address` VARCHAR(50) DEFAULT '',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,
  `level` INT DEFAULT 0,
  `user_level` INT DEFAULT 0,
  `total_money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `roses_f1` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `roses_f` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `roses_today` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `rank` INT DEFAULT 0,
  `free_bonus` INT DEFAULT 0,
  `first_deposit` INT DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_users_phone` (`phone`),
  UNIQUE KEY `uk_users_code` (`code`),
  KEY `idx_users_token` (`token`),
  KEY `idx_users_invite` (`invite`),
  KEY `idx_users_ctv` (`ctv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `level` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `level` INT DEFAULT 0,
  `f1` DECIMAL(10,4) DEFAULT 0,
  `f2` DECIMAL(10,4) DEFAULT 0,
  `f3` DECIMAL(10,4) DEFAULT 0,
  `f4` DECIMAL(10,4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `wingo1` VARCHAR(50) DEFAULT '-1',
  `wingo3` VARCHAR(50) DEFAULT '-1',
  `wingo5` VARCHAR(50) DEFAULT '-1',
  `wingo10` VARCHAR(50) DEFAULT '-1',
  `k5d` VARCHAR(50) DEFAULT '-1',
  `k5d3` VARCHAR(50) DEFAULT '-1',
  `k5d5` VARCHAR(50) DEFAULT '-1',
  `k5d10` VARCHAR(50) DEFAULT '-1',
  `win_rate` INT DEFAULT 80,
  `telegram` VARCHAR(255) DEFAULT '',
  `cskh` VARCHAR(255) DEFAULT '',
  `app` VARCHAR(50) DEFAULT '#'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `point_list` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `money_us` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `telegram` VARCHAR(255) DEFAULT '',
  `total1` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total2` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total3` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total4` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total5` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total6` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total7` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `level` INT DEFAULT 0,
  UNIQUE KEY `uk_point_list_phone` (`phone`),
  CONSTRAINT `fk_point_list_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- WALLET & PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS `bank_recharge` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name_bank` VARCHAR(100) DEFAULT '',
  `name_user` VARCHAR(100) DEFAULT '',
  `stk` VARCHAR(50) DEFAULT '',
  `type` VARCHAR(50) DEFAULT '',
  `qr_code_image` VARCHAR(255) DEFAULT '',
  `time` BIGINT DEFAULT 0
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `recharge` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_order` VARCHAR(50) NOT NULL,
  `transaction_id` VARCHAR(100) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `type` VARCHAR(50) DEFAULT '',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `today` VARCHAR(50) DEFAULT '',
  `url` VARCHAR(255) DEFAULT '',
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `utr` VARCHAR(100) DEFAULT '',
  UNIQUE KEY `uk_recharge_id_order` (`id_order`),
  KEY `idx_recharge_phone_status` (`phone`,`status`),
  KEY `idx_recharge_time` (`time`),
  CONSTRAINT `fk_recharge_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_bank` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `name_bank` VARCHAR(100) DEFAULT '',
  `name_user` VARCHAR(100) DEFAULT '',
  `stk` VARCHAR(50) DEFAULT '',
  `ifsc` VARCHAR(20) DEFAULT '',
  `tp` VARCHAR(100) DEFAULT '',
  `email` VARCHAR(150) DEFAULT '',
  `sdt` VARCHAR(20) DEFAULT '',
  `tinh` VARCHAR(100) DEFAULT '',
  `chi_nhanh` VARCHAR(100) DEFAULT '',
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_bank_phone` (`phone`),
  KEY `idx_user_bank_stk` (`stk`),
  CONSTRAINT `fk_user_bank_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `withdraw` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_order` VARCHAR(50) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `stk` VARCHAR(50) DEFAULT '',
  `name_bank` VARCHAR(100) DEFAULT '',
  `ifsc` VARCHAR(100) DEFAULT '',
  `name_user` VARCHAR(100) DEFAULT '',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `today` VARCHAR(50) DEFAULT '',
  `remark` VARCHAR(255) DEFAULT '',
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_withdraw_id_order` (`id_order`),
  KEY `idx_withdraw_phone_status` (`phone`,`status`),
  KEY `idx_withdraw_time` (`time`),
  CONSTRAINT `fk_withdraw_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `balance_transfer` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sender_phone` VARCHAR(20) NOT NULL,
  `receiver_phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_balance_transfer_sender` (`sender_phone`),
  KEY `idx_balance_transfer_receiver` (`receiver_phone`),
  CONSTRAINT `fk_balance_transfer_sender` FOREIGN KEY (`sender_phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_balance_transfer_receiver` FOREIGN KEY (`receiver_phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GAME RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS `wingo` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `game` VARCHAR(50) NOT NULL,
  `amount` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_wingo_game_status` (`game`,`status`),
  KEY `idx_wingo_time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `5d` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_5d_game_status` (`game`,`status`),
  KEY `idx_5d_time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `k3` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_k3_game_status` (`game`,`status`),
  KEY `idx_k3_time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BETS & RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS `minutes_1` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_product` INT DEFAULT 0,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `stage` INT DEFAULT 0,
  `level` INT DEFAULT 0,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `get` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `game` VARCHAR(50) NOT NULL,
  `join_bet` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `today` VARCHAR(50) DEFAULT '',
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_minutes1_phone_game` (`phone`,`game`),
  KEY `idx_minutes1_status_game` (`status`,`game`),
  KEY `idx_minutes1_stage` (`stage`),
  KEY `idx_minutes1_time` (`time`),
  CONSTRAINT `fk_minutes1_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `result_5d` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_product` INT DEFAULT 0,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `stage` INT DEFAULT 0,
  `level` INT DEFAULT 0,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `get` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `game` INT DEFAULT 0,
  `join_bet` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` VARCHAR(50) DEFAULT '0',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_result5d_phone_game` (`phone`,`game`),
  KEY `idx_result5d_status_game` (`status`,`game`),
  KEY `idx_result5d_stage` (`stage`),
  KEY `idx_result5d_time` (`time`),
  CONSTRAINT `fk_result5d_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `result_k3` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_product` INT DEFAULT 0,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `stage` INT DEFAULT 0,
  `level` INT DEFAULT 0,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `get` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `game` INT DEFAULT 0,
  `join_bet` VARCHAR(50) DEFAULT '',
  `typeGame` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` VARCHAR(50) DEFAULT '0',
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_resultk3_phone_game` (`phone`,`game`),
  KEY `idx_resultk3_status_game` (`status`,`game`),
  KEY `idx_resultk3_stage` (`stage`),
  KEY `idx_resultk3_time` (`time`),
  CONSTRAINT `fk_resultk3_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COMMISSIONS & REPORTING
-- ============================================
CREATE TABLE IF NOT EXISTS `roses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `f1` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `f2` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `f3` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `f4` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_roses_phone` (`phone`),
  CONSTRAINT `fk_roses_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `turn_over` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `daily_turn_over` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total_turn_over` DECIMAL(12,2) NOT NULL DEFAULT 0,
  UNIQUE KEY `uk_turn_over_phone` (`phone`),
  CONSTRAINT `fk_turn_over_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `salary` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `type` VARCHAR(50) DEFAULT '',
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_salary_phone` (`phone`),
  CONSTRAINT `fk_salary_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PROMOTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS `redenvelopes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_redenvelope` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `used` TINYINT(1) NOT NULL DEFAULT 0,
  `amount` INT DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_redenvelopes_phone` (`phone`),
  KEY `idx_redenvelopes_status` (`status`),
  CONSTRAINT `fk_redenvelopes_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `redenvelopes_used` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `phone_used` VARCHAR(20) NOT NULL,
  `id_redenvelops` VARCHAR(50) NOT NULL,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_redenvelopes_used_phone` (`phone`),
  KEY `idx_redenvelopes_used_phone_used` (`phone_used`),
  CONSTRAINT `fk_redenvelopes_used_phone` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_redenvelopes_used_phone_used` FOREIGN KEY (`phone_used`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `check_in` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `days` INT DEFAULT 0,
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_check_in_phone` (`phone`),
  CONSTRAINT `fk_check_in_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `financial_details` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `phone_used` VARCHAR(20) DEFAULT '',
  `money` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `type` VARCHAR(50) DEFAULT '',
  `time` BIGINT DEFAULT 0,  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_financial_details_phone` (`phone`),
  CONSTRAINT `fk_financial_details_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
