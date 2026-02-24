# All SQL Queries

This file lists SQL queries found in controllers. Under each original query, a renamed-schema version is provided (best-effort translation).

## Query 1
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
INSERT INTO recharge SET 
            id_order = ?,
            transaction_id = ?,
            phone = ?,
            money = ?,
            type = ?,
            status = ?,
            today = ?,
            url = ?,
            time = ?
```

New (renamed schema)
```sql
INSERT INTO deposits SET 
            order_id = ?,
            transaction_id = ?,
            phone = ?,
            balance = ?,
            method = ?,
            status = ?,
            business_day = ?,
            payment_url = ?,
            registered_at = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 2
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
INSERT INTO recharge SET 
        id_order = ?,
        transaction_id = ?,
        phone = ?,
        money = ?,
        type = ?,
        status = ?,
        today = ?,
        url = ?,
        time = ?
```

New (renamed schema)
```sql
INSERT INTO deposits SET 
        order_id = ?,
        transaction_id = ?,
        phone = ?,
        balance = ?,
        method = ?,
        status = ?,
        business_day = ?,
        payment_url = ?,
        registered_at = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 3
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
INSERT INTO user_bank SET 
        phone = ?,
        name_bank = ?,
        name_user = ?,
        stk = ?,
        tp = ?,
        email = ?,
        sdt = ?,
        tinh = ?,
        chi_nhanh = ?,
        time = ?
```

New (renamed schema)
```sql
INSERT INTO user_bank_accounts SET 
        phone = ?,
        bank_name = ?,
        account_name = ?,
        account_number = ?,
        city = ?,
        email = ?,
        phone_alt = ?,
        state = ?,
        branch = ?,
        registered_at = ?
```
Relations
```text
user_bank_accounts.phone -> app_users.phone
```

## Query 4
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
INSERT INTO withdraw SET 
                    id_order = ?,
                    phone = ?,
                    money = ?,
                    stk = ?,
                    name_bank = ?,
                    name_user = ?,
                    status = ?,
                    today = ?,
                    time = ?
```

New (renamed schema)
```sql
INSERT INTO withdrawals SET 
                    order_id = ?,
                    phone = ?,
                    balance = ?,
                    account_number = ?,
                    bank_name = ?,
                    account_name = ?,
                    status = ?,
                    business_day = ?,
                    registered_at = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 5
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM users WHERE phone = ? ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE phone = ? ORDER BY id DESC
```

## Query 6
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE recharge SET status = 1 WHERE id_order = ?
```

New (renamed schema)
```sql
UPDATE deposits SET status = 1 WHERE order_id = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 7
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM recharge WHERE id_order = ?
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE order_id = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 8
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE recharge SET status = 2 WHERE id = ?
```

New (renamed schema)
```sql
UPDATE deposits SET status = 2 WHERE id = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 9
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM users WHERE `token` = ? AND `password` = ? AND otp = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE `auth_token` = ? AND `password_hash` = ? AND otp_code = ?
```

## Query 10
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE `auth_token` = ?
```

## Query 11
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE users SET otp = ?, time_otp = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET otp_code = ?, otp_expires_at = ? WHERE phone = ?
```

## Query 12
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM recharge WHERE `phone` = ? AND status = 1
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE `phone` = ? AND status = 1
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 13
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM withdraw WHERE `phone` = ? AND status = 1
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE `phone` = ? AND status = 1
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 14
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE users SET name_user = ? WHERE `token` = ?
```

New (renamed schema)
```sql
UPDATE app_users SET account_name = ? WHERE `auth_token` = ?
```

## Query 15
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM users WHERE `token` = ? AND `password` = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE `auth_token` = ? AND `password_hash` = ?
```

## Query 16
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE users SET otp = ?, password = ? WHERE `token` = ?
```

New (renamed schema)
```sql
UPDATE app_users SET otp_code = ?, password_hash = ? WHERE `auth_token` = ?
```

## Query 17
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM point_list WHERE `phone` = ?
```

New (renamed schema)
```sql
SELECT * FROM user_points WHERE `phone` = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 18
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE users SET money = money + ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET balance = balance + ? WHERE phone = ?
```

## Query 19
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE point_list SET total1 = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET total_1 = ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 20
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE point_list SET total2 = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET total_2 = ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 21
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE point_list SET total3 = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET total_3 = ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 22
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE point_list SET total4 = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET total_4 = ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 23
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE point_list SET total5 = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET total_5 = ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 24
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE point_list SET total6 = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET total_6 = ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 25
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE point_list SET total7 = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET total_7 = ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 26
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `phone`, `code`,`invite`, `roses_f`, `roses_f1`, `roses_today` FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`,`referred_by`, `commission_total`, `commission_f1`, `commission_today` FROM app_users WHERE `auth_token` = ?
```

## Query 27
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM level
```

New (renamed schema)
```sql
SELECT * FROM commission_levels
```

## Query 28
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`,`referred_by`, `registered_at` FROM app_users WHERE `referred_by` = ?
```

## Query 29
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`,`referred_by` FROM app_users WHERE `referred_by` = ?
```

## Query 30
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ?
```

## Query 31
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `id_user`, `name_user`,`status`, `time` FROM users WHERE `invite` = ? ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT `id_user`, `account_name`,`status`, `registered_at` FROM app_users WHERE `referred_by` = ? ORDER BY id DESC
```

## Query 32
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `id_user`, `phone`, `time` FROM users WHERE `invite` = ? ORDER BY id DESC LIMIT 100
```

New (renamed schema)
```sql
SELECT `id_user`, `phone`, `registered_at` FROM app_users WHERE `referred_by` = ? ORDER BY id DESC LIMIT 100
```

## Query 33
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `f1`, `time` FROM roses WHERE `invite` = ? ORDER BY id DESC LIMIT 100
```

New (renamed schema)
```sql
SELECT `f1`, `registered_at` FROM commission_logs WHERE `referred_by` = ? ORDER BY id DESC LIMIT 100
```
Relations
```text
commission_logs.phone -> app_users.phone
```

## Query 34
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE recharge SET status = 2 WHERE phone = ? AND id_order = ? AND status = ?
```

New (renamed schema)
```sql
UPDATE deposits SET status = 2 WHERE phone = ? AND order_id = ? AND status = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 35
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ? AND status = ?
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ? AND status = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 36
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM user_bank WHERE stk = ?
```

New (renamed schema)
```sql
SELECT * FROM user_bank_accounts WHERE account_number = ?
```
Relations
```text
user_bank_accounts.phone -> app_users.phone
```

## Query 37
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM user_bank WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM user_bank_accounts WHERE phone = ?
```
Relations
```text
user_bank_accounts.phone -> app_users.phone
```

## Query 38
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `phone`, `code`,`invite`, `money` FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`,`referred_by`, `balance` FROM app_users WHERE `auth_token` = ?
```

## Query 39
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ? AND today = ? AND status = 1
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ? AND business_day = ? AND status = 1
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 40
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM minutes_1 WHERE phone = ? AND today = ?
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE phone = ? AND business_day = ?
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 41
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `phone`, `code`,`invite`, `money` FROM users WHERE `token` = ? AND password = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`,`referred_by`, `balance` FROM app_users WHERE `auth_token` = ? AND password_hash = ?
```

## Query 42
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM user_bank WHERE `phone` = ?
```

New (renamed schema)
```sql
SELECT * FROM user_bank_accounts WHERE `phone` = ?
```
Relations
```text
user_bank_accounts.phone -> app_users.phone
```

## Query 43
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM withdraw WHERE `phone` = ? AND today = ?
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE `phone` = ? AND business_day = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 44
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE users SET money = money - ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET balance = balance - ? WHERE phone = ?
```

## Query 45
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM bank_recharge
```

New (renamed schema)
```sql
SELECT * FROM bank_accounts
```

## Query 46
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ? ORDER BY id DESC
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 47
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT `phone`, `code`,`invite`, `level` FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`,`referred_by`, `commission_levels` FROM app_users WHERE `auth_token` = ?
```

## Query 48
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE phone = ? ORDER BY id DESC
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 49
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM redenvelopes WHERE id_redenvelope = ?
```

New (renamed schema)
```sql
SELECT * FROM red_envelopes WHERE envelope_code = ?
```
Relations
```text
red_envelopes.phone -> app_users.phone
```

## Query 50
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE redenvelopes SET used = ?, status = ? WHERE `id_redenvelope` = ?
```

New (renamed schema)
```sql
UPDATE red_envelopes SET is_used = ?, status = ? WHERE `envelope_code` = ?
```
Relations
```text
red_envelopes.phone -> app_users.phone
```

## Query 51
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE users SET money = money + ? WHERE `phone` = ?
```

New (renamed schema)
```sql
UPDATE app_users SET balance = balance + ? WHERE `phone` = ?
```

## Query 52
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
INSERT INTO redenvelopes_used SET phone = ?, phone_used = ?, id_redenvelops = ?, money = ?, `time` = ?
```

New (renamed schema)
```sql
INSERT INTO red_envelope_usages SET phone = ?, counterparty_phone = ?, envelope_code = ?, balance = ?, `registered_at` = ?
```
Relations
```text
red_envelope_usages.phone -> app_users.phone
red_envelope_usages.used_by_phone -> app_users.phone
```

## Query 53
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET balance = balance + ?, total_deposit = total_deposit + ? WHERE phone = ?
```

## Query 54
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
SELECT * FROM recharge WHERE `utr` = ?
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE `utr` = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 55
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController1.js`

Old
```sql
UPDATE recharge SET utr = ? WHERE phone = ? AND id_order = ?
```

New (renamed schema)
```sql
UPDATE deposits SET utr = ? WHERE phone = ? AND order_id = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 56
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM `wingo` WHERE `game` = "wingo" ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM `wingo_rounds` WHERE `game` = "wingo_rounds" ORDER BY `id` DESC LIMIT 2
```

## Query 57
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM `wingo` WHERE `game` = "wingo3" ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM `wingo_rounds` WHERE `game` = "wingo3" ORDER BY `id` DESC LIMIT 2
```

## Query 58
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM `wingo` WHERE `game` = "wingo5" ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM `wingo_rounds` WHERE `game` = "wingo5" ORDER BY `id` DESC LIMIT 2
```

## Query 59
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM `wingo` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM `wingo_rounds` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2
```

## Query 60
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM 5d WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_rounds WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2
```

## Query 61
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM k3 WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_rounds WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2
```

## Query 62
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM 5d WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_rounds WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2
```

## Query 63
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM k3 WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_rounds WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2
```

## Query 64
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM 5d WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_rounds WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2
```

## Query 65
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM k3 WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_rounds WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2
```

## Query 66
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM 5d WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_rounds WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2
```

## Query 67
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
SELECT * FROM k3 WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_rounds WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2
```

## Query 68
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
UPDATE users SET roses_today = ?
```

New (renamed schema)
```sql
UPDATE app_users SET commission_today = ?
```

## Query 69
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/cronJobContronler.js`

Old
```sql
UPDATE point_list SET money = ?
```

New (renamed schema)
```sql
UPDATE user_points SET balance = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 70
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController12.js`

Old
```sql
INSERT INTO withdraw SET 
                    id_order = ?,
                    phone = ?,
                    money = ?,
                    stk = ?,
                    name_bank = ?,
                    ifsc = ?,
                    name_user = ?,
                    status = ?,
                    today = ?,
                    time = ?
```

New (renamed schema)
```sql
INSERT INTO withdrawals SET 
                    order_id = ?,
                    phone = ?,
                    balance = ?,
                    account_number = ?,
                    bank_name = ?,
                    ifsc = ?,
                    account_name = ?,
                    status = ?,
                    business_day = ?,
                    registered_at = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 71
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM minutes_1 WHERE game = "${game}" AND status = 0 AND level = 0 ORDER BY id ASC
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE game = "${game}" AND status = 0 AND commission_levels = 0 ORDER BY id ASC
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 72
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT * FROM wingo_rounds WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

## Query 73
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10
```

New (renamed schema)
```sql
SELECT * FROM wingo_rounds WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10
```

## Query 74
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM admin
```

New (renamed schema)
```sql
SELECT * FROM system_settings
```

## Query 75
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE veri = 1 AND level != 2 ORDER BY id DESC LIMIT ${pageno}, ${limit}
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE is_verified = 1 AND commission_levels != 2 ORDER BY id DESC LIMIT ${pageno}, ${limit}
```

## Query 76
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE veri = 1 AND level != 2
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE is_verified = 1 AND commission_levels != 2
```

## Query 77
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE veri = 1 AND level = 2 ORDER BY id DESC LIMIT ${pageno}, ${pageto}
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE is_verified = 1 AND commission_levels = 2 ORDER BY id DESC LIMIT ${pageno}, ${pageto}
```

## Query 78
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(money) as total FROM minutes_1 WHERE status = 1
```

New (renamed schema)
```sql
SELECT SUM(balance) as total FROM wingo_bets WHERE status = 1
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 79
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(money) as total FROM minutes_1 WHERE status = 2
```

New (renamed schema)
```sql
SELECT SUM(balance) as total FROM wingo_bets WHERE status = 2
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 80
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT COUNT(id) as total FROM users WHERE status = 1
```

New (renamed schema)
```sql
SELECT COUNT(id) as total FROM app_users WHERE status = 1
```

## Query 81
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT COUNT(id) as total FROM users WHERE status = 0
```

New (renamed schema)
```sql
SELECT COUNT(id) as total FROM app_users WHERE status = 0
```

## Query 82
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(money) as total FROM recharge WHERE status = 1
```

New (renamed schema)
```sql
SELECT SUM(balance) as total FROM deposits WHERE status = 1
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 83
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(money) as total FROM withdraw WHERE status = 1
```

New (renamed schema)
```sql
SELECT SUM(balance) as total FROM withdrawals WHERE status = 1
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 84
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(money) as total FROM recharge WHERE status = 1 AND today = ?
```

New (renamed schema)
```sql
SELECT SUM(balance) as total FROM deposits WHERE status = 1 AND business_day = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 85
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(money) as total FROM withdraw WHERE status = 1 AND today = ?
```

New (renamed schema)
```sql
SELECT SUM(balance) as total FROM withdrawals WHERE status = 1 AND business_day = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 86
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE admin SET ${game} = ?
```

New (renamed schema)
```sql
UPDATE system_settings SET ${game} = ?
```

## Query 87
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE admin SET ${bs} = ?
```

New (renamed schema)
```sql
UPDATE system_settings SET ${bs} = ?
```

## Query 88
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE recharge SET status = 1 WHERE id = ?
```

New (renamed schema)
```sql
UPDATE deposits SET status = 1 WHERE id = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 89
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM recharge WHERE id = ?
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE id = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 90
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE withdraw SET status = 1 WHERE id = ?
```

New (renamed schema)
```sql
UPDATE withdrawals SET status = 1 WHERE id = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 91
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM withdraw WHERE id = ?
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE id = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 92
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE withdraw SET status = 2, remark = ? WHERE id = ?
```

New (renamed schema)
```sql
UPDATE withdrawals SET status = 2, remark = ? WHERE id = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 93
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE bank_recharge SET name_bank = ?, name_user = ?, stk = ? WHERE type = 'bank'
```

New (renamed schema)
```sql
UPDATE bank_accounts SET bank_name = ?, account_name = ?, account_number = ? WHERE method = 'bank'
```

## Query 94
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM bank_recharge WHERE type = 'momo'
```

New (renamed schema)
```sql
SELECT * FROM bank_accounts WHERE method = 'momo'
```

## Query 95
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ? WHERE type = 'upi'
```

New (renamed schema)
```sql
UPDATE bank_accounts SET bank_name = ?, account_name = ?, account_number = ?, qr_code_url = ? WHERE method = 'upi'
```

## Query 96
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE admin SET telegram = ?, cskh = ?, app = ?
```

