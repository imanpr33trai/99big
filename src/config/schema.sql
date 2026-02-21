-- Schema for 99bigdaddy database

-- Table: wingo
CREATE TABLE IF NOT EXISTS `wingo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `game` VARCHAR(50) NOT NULL,
  `amount` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: 5d
CREATE TABLE IF NOT EXISTS `5d` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: k3
CREATE TABLE IF NOT EXISTS `k3` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `period` VARCHAR(50) NOT NULL,
  `result` VARCHAR(50) DEFAULT '0',
  `game` INT DEFAULT 0,
  `status` INT DEFAULT 0,
  `time` BIGINT DEFAULT 0
);

-- Table: level
CREATE TABLE IF NOT EXISTS `level` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `level` INT DEFAULT 0,
  `f1` DECIMAL(10,4) DEFAULT 0,
  `f2` DECIMAL(10,4) DEFAULT 0,
  `f3` DECIMAL(10,4) DEFAULT 0,
  `f4` DECIMAL(10,4) DEFAULT 0
);

-- Table: bank_recharge
CREATE TABLE IF NOT EXISTS `bank_recharge` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_bank` VARCHAR(100) DEFAULT '',
  `name_user` VARCHAR(100) DEFAULT '',
  `stk` VARCHAR(50) DEFAULT '',
  `type` VARCHAR(50) DEFAULT '',
  `time` BIGINT DEFAULT 0
);

-- Table: admin
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
  `win_rate` INT DEFAULT 80,
  `telegram` VARCHAR(255) DEFAULT '',
  `cskh` VARCHAR(255) DEFAULT '',
  `app` VARCHAR(50) DEFAULT '#'
);
