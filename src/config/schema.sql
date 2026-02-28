-- Schema for 99bigdaddy database
-- Run this file first to create all required tables

-- ============================================
-- DATA TYPE MIGRATION QUERIES (Run if tables already exist)
-- ============================================

-- Fix id_product in minutes_1 (INT -> VARCHAR)
ALTER TABLE `minutes_1` MODIFY COLUMN `id_product` VARCHAR(50) DEFAULT '';
ALTER TABLE `minutes_1` MODIFY COLUMN `stage` VARCHAR(50) DEFAULT '';

-- Fix stage in result_k3 (INT -> VARCHAR for large period values)
ALTER TABLE `result_k3` MODIFY COLUMN `stage` VARCHAR(50) DEFAULT '';

-- Fix ctv in users (INT -> VARCHAR to store phone numbers)
ALTER TABLE `users` MODIFY COLUMN `ctv` VARCHAR(20) DEFAULT '';

-- Add missing columns to admin table
ALTER TABLE `admin` ADD COLUMN IF NOT EXISTS `bs1` VARCHAR(50) DEFAULT '0';
ALTER TABLE `admin` ADD COLUMN IF NOT EXISTS `bs3` VARCHAR(50) DEFAULT '0';
ALTER TABLE `admin` ADD COLUMN IF NOT EXISTS `bs5` VARCHAR(50) DEFAULT '0';
ALTER TABLE `admin` ADD COLUMN IF NOT EXISTS `bs10` VARCHAR(50) DEFAULT '0';

-- ============================================
-- CORE GAME TABLES
-- ============================================

-- Table: wingo - Wingo game results
CREATE TABLE IF NOT EXISTS `wingo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `game` VARCHAR(50) NOT NULL,
  `amount` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: 5d - 5D lottery results (note: backticks required for table name starting with number)
CREATE TABLE IF NOT EXISTS `5d` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: k3 - K3 lottery results
CREATE TABLE IF NOT EXISTS `k3` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- ============================================
-- USER & AUTHENTICATION TABLES
-- ============================================

-- Table: users - User accounts
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `name_user` VARCHAR(100) DEFAULT '',
  `password` VARCHAR(255) NOT NULL,
  `plain_password` VARCHAR(255) DEFAULT '',
  `token` VARCHAR(255) DEFAULT '',
  `money` DECIMAL(10,2) DEFAULT 0,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `invite` VARCHAR(50) DEFAULT '',
  `ctv` VARCHAR(20) DEFAULT '',
  `veri` INT DEFAULT 0,
  `otp` VARCHAR(10) DEFAULT '',
  `time_otp` BIGINT DEFAULT 0,
  `ip_address` VARCHAR(50) DEFAULT '',
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0,
  `level` INT DEFAULT 0,
  `user_level` INT DEFAULT 0,
  `total_money` DECIMAL(10,2) DEFAULT 0,
  `roses_f1` DECIMAL(10,2) DEFAULT 0,
  `roses_f` DECIMAL(10,2) DEFAULT 0,
  `roses_today` DECIMAL(10,2) DEFAULT 0,
  `rank` INT DEFAULT 0,
  `free_bonus` INT DEFAULT 0,
  `first_deposit` INT DEFAULT 0
);

-- Table: level - Commission levels configuration
CREATE TABLE IF NOT EXISTS `level` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `level` INT DEFAULT 0,
  `f1` DECIMAL(10,4) DEFAULT 0,
  `f2` DECIMAL(10,4) DEFAULT 0,
  `f3` DECIMAL(10,4) DEFAULT 0,
  `f4` DECIMAL(10,4) DEFAULT 0
);

-- Table: roses - Commission records
CREATE TABLE IF NOT EXISTS `roses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `f1` DECIMAL(10,2) DEFAULT 0,
  `f2` DECIMAL(10,2) DEFAULT 0,
  `f3` DECIMAL(10,2) DEFAULT 0,
  `f4` DECIMAL(10,2) DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: turn_over - Turnover tracking
