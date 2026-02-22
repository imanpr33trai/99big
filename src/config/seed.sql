-- Seed Data for 99bigdaddy database
-- Run this AFTER schema.sql to populate initial data

-- ============================================
-- ADMIN SETTINGS
-- ============================================
INSERT INTO `admin` (`id`, `wingo1`, `wingo3`, `wingo5`, `wingo10`, `k5d`, `k5d3`, `k5d5`, `k5d10`, `win_rate`, `telegram`, `cskh`, `app`) 
VALUES (1, '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', 80, 'https://t.me/dreamsister', 'https://t.me/ChenQiaoYing', '#');

-- ============================================
-- COMMISSION LEVELS
-- ============================================
INSERT INTO `level` (`id`, `level`, `f1`, `f2`, `f3`, `f4`) VALUES 
(1, 0, 0.6, 0.18, 0.054, 0.0162),
(2, 1, 0.7, 0.21, 0.063, 0.0189),
(3, 2, 0.75, 0.225, 0.0675, 0.0203),
(4, 3, 0.8, 0.24, 0.072, 0.0216),
(5, 4, 0.85, 0.255, 0.0765, 0.023),
(6, 5, 0.9, 0.27, 0.081, 0.0243),
(7, 6, 1.0, 0.3, 0.09, 0.027);

-- ============================================
-- BANK RECHARGE METHODS
-- ============================================
INSERT INTO `bank_recharge` (`id`, `name_bank`, `name_user`, `stk`, `type`, `time`) VALUES 
(1, 'MB BANK', 'NGUYEN NHAT LONG', '0800103725300', 'bank', UNIX_TIMESTAMP() * 1000),
(2, 'MOMO', 'NGUYEN NHAT LONG', '387633464', 'momo', UNIX_TIMESTAMP() * 1000);

-- ============================================
-- WINGO GAME DATA (with status=0 for active games)
-- ============================================
-- Wingo 1 minute
INSERT INTO `wingo` (`period`, `game`, `amount`, `status`, `time`) VALUES 
('20240101001', 'wingo', 0, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', 'wingo', 0, 0, UNIX_TIMESTAMP() * 1000);

-- Wingo 3 minute
INSERT INTO `wingo` (`period`, `game`, `amount`, `status`, `time`) VALUES 
('20240101001', 'wingo3', 0, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', 'wingo3', 0, 0, UNIX_TIMESTAMP() * 1000);

-- Wingo 5 minute
INSERT INTO `wingo` (`period`, `game`, `amount`, `status`, `time`) VALUES 
('20240101001', 'wingo5', 0, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', 'wingo5', 0, 0, UNIX_TIMESTAMP() * 1000);

-- Wingo 10 minute
INSERT INTO `wingo` (`period`, `game`, `amount`, `status`, `time`) VALUES 
('20240101001', 'wingo10', 0, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', 'wingo10', 0, 0, UNIX_TIMESTAMP() * 1000);

-- ============================================
-- 5D GAME DATA (with status=0 for active games)
-- ============================================
INSERT INTO `5d` (`period`, `result`, `game`, `status`, `time`) VALUES 
('20240101001', '0', 1, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', '0', 1, 0, UNIX_TIMESTAMP() * 1000),
('20240101001', '0', 3, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', '0', 3, UNIX_TIMESTAMP() * 1000),
('20240101001', '0', 5, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', '0', 5, 0, UNIX_TIMESTAMP() * 1000),
('20240101001', '0', 10, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', '0', 10, 0, UNIX_TIMESTAMP() * 1000);

-- ============================================
-- K3 GAME DATA (with status=0 for active games)
-- ============================================
INSERT INTO `k3` (`period`, `result`, `game`, `status`, `time`) VALUES 
('20240101001', '0', 1, 0, UNIX_TIMESTAMP() * 1000),
('20240101002', '0', 1, 0, UNIX_TIMESTAMP() * 1000);

-- ============================================
-- DEFAULT ADMIN USER (optional - for testing)
-- ============================================
-- Phone: 9876543210, Password: admin123 (hashed with md5)
-- INSERT INTO `users` (`phone`, `name_user`, `password`, `plain_password`, `money`, `code`, `invite`, `veri`, `user_level`, `time`) 
-- VALUES ('9876543210', 'Admin', '0192023a7bbd73250516f069df18b500', 'admin123', 10000, 'ADM001', '', 1, 6, UNIX_TIMESTAMP() * 1000);