New (renamed schema)
```sql
UPDATE system_settings SET telegram = ?, cskh = ?, app = ?
```

## Query 97
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE users SET status = 1 WHERE id = ?
```

New (renamed schema)
```sql
UPDATE app_users SET status = 1 WHERE id = ?
```

## Query 98
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE users SET status = 2 WHERE id = ?
```

New (renamed schema)
```sql
UPDATE app_users SET status = 2 WHERE id = ?
```

## Query 99
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE point_list SET money = money + ? WHERE level = 2
```

New (renamed schema)
```sql
UPDATE user_points SET balance = balance + ? WHERE commission_levels = 2
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 100
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE point_list SET money = money - ? WHERE level = 2
```

New (renamed schema)
```sql
UPDATE user_points SET balance = balance - ? WHERE commission_levels = 2
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 101
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE point_list SET money_us = money_us + ? WHERE level = 2
```

New (renamed schema)
```sql
UPDATE user_points SET balance_us = balance_us + ? WHERE commission_levels = 2
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 102
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE point_list SET money_us = money_us - ? WHERE level = 2
```

New (renamed schema)
```sql
UPDATE user_points SET balance_us = balance_us - ? WHERE commission_levels = 2
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 103
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE point_list SET money = money + ? WHERE level = 2 and phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET balance = balance + ? WHERE commission_levels = 2 and phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 104
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE point_list SET money = money - ? WHERE level = 2 and phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET balance = balance - ? WHERE commission_levels = 2 and phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 105
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE point_list SET money_us = money_us + ? WHERE level = 2 and phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET balance_us = balance_us + ? WHERE commission_levels = 2 and phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 106
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE point_list SET money_us = money_us - ? WHERE level = 2 and phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET balance_us = balance_us - ? WHERE commission_levels = 2 and phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 107
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
INSERT INTO redenvelopes SET id_redenvelope = ?, phone = ?, money = ?, used = ?, amount = ?, status = ?, time = ?
```

New (renamed schema)
```sql
INSERT INTO red_envelopes SET envelope_code = ?, phone = ?, balance = ?, is_used = ?, amount = ?, status = ?, registered_at = ?
```
Relations
```text
red_envelopes.phone -> app_users.phone
```

## Query 108
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE id_user = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE id_user = ?
```

## Query 109
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE users SET money = money + ? WHERE id_user = ?
```

New (renamed schema)
```sql
UPDATE app_users SET balance = balance + ? WHERE id_user = ?
```

## Query 110
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE users SET money = money - ? WHERE id_user = ?
```

New (renamed schema)
```sql
UPDATE app_users SET balance = balance - ? WHERE id_user = ?
```

## Query 111
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
INSERT INTO users SET 
            id_user = ?,
            phone = ?,
            name_user = ?,
            password = ?,
            money = ?,
            level = ?,
            code = ?,
            invite = ?,
            veri = ?,
            ip_address = ?,
            status = ?,
            time = ?
```

New (renamed schema)
```sql
INSERT INTO app_users SET 
            id_user = ?,
            phone = ?,
            account_name = ?,
            password_hash = ?,
            balance = ?,
            commission_levels = ?,
            invite_code = ?,
            referred_by = ?,
            is_verified = ?,
            last_ip = ?,
            status = ?,
            registered_at = ?
```

## Query 112
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE phone = ?
```

## Query 113
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT 10
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ? ORDER BY id DESC LIMIT 10
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 114
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT 10
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE phone = ? ORDER BY id DESC LIMIT 10
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 115
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit}
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit}
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 116
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 117
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit}
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit}
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 118
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM withdraw WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE phone = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 119
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM redenvelopes_used WHERE phone_used = ? ORDER BY id DESC LIMIT ${pageno}, ${limit}
```

New (renamed schema)
```sql
SELECT * FROM red_envelope_usages WHERE counterparty_phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit}
```
Relations
```text
red_envelope_usages.phone -> app_users.phone
red_envelope_usages.used_by_phone -> app_users.phone
```

## Query 120
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM redenvelopes_used WHERE phone_used = ?
```

New (renamed schema)
```sql
SELECT * FROM red_envelope_usages WHERE counterparty_phone = ?
```
Relations
```text
red_envelope_usages.phone -> app_users.phone
red_envelope_usages.used_by_phone -> app_users.phone
```

## Query 121
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM minutes_1 WHERE phone = ? AND status != 0 ORDER BY id DESC LIMIT ${pageno}, ${limit}
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE phone = ? AND status != 0 ORDER BY id DESC LIMIT ${pageno}, ${limit}
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 122
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM minutes_1 WHERE phone = ? AND status != 0
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE phone = ? AND status != 0
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 123
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM 5d WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_rounds WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10
```

## Query 124
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT period FROM 5d WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT period FROM lotto_5d_rounds WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

## Query 125
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT phone, money, price, amount, bet FROM result_5d WHERE status = 0 AND level = 0 AND game = '${game}' ORDER BY id ASC
```

New (renamed schema)
```sql
SELECT phone, balance, price, amount, bet FROM lotto_5d_bets WHERE status = 0 AND commission_levels = 0 AND game = '${game}' ORDER BY id ASC
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 126
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT ${join} FROM admin
```

New (renamed schema)
```sql
SELECT ${join} FROM system_settings
```

## Query 127
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM k3 WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_rounds WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10
```

## Query 128
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT period FROM k3 WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT period FROM lotto_k3_rounds WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

## Query 129
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT phone, money, price, typeGame, amount, bet FROM result_k3 WHERE status = 0 AND level = 0 AND game = '${game}' ORDER BY id ASC
```

New (renamed schema)
```sql
SELECT phone, balance, price, bet_type, amount, bet FROM lotto_k3_bets WHERE status = 0 AND commission_levels = 0 AND game = '${game}' ORDER BY id ASC
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 130
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE admin SET ${join} = ?
```

New (renamed schema)
```sql
UPDATE system_settings SET ${join} = ?
```

## Query 131
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM salary ORDER BY time DESC
```

New (renamed schema)
```sql
SELECT * FROM salary_payments ORDER BY registered_at DESC
```
Relations
```text
salary_payments.phone -> app_users.phone
```

## Query 132
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT invite FROM users WHERE phone = ?
```

New (renamed schema)
```sql
SELECT referred_by FROM app_users WHERE phone = ?
```

## Query 133
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT free_bonus FROM users WHERE phone = ?
```

New (renamed schema)
```sql
SELECT free_bonus FROM app_users WHERE phone = ?
```

## Query 134
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
t exist, return an error
      return res.status(400).json({
        message: "ERROR!!! User with the provided phone number does not exist.",
        status: false,
      });
    }

    // If user exists, update the
```

New (renamed schema)
```sql
t exist, return an error
      return res.status(400).json({
        message: "ERROR!!! User with the provided phone number does not exist.",
        status: false,
      });
    }

    // If user exists, update the
```

## Query 135
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
table
    const updateUserQuery = "UPDATE `users` SET `money` = `money` + ? WHERE phone = ?";
    await connection.execute(updateUserQuery, [amount, phone]);

    // Insert record into
```

New (renamed schema)
```sql
table
    const updateUserQuery = "UPDATE `app_users` SET `balance` = `balance` + ? WHERE phone = ?";
    await connection.execute(updateUserQuery, [amount, phone]);

    // Insert record into
```

## Query 136
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `token`,`level`, `status` FROM `users` WHERE `token` = ? AND veri = 1
```

New (renamed schema)
```sql
SELECT `auth_token`,`commission_levels`, `status` FROM `app_users` WHERE `auth_token` = ? AND is_verified = 1
```

## Query 137
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT phone FROM users WHERE code = ?
```

New (renamed schema)
```sql
SELECT phone FROM app_users WHERE invite_code = ?
```

## Query 138
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT COUNT(*) AS userCount FROM users WHERE invite = ?
```

New (renamed schema)
```sql
SELECT COUNT(*) AS userCount FROM app_users WHERE referred_by = ?
```

## Query 139
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE invite = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE referred_by = ?
```

## Query 140
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(`money`) as total FROM recharge WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT SUM(`balance`) as total FROM deposits WHERE phone = ? AND status = 1
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 141
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(`money`) as total FROM withdraw WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT SUM(`balance`) as total FROM withdrawals WHERE phone = ? AND status = 1
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 142
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `telegram` FROM point_list WHERE phone = ?
```

New (renamed schema)
```sql
SELECT `telegram` FROM user_points WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 143
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `phone` FROM users WHERE code = ?
```

New (renamed schema)
```sql
SELECT `phone` FROM app_users WHERE invite_code = ?
```

## Query 144
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM recharge WHERE status = 0
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE status = 0
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 145
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM recharge WHERE status != 0
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE status != 0
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 146
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM withdraw WHERE status = 0
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE status = 0
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 147
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM withdraw WHERE status != 0
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE status != 0
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 148
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE code = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE invite_code = ?
```

## Query 149
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE users SET first_deposit = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET first_deposit_flag = ? WHERE phone = ?
```

## Query 150
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE users SET free_bonus = free_bonus - ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET free_bonus = free_bonus - ? WHERE phone = ?
```

## Query 151
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE users SET free_bonus = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET free_bonus = ? WHERE phone = ?
```

## Query 152
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
INSERT INTO salary (phone, amount, type, time) VALUES (?, ?, ?, ?)
```

New (renamed schema)
```sql
INSERT INTO salary_payments (phone, amount, method, registered_at) VALUES (?, ?, ?, ?)
```
Relations
```text
salary_payments.phone -> app_users.phone
```

## Query 153
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
delete
```

New (renamed schema)
```sql
delete
```

## Query 154
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE `level` SET `f1`= ? ,`f2`= ? ,`f3`= ? ,`f4`= ?  WHERE `id` = ?
```

New (renamed schema)
```sql
UPDATE `commission_levels` SET `f1`= ? ,`f2`= ? ,`f3`= ? ,`f4`= ?  WHERE `id` = ?
```

## Query 155
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
Update successful
```

New (renamed schema)
```sql
Update successful
```

## Query 156
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
Update failed
```

New (renamed schema)
```sql
Update failed
```

## Query 157
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, type = 'momo'
```

New (renamed schema)
```sql
INSERT INTO bank_accounts SET bank_name = ?, account_name = ?, account_number = ?, qr_code_url = ?, method = 'momo'
```

## Query 158
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
DELETE FROM bank_recharge WHERE type = 'momo' AND id = ?
```

New (renamed schema)
```sql
DELETE FROM bank_accounts WHERE method = 'momo' AND id = ?
```

## Query 159
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE token = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE auth_token = ?
```

## Query 160
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM point_list WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM user_points WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 161
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM redenvelopes WHERE status = 0
```

New (renamed schema)
```sql
SELECT * FROM red_envelopes WHERE status = 0
```
Relations
```text
red_envelopes.phone -> app_users.phone
```

## Query 162
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
INSERT INTO point_list SET phone = ?, level = 2
```

New (renamed schema)
```sql
INSERT INTO user_points SET phone = ?, commission_levels = 2
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 163
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE agent_code = ? AND status = 1 AND is_verified = 1
```

## Query 164
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM users WHERE ctv = ? AND status = 2 AND veri = 1
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE agent_code = ? AND status = 2 AND is_verified = 1
```

## Query 165
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(money) as money FROM recharge WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT SUM(balance) as balance FROM deposits WHERE phone = ? AND status = 1
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 166
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT SUM(money) as money FROM withdraw WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT SUM(balance) as balance FROM withdrawals WHERE phone = ? AND status = 1
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 167
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `money`, `time` FROM recharge WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT `balance`, `registered_at` FROM deposits WHERE phone = ? AND status = 1
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 168
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `money`, `time` FROM withdraw WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT `balance`, `registered_at` FROM withdrawals WHERE phone = ? AND status = 1
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 169
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `money`, `time` FROM minutes_1 WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT `balance`, `registered_at` FROM wingo_bets WHERE phone = ? AND status = 1
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 170
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `money`, `time` FROM minutes_1 WHERE phone = ? AND status = 2
```

New (renamed schema)
```sql
SELECT `balance`, `registered_at` FROM wingo_bets WHERE phone = ? AND status = 2
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 171
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `id`, `status`, `type`,`phone`, `money`, `time` FROM recharge WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT `id`, `status`, `method`,`phone`, `balance`, `registered_at` FROM deposits WHERE phone = ? AND status = 1
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 172
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT `id`, `status`,`phone`, `money`, `time` FROM withdraw WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT `id`, `status`,`phone`, `balance`, `registered_at` FROM withdrawals WHERE phone = ? AND status = 1
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 173
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM redenvelopes_used WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM red_envelope_usages WHERE phone = ?
```
Relations
```text
red_envelope_usages.phone -> app_users.phone
red_envelope_usages.used_by_phone -> app_users.phone
```

## Query 174
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM financial_details WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM financial_ledger WHERE phone = ?
```
Relations
```text
financial_ledger.phone -> app_users.phone
```

## Query 175
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM `level`
```

New (renamed schema)
```sql
SELECT * FROM `commission_levels`
```

## Query 176
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
SELECT * FROM `users` WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM `app_users` WHERE phone = ?
```

## Query 177
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/adminController.js`

Old
```sql
UPDATE `users` SET `money` = `money` + ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE `app_users` SET `balance` = `balance` + ? WHERE phone = ?
```

## Query 178
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/homeController.js`

Old
```sql
SELECT * FROM salary WHERE phone = ? ORDER BY time DESC
```

New (renamed schema)
```sql
SELECT * FROM salary_payments WHERE phone = ? ORDER BY registered_at DESC
```
Relations
```text
salary_payments.phone -> app_users.phone
```

## Query 179
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/homeController.js`

Old
```sql
SELECT `app` FROM admin
```

New (renamed schema)
```sql
SELECT `app` FROM system_settings
```

## Query 180
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/homeController.js`

Old
```sql
SELECT `level` FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT `commission_levels` FROM app_users WHERE `auth_token` = ?
```

## Query 181
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/homeController.js`

Old
```sql
SELECT `cskh` FROM admin
```

New (renamed schema)
```sql
SELECT `cskh` FROM system_settings
```

## Query 182
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/homeController.js`

Old
```sql
SELECT `time_otp` FROM users WHERE token = ?
```

New (renamed schema)
```sql
SELECT `otp_expires_at` FROM app_users WHERE auth_token = ?
```

## Query 183
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT period FROM wingo WHERE status = 0 AND game = '${gameJoin}' ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT period FROM wingo_rounds WHERE status = 0 AND game = '${gameJoin}' ORDER BY id DESC LIMIT 1
```

## Query 184
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
<div data-v-a9660e98="" issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
        <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="result">
                <div data-v-a9660e98="" class="select select-${color}">
                    ${checkJoin}
                </div>
            </div>
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${period}
                    </div>
                    <div data-v-a9660e98="" class="tiem">${formatTime}</div>
                </div>
            </div>
        </div>
        <!---->
    </div>
```

New (renamed schema)
```sql
<div data-v-a9660e98="" issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
        <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="result">
                <div data-v-a9660e98="" class="select select-${color}">
                    ${checkJoin}
                </div>
            </div>
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${period}
                    </div>
                    <div data-v-a9660e98="" class="tiem">${formatTime}</div>
                </div>
            </div>
        </div>
        <!---->
    </div>
```

## Query 185
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
INSERT INTO minutes_1 SET 
        id_product = ?,
        phone = ?,
        code = ?,
        invite = ?,
        stage = ?,
        level = ?,
        money = ?,
        amount = ?,
        fee = ?,
        get = ?,
        game = ?,
        bet = ?,
        status = ?,
        today = ?,
        time = ?
```