CREATE TABLE IF NOT EXISTS `turn_over` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `daily_turn_over` DECIMAL(10,2) DEFAULT 0,
  `total_turn_over` DECIMAL(10,2) DEFAULT 0
);

-- Table: point_list - User points
CREATE TABLE IF NOT EXISTS `point_list` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `money` DECIMAL(10,2) DEFAULT 0,
  `money_us` DECIMAL(10,2) DEFAULT 0,
  `telegram` VARCHAR(255) DEFAULT '',
  `total1` DECIMAL(10,2) DEFAULT 0,
  `total2` DECIMAL(10,2) DEFAULT 0,
  `total3` DECIMAL(10,2) DEFAULT 0,
  `total4` DECIMAL(10,2) DEFAULT 0,
  `total5` DECIMAL(10,2) DEFAULT 0,
  `total6` DECIMAL(10,2) DEFAULT 0,
  `total7` DECIMAL(10,2) DEFAULT 0,
  `level` INT DEFAULT 0
);

-- ============================================
-- WALLET & PAYMENT TABLES
-- ============================================

-- Table: bank_recharge - Bank/UPI recharge methods
CREATE TABLE IF NOT EXISTS `bank_recharge` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_bank` VARCHAR(100) DEFAULT '',
  `name_user` VARCHAR(100) DEFAULT '',
  `stk` VARCHAR(50) DEFAULT '',
  `type` VARCHAR(50) DEFAULT '',
  `qr_code_image` VARCHAR(255) DEFAULT '',
  `time` BIGINT DEFAULT 0
);

-- Table: recharge - Deposit records
CREATE TABLE IF NOT EXISTS `recharge` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_order` VARCHAR(50) NOT NULL,
  `transaction_id` VARCHAR(100) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `money` DECIMAL(10,2) DEFAULT 0,
  `type` VARCHAR(50) DEFAULT '',
  `status` INT DEFAULT 0,
  `today` VARCHAR(50) DEFAULT '',
  `url` VARCHAR(255) DEFAULT '',
  `time` BIGINT DEFAULT 0,
  `utr` VARCHAR(100) DEFAULT ''
);

-- Table: withdraw - Withdrawal records
CREATE TABLE IF NOT EXISTS `withdraw` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_order` VARCHAR(50) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `money` DECIMAL(10,2) DEFAULT 0,
  `stk` VARCHAR(50) DEFAULT '',
  `name_bank` VARCHAR(100) DEFAULT '',
  `ifsc` VARCHAR(100) DEFAULT '',
  `name_user` VARCHAR(100) DEFAULT '',
  `status` INT DEFAULT 0,
  `today` VARCHAR(50) DEFAULT '',
  `remark` VARCHAR(255) DEFAULT '',
  `time` BIGINT DEFAULT 0
);

-- Table: user_bank - User bank details
CREATE TABLE IF NOT EXISTS `user_bank` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
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
  `time` BIGINT DEFAULT 0
);

-- Table: balance_transfer - Balance transfer records
CREATE TABLE IF NOT EXISTS `balance_transfer` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_phone` VARCHAR(20) NOT NULL,
  `receiver_phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(10,2) DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- ============================================
-- BET & RESULT TABLES
-- ============================================

-- Table: minutes_1 - Wingo bet records (1 minute)
CREATE TABLE IF NOT EXISTS `minutes_1` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_product` VARCHAR(50) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `stage` VARCHAR(50) DEFAULT 0,
  `level` INT DEFAULT 0,
  `money` DECIMAL(10,2) DEFAULT 0,
  `price` DECIMAL(10,2) DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(10,2) DEFAULT 0,
  `get` DECIMAL(10,2) DEFAULT 0,
  `game` VARCHAR(50) NOT NULL,
  `join_bet` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `today` VARCHAR(50) DEFAULT '',
  `time` BIGINT DEFAULT 0
);

-- Table: result_5d - 5D bet results
CREATE TABLE IF NOT EXISTS `result_5d` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_product` VARCHAR(50) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `stage` INT DEFAULT 0,
  `level` INT DEFAULT 0,
  `money` DECIMAL(10,2) DEFAULT 0,
  `price` DECIMAL(10,2) DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(10,2) DEFAULT 0,
  `get` DECIMAL(10,2) DEFAULT 0,
  `game` INT DEFAULT 0,
  `join_bet` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` VARCHAR(50) DEFAULT '0',
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: result_k3 - K3 bet results
CREATE TABLE IF NOT EXISTS `result_k3` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_product` VARCHAR(50) DEFAULT '',
  `phone` VARCHAR(20) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `invite` VARCHAR(50) NOT NULL,
  `stage` VARCHAR(50) DEFAULT '',
  `level` INT DEFAULT 0,
  `money` DECIMAL(10,2) DEFAULT 0,
  `price` DECIMAL(10,2) DEFAULT 0,
  `amount` INT DEFAULT 0,
  `fee` DECIMAL(10,2) DEFAULT 0,
  `get` DECIMAL(10,2) DEFAULT 0,
  `game` INT DEFAULT 0,
  `join_bet` VARCHAR(50) DEFAULT '',
  `typeGame` VARCHAR(50) DEFAULT '',
  `bet` VARCHAR(50) DEFAULT '',
  `result` VARCHAR(50) DEFAULT '0',
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- ============================================
-- ADMIN & MANAGEMENT TABLES
-- ============================================

-- Table: admin - Admin settings
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `wingo1` VARCHAR(50) DEFAULT '-1',
  `wingo3` VARCHAR(50) DEFAULT '-1',
  `wingo5` VARCHAR(50) DEFAULT '-1',
  `wingo10` VARCHAR(50) DEFAULT '-1',
  `k5d` VARCHAR(50) DEFAULT '-1',
  `k5d3` VARCHAR(50) DEFAULT '-1',
  `k5d5` VARCHAR(50) DEFAULT '-1',
  `k5d10` VARCHAR(50) DEFAULT '-1',
  `bs1` VARCHAR(50) DEFAULT '0',
  `bs3` VARCHAR(50) DEFAULT '0',
  `bs5` VARCHAR(50) DEFAULT '0',
  `bs10` VARCHAR(50) DEFAULT '0',
  `win_rate` INT DEFAULT 80,
  `telegram` VARCHAR(255) DEFAULT '',
  `cskh` VARCHAR(255) DEFAULT '',
  `app` VARCHAR(50) DEFAULT '#'
);

-- Table: salary - Salary/commission records
CREATE TABLE IF NOT EXISTS `salary` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(10,2) DEFAULT 0,
  `type` VARCHAR(50) DEFAULT '',
  `time` BIGINT DEFAULT 0
);

-- ============================================
-- PROMOTIONAL TABLES
-- ============================================

-- Table: redenvelopes - Red envelope bonuses
CREATE TABLE IF NOT EXISTS `redenvelopes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_redenvelope` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `money` DECIMAL(10,2) DEFAULT 0,
  `used` INT DEFAULT 0,
  `amount` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: redenvelopes_used - Red envelope usage
CREATE TABLE IF NOT EXISTS `redenvelopes_used` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `phone_used` VARCHAR(20) NOT NULL,
  `id_redenvelops` VARCHAR(50) NOT NULL,
  `money` DECIMAL(10,2) DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: check_in - Daily check-in records
CREATE TABLE IF NOT EXISTS `check_in` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `days` INT DEFAULT 0,
  `money` DECIMAL(10,2) DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- ============================================
-- ADDITIONAL TABLES
-- ============================================

-- Table: financial_details - Financial transaction log
CREATE TABLE IF NOT EXISTS `financial_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL,
  `phone_used` VARCHAR(20) DEFAULT '',
  `money` DECIMAL(10,2) DEFAULT 0,
  `type` VARCHAR(50) DEFAULT '',
  `time` BIGINT DEFAULT 0
);