New (renamed schema)
```sql
INSERT INTO wingo_bets SET 
        product_id = ?,
        phone = ?,
        invite_code = ?,
        referred_by = ?,
        round_id = ?,
        commission_levels = ?,
        balance = ?,
        amount = ?,
        fee = ?,
        payout = ?,
        game = ?,
        bet = ?,
        status = ?,
        business_day = ?,
        registered_at = ?
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 186
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
INSERT INTO roses SET 
        phone = ?,
        code = ?,
        invite = ?,
        f1 = ?,
        f2 = ?,
        f3 = ?,
        f4 = ?,
        time = ?
```

New (renamed schema)
```sql
INSERT INTO commission_logs SET 
        phone = ?,
        invite_code = ?,
        referred_by = ?,
        f1 = ?,
        f2 = ?,
        f3 = ?,
        f4 = ?,
        registered_at = ?
```
Relations
```text
commission_logs.phone -> app_users.phone
```

## Query 187
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}
```

New (renamed schema)
```sql
SELECT * FROM wingo_rounds WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}
```

## Query 188
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT * FROM wingo WHERE status != 0 AND game = '${game}'
```

New (renamed schema)
```sql
SELECT * FROM wingo_rounds WHERE status != 0 AND game = '${game}'
```

## Query 189
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT period FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT period FROM wingo_rounds WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

## Query 190
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT * FROM minutes_1 WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${Number(pageno) + "," + Number(pageto)}
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${Number(pageno) + "," + Number(pageto)}
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 191
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT * FROM minutes_1 WHERE phone = ? AND game = '${game}' ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE phone = ? AND game = '${game}' ORDER BY id DESC
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 192
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT period FROM wingo WHERE status = 0 AND game = "${join}" ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT period FROM wingo_rounds WHERE status = 0 AND game = "${join}" ORDER BY id DESC LIMIT 1
```

## Query 193
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE wingo SET amount = ?,status = ? WHERE period = ? AND game = "${join}"
```

New (renamed schema)
```sql
UPDATE wingo_rounds SET amount = ?,status = ? WHERE period = ? AND game = "${join}"
```

## Query 194
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
INSERT INTO wingo SET 
        period = ?,
        amount = ?,
        game = ?,
        status = ?,
        time = ?
```

New (renamed schema)
```sql
INSERT INTO wingo_rounds SET 
        period = ?,
        amount = ?,
        game = ?,
        status = ?,
        registered_at = ?
```

## Query 195
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT * FROM wingo_rounds WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 1
```

## Query 196
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET result = ? WHERE status = 0 AND game = '${game}'
```

New (renamed schema)
```sql
UPDATE wingo_bets SET result = ? WHERE status = 0 AND game = '${game}'
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 197
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "0" AND bet != "t"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "0" AND bet != "t"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 198
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "1"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "1"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 199
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "2"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "2"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 200
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "3"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "3"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 201
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "4"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "4"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 202
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "5" AND bet != "t"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "5" AND bet != "t"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 203
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "6"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "6"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 204
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "7"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "7"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 205
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "8"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "8"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 206
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "9"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "9"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 207
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "l"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "l"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 208
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "n"
```

New (renamed schema)
```sql
UPDATE wingo_bets SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "n"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 209
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT * FROM minutes_1 WHERE status = 0 AND game = '${game}'
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE status = 0 AND game = '${game}'
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 210
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT * FROM level WHERE id = ?
```

New (renamed schema)
```sql
SELECT * FROM commission_levels WHERE id = ?
```

## Query 211
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT `phone`, `code`, `invite` FROM users WHERE token = ? AND veri = 1  LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by` FROM app_users WHERE auth_token = ? AND is_verified = 1  LIMIT 1
```

## Query 212
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET balance = balance + ?, commission_total = commission_total + ?, commission_today = commission_today + ? WHERE phone = ?
```

## Query 213
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `rank` FROM app_users WHERE invite_code = ? AND is_verified = 1  LIMIT 1
```

## Query 214
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE users SET money = money + ?, roses_f1 = roses_f1 + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET balance = balance + ?, commission_f1 = commission_f1 + ?, commission_total = commission_total + ?, commission_today = commission_today + ? WHERE phone = ?
```

## Query 215
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1  LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `commission_levels`, `balance` FROM app_users WHERE auth_token = ? AND is_verified = 1  LIMIT 1
```

## Query 216
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
select select-${color}
```

New (renamed schema)
```sql
select select-${color}
```

## Query 217
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE `users` SET `money` = `money` - ? WHERE `token` = ?
```

New (renamed schema)
```sql
UPDATE `app_users` SET `balance` = `balance` - ? WHERE `auth_token` = ?
```

## Query 218
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT `money`, `level` FROM users WHERE token = ? AND veri = 1  LIMIT 1
```

New (renamed schema)
```sql
SELECT `balance`, `commission_levels` FROM app_users WHERE auth_token = ? AND is_verified = 1  LIMIT 1
```

## Query 219
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE token = ? AND veri = 1 LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `commission_levels`, `balance` FROM app_users WHERE auth_token = ? AND is_verified = 1 LIMIT 1
```

## Query 220
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT * FROM `admin`
```

New (renamed schema)
```sql
SELECT * FROM `system_settings`
```

## Query 221
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
SELECT `money` FROM `users` WHERE `phone` = ?
```

New (renamed schema)
```sql
SELECT `balance` FROM `app_users` WHERE `phone` = ?
```

## Query 222
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE `minutes_1` SET `get` = ?, `status` = 1 WHERE `id` = ?
```

New (renamed schema)
```sql
UPDATE `wingo_bets` SET `payout` = ?, `status` = 1 WHERE `id` = ?
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 223
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController1.js`

Old
```sql
UPDATE `users` SET `money` = ? WHERE `phone` = ?
```

New (renamed schema)
```sql
UPDATE `app_users` SET `balance` = ? WHERE `phone` = ?
```

## Query 224
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController_old.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `rank`, `level` FROM users WHERE code = ? AND veri = 1  LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `rank`, `commission_levels` FROM app_users WHERE invite_code = ? AND is_verified = 1  LIMIT 1
```

## Query 225
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController_old.js`

Old
```sql
SELECT * FROM level WHERE level = ?
```

New (renamed schema)
```sql
SELECT * FROM commission_levels WHERE commission_levels = ?
```

## Query 226
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT period FROM k3 WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT period FROM lotto_k3_rounds WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1
```

## Query 227
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
INSERT INTO result_k3 SET id_product = ?,phone = ?,code = ?,invite = ?,stage = ?,level = ?,money = ?,price = ?,amount = ?,fee = ?,game = ?,join_bet = ?, typeGame = ?,bet = ?,status = ?,time = ?
```

New (renamed schema)
```sql
INSERT INTO lotto_k3_bets SET product_id = ?,phone = ?,invite_code = ?,referred_by = ?,round_id = ?,commission_levels = ?,balance = ?,price = ?,amount = ?,fee = ?,game = ?,join_type = ?, bet_type = ?,bet = ?,status = ?,registered_at = ?
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 228
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,time = ?
```

New (renamed schema)
```sql
INSERT INTO commission_logs SET phone = ?,invite_code = ?,referred_by = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,registered_at = ?
```
Relations
```text
commission_logs.phone -> app_users.phone
```

## Query 229
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
UPDATE k3 SET result = ?,status = ? WHERE period = ? AND game = "${game}"
```

New (renamed schema)
```sql
UPDATE lotto_k3_rounds SET result = ?,status = ? WHERE period = ? AND game = "${game}"
```

## Query 230
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
UPDATE k3 SET result = ?,status = ? WHERE period = ? AND game = ${game}
```

New (renamed schema)
```sql
UPDATE lotto_k3_rounds SET result = ?,status = ? WHERE period = ? AND game = ${game}
```

## Query 231
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
INSERT INTO k3 SET period = ?, result = ?, game = ?, status = ?, time = ?
```

New (renamed schema)
```sql
INSERT INTO lotto_k3_rounds SET period = ?, result = ?, game = ?, status = ?, registered_at = ?
```

## Query 232
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT * FROM k3 WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_rounds WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1
```

## Query 233
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
UPDATE result_k3 SET result = ? WHERE status = 0 AND game = ${game}
```

New (renamed schema)
```sql
UPDATE lotto_k3_bets SET result = ? WHERE status = 0 AND game = ${game}
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 234
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'total'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_k3_bets WHERE status = 0 AND game = ${game} AND bet_type = 'total'
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 235
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
UPDATE result_k3 SET status = 2 WHERE id = ?
```

New (renamed schema)
```sql
UPDATE lotto_k3_bets SET status = 2 WHERE id = ?
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 236
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
UPDATE result_k3 SET status = 0 WHERE id = ?
```

New (renamed schema)
```sql
UPDATE lotto_k3_bets SET status = 0 WHERE id = ?
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 237
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'two-same'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_k3_bets WHERE status = 0 AND game = ${game} AND bet_type = 'two-same'
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 238
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'three-same'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_k3_bets WHERE status = 0 AND game = ${game} AND bet_type = 'three-same'
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 239
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'unlike'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_k3_bets WHERE status = 0 AND game = ${game} AND bet_type = 'unlike'
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 240
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT id, phone, bet, price, money, fee, amount, result, typeGame FROM result_k3 WHERE status = 0 AND game = ${game}
```

New (renamed schema)
```sql
SELECT id, phone, bet, price, balance, fee, amount, result, bet_type FROM lotto_k3_bets WHERE status = 0 AND game = ${game}
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 241
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT * FROM k3 WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_rounds WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}
```

## Query 242
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT * FROM k3 WHERE status != 0 AND game = '${game}'
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_rounds WHERE status != 0 AND game = '${game}'
```

## Query 243
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT * FROM result_k3 WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${Number(pageno) + "," + Number(pageto)}
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_bets WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${Number(pageno) + "," + Number(pageto)}
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 244
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
SELECT * FROM result_k3 WHERE phone = ? AND game = '${game}' ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT * FROM lotto_k3_bets WHERE phone = ? AND game = '${game}' ORDER BY id DESC
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 245
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
UPDATE `result_k3` SET `get` = ?, `status` = 1 WHERE `id` = ?
```

New (renamed schema)
```sql
UPDATE `lotto_k3_bets` SET `payout` = ?, `status` = 1 WHERE `id` = ?
```
Relations
```text
lotto_k3_bets.phone -> app_users.phone
```

## Query 246
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k3Controller2011.js`

Old
```sql
UPDATE `users` SET `money` = `money` + ? WHERE `phone` = ?
```

New (renamed schema)
```sql
UPDATE `app_users` SET `balance` = `balance` + ? WHERE `phone` = ?
```

## Query 247
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT id_user, phone, money, total_money, status, time FROM users WHERE veri = 1 AND level = 0 AND ctv = ? ORDER BY id DESC LIMIT ${pageno}, ${limit}
```

New (renamed schema)
```sql
SELECT id_user, phone, balance, total_deposit, status, registered_at FROM app_users WHERE is_verified = 1 AND commission_levels = 0 AND agent_code = ? ORDER BY id DESC LIMIT ${pageno}, ${limit}
```

## Query 248
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT * FROM users WHERE veri = 1 AND level = 0 AND ctv = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE is_verified = 1 AND commission_levels = 0 AND agent_code = ?
```

## Query 249
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT `phone` FROM `users` WHERE `token` = ? AND veri = 1
```

New (renamed schema)
```sql
SELECT `phone` FROM `app_users` WHERE `auth_token` = ? AND is_verified = 1
```

## Query 250
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT `money`, `money_us` FROM `point_list` WHERE `phone` = ?
```

New (renamed schema)
```sql
SELECT `balance`, `balance_us` FROM `user_points` WHERE `phone` = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 251
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT `telegram` FROM `point_list` WHERE phone = ?
```

New (renamed schema)
```sql
SELECT `telegram` FROM `user_points` WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 252
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT `telegram` FROM `admin`
```

New (renamed schema)
```sql
SELECT `telegram` FROM `system_settings`
```

## Query 253
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
UPDATE `point_list` SET telegram = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE `user_points` SET telegram = ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 254
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
UPDATE `point_list` SET money = money - ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE `user_points` SET balance = balance - ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 255
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT `money` FROM point_list WHERE phone = ?
```

New (renamed schema)
```sql
SELECT `balance` FROM user_points WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 256
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT * FROM redenvelopes WHERE phone = ? ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT * FROM red_envelopes WHERE phone = ? ORDER BY id DESC
```
Relations
```text
red_envelopes.phone -> app_users.phone
```

## Query 257
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT 100
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ? ORDER BY id DESC LIMIT 100
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 258
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT 100
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE phone = ? ORDER BY id DESC LIMIT 100
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 259
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
SELECT `money_us` FROM point_list WHERE phone = ?
```

New (renamed schema)
```sql
SELECT `balance_us` FROM user_points WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 260
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
UPDATE point_list SET money_us = money_us - ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET balance_us = balance_us - ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 261
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
INSERT INTO financial_details SET phone = ?, phone_used = ?, money = ?, type = ?, time = ?
```

New (renamed schema)
```sql
INSERT INTO financial_ledger SET phone = ?, counterparty_phone = ?, balance = ?, method = ?, registered_at = ?
```
Relations
```text
financial_ledger.phone -> app_users.phone
```

## Query 262
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/dailyController.js`

Old
```sql
UPDATE point_list SET money = money + ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_points SET balance = balance + ? WHERE phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 263
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
INSERT INTO recharge SET
            id_order = ?,
            transaction_id = ?,
            phone = ?,
            money = ?,
            type = ?,
            status = ?,
            today = ?,
            url = ?,
            time = ?
```

New (renamed schema)
```sql
INSERT INTO deposits SET
            order_id = ?,
            transaction_id = ?,
            phone = ?,
            balance = ?,
            method = ?,
            status = ?,
            business_day = ?,
            payment_url = ?,
            registered_at = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 264
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
INSERT INTO recharge SET
                id_order = ?,
                transaction_id = ?,
                phone = ?,
                money = ?,
                type = ?,
                status = ?,
                today = ?,
                url = ?,
                time = ?
```

New (renamed schema)
```sql
INSERT INTO deposits SET
                order_id = ?,
                transaction_id = ?,
                phone = ?,
                balance = ?,
                method = ?,
                status = ?,
                business_day = ?,
                payment_url = ?,
                registered_at = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 265
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
INSERT INTO user_bank SET
        phone = ?,
        name_bank = ?,
        name_user = ?,
        stk = ?,
        email = ?,
        tinh = ?,
        time = ?
```

New (renamed schema)
```sql
INSERT INTO user_bank_accounts SET
        phone = ?,
        bank_name = ?,
        account_name = ?,
        account_number = ?,
        email = ?,
        state = ?,
        registered_at = ?
```
Relations
```text
user_bank_accounts.phone -> app_users.phone
```

## Query 266
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
INSERT INTO withdraw SET
                    id_order = ?,
                    phone = ?,
                    money = ?,
                    stk = ?,
                    name_bank = ?,
                    ifsc = ?,
                    name_user = ?,
                    status = ?,
                    today = ?,
                    time = ?
```

New (renamed schema)
```sql
INSERT INTO withdrawals SET
                    order_id = ?,
                    phone = ?,
                    balance = ?,
                    account_number = ?,
                    bank_name = ?,
                    ifsc = ?,
                    account_name = ?,
                    status = ?,
                    business_day = ?,
                    registered_at = ?
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 267
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?
```

New (renamed schema)
```sql
UPDATE deposits SET status = 1 WHERE id = ? AND order_id = ? AND phone = ? AND balance = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 268
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT invite, total_money from users WHERE phone = ?
```

New (renamed schema)
```sql
SELECT referred_by, total_deposit from app_users WHERE phone = ?
```

## Query 269
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
UPDATE recharge SET status = 2 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?
```

New (renamed schema)
```sql
UPDATE deposits SET status = 2 WHERE id = ? AND order_id = ? AND phone = ? AND balance = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 270
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
s mobile number from the database using auth token

  // Your existing controller code here
};

const recharge = async (req, res) => {
  let auth = req.cookies.auth;
  let money = req.body.money;
  let type = req.body.type;
  let typeid = req.body.typeid;

  const minimumMoney = process.env.MINIMUM_MONEY;

  if (type != "cancel") {
    if (!auth || !money || money < minimumMoney - 1) {
      return res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      });
    }
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  if (type == "cancel") {
    await connection.query(
      "UPDATE recharge SET status = 2 WHERE phone = ? AND id_order = ? AND status = ? ",
      [userInfo.phone, typeid, 0],
    );
    return res.status(200).json({
      message: "Cancelled order successfully",
      status: true,
      timeStamp: timeNow,
    });
  }
  const [recharge] = await connection.query(
    "SELECT * FROM recharge WHERE phone = ? AND status = ? ",
    [userInfo.phone, 0],
  );

  if (recharge.length == 0) {
    let time = new Date().getTime();
    const date = new Date();
    function formateT(params) {
      let result = params < 10 ? "0" + params : params;
      return result;
    }

    function timerJoin(params = "", addHours = 0) {
      let date = "";
      if (params) {
        date = new Date(Number(params));
      } else {
        date = new Date();
      }

      date.setHours(date.getHours() + addHours);

      let years = formateT(date.getFullYear());
      let months = formateT(date.getMonth() + 1);
      let days = formateT(date.getDate());

      let hours = date.getHours() % 12;
      hours = hours === 0 ? 12 : hours;
      let ampm = date.getHours() < 12 ? "AM" : "PM";

      let minutes = formateT(date.getMinutes());
      let seconds = formateT(date.getSeconds());

      return (
        years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + " " + ampm
      );
    }
    let checkTime = timerJoin(time);
    let id_time = date.getUTCFullYear() + "" + date.getUTCMonth() + 1 + "" + date.getUTCDate();
    let id_order =
      Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
    // let vat = Math.floor(Math.random() * (2000 - 0 + 1) ) + 0;

    money = Number(money);
    let client_transaction_id = id_time + id_order;
    const formData = {
      username: process.env.accountBank,
      secret_key: process.env.secret_key,
      client_transaction: client_transaction_id,
      amount: money,
    };

    if (type == "momo") {
      const sql = `INSERT INTO recharge SET
            id_order = ?,
            transaction_id = ?,
            phone = ?,
            money = ?,
            type = ?,
            status = ?,
            today = ?,
            url = ?,
            time = ?`;
      await connection.execute(sql, [
        client_transaction_id,
        "NULL",
        userInfo.phone,
        money,
        type,
        0,
        checkTime,
        "NULL",
        time,
      ]);
      const [recharge] = await connection.query(
        "SELECT * FROM recharge WHERE phone = ? AND status = ? ",
        [userInfo.phone, 0],
      );
      return res.status(200).json({
        message: "Received successfully",
        datas: recharge[0],
        status: true,
        timeStamp: timeNow,
      });
    }

    const moneyString = money.toString();

    const apiData = {
      key: process.env.PAYMENT_KEY,
      client_txn_id: client_transaction_id,
      amount: moneyString,
      p_info: process.env.PAYMENT_INFO,
      customer_name: userInfo.name_user,
      customer_email: process.env.PAYMENT_EMAIL,
      customer_mobile: userInfo.phone,
      redirect_url: `${process.env.APP_BASE_URL}/wallet/rechargerecord`,
      udf1: process.env.APP_NAME,
    };

    try {
      const apiResponse = await axios.post("https://api.ekqr.in/api/create_order", apiData);

      if (apiResponse.data.status == true) {
        const sql = `INSERT INTO recharge SET
                id_order = ?,
                transaction_id = ?,
                phone = ?,
                money = ?,
                type = ?,
                status = ?,
                today = ?,
                url = ?,
                time = ?`;

        await connection.execute(sql, [
          client_transaction_id,
          "0",
          userInfo.phone,
          money,
          type,
          0,
          checkTime,
          "0",
          timeNow,
        ]);

        const [recharge] = await connection.query(
          "SELECT * FROM recharge WHERE phone = ? AND status = ? ",
          [userInfo.phone, 0],
        );

        return res.status(200).json({
          message: "Received successfully",
          datas: recharge[0],
          payment_url: apiResponse.data.data.payment_url,
          status: true,
          timeStamp: timeNow,
        });
      } else {
        return res.status(500).json({ message: "Failed to create order", status: false });
      }
    } catch (error) {
      return res.status(500).json({ message: "API request failed", status: false });
    }
  } else {
    return res.status(200).json({
      message: "Received successfully",
      datas: recharge[0],
      status: true,
      timeStamp: timeNow,
    });
  }
};

const cancelRecharge = async (req, res) => {
  try {
    let auth = req.cookies.auth;

    if (!auth) {
      return res.status(200).json({
        message: "Authorization is required to access this API!",
        status: false,
        timeStamp: timeNow,
      });
    }

    const [user] = await connection.query(
      "SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `token` = ? ",
      [auth],
    );

    if (!user) {
      return res.status(200).json({
        message: "Authorization is required to access this API!",
        status: false,
        timeStamp: timeNow,
      });
    }

    let userInfo = user[0];

    const result = await connection.query("DELETE FROM recharge WHERE phone = ? AND status = ?", [
      userInfo.phone,
      0,
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        message: "All the pending recharges has been deleted successfully!",
        status: true,
        timeStamp: timeNow,
      });
    } else {
      return res.status(200).json({
        message:
          "There was no pending recharges for this user or delete operation has been failed!",
        status: true,
        timeStamp: timeNow,
      });
    }
  } catch (error) {
    console.error("API error: ", error);
    return res.status(500).json({
      message: "API Request failed!",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const addBank = async (req, res) => {
  let auth = req.cookies.auth;
  let name_bank = req.body.name_bank;
  let name_user = req.body.name_user;
  let stk = req.body.stk;
  let email = req.body.email;
  let tinh = req.body.tinh;
  let time = new Date().getTime();

  if (!auth || !name_bank || !name_user || !stk || !email || !tinh) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: time,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user_bank] = await connection.query("SELECT * FROM user_bank WHERE stk = ? ", [stk]);
  const [user_bank2] = await connection.query("SELECT * FROM user_bank WHERE phone = ? ", [
    userInfo.phone,
  ]);
  if (user_bank.length == 0 && user_bank2.length == 0) {
    const sql = `INSERT INTO user_bank SET
        phone = ?,
        name_bank = ?,
        name_user = ?,
        stk = ?,
        email = ?,
        tinh = ?,
        time = ?`;
    await connection.execute(sql, [userInfo.phone, name_bank, name_user, stk, email, tinh, time]);
    return res.status(200).json({
      message: "Successfully added bank",
      status: true,
      timeStamp: timeNow,
    });
  } else if (user_bank.length > 0) {
    await connection.query("UPDATE user_bank SET stk = ? WHERE phone = ? ", [stk, userInfo.phone]);
    return res.status(200).json({
      message: "Account number updated in the system",
      status: false,
      timeStamp: timeNow,
    });
  } else if (user_bank2.length > 0) {
    await connection.query(
      "UPDATE user_bank SET name_bank = ?, name_user = ?, stk = ?, email = ?, tinh = ?, time = ? WHERE phone = ?",
      [name_bank, name_user, stk, email, tinh, time, userInfo.phone],
    );
    return res.status(200).json({
      message: "your account is updated",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const infoUserBank = async (req, res) => {
  let auth = req.cookies.auth;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `money` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }

  function timerJoin(params = "", addHours = 0) {
    let date = "";
    if (params) {
      date = new Date(Number(params));
    } else {
      date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return (
      years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + " " + ampm
    );
  }
  let date = new Date().getTime();
  let checkTime = timerJoin(date);
  const [recharge] = await connection.query(
    "SELECT * FROM recharge WHERE phone = ? AND status = 1",
    [userInfo.phone],
  );
  const [minutes_1] = await connection.query("SELECT * FROM minutes_1 WHERE phone = ?", [
    userInfo.phone,
  ]);
  let total = 0;
  recharge.forEach((data) => {
    total += parseFloat(data.money);
  });
  let total2 = 0;
  minutes_1.forEach((data) => {
    total2 += parseFloat(data.money);
  });
  let fee = 0;
  minutes_1.forEach((data) => {
    fee += parseFloat(data.fee);
  });

  // result = Math.max(result, 0);
  let result = 0;
  if (total - total2 > 0) result = total - total2 - fee;

  const [userBank] = await connection.query("SELECT * FROM user_bank WHERE phone = ? ", [
    userInfo.phone,
  ]);
  return res.status(200).json({
    message: "Received successfully",
    datas: userBank,
    userInfo: user,
    result: result,
    status: true,
    timeStamp: timeNow,
  });
};

const withdrawal3 = async (req, res) => {
  let auth = req.cookies.auth;
  let money = req.body.money;
  let password = req.body.password;
  if (!auth || !money || !password || money < 299) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite`, `money` FROM users WHERE `token` = ? AND password = ?",
    [auth, md5(password)],
  );

  if (user.length == 0) {
    return res.status(200).json({
      message: "incorrect password",
      status: false,
      timeStamp: timeNow,
    });
  }
  let userInfo = user[0];
  const date = new Date();
  let id_time = date.getUTCFullYear() + "" + date.getUTCMonth() + 1 + "" + date.getUTCDate();
  let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;

  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }

  function timerJoin(params = "", addHours = 0) {
    let date = "";
    if (params) {
      date = new Date(Number(params));
    } else {
      date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return (
      years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + " " + ampm
    );
  }
  let dates = new Date().getTime();
  let checkTime = timerJoin(dates);
  const [withdraw_set] = await connection.query(
    "SELECT * FROM withdraw WHERE phone = ? and status = 1",
    [userInfo.phone],
  );
  const [recharge] = await connection.query(
    "SELECT * FROM recharge WHERE phone = ? AND status = 1",
    [userInfo.phone],
  );
  const [minutes_1] = await connection.query("SELECT * FROM minutes_1 WHERE phone = ?", [
    userInfo.phone,
  ]);
  let total = 0;
  withdraw_set.forEach((data) => {
    total += parseFloat(data.money);
  });
  console.log("Total withdraw: ", total);
  let total2 = 0;
  minutes_1.forEach((data) => {
    total2 += parseFloat(data.get);
  });
  console.log("Total gameplay: ", total2);
  let result = total2 - total - money;

  const [user_bank] = await connection.query("SELECT * FROM user_bank WHERE `phone` = ?", [
    userInfo.phone,
  ]);
  const [withdraw] = await connection.query(
    "SELECT * FROM withdraw WHERE `phone` = ? AND today = ?",
    [userInfo.phone, checkTime],
  );
  if (user_bank.length != 0) {
    if (withdraw.length < 3) {
      if (userInfo.money - money >= 0) {
        console.log("result:", result);
        if (result >= 0) {
          if (money - (total2 - total) > 0) {
            return res.status(200).json({
              message: "The total bet is not enough to fulfill the request",
              status: false,
              timeStamp: timeNow,
            });
          } else {
            let infoBank = user_bank[0];
            const sql = `INSERT INTO withdraw SET
                    id_order = ?,
                    phone = ?,
                    money = ?,
                    stk = ?,
                    name_bank = ?,
                    ifsc = ?,
                    name_user = ?,
                    status = ?,
                    today = ?,
                    time = ?`;
            await connection.execute(sql, [
              id_time + "" + id_order,
              userInfo.phone,
              money,
              infoBank.stk,
              infoBank.name_bank,
              infoBank.email,
              infoBank.name_user,
              0,
              checkTime,
              dates,
            ]);
            await connection.query("UPDATE users SET money = money - ? WHERE phone = ? ", [
              money,
              userInfo.phone,
            ]);
            return res.status(200).json({
              message: "Withdrawal successful",
              status: true,
              money: userInfo.money - money,
              timeStamp: timeNow,
            });
          }
        } else {
          console.log("niche wale ka wajah se ho rha");
          return res.status(200).json({
            message: "The total bet is not enough to fulfill the request",
            status: false,
            timeStamp: timeNow,
          });
        }
      } else {
        return res.status(200).json({
          message: "The balance is not enough to fulfill the request",
          status: false,
          timeStamp: timeNow,
        });
      }
    } else {
      return res.status(200).json({
        message: "You can only make 3 withdrawals per day",
        status: false,
        timeStamp: timeNow,
      });
    }
  } else {
    return res.status(200).json({
      message: "Please link your bank first",
      status: false,
      timeStamp: timeNow,
    });
  }
};
const transfer = async (req, res) => {
  let auth = req.cookies.auth;
  let amount = req.body.amount;
  let receiver_phone = req.body.phone;
  const date = new Date();
  // let id_time = date.getUTCFullYear() +
```

New (renamed schema)
```sql
s mobile number from the database using auth auth_token

  // Your existing controller invite_code here
};

const deposits = async (req, res) => {
  let auth = req.cookies.auth;
  let balance = req.body.balance;
  let method = req.body.method;
  let typeid = req.body.typeid;

  const minimumMoney = process.env.MINIMUM_MONEY;

  if (method != "cancel") {
    if (!auth || !balance || balance < minimumMoney - 1) {
      return res.status(200).json({
        message: "Failed",
        status: false,
        timeStamp: timeNow,
      });
    }
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`account_name`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  if (method == "cancel") {
    await connection.query(
      "UPDATE deposits SET status = 2 WHERE phone = ? AND order_id = ? AND status = ? ",
      [userInfo.phone, typeid, 0],
    );
    return res.status(200).json({
      message: "Cancelled order successfully",
      status: true,
      timeStamp: timeNow,
    });
  }
  const [deposits] = await connection.query(
    "SELECT * FROM deposits WHERE phone = ? AND status = ? ",
    [userInfo.phone, 0],
  );

  if (deposits.length == 0) {
    let registered_at = new Date().getTime();
    const date = new Date();
    function formateT(params) {
      let result = params < 10 ? "0" + params : params;
      return result;
    }

    function timerJoin(params = "", addHours = 0) {
      let date = "";
      if (params) {
        date = new Date(Number(params));
      } else {
        date = new Date();
      }

      date.setHours(date.getHours() + addHours);

      let years = formateT(date.getFullYear());
      let months = formateT(date.getMonth() + 1);
      let days = formateT(date.getDate());

      let hours = date.getHours() % 12;
      hours = hours === 0 ? 12 : hours;
      let ampm = date.getHours() < 12 ? "AM" : "PM";

      let minutes = formateT(date.getMinutes());
      let seconds = formateT(date.getSeconds());

      return (
        years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + " " + ampm
      );
    }
    let checkTime = timerJoin(registered_at);
    let id_time = date.getUTCFullYear() + "" + date.getUTCMonth() + 1 + "" + date.getUTCDate();
    let order_id =
      Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
    // let vat = Math.floor(Math.random() * (2000 - 0 + 1) ) + 0;

    balance = Number(balance);
    let client_transaction_id = id_time + order_id;
    const formData = {
      username: process.env.accountBank,
      secret_key: process.env.secret_key,
      client_transaction: client_transaction_id,
      amount: balance,
    };

    if (method == "momo") {
      const sql = `INSERT INTO deposits SET
            order_id = ?,
            transaction_id = ?,
            phone = ?,
            balance = ?,
            method = ?,
            status = ?,
            business_day = ?,
            payment_url = ?,
            registered_at = ?`;
      await connection.execute(sql, [
        client_transaction_id,
        "NULL",
        userInfo.phone,
        balance,
        method,
        0,
        checkTime,
        "NULL",
        registered_at,
      ]);
      const [deposits] = await connection.query(
        "SELECT * FROM deposits WHERE phone = ? AND status = ? ",
        [userInfo.phone, 0],
      );
      return res.status(200).json({
        message: "Received successfully",
        datas: deposits[0],
        status: true,
        timeStamp: timeNow,
      });
    }

    const moneyString = balance.toString();

    const apiData = {
      key: process.env.PAYMENT_KEY,
      client_txn_id: client_transaction_id,
      amount: moneyString,
      p_info: process.env.PAYMENT_INFO,
      customer_name: userInfo.account_name,
      customer_email: process.env.PAYMENT_EMAIL,
      customer_mobile: userInfo.phone,
      redirect_url: `${process.env.APP_BASE_URL}/wallet/rechargerecord`,
      udf1: process.env.APP_NAME,
    };

    try {
      const apiResponse = await axios.post("https://api.ekqr.in/api/create_order", apiData);

      if (apiResponse.data.status == true) {
        const sql = `INSERT INTO deposits SET
                order_id = ?,
                transaction_id = ?,
                phone = ?,
                balance = ?,
                method = ?,
                status = ?,
                business_day = ?,
                payment_url = ?,
                registered_at = ?`;

        await connection.execute(sql, [
          client_transaction_id,
          "0",
          userInfo.phone,
          balance,
          method,
          0,
          checkTime,
          "0",
          timeNow,
        ]);

        const [deposits] = await connection.query(
          "SELECT * FROM deposits WHERE phone = ? AND status = ? ",
          [userInfo.phone, 0],
        );

        return res.status(200).json({
          message: "Received successfully",
          datas: deposits[0],
          payment_url: apiResponse.data.data.payment_url,
          status: true,
          timeStamp: timeNow,
        });
      } else {
        return res.status(500).json({ message: "Failed to create order", status: false });
      }
    } catch (error) {
      return res.status(500).json({ message: "API request failed", status: false });
    }
  } else {
    return res.status(200).json({
      message: "Received successfully",
      datas: deposits[0],
      status: true,
      timeStamp: timeNow,
    });
  }
};

const cancelRecharge = async (req, res) => {
  try {
    let auth = req.cookies.auth;

    if (!auth) {
      return res.status(200).json({
        message: "Authorization is required to access this API!",
        status: false,
        timeStamp: timeNow,
      });
    }

    const [user] = await connection.query(
      "SELECT `phone`, `invite_code`,`account_name`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
      [auth],
    );

    if (!user) {
      return res.status(200).json({
        message: "Authorization is required to access this API!",
        status: false,
        timeStamp: timeNow,
      });
    }

    let userInfo = user[0];

    const result = await connection.query("DELETE FROM deposits WHERE phone = ? AND status = ?", [
      userInfo.phone,
      0,
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        message: "All the pending recharges has been deleted successfully!",
        status: true,
        timeStamp: timeNow,
      });
    } else {
      return res.status(200).json({
        message:
          "There was no pending recharges for this user or delete operation has been failed!",
        status: true,
        timeStamp: timeNow,
      });
    }
  } catch (error) {
    console.error("API error: ", error);
    return res.status(500).json({
      message: "API Request failed!",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const addBank = async (req, res) => {
  let auth = req.cookies.auth;
  let bank_name = req.body.bank_name;
  let account_name = req.body.account_name;
  let account_number = req.body.account_number;
  let email = req.body.email;
  let state = req.body.state;
  let registered_at = new Date().getTime();

  if (!auth || !bank_name || !account_name || !account_number || !email || !state) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: registered_at,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user_bank_accounts] = await connection.query("SELECT * FROM user_bank_accounts WHERE account_number = ? ", [account_number]);
  const [user_bank2] = await connection.query("SELECT * FROM user_bank_accounts WHERE phone = ? ", [
    userInfo.phone,
  ]);
  if (user_bank_accounts.length == 0 && user_bank2.length == 0) {
    const sql = `INSERT INTO user_bank_accounts SET
        phone = ?,
        bank_name = ?,
        account_name = ?,
        account_number = ?,
        email = ?,
        state = ?,
        registered_at = ?`;
    await connection.execute(sql, [userInfo.phone, bank_name, account_name, account_number, email, state, registered_at]);
    return res.status(200).json({
      message: "Successfully added bank",
      status: true,
      timeStamp: timeNow,
    });
  } else if (user_bank_accounts.length > 0) {
    await connection.query("UPDATE user_bank_accounts SET account_number = ? WHERE phone = ? ", [account_number, userInfo.phone]);
    return res.status(200).json({
      message: "Account number updated in the system",
      status: false,
      timeStamp: timeNow,
    });
  } else if (user_bank2.length > 0) {
    await connection.query(
      "UPDATE user_bank_accounts SET bank_name = ?, account_name = ?, account_number = ?, email = ?, state = ?, registered_at = ? WHERE phone = ?",
      [bank_name, account_name, account_number, email, state, registered_at, userInfo.phone],
    );
    return res.status(200).json({
      message: "your account is updated",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const infoUserBank = async (req, res) => {
  let auth = req.cookies.auth;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`, `referred_by`, `balance` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }

  function timerJoin(params = "", addHours = 0) {
    let date = "";
    if (params) {
      date = new Date(Number(params));
    } else {
      date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return (
      years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + " " + ampm
    );
  }
  let date = new Date().getTime();
  let checkTime = timerJoin(date);
  const [deposits] = await connection.query(
    "SELECT * FROM deposits WHERE phone = ? AND status = 1",
    [userInfo.phone],
  );
  const [wingo_bets] = await connection.query("SELECT * FROM wingo_bets WHERE phone = ?", [
    userInfo.phone,
  ]);
  let total = 0;
  deposits.forEach((data) => {
    total += parseFloat(data.balance);
  });
  let total_2 = 0;
  wingo_bets.forEach((data) => {
    total_2 += parseFloat(data.balance);
  });
  let fee = 0;
  wingo_bets.forEach((data) => {
    fee += parseFloat(data.fee);
  });

  // result = Math.max(result, 0);
  let result = 0;
  if (total - total_2 > 0) result = total - total_2 - fee;

  const [userBank] = await connection.query("SELECT * FROM user_bank_accounts WHERE phone = ? ", [
    userInfo.phone,
  ]);
  return res.status(200).json({
    message: "Received successfully",
    datas: userBank,
    userInfo: user,
    result: result,
    status: true,
    timeStamp: timeNow,
  });
};

const withdrawal3 = async (req, res) => {
  let auth = req.cookies.auth;
  let balance = req.body.balance;
  let password_hash = req.body.password_hash;
  if (!auth || !balance || !password_hash || balance < 299) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`referred_by`, `balance` FROM app_users WHERE `auth_token` = ? AND password_hash = ?",
    [auth, md5(password_hash)],
  );

  if (user.length == 0) {
    return res.status(200).json({
      message: "incorrect password_hash",
      status: false,
      timeStamp: timeNow,
    });
  }
  let userInfo = user[0];
  const date = new Date();
  let id_time = date.getUTCFullYear() + "" + date.getUTCMonth() + 1 + "" + date.getUTCDate();
  let order_id = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;

  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }

  function timerJoin(params = "", addHours = 0) {
    let date = "";
    if (params) {
      date = new Date(Number(params));
    } else {
      date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return (
      years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + " " + ampm
    );
  }
  let dates = new Date().getTime();
  let checkTime = timerJoin(dates);
  const [withdraw_set] = await connection.query(
    "SELECT * FROM withdrawals WHERE phone = ? and status = 1",
    [userInfo.phone],
  );
  const [deposits] = await connection.query(
    "SELECT * FROM deposits WHERE phone = ? AND status = 1",
    [userInfo.phone],
  );
  const [wingo_bets] = await connection.query("SELECT * FROM wingo_bets WHERE phone = ?", [
    userInfo.phone,
  ]);
  let total = 0;
  withdraw_set.forEach((data) => {
    total += parseFloat(data.balance);
  });
  console.log("Total withdrawals: ", total);
  let total_2 = 0;
  wingo_bets.forEach((data) => {
    total_2 += parseFloat(data.payout);
  });
  console.log("Total gameplay: ", total_2);
  let result = total_2 - total - balance;

  const [user_bank_accounts] = await connection.query("SELECT * FROM user_bank_accounts WHERE `phone` = ?", [
    userInfo.phone,
  ]);
  const [withdrawals] = await connection.query(
    "SELECT * FROM withdrawals WHERE `phone` = ? AND business_day = ?",
    [userInfo.phone, checkTime],
  );
  if (user_bank_accounts.length != 0) {
    if (withdrawals.length < 3) {
      if (userInfo.balance - balance >= 0) {
        console.log("result:", result);
        if (result >= 0) {
          if (balance - (total_2 - total) > 0) {
            return res.status(200).json({
              message: "The total bet is not enough to fulfill the request",
              status: false,
              timeStamp: timeNow,
            });
          } else {
            let infoBank = user_bank_accounts[0];
            const sql = `INSERT INTO withdrawals SET
                    order_id = ?,
                    phone = ?,
                    balance = ?,
                    account_number = ?,
                    bank_name = ?,
                    ifsc = ?,
                    account_name = ?,
                    status = ?,
                    business_day = ?,
                    registered_at = ?`;
            await connection.execute(sql, [
              id_time + "" + order_id,
              userInfo.phone,
              balance,
              infoBank.account_number,
              infoBank.bank_name,
              infoBank.email,
              infoBank.account_name,
              0,
              checkTime,
              dates,
            ]);
            await connection.query("UPDATE app_users SET balance = balance - ? WHERE phone = ? ", [
              balance,
              userInfo.phone,
            ]);
            return res.status(200).json({
              message: "Withdrawal successful",
              status: true,
              balance: userInfo.balance - balance,
              timeStamp: timeNow,
            });
          }
        } else {
          console.log("niche wale ka wajah se ho rha");
          return res.status(200).json({
            message: "The total bet is not enough to fulfill the request",
            status: false,
            timeStamp: timeNow,
          });
        }
      } else {
        return res.status(200).json({
          message: "The balance is not enough to fulfill the request",
          status: false,
          timeStamp: timeNow,
        });
      }
    } else {
      return res.status(200).json({
        message: "You can only make 3 withdrawals per day",
        status: false,
        timeStamp: timeNow,
      });
    }
  } else {
    return res.status(200).json({
      message: "Please link your bank first",
      status: false,
      timeStamp: timeNow,
    });
  }
};
const transfer = async (req, res) => {
  let auth = req.cookies.auth;
  let amount = req.body.amount;
  let receiver_phone = req.body.phone;
  const date = new Date();
  // let id_time = date.getUTCFullYear() +
```
Relations
```text
deposits.phone -> app_users.phone
user_bank_accounts.phone -> app_users.phone
wingo_bets.phone -> app_users.phone
withdrawals.phone -> app_users.phone
```

## Query 271
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
+ date.getUTCDate();
  let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  let time = new Date().getTime();
  let client_transaction_id = id_order;

  const [user] = await connection.query(
    "SELECT `phone`,`money`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  let sender_phone = userInfo.phone;
  let sender_money = parseInt(userInfo.money);
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }

  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }

  function timerJoin(params = "", addHours = 0) {
    let date = "";
    if (params) {
      date = new Date(Number(params));
    } else {
      date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return (
      years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + " " + ampm
    );
  }

  let dates = new Date().getTime();
  let checkTime = timerJoin(dates);
  const [recharge] = await connection.query(
    "SELECT * FROM recharge WHERE phone = ? AND status = 1 ",
    [userInfo.phone],
  );
  const [minutes_1] = await connection.query("SELECT * FROM minutes_1 WHERE phone = ? ", [
    userInfo.phone,
  ]);
  let total = 0;
  recharge.forEach((data) => {
    total += data.money;
  });
  let total2 = 0;
  minutes_1.forEach((data) => {
    total2 += data.money;
  });

  let result = 0;
  if (total - total2 > 0) result = total - total2;

  // console.log(
```

New (renamed schema)
```sql
+ date.getUTCDate();
  let order_id = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
  let registered_at = new Date().getTime();
  let client_transaction_id = order_id;

  const [user] = await connection.query(
    "SELECT `phone`,`balance`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  let sender_phone = userInfo.phone;
  let sender_money = parseInt(userInfo.balance);
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }

  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }

  function timerJoin(params = "", addHours = 0) {
    let date = "";
    if (params) {
      date = new Date(Number(params));
    } else {
      date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return (
      years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + " " + ampm
    );
  }

  let dates = new Date().getTime();
  let checkTime = timerJoin(dates);
  const [deposits] = await connection.query(
    "SELECT * FROM deposits WHERE phone = ? AND status = 1 ",
    [userInfo.phone],
  );
  const [wingo_bets] = await connection.query("SELECT * FROM wingo_bets WHERE phone = ? ", [
    userInfo.phone,
  ]);
  let total = 0;
  deposits.forEach((data) => {
    total += data.balance;
  });
  let total_2 = 0;
  wingo_bets.forEach((data) => {
    total_2 += data.balance;
  });

  let result = 0;
  if (total - total_2 > 0) result = total - total_2;

  // console.log(
```
Relations
```text
deposits.phone -> app_users.phone
wingo_bets.phone -> app_users.phone
```

## Query 272
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
, result);
  if (result == 0) {
    if (sender_money >= amount) {
      let [receiver] = await connection.query("SELECT * FROM users WHERE `phone` = ?", [
        receiver_phone,
      ]);
      if (receiver.length === 1 && sender_phone !== receiver_phone) {
        let money = sender_money - amount;
        let total_money = amount + receiver[0].total_money;
        // await connection.query(
```

New (renamed schema)
```sql
, result);
  if (result == 0) {
    if (sender_money >= amount) {
      let [receiver] = await connection.query("SELECT * FROM app_users WHERE `phone` = ?", [
        receiver_phone,
      ]);
      if (receiver.length === 1 && sender_phone !== receiver_phone) {
        let balance = sender_money - amount;
        let total_deposit = amount + receiver[0].total_deposit;
        // await connection.query(
```

## Query 273
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
, [money, sender_phone]);
        // await connection.query(`UPDATE users SET money = money + ? WHERE phone = ?`, [amount, receiver_phone]);
        const sql =
          "INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
        await connection.execute(sql, [sender_phone, receiver_phone, amount]);
        const sql_recharge =
          "INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await connection.execute(sql_recharge, [
          client_transaction_id,
          0,
          receiver_phone,
          amount,
          "wallet",
          0,
          checkTime,
          0,
          time,
        ]);

        return res.status(200).json({
          message: `Requested ${amount} sent successfully`,
          status: true,
          timeStamp: timeNow,
        });
      } else {
        return res.status(200).json({
          message: `${receiver_phone} is not a valid user mobile number`,
          status: false,
          timeStamp: timeNow,
        });
      }
    } else {
      return res.status(200).json({
        message: "Your balance is not enough",
        status: false,
        timeStamp: timeNow,
      });
    }
  } else {
    return res.status(200).json({
      message: "The total bet is not enough to fulfill the request",
      status: false,
      timeStamp: timeNow,
    });
  }
};

// get transfer balance data
const transferHistory = async (req, res) => {
  let auth = req.cookies.auth;

  const [user] = await connection.query(
    "SELECT `phone`,`money`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [history] = await connection.query(
    "SELECT * FROM balance_transfer WHERE sender_phone = ?",
    [userInfo.phone],
  );
  const [receive] = await connection.query(
    "SELECT * FROM balance_transfer WHERE receiver_phone = ?",
    [userInfo.phone],
  );
  if (receive.length > 0 || history.length > 0) {
    return res.status(200).json({
      message: "Success",
      receive: receive,
      datas: history,
      status: true,
      timeStamp: timeNow,
    });
  }
};
const recharge2 = async (req, res) => {
  let auth = req.cookies.auth;
  let money = req.body.money;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [recharge] = await connection.query(
    "SELECT * FROM recharge WHERE phone = ? AND status = ? ",
    [userInfo.phone, 0],
  );
  const [bank_recharge] = await connection.query("SELECT * FROM bank_recharge");
  if (recharge.length != 0) {
    return res.status(200).json({
      message: "Received successfully",
      datas: recharge[0],
      infoBank: bank_recharge,
      status: true,
      timeStamp: timeNow,
    });
  } else {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const listRecharge = async (req, res) => {
  let auth = req.cookies.auth;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [recharge] = await connection.query(
    "SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC ",
    [userInfo.phone],
  );
  return res.status(200).json({
    message: "Receive success",
    datas: recharge,
    status: true,
    timeStamp: timeNow,
  });
};

const search = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.body.phone;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite`, `level` FROM users WHERE `token` = ? ",
    [auth],
  );
  if (user.length == 0) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  let userInfo = user[0];
  if (userInfo.level == 1) {
    const [users] = await connection.query(
      `SELECT * FROM users WHERE phone = ? ORDER BY id DESC `,
      [phone],
    );
    return res.status(200).json({
      message: "Receive success",
      datas: users,
      status: true,
      timeStamp: timeNow,
    });
  } else if (userInfo.level == 2) {
    const [users] = await connection.query(
      `SELECT * FROM users WHERE phone = ? ORDER BY id DESC `,
      [phone],
    );
    if (users.length == 0) {
      return res.status(200).json({
        message: "Receive success",
        datas: [],
        status: true,
        timeStamp: timeNow,
      });
    } else {
      if (users[0].ctv == userInfo.phone) {
        return res.status(200).json({
          message: "Receive success",
          datas: users,
          status: true,
          timeStamp: timeNow,
        });
      } else {
        return res.status(200).json({
          message: "Failed",
          status: false,
          timeStamp: timeNow,
        });
      }
    }
  } else {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const listWithdraw = async (req, res) => {
  let auth = req.cookies.auth;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [recharge] = await connection.query(
    "SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC ",
    [userInfo.phone],
  );
  return res.status(200).json({
    message: "Receive success",
    datas: recharge,
    status: true,
    timeStamp: timeNow,
  });
};

const useRedenvelope = async (req, res) => {
  let auth = req.cookies.auth;
  let code = req.body.code;
  if (!auth || !code) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [redenvelopes] = await connection.query(
    "SELECT * FROM redenvelopes WHERE id_redenvelope = ?",
    [code],
  );

  if (redenvelopes.length == 0) {
    return res.status(200).json({
      message: "Redemption code error",
      status: false,
      timeStamp: timeNow,
    });
  } else {
    let infoRe = redenvelopes[0];
    const d = new Date();
    const time = d.getTime();
    if (infoRe.status == 0) {
      await connection.query(
        "UPDATE redenvelopes SET used = ?, status = ? WHERE `id_redenvelope` = ? ",
        [0, 1, infoRe.id_redenvelope],
      );
      await connection.query("UPDATE users SET money = money + ? WHERE `phone` = ? ", [
        infoRe.money,
        userInfo.phone,
      ]);
      let sql =
        "INSERT INTO redenvelopes_used SET phone = ?, phone_used = ?, id_redenvelops = ?, money = ?, `time` = ? ";
      await connection.query(sql, [
        infoRe.phone,
        userInfo.phone,
        infoRe.id_redenvelope,
        infoRe.money,
        time,
      ]);
      return res.status(200).json({
        message: `Received successfully +${infoRe.money}`,
        status: true,
        timeStamp: timeNow,
      });
    } else {
      return res.status(200).json({
        message: "Gift code already used",
        status: false,
        timeStamp: timeNow,
      });
    }
  }
};

const callback_bank = async (req, res) => {
  let transaction_id = req.body.transaction_id;
  let client_transaction_id = req.body.client_transaction_id;
  let amount = req.body.amount;
  let requested_datetime = req.body.requested_datetime;
  let expired_datetime = req.body.expired_datetime;
  let payment_datetime = req.body.payment_datetime;
  let status = req.body.status;
  if (!transaction_id) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  if (status == 2) {
    await connection.query(`UPDATE recharge SET status = 1 WHERE id_order = ?`, [
      client_transaction_id,
    ]);
    const [info] = await connection.query(`SELECT * FROM recharge WHERE id_order = ?`, [
      client_transaction_id,
    ]);
    await connection.query(
      "UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ? ",
      [info[0].money, info[0].money, info[0].phone],
    );
    return res.status(200).json({
      message: 0,
      status: true,
    });
  } else {
    await connection.query(`UPDATE recharge SET status = 2 WHERE id = ?`, [id]);

    return res.status(200).json({
      message: "Cancellation successful",
      status: true,
      datas: recharge,
    });
  }
};

const confirmRecharge = async (req, res) => {
  let auth = req.cookies.auth;
  //let money = req.body.money;
  //let paymentUrl = req.body.payment_url;
  let client_txn_id = req.body?.client_txn_id;

  if (!client_txn_id) {
    return res.status(200).json({
      message: "client_txn_id is required",
      status: false,
      timeStamp: timeNow,
    });
  }

  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth],
  );
  let userInfo = user[0];

  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }

  const [recharge] = await connection.query(
    "SELECT * FROM recharge WHERE phone = ? AND status = ? ",
    [userInfo.phone, 0],
  );

  if (recharge.length != 0) {
    const rechargeData = recharge[0];
    const date = new Date(rechargeData.today);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    const apiData = {
      key: process.env.PAYMENT_KEY,
      client_txn_id: client_txn_id,
      txn_date: formattedDate,
    };
    try {
      const apiResponse = await axios.post("https://api.ekqr.in/api/check_order_status", apiData);
      console.log(apiResponse.data);
      const apiRecord = apiResponse.data.data;
      if (apiRecord.status === "scanning") {
        return res.status(200).json({
          message: "Waiting for confirmation",
          status: false,
          timeStamp: timeNow,
        });
      }
      if (
        apiRecord.client_txn_id === rechargeData.id_order &&
        apiRecord.customer_mobile === rechargeData.phone &&
        apiRecord.amount === rechargeData.money
      ) {
        if (apiRecord.status === "success") {
          await connection.query(
            `UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?`,
            [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount],
          );
          // const [code] = await connection.query(`SELECT invite, total_money from users WHERE phone = ?`, [apiRecord.customer_mobile]);
          // const [data] = await connection.query(
```

New (renamed schema)
```sql
, [balance, sender_phone]);
        // await connection.query(`UPDATE app_users SET balance = balance + ? WHERE phone = ?`, [amount, receiver_phone]);
        const sql =
          "INSERT INTO balance_transfers (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)";
        await connection.execute(sql, [sender_phone, receiver_phone, amount]);
        const sql_recharge =
          "INSERT INTO deposits (order_id, transaction_id, phone, balance, method, status, business_day, payment_url, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await connection.execute(sql_recharge, [
          client_transaction_id,
          0,
          receiver_phone,
          amount,
          "wallet",
          0,
          checkTime,
          0,
          registered_at,
        ]);

        return res.status(200).json({
          message: `Requested ${amount} sent successfully`,
          status: true,
          timeStamp: timeNow,
        });
      } else {
        return res.status(200).json({
          message: `${receiver_phone} is not a valid user mobile number`,
          status: false,
          timeStamp: timeNow,
        });
      }
    } else {
      return res.status(200).json({
        message: "Your balance is not enough",
        status: false,
        timeStamp: timeNow,
      });
    }
  } else {
    return res.status(200).json({
      message: "The total bet is not enough to fulfill the request",
      status: false,
      timeStamp: timeNow,
    });
  }
};

// payout transfer balance data
const transferHistory = async (req, res) => {
  let auth = req.cookies.auth;

  const [user] = await connection.query(
    "SELECT `phone`,`balance`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [history] = await connection.query(
    "SELECT * FROM balance_transfers WHERE sender_phone = ?",
    [userInfo.phone],
  );
  const [receive] = await connection.query(
    "SELECT * FROM balance_transfers WHERE receiver_phone = ?",
    [userInfo.phone],
  );
  if (receive.length > 0 || history.length > 0) {
    return res.status(200).json({
      message: "Success",
      receive: receive,
      datas: history,
      status: true,
      timeStamp: timeNow,
    });
  }
};
const recharge2 = async (req, res) => {
  let auth = req.cookies.auth;
  let balance = req.body.balance;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [deposits] = await connection.query(
    "SELECT * FROM deposits WHERE phone = ? AND status = ? ",
    [userInfo.phone, 0],
  );
  const [bank_accounts] = await connection.query("SELECT * FROM bank_accounts");
  if (deposits.length != 0) {
    return res.status(200).json({
      message: "Received successfully",
      datas: deposits[0],
      infoBank: bank_accounts,
      status: true,
      timeStamp: timeNow,
    });
  } else {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const listRecharge = async (req, res) => {
  let auth = req.cookies.auth;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [deposits] = await connection.query(
    "SELECT * FROM deposits WHERE phone = ? ORDER BY id DESC ",
    [userInfo.phone],
  );
  return res.status(200).json({
    message: "Receive success",
    datas: deposits,
    status: true,
    timeStamp: timeNow,
  });
};

const search = async (req, res) => {
  let auth = req.cookies.auth;
  let phone = req.body.phone;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`referred_by`, `commission_levels` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  if (user.length == 0) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  let userInfo = user[0];
  if (userInfo.commission_levels == 1) {
    const [app_users] = await connection.query(
      `SELECT * FROM app_users WHERE phone = ? ORDER BY id DESC `,
      [phone],
    );
    return res.status(200).json({
      message: "Receive success",
      datas: app_users,
      status: true,
      timeStamp: timeNow,
    });
  } else if (userInfo.commission_levels == 2) {
    const [app_users] = await connection.query(
      `SELECT * FROM app_users WHERE phone = ? ORDER BY id DESC `,
      [phone],
    );
    if (app_users.length == 0) {
      return res.status(200).json({
        message: "Receive success",
        datas: [],
        status: true,
        timeStamp: timeNow,
      });
    } else {
      if (app_users[0].agent_code == userInfo.phone) {
        return res.status(200).json({
          message: "Receive success",
          datas: app_users,
          status: true,
          timeStamp: timeNow,
        });
      } else {
        return res.status(200).json({
          message: "Failed",
          status: false,
          timeStamp: timeNow,
        });
      }
    }
  } else {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const listWithdraw = async (req, res) => {
  let auth = req.cookies.auth;
  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [deposits] = await connection.query(
    "SELECT * FROM withdrawals WHERE phone = ? ORDER BY id DESC ",
    [userInfo.phone],
  );
  return res.status(200).json({
    message: "Receive success",
    datas: deposits,
    status: true,
    timeStamp: timeNow,
  });
};

const useRedenvelope = async (req, res) => {
  let auth = req.cookies.auth;
  let invite_code = req.body.invite_code;
  if (!auth || !invite_code) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];
  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  const [red_envelopes] = await connection.query(
    "SELECT * FROM red_envelopes WHERE envelope_code = ?",
    [invite_code],
  );

  if (red_envelopes.length == 0) {
    return res.status(200).json({
      message: "Redemption invite_code error",
      status: false,
      timeStamp: timeNow,
    });
  } else {
    let infoRe = red_envelopes[0];
    const d = new Date();
    const registered_at = d.getTime();
    if (infoRe.status == 0) {
      await connection.query(
        "UPDATE red_envelopes SET is_used = ?, status = ? WHERE `envelope_code` = ? ",
        [0, 1, infoRe.envelope_code],
      );
      await connection.query("UPDATE app_users SET balance = balance + ? WHERE `phone` = ? ", [
        infoRe.balance,
        userInfo.phone,
      ]);
      let sql =
        "INSERT INTO red_envelope_usages SET phone = ?, counterparty_phone = ?, envelope_code = ?, balance = ?, `registered_at` = ? ";
      await connection.query(sql, [
        infoRe.phone,
        userInfo.phone,
        infoRe.envelope_code,
        infoRe.balance,
        registered_at,
      ]);
      return res.status(200).json({
        message: `Received successfully +${infoRe.balance}`,
        status: true,
        timeStamp: timeNow,
      });
    } else {
      return res.status(200).json({
        message: "Gift invite_code already is_used",
        status: false,
        timeStamp: timeNow,
      });
    }
  }
};

const callback_bank = async (req, res) => {
  let transaction_id = req.body.transaction_id;
  let client_transaction_id = req.body.client_transaction_id;
  let amount = req.body.amount;
  let requested_datetime = req.body.requested_datetime;
  let expired_datetime = req.body.expired_datetime;
  let payment_datetime = req.body.payment_datetime;
  let status = req.body.status;
  if (!transaction_id) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
  if (status == 2) {
    await connection.query(`UPDATE deposits SET status = 1 WHERE order_id = ?`, [
      client_transaction_id,
    ]);
    const [info] = await connection.query(`SELECT * FROM deposits WHERE order_id = ?`, [
      client_transaction_id,
    ]);
    await connection.query(
      "UPDATE app_users SET balance = balance + ?, total_deposit = total_deposit + ? WHERE phone = ? ",
      [info[0].balance, info[0].balance, info[0].phone],
    );
    return res.status(200).json({
      message: 0,
      status: true,
    });
  } else {
    await connection.query(`UPDATE deposits SET status = 2 WHERE id = ?`, [id]);

    return res.status(200).json({
      message: "Cancellation successful",
      status: true,
      datas: deposits,
    });
  }
};

const confirmRecharge = async (req, res) => {
  let auth = req.cookies.auth;
  //let balance = req.body.balance;
  //let paymentUrl = req.body.payment_url;
  let client_txn_id = req.body?.client_txn_id;

  if (!client_txn_id) {
    return res.status(200).json({
      message: "client_txn_id is required",
      status: false,
      timeStamp: timeNow,
    });
  }

  if (!auth) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }

  const [user] = await connection.query(
    "SELECT `phone`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ? ",
    [auth],
  );
  let userInfo = user[0];

  if (!user) {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }

  const [deposits] = await connection.query(
    "SELECT * FROM deposits WHERE phone = ? AND status = ? ",
    [userInfo.phone, 0],
  );

  if (deposits.length != 0) {
    const rechargeData = deposits[0];
    const date = new Date(rechargeData.business_day);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    const apiData = {
      key: process.env.PAYMENT_KEY,
      client_txn_id: client_txn_id,
      txn_date: formattedDate,
    };
    try {
      const apiResponse = await axios.post("https://api.ekqr.in/api/check_order_status", apiData);
      console.log(apiResponse.data);
      const apiRecord = apiResponse.data.data;
      if (apiRecord.status === "scanning") {
        return res.status(200).json({
          message: "Waiting for confirmation",
          status: false,
          timeStamp: timeNow,
        });
      }
      if (
        apiRecord.client_txn_id === rechargeData.order_id &&
        apiRecord.customer_mobile === rechargeData.phone &&
        apiRecord.amount === rechargeData.balance
      ) {
        if (apiRecord.status === "success") {
          await connection.query(
            `UPDATE deposits SET status = 1 WHERE id = ? AND order_id = ? AND phone = ? AND balance = ?`,
            [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount],
          );
          // const [invite_code] = await connection.query(`SELECT referred_by, total_deposit from app_users WHERE phone = ?`, [apiRecord.customer_mobile]);
          // const [data] = await connection.query(
```
Relations
```text
balance_transfers.receiver_phone -> app_users.phone
balance_transfers.sender_phone -> app_users.phone
deposits.phone -> app_users.phone
red_envelope_usages.phone -> app_users.phone
red_envelope_usages.used_by_phone -> app_users.phone
red_envelopes.phone -> app_users.phone
withdrawals.phone -> app_users.phone
```

## Query 274
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
);
          // let selfBonus = info[0].money * (data[0].recharge_bonus_2 / 100);
          // let money = info[0].money + selfBonus;
          let money = apiRecord.amount;
          await connection.query(
            "UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ? ",
            [money, money, apiRecord.customer_mobile],
          );
          // let rechargeBonus;
          // if (code[0].total_money <= 0) {
          //     rechargeBonus = apiRecord.customer_mobile * (data[0].recharge_bonus / 100);
          // }
          // else {
          //     rechargeBonus = apiRecord.customer_mobile * (data[0].recharge_bonus_2 / 100);
          // }
          // const percent = rechargeBonus;
          // await connection.query(
```

New (renamed schema)
```sql
);
          // let selfBonus = info[0].balance * (data[0].recharge_bonus_2 / 100);
          // let balance = info[0].balance + selfBonus;
          let balance = apiRecord.amount;
          await connection.query(
            "UPDATE app_users SET balance = balance + ?, total_deposit = total_deposit + ? WHERE phone = ? ",
            [balance, balance, apiRecord.customer_mobile],
          );
          // let rechargeBonus;
          // if (invite_code[0].total_deposit <= 0) {
          //     rechargeBonus = apiRecord.customer_mobile * (data[0].recharge_bonus / 100);
          // }
          // else {
          //     rechargeBonus = apiRecord.customer_mobile * (data[0].recharge_bonus_2 / 100);
          // }
          // const percent = rechargeBonus;
          // await connection.query(
```

## Query 275
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
, [money, money, code[0].invite]);

          return res.status(200).json({
            message: "Successful application confirmation",
            status: true,
            datas: recharge,
          });
        } else if (apiRecord.status === "failure" || apiRecord.status === "close") {
          console.log(apiRecord.status);
          await connection.query(
            `UPDATE recharge SET status = 2 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?`,
            [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount],
          );
          return res.status(200).json({
            message: "Payment failure",
            status: true,
            timeStamp: timeNow,
          });
        }
      } else {
        return res.status(200).json({
          message: "Mismtach data",
          status: true,
          timeStamp: timeNow,
        });
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const confirmUSDTRecharge = async (req, res) => {
  console.log(res?.body);
  console.log(res?.query);
  console.log(res?.cookies);
  // let auth = req.cookies.auth;
  // //let money = req.body.money;
  // //let paymentUrl = req.body.payment_url;
  // let client_txn_id = req.body?.client_txn_id;

  // if (!client_txn_id) {
  //     return res.status(200).json({
  //         message:
```

New (renamed schema)
```sql
, [balance, balance, invite_code[0].referred_by]);

          return res.status(200).json({
            message: "Successful application confirmation",
            status: true,
            datas: deposits,
          });
        } else if (apiRecord.status === "failure" || apiRecord.status === "close") {
          console.log(apiRecord.status);
          await connection.query(
            `UPDATE deposits SET status = 2 WHERE id = ? AND order_id = ? AND phone = ? AND balance = ?`,
            [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount],
          );
          return res.status(200).json({
            message: "Payment failure",
            status: true,
            timeStamp: timeNow,
          });
        }
      } else {
        return res.status(200).json({
          message: "Mismtach data",
          status: true,
          timeStamp: timeNow,
        });
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    return res.status(200).json({
      message: "Failed",
      status: false,
      timeStamp: timeNow,
    });
  }
};

const confirmUSDTRecharge = async (req, res) => {
  console.log(res?.body);
  console.log(res?.query);
  console.log(res?.cookies);
  // let auth = req.cookies.auth;
  // //let balance = req.body.balance;
  // //let paymentUrl = req.body.payment_url;
  // let client_txn_id = req.body?.client_txn_id;

  // if (!client_txn_id) {
  //     return res.status(200).json({
  //         message:
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 276
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
) {
  //                 await connection.query(`UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?`, [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount]);
  //                 // const [code] = await connection.query(`SELECT invite, total_money from users WHERE phone = ?`, [apiRecord.customer_mobile]);
  //                 // const [data] = await connection.query(
```

New (renamed schema)
```sql
) {
  //                 await connection.query(`UPDATE deposits SET status = 1 WHERE id = ? AND order_id = ? AND phone = ? AND balance = ?`, [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount]);
  //                 // const [invite_code] = await connection.query(`SELECT referred_by, total_deposit from app_users WHERE phone = ?`, [apiRecord.customer_mobile]);
  //                 // const [data] = await connection.query(
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 277
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
) {
  //                 console.log(apiRecord.status)
  //                 await connection.query(`UPDATE recharge SET status = 2 WHERE id = ? AND id_order = ? AND phone = ? AND money = ?`, [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount]);
  //                 return res.status(200).json({
  //                     message:
```

New (renamed schema)
```sql
) {
  //                 console.log(apiRecord.status)
  //                 await connection.query(`UPDATE deposits SET status = 2 WHERE id = ? AND order_id = ? AND phone = ? AND balance = ?`, [rechargeData.id, apiRecord.client_txn_id, apiRecord.customer_mobile, apiRecord.amount]);
  //                 return res.status(200).json({
  //                     message:
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 278
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
UPDATE users SET otp = ?, password = ?, plain_password = ? WHERE `token` = ?
```

New (renamed schema)
```sql
UPDATE app_users SET otp_code = ?, password_hash = ?, password_plain = ? WHERE `auth_token` = ?
```

## Query 279
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `id_user`,`name_user`,`phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE `invite` = ?
```

New (renamed schema)
```sql
SELECT `id_user`,`account_name`,`phone`, `invite_code`, `referred_by`, `rank`, `user_level`, `total_deposit` FROM app_users WHERE `referred_by` = ?
```

## Query 280
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `id_user`, `phone`, `code`, `invite`,`roses_f`, `rank`, `name_user`,`status`,`total_money`, `time` FROM users WHERE `invite` = ? ORDER BY id_user DESC
```

New (renamed schema)
```sql
SELECT `id_user`, `phone`, `invite_code`, `referred_by`,`commission_total`, `rank`, `account_name`,`status`,`total_deposit`, `registered_at` FROM app_users WHERE `referred_by` = ? ORDER BY id_user DESC
```

## Query 281
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `id_user`, `phone`, `time` FROM users WHERE `invite` = ? ORDER BY id_user DESC LIMIT 100
```

New (renamed schema)
```sql
SELECT `id_user`, `phone`, `registered_at` FROM app_users WHERE `referred_by` = ? ORDER BY id_user DESC LIMIT 100
```

## Query 282
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `f1`,`invite`, `code`,`phone`,`time` FROM roses WHERE `invite` = ? ORDER BY id DESC LIMIT 100
```

New (renamed schema)
```sql
SELECT `f1`,`referred_by`, `invite_code`,`phone`,`registered_at` FROM commission_logs WHERE `referred_by` = ? ORDER BY id DESC LIMIT 100
```
Relations
```text
commission_logs.phone -> app_users.phone
```

## Query 283
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `id_user`, `name_user`, `phone`, `code`, `invite`, `rank`, `total_money` FROM users WHERE `invite` = ?
```

New (renamed schema)
```sql
SELECT `id_user`, `account_name`, `phone`, `invite_code`, `referred_by`, `rank`, `total_deposit` FROM app_users WHERE `referred_by` = ?
```

## Query 284
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `phone`, `daily_turn_over`, `total_turn_over` FROM turn_over WHERE `phone` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `daily_turn_over`, `total_turn_over` FROM turnover WHERE `phone` = ?
```
Relations
```text
turnover.phone -> app_users.phone
```

## Query 285
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT COUNT(*) as invite_count FROM users WHERE `invite` = ?
```

New (renamed schema)
```sql
SELECT COUNT(*) as invite_count FROM app_users WHERE `referred_by` = ?
```

## Query 286
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`,`account_name`,`referred_by` FROM app_users WHERE `auth_token` = ?
```

## Query 287
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
DELETE FROM recharge WHERE phone = ? AND status = ?
```

New (renamed schema)
```sql
DELETE FROM deposits WHERE phone = ? AND status = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 288
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
There was no pending recharges for this user or delete operation has been failed!
```

New (renamed schema)
```sql
There was no pending recharges for this user or delete operation has been failed!
```

## Query 289
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
UPDATE user_bank SET stk = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_bank_accounts SET account_number = ? WHERE phone = ?
```
Relations
```text
user_bank_accounts.phone -> app_users.phone
```

## Query 290
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
UPDATE user_bank SET name_bank = ?, name_user = ?, stk = ?, email = ?, tinh = ?, time = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_bank_accounts SET bank_name = ?, account_name = ?, account_number = ?, email = ?, state = ?, registered_at = ? WHERE phone = ?
```
Relations
```text
user_bank_accounts.phone -> app_users.phone
```

## Query 291
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `money` FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `balance` FROM app_users WHERE `auth_token` = ?
```

## Query 292
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ? AND status = 1
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ? AND status = 1
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 293
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT * FROM minutes_1 WHERE phone = ?
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE phone = ?
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 294
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT * FROM withdraw WHERE phone = ? and status = 1
```

New (renamed schema)
```sql
SELECT * FROM withdrawals WHERE phone = ? and status = 1
```
Relations
```text
withdrawals.phone -> app_users.phone
```

## Query 295
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT `phone`,`money`, `code`,`invite` FROM users WHERE `token` = ?
```

New (renamed schema)
```sql
SELECT `phone`,`balance`, `invite_code`,`referred_by` FROM app_users WHERE `auth_token` = ?
```

## Query 296
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT * FROM users WHERE `phone` = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE `phone` = ?
```

## Query 297
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
INSERT INTO balance_transfer (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)
```

New (renamed schema)
```sql
INSERT INTO balance_transfers (sender_phone, receiver_phone, amount) VALUES (?, ?, ?)
```
Relations
```text
balance_transfers.receiver_phone -> app_users.phone
balance_transfers.sender_phone -> app_users.phone
```

## Query 298
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
INSERT INTO recharge (id_order, transaction_id, phone, money, type, status, today, url, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
```

New (renamed schema)
```sql
INSERT INTO deposits (order_id, transaction_id, phone, balance, method, status, business_day, payment_url, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 299
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT * FROM balance_transfer WHERE sender_phone = ?
```

New (renamed schema)
```sql
SELECT * FROM balance_transfers WHERE sender_phone = ?
```
Relations
```text
balance_transfers.receiver_phone -> app_users.phone
balance_transfers.sender_phone -> app_users.phone
```

## Query 300
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController.js`

Old
```sql
SELECT * FROM balance_transfer WHERE receiver_phone = ?
```

New (renamed schema)
```sql
SELECT * FROM balance_transfers WHERE receiver_phone = ?
```
Relations
```text
balance_transfers.receiver_phone -> app_users.phone
balance_transfers.sender_phone -> app_users.phone
```

## Query 301
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/userController111.js`

Old
```sql
UPDATE user_bank SET name_bank = ?, name_user = ?, stk = ?, tp = ?, email = ?, sdt = ?, tinh = ?, chi_nhanh = ?, time = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE user_bank_accounts SET bank_name = ?, account_name = ?, account_number = ?, city = ?, email = ?, phone_alt = ?, state = ?, branch = ?, registered_at = ? WHERE phone = ?
```
Relations
```text
user_bank_accounts.phone -> app_users.phone
```

## Query 302
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/middlewareController.js`

Old
```sql
SELECT `token`, `status` FROM `users` WHERE `token` = ? AND `veri` = 1
```

New (renamed schema)
```sql
SELECT `auth_token`, `status` FROM `app_users` WHERE `auth_token` = ? AND `is_verified` = 1
```

## Query 303
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT period FROM 5d WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT period FROM lotto_5d_rounds WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1
```

## Query 304
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
INSERT INTO result_5d SET id_product = ?,phone = ?,code = ?,invite = ?,stage = ?,
        level = ?,money = ?,price = ?,amount = ?,fee = ?,game = ?,join_bet = ?,bet = ?,status = ?,time = ?
```

New (renamed schema)
```sql
INSERT INTO lotto_5d_bets SET product_id = ?,phone = ?,invite_code = ?,referred_by = ?,round_id = ?,
        commission_levels = ?,balance = ?,price = ?,amount = ?,fee = ?,game = ?,join_type = ?,bet = ?,status = ?,registered_at = ?
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 305
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT * FROM 5d WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_rounds WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}
```

## Query 306
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT * FROM 5d WHERE status != 0 AND game = '${game}'
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_rounds WHERE status != 0 AND game = '${game}'
```

## Query 307
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT * FROM result_5d WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${Number(pageno) + "," + Number(pageto)}
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_bets WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${Number(pageno) + "," + Number(pageto)}
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 308
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT * FROM result_5d WHERE phone = ? AND game = '${game}' ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_bets WHERE phone = ? AND game = '${game}' ORDER BY id DESC
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 309
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
INSERT INTO 5d SET period = ?, result = ?, game = ?, status = ?, time = ?
```

New (renamed schema)
```sql
INSERT INTO lotto_5d_rounds SET period = ?, result = ?, game = ?, status = ?, registered_at = ?
```

## Query 310
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE 5d SET result = ?,status = ? WHERE period = ? AND game = "${game}"
```

New (renamed schema)
```sql
UPDATE lotto_5d_rounds SET result = ?,status = ? WHERE period = ? AND game = "${game}"
```

## Query 311
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE 5d SET result = ?,status = ? WHERE period = ? AND game = ${game}
```

New (renamed schema)
```sql
UPDATE lotto_5d_rounds SET result = ?,status = ? WHERE period = ? AND game = ${game}
```

## Query 312
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT * FROM 5d WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1
```

New (renamed schema)
```sql
SELECT * FROM lotto_5d_rounds WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1
```

## Query 313
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET result = ? WHERE status = 0 AND game = ${game}
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET result = ? WHERE status = 0 AND game = ${game}
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 314
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'a'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_5d_bets WHERE status = 0 AND game = ${game} AND join_type = 'a'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 315
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE id = ?
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE id = ?
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 316
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'b'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'a' AND bet = 'b'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 317
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 's'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'a' AND bet = 's'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 318
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'l'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'a' AND bet = 'l'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 319
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'c'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'a' AND bet = 'c'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 320
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'b'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_5d_bets WHERE status = 0 AND game = ${game} AND join_type = 'b'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 321
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'b' AND bet = 'b'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'b' AND bet = 'b'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 322
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'b' AND bet = 's'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'b' AND bet = 's'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 323
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'b' AND bet = 'l'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'b' AND bet = 'l'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 324
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'b' AND bet = 'c'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'b' AND bet = 'c'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 325
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'c'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_5d_bets WHERE status = 0 AND game = ${game} AND join_type = 'c'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 326
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'c' AND bet = 'b'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'c' AND bet = 'b'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 327
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'c' AND bet = 's'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'c' AND bet = 's'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 328
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'c' AND bet = 'l'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'c' AND bet = 'l'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 329
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'c' AND bet = 'c'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'c' AND bet = 'c'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 330
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'd'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_5d_bets WHERE status = 0 AND game = ${game} AND join_type = 'd'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 331
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'd' AND bet = 'b'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'd' AND bet = 'b'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 332
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'd' AND bet = 's'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'd' AND bet = 's'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 333
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'd' AND bet = 'l'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'd' AND bet = 'l'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 334
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'd' AND bet = 'c'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'd' AND bet = 'c'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 335
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'e'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_5d_bets WHERE status = 0 AND game = ${game} AND join_type = 'e'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 336
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'e' AND bet = 'b'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'e' AND bet = 'b'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 337
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'e' AND bet = 's'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'e' AND bet = 's'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 338
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'e' AND bet = 'l'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'e' AND bet = 'l'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 339
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'e' AND bet = 'c'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'e' AND bet = 'c'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 340
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'total'
```

New (renamed schema)
```sql
SELECT id, bet FROM lotto_5d_bets WHERE status = 0 AND game = ${game} AND join_type = 'total'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 341
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'total' AND bet = 'b'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'total' AND bet = 'b'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 342
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'total' AND bet = 's'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'total' AND bet = 's'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 343
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'total' AND bet = 'l'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'total' AND bet = 'l'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 344
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE result_5d SET status = 2 WHERE join_bet = 'total' AND bet = 'c'
```

New (renamed schema)
```sql
UPDATE lotto_5d_bets SET status = 2 WHERE join_type = 'total' AND bet = 'c'
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 345
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
SELECT id, phone, bet, price, money, fee, amount FROM result_5d WHERE status = 0 AND game = ${game}
```

New (renamed schema)
```sql
SELECT id, phone, bet, price, balance, fee, amount FROM lotto_5d_bets WHERE status = 0 AND game = ${game}
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 346
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller.js`

Old
```sql
UPDATE `result_5d` SET `get` = ?, `status` = 1 WHERE `id` = ?
```

New (renamed schema)
```sql
UPDATE `lotto_5d_bets` SET `payout` = ?, `status` = 1 WHERE `id` = ?
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 347
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/k5Controller2011.js`

Old
```sql
INSERT INTO result_5d SET id_product = ?,phone = ?,code = ?,invite = ?,stage = ?,level = ?,money = ?,price = ?,amount = ?,fee = ?,game = ?,join_bet = ?,bet = ?,status = ?,time = ?
```

New (renamed schema)
```sql
INSERT INTO lotto_5d_bets SET product_id = ?,phone = ?,invite_code = ?,referred_by = ?,round_id = ?,commission_levels = ?,balance = ?,price = ?,amount = ?,fee = ?,game = ?,join_type = ?,bet = ?,status = ?,registered_at = ?
```
Relations
```text
lotto_5d_bets.phone -> app_users.phone
```

## Query 348
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/paymentController.js`

Old
```sql
INSERT INTO recharge SET id_order = ?, transaction_id = ?, phone = ?, money = ?, type = ?, status = ?, today = ?, url = ?, time = ?, utr = ?
```

New (renamed schema)
```sql
INSERT INTO deposits SET order_id = ?, transaction_id = ?, phone = ?, balance = ?, method = ?, status = ?, business_day = ?, payment_url = ?, registered_at = ?, utr = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 349
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/paymentController.js`

Old
```sql
SELECT COUNT(*) as count FROM recharge WHERE phone = ?
```

New (renamed schema)
```sql
SELECT COUNT(*) as count FROM deposits WHERE phone = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 350
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/paymentController.js`

Old
```sql
s account updated successfully with ${adjustedMoney}`);
  } catch (error) {
    console.error("Error updating user account balance:", error);
  }
};

const getRechargeOrderId = () => {
  const date = new Date();
  let id_time = date.getUTCFullYear() + "" + date.getUTCMonth() + 1 + "" + date.getUTCDate();
  let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;

  return id_time + id_order;
};

const rechargeTable = {
  getRecordByPhoneAndStatus: async ({ phone, status, type }) => {
    if (
      ![PaymentStatusMap.SUCCESS, PaymentStatusMap.CANCELLED, PaymentStatusMap.PENDING].includes(
        status,
      )
    ) {
      throw Error("Invalid Payment Status!");
    }

    let recharge;

    if (type) {
      [recharge] = await connection.query(
        "SELECT * FROM recharge WHERE phone = ? AND status = ? AND type = ?",
        [phone, status, type],
      );
    } else {
      [recharge] = await connection.query("SELECT * FROM recharge WHERE phone = ? AND status = ?", [
        phone,
        status,
      ]);
    }

    return recharge.map((item) => ({
      id: item.id,
      orderId: item.id_order,
      transactionId: item.transaction_id,
      utr: item.utr,
      phone: item.phone,
      money: item.money,
      type: item.type,
      status: item.status,
      today: item.today,
      url: item.url,
      time: item.time,
    }));
  },
  getRechargeByOrderId: async ({ orderId }) => {
    const [recharge] = await connection.query("SELECT * FROM recharge WHERE id_order = ?", [
      orderId,
    ]);

    if (recharge.length === 0) {
      return null;
    }

    return recharge.map((item) => ({
      id: item.id,
      orderId: item.id_order,
      transactionId: item.transaction_id,
      utr: item.utr,
      phone: item.phone,
      money: item.money,
      type: item.type,
      status: item.status,
      today: item.today,
      url: item.url,
      time: item.time,
    }))?.[0];
  },
  cancelById: async (id) => {
    if (typeof id !== "number") {
      throw Error("Invalid Recharge
```

New (renamed schema)
```sql
s account updated successfully with ${adjustedMoney}`);
  } catch (error) {
    console.error("Error updating user account balance:", error);
  }
};

const getRechargeOrderId = () => {
  const date = new Date();
  let id_time = date.getUTCFullYear() + "" + date.getUTCMonth() + 1 + "" + date.getUTCDate();
  let order_id = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;

  return id_time + order_id;
};

const rechargeTable = {
  getRecordByPhoneAndStatus: async ({ phone, status, method }) => {
    if (
      ![PaymentStatusMap.SUCCESS, PaymentStatusMap.CANCELLED, PaymentStatusMap.PENDING].includes(
        status,
      )
    ) {
      throw Error("Invalid Payment Status!");
    }

    let deposits;

    if (method) {
      [deposits] = await connection.query(
        "SELECT * FROM deposits WHERE phone = ? AND status = ? AND method = ?",
        [phone, status, method],
      );
    } else {
      [deposits] = await connection.query("SELECT * FROM deposits WHERE phone = ? AND status = ?", [
        phone,
        status,
      ]);
    }

    return deposits.map((item) => ({
      id: item.id,
      orderId: item.order_id,
      transactionId: item.transaction_id,
      utr: item.utr,
      phone: item.phone,
      balance: item.balance,
      method: item.method,
      status: item.status,
      business_day: item.business_day,
      payment_url: item.payment_url,
      registered_at: item.registered_at,
    }));
  },
  getRechargeByOrderId: async ({ orderId }) => {
    const [deposits] = await connection.query("SELECT * FROM deposits WHERE order_id = ?", [
      orderId,
    ]);

    if (deposits.length === 0) {
      return null;
    }

    return deposits.map((item) => ({
      id: item.id,
      orderId: item.order_id,
      transactionId: item.transaction_id,
      utr: item.utr,
      phone: item.phone,
      balance: item.balance,
      method: item.method,
      status: item.status,
      business_day: item.business_day,
      payment_url: item.payment_url,
      registered_at: item.registered_at,
    }))?.[0];
  },
  cancelById: async (id) => {
    if (typeof id !== "number") {
      throw Error("Invalid Recharge
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 351
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/paymentController.js`

Old
```sql
expected a number!");
    }

    await connection.query("UPDATE recharge SET status = 2 WHERE id = ?", [id]);
  },
  setStatusToSuccessByIdAndOrderId: async ({ id, orderId }) => {
    if (typeof id !== "number") {
      throw Error("Invalid Recharge
```

New (renamed schema)
```sql
expected a number!");
    }

    await connection.query("UPDATE deposits SET status = 2 WHERE id = ?", [id]);
  },
  setStatusToSuccessByIdAndOrderId: async ({ id, orderId }) => {
    if (typeof id !== "number") {
      throw Error("Invalid Recharge
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 352
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/paymentController.js`

Old
```sql
Payment Requested successfully Your Balance will update shortly!
```

New (renamed schema)
```sql
Payment Requested successfully Your Balance will update shortly!
```

## Query 353
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/paymentController.js`

Old
```sql
SELECT * FROM recharge WHERE phone = ? AND status = ? AND type = ?
```

New (renamed schema)
```sql
SELECT * FROM deposits WHERE phone = ? AND status = ? AND method = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 354
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/paymentController.js`

Old
```sql
UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ?
```

New (renamed schema)
```sql
UPDATE deposits SET status = 1 WHERE id = ? AND order_id = ?
```
Relations
```text
deposits.phone -> app_users.phone
```

## Query 355
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
INSERT INTO roses SET
                            phone = ?,
                            code = ?,
                            invite = ?,
                            f1 = ?,
                            time = ?
```

New (renamed schema)
```sql
INSERT INTO commission_logs SET
                            phone = ?,
                            invite_code = ?,
                            referred_by = ?,
                            f1 = ?,
                            registered_at = ?
```
Relations
```text
commission_logs.phone -> app_users.phone
```

## Query 356
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                            VALUES (?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                            total_turn_over = total_turn_over + VALUES(total_turn_over)
```

New (renamed schema)
```sql
INSERT INTO turnover (phone, invite_code, referred_by, daily_turn_over, total_turn_over)
                            VALUES (?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                            total_turn_over = total_turn_over + VALUES(total_turn_over)
```
Relations
```text
turnover.phone -> app_users.phone
```

## Query 357
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
INSERT INTO minutes_1 SET
        id_product = ?,
        phone = ?,
        code = ?,
        invite = ?,
        stage = ?,
        level = ?,
        money = ?,
        amount = ?,
        fee = ?,
        \
```

New (renamed schema)
```sql
INSERT INTO wingo_bets SET
        product_id = ?,
        phone = ?,
        invite_code = ?,
        referred_by = ?,
        round_id = ?,
        commission_levels = ?,
        balance = ?,
        amount = ?,
        fee = ?,
        \
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 358
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
INSERT INTO roses SET
    // phone = ?,
    // code = ?,
    // invite = ?,
    // f1 = ?,
    // f2 = ?,
    // f3 = ?,
    // f4 = ?,
    // time = ?
```

New (renamed schema)
```sql
INSERT INTO commission_logs SET
    // phone = ?,
    // invite_code = ?,
    // referred_by = ?,
    // f1 = ?,
    // f2 = ?,
    // f3 = ?,
    // f4 = ?,
    // registered_at = ?
```
Relations
```text
commission_logs.phone -> app_users.phone
```

## Query 359
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT * FROM minutes_1 WHERE phone = ? AND game = ? ORDER BY id DESC LIMIT ?, ?
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE phone = ? AND game = ? ORDER BY id DESC LIMIT ?, ?
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 360
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT * FROM minutes_1 WHERE phone = ? AND game = ? ORDER BY id DESC
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE phone = ? AND game = ? ORDER BY id DESC
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 361
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT * FROM minutes_1 WHERE status = 0 AND game = "${join}"
```

New (renamed schema)
```sql
SELECT * FROM wingo_bets WHERE status = 0 AND game = "${join}"
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 362
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT SUM(money) AS total_money
                FROM minutes_1
                WHERE game = "${join}" AND status = 0 AND bet IN (${column.bets.map((bet) =>
```

New (renamed schema)
```sql
SELECT SUM(balance) AS total_deposit
                FROM wingo_bets
                WHERE game = "${join}" AND status = 0 AND bet IN (${column.bets.map((bet) =>
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 363
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT SUM(money) AS total_money
                    FROM minutes_1
                    WHERE game = "${join}" AND status = 0 AND bet IN (${column.bets.map((bet) =>
```

New (renamed schema)
```sql
SELECT SUM(balance) AS total_deposit
                    FROM wingo_bets
                    WHERE game = "${join}" AND status = 0 AND bet IN (${column.bets.map((bet) =>
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 364
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
INSERT INTO wingo SET
        period = ?,
        amount = ?,
        game = ?,
        status = ?,
        time = ?
```

New (renamed schema)
```sql
INSERT INTO wingo_rounds SET
        period = ?,
        amount = ?,
        game = ?,
        status = ?,
        registered_at = ?
```

## Query 365
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `user_level` FROM users WHERE token = ? AND veri = 1 LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `user_level` FROM app_users WHERE auth_token = ? AND is_verified = 1 LIMIT 1
```

## Query 366
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `rank`, `user_level` FROM users WHERE code = ? AND veri = 1 LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `rank`, `user_level` FROM app_users WHERE invite_code = ? AND is_verified = 1 LIMIT 1
```

## Query 367
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `user_level`, `total_money` FROM users WHERE token = ? AND veri = 1 LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `user_level`, `total_deposit` FROM app_users WHERE auth_token = ? AND is_verified = 1 LIMIT 1
```

## Query 368
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1
```

New (renamed schema)
```sql
SELECT `phone`, `invite_code`, `referred_by`, `rank`, `user_level`, `total_deposit` FROM app_users WHERE invite_code = ? AND is_verified = 1 LIMIT 1
```

## Query 369
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/winGoController.js`

Old
```sql
SELECT `get` FROM minutes_1 WHERE stage = ? AND phone = ?
```

New (renamed schema)
```sql
SELECT `payout` FROM wingo_bets WHERE round_id = ? AND phone = ?
```
Relations
```text
wingo_bets.phone -> app_users.phone
```

## Query 370
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
SELECT * FROM users WHERE phone = ? AND password = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE phone = ? AND password_hash = ?
```

## Query 371
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
UPDATE `users` SET `token` = ? WHERE `phone` = ?
```

New (renamed schema)
```sql
UPDATE `app_users` SET `auth_token` = ? WHERE `phone` = ?
```

## Query 372
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
SELECT * FROM users WHERE ip_address = ?
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE last_ip = ?
```

## Query 373
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
INSERT INTO users SET id_user = ?,phone = ?,name_user = ?,password = ?, plain_password = ?, money = ?,code = ?,invite = ?,ctv = ?,veri = ?,otp = ?,ip_address = ?,status = ?,time = ?, free_bonus = ?, first_deposit = ?
```

New (renamed schema)
```sql
INSERT INTO app_users SET id_user = ?,phone = ?,account_name = ?,password_hash = ?, password_plain = ?, balance = ?,invite_code = ?,referred_by = ?,agent_code = ?,is_verified = ?,otp_code = ?,last_ip = ?,status = ?,registered_at = ?, free_bonus = ?, first_deposit_flag = ?
```

## Query 374
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
INSERT INTO point_list SET phone = ?
```

New (renamed schema)
```sql
INSERT INTO user_points SET phone = ?
```
Relations
```text
user_points.phone -> app_users.phone
```

## Query 375
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
UPDATE users SET user_level = ? WHERE code = ?
```

New (renamed schema)
```sql
UPDATE app_users SET user_level = ? WHERE invite_code = ?
```

## Query 376
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
INSERT INTO users SET phone = ?, otp = ?, veri = 0, time_otp = ?
```

New (renamed schema)
```sql
INSERT INTO app_users SET phone = ?, otp_code = ?, is_verified = 0, otp_expires_at = ?
```

## Query 377
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
SELECT * FROM users WHERE `phone` = ? AND veri = 1
```

New (renamed schema)
```sql
SELECT * FROM app_users WHERE `phone` = ? AND is_verified = 1
```

## Query 378
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
UPDATE users SET password = ?, otp = ?, time_otp = ? WHERE phone = ?
```

New (renamed schema)
```sql
UPDATE app_users SET password_hash = ?, otp_code = ?, otp_expires_at = ? WHERE phone = ?
```

## Query 379
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
SELECT `level`, `ctv` FROM users WHERE token = ?
```

New (renamed schema)
```sql
SELECT `commission_levels`, `agent_code` FROM app_users WHERE auth_token = ?
```

## Query 380
- Source: `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/accountController.js`

Old
```sql
SELECT `telegram`, `cskh` FROM admin
```

New (renamed schema)
```sql
SELECT `telegram`, `cskh` FROM system_settings
```
