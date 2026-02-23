# ALL SQL QUERIES - PRISMA MIGRATION REFERENCE

This document contains ALL SQL queries extracted from the controller files for Prisma ORM migration.

**Generated:** 2026-02-22
**Source Directory:** `/home/imanpr33t/Downloads/99bigdaddy/src/controllers/`

---

## TABLE OF CONTENTS

1. [users table](#users-table)
2. [wingo table](#wingo-table)
3. [minutes_1 table](#minutes_1-table)
4. [5d table](#5d-table)
5. [k3 table](#k3-table)
6. [result_5d table](#result_5d-table)
7. [result_k3 table](#result_k3-table)
8. [recharge table](#recharge-table)
9. [withdraw table](#withdraw-table)
10. [user_bank table](#user_bank-table)
11. [point_list table](#point_list-table)
12. [level table](#level-table)
13. [roses table](#roses-table)
14. [turn_over table](#turn_over-table)
15. [salary table](#salary-table)
16. [admin table](#admin-table)
17. [bank_recharge table](#bank_recharge-table)
18. [redenvelopes table](#redenvelopes-table)
19. [redenvelopes_used table](#redenvelopes_used-table)
20. [financial_details table](#financial_details-table)

---

## users TABLE

### SELECT Queries

| #   | Query                                                                                                                                        | File                    | Line      | Type   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------- | ------ |
| 1   | `SELECT * FROM level`                                                                                                                        | winGoController.js      | 74        | SELECT |
| 2   | `SELECT phone, code, invite, user_level, total_money FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                        | winGoController.js      | 76-77     | SELECT |
| 3   | `SELECT phone, code, invite, rank, user_level, total_money FROM users WHERE code = ? AND veri = 1 LIMIT 1`                                   | winGoController.js      | 81-82     | SELECT |
| 4   | `SELECT phone, code, invite, rank, user_level, total_money FROM users WHERE code = ? AND veri = 1 LIMIT 1`                                   | winGoController.js      | 130-131   | SELECT |
| 5   | `SELECT period FROM wingo WHERE status = 0 AND game = '${gameJoin}' ORDER BY id DESC LIMIT 1`                                                | winGoController.js      | 259-260   | SELECT |
| 6   | `SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                   | winGoController.js      | 262-263   | SELECT |
| 7   | `SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                   | winGoController.js      | 425-426   | SELECT |
| 8   | `SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                   | winGoController.js      | 483-484   | SELECT |
| 9   | `SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}`                                     | winGoController.js      | 494-495   | SELECT |
| 10  | `SELECT * FROM wingo WHERE status != 0 AND game = '${game}'`                                                                                 | winGoController.js      | 497-498   | SELECT |
| 11  | `SELECT period FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`                                                    | winGoController.js      | 500-501   | SELECT |
| 12  | `SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                   | winGoController.js      | 561-562   | SELECT |
| 13  | `SELECT * FROM minutes_1 WHERE phone = ? AND game = ? ORDER BY id DESC LIMIT ?, ?`                                                           | winGoController.js      | 572-573   | SELECT |
| 14  | `SELECT * FROM minutes_1 WHERE phone = ? AND game = ? ORDER BY id DESC`                                                                      | winGoController.js      | 576-577   | SELECT |
| 15  | `SELECT get FROM minutes_1 WHERE stage = ? AND phone = ?`                                                                                    | winGoController.js      | 584-585   | SELECT |
| 16  | `SELECT period FROM wingo WHERE status = 0 AND game = "${join}" ORDER BY id DESC LIMIT 1`                                                    | winGoController.js      | 650-651   | SELECT |
| 17  | `SELECT * FROM admin`                                                                                                                        | winGoController.js      | 653       | SELECT |
| 18  | `SELECT * FROM minutes_1 WHERE status = 0 AND game = "${join}"`                                                                              | winGoController.js      | 656-657   | SELECT |
| 19  | `SELECT SUM(money) AS total_money FROM minutes_1 WHERE game = "${join}" AND status = 0 AND bet IN (...)`                                     | winGoController.js      | 678-680   | SELECT |
| 20  | `SELECT SUM(money) AS total_money FROM minutes_1 WHERE game = "${join}" AND status = 0 AND bet IN (...)`                                     | winGoController.js      | 747-749   | SELECT |
| 21  | `SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`                                                        | winGoController.js      | 857-858   | SELECT |
| 22  | `SELECT * FROM minutes_1 WHERE status = 0 AND game = '${game}'`                                                                              | winGoController.js      | 945-946   | SELECT |
| 23  | `SELECT money FROM users WHERE phone = ?`                                                                                                    | winGoController.js      | 1039-1040 | SELECT |
| 24  | `SELECT * FROM users WHERE token = ?`                                                                                                        | userController.js       | 22        | SELECT |
| 25  | `SELECT * FROM users WHERE token = ?`                                                                                                        | userController.js       | 66        | SELECT |
| 26  | `SELECT * FROM recharge WHERE phone = ? AND status = 1`                                                                                      | userController.js       | 74        | SELECT |
| 27  | `SELECT * FROM withdraw WHERE phone = ? AND status = 1`                                                                                      | userController.js       | 78        | SELECT |
| 28  | `SELECT * FROM users WHERE token = ?`                                                                                                        | userController.js       | 98        | SELECT |
| 29  | `SELECT * FROM users WHERE token = ? AND password = ?`                                                                                       | userController.js       | 133       | SELECT |
| 30  | `SELECT * FROM users WHERE token = ?`                                                                                                        | userController.js       | 184       | SELECT |
| 31  | `SELECT * FROM point_list WHERE phone = ?`                                                                                                   | userController.js       | 193       | SELECT |
| 32  | `SELECT phone, code, invite, roses_f, roses_f1, roses_today FROM users WHERE token = ?`                                                      | userController.js       | 428       | SELECT |
| 33  | `SELECT * FROM level`                                                                                                                        | userController.js       | 429       | SELECT |
| 34  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | userController.js       | 435       | SELECT |
| 35  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | userController.js       | 453       | SELECT |
| 36  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | userController.js       | 462       | SELECT |
| 37  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | userController.js       | 471       | SELECT |
| 38  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | userController.js       | 486       | SELECT |
| 39  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | userController.js       | 494       | SELECT |
| 40  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | userController.js       | 503       | SELECT |
| 41  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | userController.js       | 512       | SELECT |
| 42  | `SELECT id_user, name_user, phone, code, invite, rank, user_level, total_money FROM users WHERE invite = ?`                                  | userController.js       | 522       | SELECT |
| 43  | `SELECT phone, code, invite FROM users WHERE token = ?`                                                                                      | userController.js       | 563       | SELECT |
| 44  | `SELECT * FROM level`                                                                                                                        | userController.js       | 564       | SELECT |
| 45  | `SELECT phone, code, invite FROM users WHERE token = ?`                                                                                      | userController.js       | 583       | SELECT |
| 46  | `SELECT id_user, phone, code, invite, roses_f, rank, name_user, status, total_money, time FROM users WHERE invite = ? ORDER BY id_user DESC` | userController.js       | 592       | SELECT |
| 47  | `SELECT id_user, phone, time FROM users WHERE invite = ? ORDER BY id_user DESC LIMIT 100`                                                    | userController.js       | 593       | SELECT |
| 48  | `SELECT f1, invite, code, phone, time FROM roses WHERE invite = ? ORDER BY id DESC LIMIT 100`                                                | userController.js       | 594       | SELECT |
| 49  | `SELECT id_user, name_user, phone, code, invite, rank, total_money FROM users WHERE invite = ?`                                              | userController.js       | 602       | SELECT |
| 50  | `SELECT phone, code, name_user, invite FROM users WHERE token = ?`                                                                           | userController.js       | 710       | SELECT |
| 51  | `SELECT * FROM users WHERE phone = ?`                                                                                                        | userController.js       | 754       | SELECT |
| 52  | `SELECT * FROM users WHERE code = ?`                                                                                                         | userController.js       | 759       | SELECT |
| 53  | `SELECT * FROM recharge WHERE phone = ? AND status = ? AND type = ?`                                                                         | userController.js       | 806       | SELECT |
| 54  | `SELECT * FROM recharge WHERE phone = ? AND status = ?`                                                                                      | userController.js       | 808       | SELECT |
| 55  | `SELECT * FROM recharge WHERE id_order = ?`                                                                                                  | userController.js       | 826       | SELECT |
| 56  | `SELECT * FROM users WHERE token = ? AND level = 2`                                                                                          | dailyController.js      | 96        | SELECT |
| 57  | `SELECT * FROM users WHERE token = ?`                                                                                                        | dailyController.js      | 114       | SELECT |
| 58  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 118       | SELECT |
| 59  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 136       | SELECT |
| 60  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 145       | SELECT |
| 61  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 154       | SELECT |
| 62  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 169       | SELECT |
| 63  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 177       | SELECT |
| 64  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 186       | SELECT |
| 65  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 195       | SELECT |
| 66  | `SELECT * FROM users WHERE phone = ?`                                                                                                        | dailyController.js      | 232       | SELECT |
| 67  | `SELECT * FROM users WHERE token = ?`                                                                                                        | dailyController.js      | 233       | SELECT |
| 68  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 247       | SELECT |
| 69  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 265       | SELECT |
| 70  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 274       | SELECT |
| 71  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 283       | SELECT |
| 72  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 298       | SELECT |
| 73  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 306       | SELECT |
| 74  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 315       | SELECT |
| 75  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 324       | SELECT |
| 76  | `SELECT SUM(money) as total FROM recharge WHERE phone = ? AND status = 1`                                                                    | dailyController.js      | 337       | SELECT |
| 77  | `SELECT SUM(money) as total FROM withdraw WHERE phone = ? AND status = 1`                                                                    | dailyController.js      | 338       | SELECT |
| 78  | `SELECT * FROM user_bank WHERE phone = ?`                                                                                                    | dailyController.js      | 339       | SELECT |
| 79  | `SELECT * FROM users WHERE token = ?`                                                                                                        | dailyController.js      | 360       | SELECT |
| 80  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 368       | SELECT |
| 81  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 386       | SELECT |
| 82  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 395       | SELECT |
| 83  | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | dailyController.js      | 404       | SELECT |
| 84  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 419       | SELECT |
| 85  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 427       | SELECT |
| 86  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 436       | SELECT |
| 87  | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | dailyController.js      | 445       | SELECT |
| 88  | `SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1`                                                                              | dailyController.js      | 458       | SELECT |
| 89  | `SELECT * FROM users WHERE ctv = ? AND status = 2 AND veri = 1`                                                                              | dailyController.js      | 459       | SELECT |
| 90  | `SELECT SUM(money) as money FROM recharge WHERE phone = ? AND status = 1`                                                                    | dailyController.js      | 463       | SELECT |
| 91  | `SELECT SUM(money) as money FROM withdraw WHERE phone = ? AND status = 1`                                                                    | dailyController.js      | 464       | SELECT |
| 92  | `SELECT money, time FROM recharge WHERE phone = ? AND status = 1`                                                                            | dailyController.js      | 474       | SELECT |
| 93  | `SELECT money, time FROM withdraw WHERE phone = ? AND status = 1`                                                                            | dailyController.js      | 475       | SELECT |
| 94  | `SELECT money, time FROM minutes_1 WHERE phone = ? AND status = 1`                                                                           | dailyController.js      | 491       | SELECT |
| 95  | `SELECT money, time FROM minutes_1 WHERE phone = ? AND status = 2`                                                                           | dailyController.js      | 492       | SELECT |
| 96  | `SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1`                                                                              | dailyController.js      | 508       | SELECT |
| 97  | `SELECT phone FROM users WHERE code = ?`                                                                                                     | dailyController.js      | 513       | SELECT |
| 98  | `SELECT * FROM point_list WHERE phone = ?`                                                                                                   | dailyController.js      | 524       | SELECT |
| 99  | `SELECT id, status, type, phone, money, time FROM recharge WHERE phone = ? AND status = 1`                                                   | dailyController.js      | 529       | SELECT |
| 100 | `SELECT id, status, phone, money, time FROM withdraw WHERE phone = ? AND status = 1`                                                         | dailyController.js      | 530       | SELECT |
| 101 | `SELECT * FROM redenvelopes_used WHERE phone = ?`                                                                                            | dailyController.js      | 543       | SELECT |
| 102 | `SELECT * FROM financial_details WHERE phone = ?`                                                                                            | dailyController.js      | 552       | SELECT |
| 103 | `SELECT phone FROM users WHERE token = ? AND veri = 1`                                                                                       | dailyController.js      | 46        | SELECT |
| 104 | `SELECT money, money_us FROM point_list WHERE phone = ?`                                                                                     | dailyController.js      | 47        | SELECT |
| 105 | `SELECT phone FROM users WHERE token = ? AND veri = 1`                                                                                       | dailyController.js      | 61        | SELECT |
| 106 | `SELECT telegram FROM point_list WHERE phone = ?`                                                                                            | dailyController.js      | 66        | SELECT |
| 107 | `SELECT telegram FROM admin`                                                                                                                 | dailyController.js      | 67        | SELECT |
| 108 | `SELECT token, level, status FROM users WHERE token = ? AND veri = 1`                                                                        | dailyController.js      | 96        | SELECT |
| 109 | `SELECT * FROM 5d WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                                                              | k5Controller.js         | 130       | SELECT |
| 110 | `SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                   | k5Controller.js         | 131       | SELECT |
| 111 | `SELECT money, level FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                                        | k5Controller.js         | 157       | SELECT |
| 112 | `SELECT * FROM level`                                                                                                                        | k5Controller.js         | 159       | SELECT |
| 113 | `SELECT * FROM 5d WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}`                                        | k5Controller.js         | 189       | SELECT |
| 114 | `SELECT * FROM 5d WHERE status != 0 AND game = '${game}'`                                                                                    | k5Controller.js         | 190       | SELECT |
| 115 | `SELECT period FROM 5d WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`                                                       | k5Controller.js         | 191       | SELECT |
| 116 | `SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                   | k5Controller.js         | 218       | SELECT |
| 117 | `SELECT * FROM result_5d WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}`                                   | k5Controller.js         | 219       | SELECT |
| 118 | `SELECT * FROM result_5d WHERE phone = ? AND game = '${game}' ORDER BY id DESC`                                                              | k5Controller.js         | 220       | SELECT |
| 119 | `SELECT period FROM 5d WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                                                         | k5Controller.js         | 258       | SELECT |
| 120 | `SELECT * FROM admin`                                                                                                                        | k5Controller.js         | 259       | SELECT |
| 121 | `SELECT * FROM 5d WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                                                             | k5Controller.js         | 300       | SELECT |
| 122 | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'a'`                                                       | k5Controller.js         | 313       | SELECT |
| 123 | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'b'`                                                       | k5Controller.js         | 340       | SELECT |
| 124 | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'c'`                                                       | k5Controller.js         | 367       | SELECT |
| 125 | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'd'`                                                       | k5Controller.js         | 394       | SELECT |
| 126 | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'e'`                                                       | k5Controller.js         | 421       | SELECT |
| 127 | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'total'`                                                   | k5Controller.js         | 448       | SELECT |
| 128 | `SELECT id, phone, bet, price, money, fee, amount FROM result_5d WHERE status = 0 AND game = ${game}`                                        | k5Controller.js         | 465       | SELECT |
| 129 | `SELECT period FROM k3 WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                                                         | k3Controller.js         | 121       | SELECT |
| 130 | `SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                   | k3Controller.js         | 122       | SELECT |
| 131 | `SELECT money, level FROM users WHERE token = ? AND veri = 1 LIMIT 1`                                                                        | k3Controller.js         | 197       | SELECT |
| 132 | `SELECT * FROM level`                                                                                                                        | k3Controller.js         | 199       | SELECT |
| 133 | `SELECT period FROM k3 WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                                                         | k3Controller.js         | 246       | SELECT |
| 134 | `SELECT * FROM admin`                                                                                                                        | k3Controller.js         | 247       | SELECT |
| 135 | `SELECT * FROM k3 WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                                                             | k3Controller.js         | 279       | SELECT |
| 136 | `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'total'`                                                   | k3Controller.js         | 290       | SELECT |
| 137 | `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'two-same'`                                                | k3Controller.js         | 332       | SELECT |
| 138 | `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'three-same'`                                              | k3Controller.js         | 410       | SELECT |
| 139 | `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'unlike'`                                                  | k3Controller.js         | 455       | SELECT |
| 140 | `SELECT id, phone, bet, price, money, fee, amount FROM result_k3 WHERE status = 0 AND game = ${game}`                                        | k3Controller.js         | 557       | SELECT |
| 141 | `SELECT level FROM users WHERE token = ?`                                                                                                    | homeController.js       | 77        | SELECT |
| 142 | `SELECT cskh FROM admin`                                                                                                                     | homeController.js       | 78        | SELECT |
| 143 | `SELECT * FROM users WHERE token = ?`                                                                                                        | homeController.js       | 104       | SELECT |
| 144 | `SELECT * FROM salary WHERE phone = ? ORDER BY time DESC`                                                                                    | homeController.js       | 113       | SELECT |
| 145 | `SELECT token, status FROM users WHERE token = ? AND veri = 1`                                                                               | middlewareController.js | 8         | SELECT |
| 146 | `SELECT * FROM users WHERE phone = ? AND password = ?`                                                                                       | accountController.ts    | 78        | SELECT |
| 147 | `SELECT * FROM users WHERE phone = ?`                                                                                                        | accountController.ts    | 140       | SELECT |
| 148 | `SELECT * FROM users WHERE code = ?`                                                                                                         | accountController.ts    | 141       | SELECT |
| 149 | `SELECT * FROM users WHERE ip_address = ?`                                                                                                   | accountController.ts    | 142       | SELECT |
| 150 | `SELECT * FROM users WHERE invite = ?`                                                                                                       | accountController.ts    | 172       | SELECT |
| 151 | `SELECT * FROM users WHERE phone = ?`                                                                                                        | accountController.ts    | 214       | SELECT |
| 152 | `SELECT * FROM users WHERE phone = ? AND veri = 1`                                                                                           | accountController.ts    | 246       | SELECT |
| 153 | `SELECT * FROM users WHERE phone = ? AND veri = 1`                                                                                           | accountController.ts    | 298       | SELECT |
| 154 | `SELECT level, ctv FROM users WHERE token = ?`                                                                                               | accountController.ts    | 333       | SELECT |
| 155 | `SELECT telegram, cskh FROM admin`                                                                                                           | accountController.ts    | 337       | SELECT |
| 156 | `SELECT * FROM admin`                                                                                                                        | accountController.ts    | 341       | SELECT |
| 157 | `SELECT telegram FROM point_list WHERE phone = ?`                                                                                            | accountController.ts    | 343       | SELECT |
| 158 | `SELECT * FROM bank_recharge WHERE type = 'momo'`                                                                                            | paymentController.js    | 32        | SELECT |
| 159 | `SELECT * FROM bank_recharge WHERE type = 'momo'`                                                                                            | paymentController.js    | 60        | SELECT |
| 160 | `SELECT phone, code, name_user, invite FROM users WHERE token = ?`                                                                           | paymentController.js    | 710       | SELECT |
| 161 | `SELECT * FROM users WHERE phone = ?`                                                                                                        | paymentController.js    | 754       | SELECT |
| 162 | `SELECT * FROM users WHERE code = ?`                                                                                                         | paymentController.js    | 759       | SELECT |
| 163 | `SELECT * FROM recharge WHERE phone = ? AND status = ? AND type = ?`                                                                         | paymentController.js    | 806       | SELECT |
| 164 | `SELECT * FROM recharge WHERE phone = ? AND status = ?`                                                                                      | paymentController.js    | 808       | SELECT |
| 165 | `SELECT * FROM recharge WHERE id_order = ?`                                                                                                  | paymentController.js    | 826       | SELECT |
| 166 | `SELECT * FROM users WHERE token = ? AND level = 2`                                                                                          | adminController.js      | 96        | SELECT |
| 167 | `SELECT * FROM users WHERE token = ?`                                                                                                        | adminController.js      | 127       | SELECT |
| 168 | `SELECT * FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`                                                         | adminController.js      | 131       | SELECT |
| 169 | `SELECT * FROM admin`                                                                                                                        | adminController.js      | 133       | SELECT |
| 170 | `SELECT * FROM users WHERE veri = 1 AND level != 2 ORDER BY id DESC LIMIT ${pageno}, ${limit}`                                               | adminController.js      | 163       | SELECT |
| 171 | `SELECT * FROM users WHERE veri = 1 AND level != 2`                                                                                          | adminController.js      | 164       | SELECT |
| 172 | `SELECT * FROM users WHERE veri = 1 AND level = 2 ORDER BY id DESC LIMIT ${pageno}, ${pageto}`                                               | adminController.js      | 193       | SELECT |
| 173 | `SELECT phone FROM users WHERE code = ?`                                                                                                     | adminController.js      | 210       | SELECT |
| 174 | `SELECT COUNT(*) AS userCount FROM users WHERE invite = ?`                                                                                   | adminController.js      | 224       | SELECT |
| 175 | `SELECT * FROM users WHERE invite = ?`                                                                                                       | adminController.js      | 240       | SELECT |
| 176 | `SELECT SUM(money) as total FROM minutes_1 WHERE status = 1`                                                                                 | adminController.js      | 276       | SELECT |
| 177 | `SELECT SUM(money) as total FROM minutes_1 WHERE status = 2`                                                                                 | adminController.js      | 277       | SELECT |
| 178 | `SELECT COUNT(id) as total FROM users WHERE status = 1`                                                                                      | adminController.js      | 278       | SELECT |
| 179 | `SELECT COUNT(id) as total FROM users WHERE status = 0`                                                                                      | adminController.js      | 279       | SELECT |
| 180 | `SELECT SUM(money) as total FROM recharge WHERE status = 1`                                                                                  | adminController.js      | 280       | SELECT |
| 181 | `SELECT SUM(money) as total FROM withdraw WHERE status = 1`                                                                                  | adminController.js      | 281       | SELECT |
| 182 | `SELECT SUM(money) as total FROM recharge WHERE status = 1 AND today = ?`                                                                    | adminController.js      | 283       | SELECT |
| 183 | `SELECT SUM(money) as total FROM withdraw WHERE status = 1 AND today = ?`                                                                    | adminController.js      | 284       | SELECT |
| 184 | `SELECT * FROM users WHERE phone = ?`                                                                                                        | adminController.js      | 378       | SELECT |
| 185 | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | adminController.js      | 389       | SELECT |
| 186 | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | adminController.js      | 407       | SELECT |
| 187 | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | adminController.js      | 416       | SELECT |
| 188 | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | adminController.js      | 425       | SELECT |
| 189 | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | adminController.js      | 440       | SELECT |
| 190 | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | adminController.js      | 448       | SELECT |
| 191 | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | adminController.js      | 457       | SELECT |
| 192 | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | adminController.js      | 466       | SELECT |
| 193 | `SELECT SUM(money) as total FROM recharge WHERE phone = ? AND status = 1`                                                                    | adminController.js      | 477       | SELECT |
| 194 | `SELECT SUM(money) as total FROM withdraw WHERE phone = ? AND status = 1`                                                                    | adminController.js      | 478       | SELECT |
| 195 | `SELECT * FROM user_bank WHERE phone = ?`                                                                                                    | adminController.js      | 479       | SELECT |
| 196 | `SELECT telegram FROM point_list WHERE phone = ?`                                                                                            | adminController.js      | 480       | SELECT |
| 197 | `SELECT phone FROM users WHERE code = ?`                                                                                                     | adminController.js      | 481       | SELECT |
| 198 | `SELECT * FROM recharge WHERE status = 0`                                                                                                    | adminController.js      | 495       | SELECT |
| 199 | `SELECT * FROM recharge WHERE status != 0`                                                                                                   | adminController.js      | 496       | SELECT |
| 200 | `SELECT * FROM withdraw WHERE status = 0`                                                                                                    | adminController.js      | 497       | SELECT |
| 201 | `SELECT * FROM withdraw WHERE status != 0`                                                                                                   | adminController.js      | 498       | SELECT |
| 202 | `SELECT * FROM bank_recharge`                                                                                                                | adminController.js      | 514       | SELECT |
| 203 | `SELECT * FROM bank_recharge WHERE type = 'momo'`                                                                                            | adminController.js      | 515       | SELECT |
| 204 | `SELECT * FROM admin`                                                                                                                        | adminController.js      | 516       | SELECT |
| 205 | `SELECT * FROM recharge WHERE id = ?`                                                                                                        | adminController.js      | 561       | SELECT |
| 206 | `SELECT * FROM users WHERE phone = ?`                                                                                                        | adminController.js      | 565       | SELECT |
| 207 | `SELECT * FROM users WHERE code = ?`                                                                                                         | adminController.js      | 578       | SELECT |
| 208 | `SELECT * FROM withdraw WHERE id = ?`                                                                                                        | adminController.js      | 697       | SELECT |
| 209 | `SELECT * FROM bank_recharge WHERE type = 'momo'`                                                                                            | adminController.js      | 767       | SELECT |
| 210 | `SELECT * FROM users WHERE token = ?`                                                                                                        | adminController.js      | 925       | SELECT |
| 211 | `SELECT * FROM point_list WHERE phone = ?`                                                                                                   | adminController.js      | 937       | SELECT |
| 212 | `SELECT * FROM point_list WHERE phone = ?`                                                                                                   | adminController.js      | 956       | SELECT |
| 213 | `SELECT * FROM redenvelopes WHERE status = 0`                                                                                                | adminController.js      | 989       | SELECT |
| 214 | `SELECT * FROM users WHERE id_user = ?`                                                                                                      | adminController.js      | 1007      | SELECT |
| 215 | `SELECT * FROM users WHERE phone = ?`                                                                                                        | adminController.js      | 1127      | SELECT |
| 216 | `SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT 10`                                                                           | adminController.js      | 1139      | SELECT |
| 217 | `SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT 10`                                                                           | adminController.js      | 1140      | SELECT |
| 218 | `SELECT * FROM users WHERE phone = ?`                                                                                                        | adminController.js      | 1152      | SELECT |
| 219 | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | adminController.js      | 1160      | SELECT |
| 220 | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | adminController.js      | 1178      | SELECT |
| 221 | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | adminController.js      | 1187      | SELECT |
| 222 | `SELECT phone, code, invite, time FROM users WHERE invite = ?`                                                                               | adminController.js      | 1196      | SELECT |
| 223 | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | adminController.js      | 1211      | SELECT |
| 224 | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | adminController.js      | 1219      | SELECT |
| 225 | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | adminController.js      | 1228      | SELECT |
| 226 | `SELECT phone, code, invite FROM users WHERE invite = ?`                                                                                     | adminController.js      | 1237      | SELECT |
| 227 | `SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1`                                                                              | adminController.js      | 1250      | SELECT |
| 228 | `SELECT * FROM users WHERE ctv = ? AND status = 2 AND veri = 1`                                                                              | adminController.js      | 1251      | SELECT |
| 229 | `SELECT SUM(money) as money FROM recharge WHERE phone = ? AND status = 1`                                                                    | adminController.js      | 1255      | SELECT |
| 230 | `SELECT SUM(money) as money FROM withdraw WHERE phone = ? AND status = 1`                                                                    | adminController.js      | 1256      | SELECT |
| 231 | `SELECT money, time FROM recharge WHERE phone = ? AND status = 1`                                                                            | adminController.js      | 1266      | SELECT |
| 232 | `SELECT money, time FROM withdraw WHERE phone = ? AND status = 1`                                                                            | adminController.js      | 1267      | SELECT |
| 233 | `SELECT money, time FROM minutes_1 WHERE phone = ? AND status = 1`                                                                           | adminController.js      | 1283      | SELECT |
| 234 | `SELECT money, time FROM minutes_1 WHERE phone = ? AND status = 2`                                                                           | adminController.js      | 1284      | SELECT |
| 235 | `SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1`                                                                              | adminController.js      | 1300      | SELECT |
| 236 | `SELECT * FROM point_list WHERE phone = ?`                                                                                                   | adminController.js      | 1316      | SELECT |
| 237 | `SELECT id, status, type, phone, money, time FROM recharge WHERE phone = ? AND status = 1`                                                   | adminController.js      | 1321      | SELECT |
| 238 | `SELECT id, status, phone, money, time FROM withdraw WHERE phone = ? AND status = 1`                                                         | adminController.js      | 1322      | SELECT |
| 239 | `SELECT * FROM redenvelopes_used WHERE phone = ?`                                                                                            | adminController.js      | 1335      | SELECT |
| 240 | `SELECT * FROM financial_details WHERE phone = ?`                                                                                            | adminController.js      | 1344      | SELECT |

### INSERT Queries

| #   | Query                                                                                                                                                                                                                                                   | File                 | Line      | Type   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------- | ------ |
| 1   | `INSERT INTO roses SET phone = ?, code = ?, invite = ?, f1 = ?, time = ?`                                                                                                                                                                               | winGoController.js   | 99-103    | INSERT |
| 2   | `INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE daily_turn_over = daily_turn_over + VALUES(daily_turn_over), total_turn_over = total_turn_over + VALUES(total_turn_over)` | winGoController.js   | 114-119   | INSERT |
| 3   | `INSERT INTO minutes_1 SET id_product = ?, phone = ?, code = ?, invite = ?, stage = ?, level = ?, money = ?, amount = ?, fee = ?, get = ?, game = ?, bet = ?, status = ?, today = ?, time = ?`                                                          | winGoController.js   | 386-400   | INSERT |
| 4   | `INSERT INTO wingo SET period = ?, amount = ?, game = ?, status = ?, time = ?`                                                                                                                                                                          | winGoController.js   | 828-833   | INSERT |
| 5   | `INSERT INTO users SET id_user = ?, phone = ?, name_user = ?, password = ?, plain_password = ?, money = ?, code = ?, invite = ?, ctv = ?, veri = ?, otp = ?, ip_address = ?, status = ?, time = ?, free_bonus = ?, first_deposit = ?`                   | accountController.ts | 157-170   | INSERT |
| 6   | `INSERT INTO point_list SET phone = ?`                                                                                                                                                                                                                  | accountController.ts | 174       | INSERT |
| 7   | `INSERT INTO users SET phone = ?, otp = ?, veri = 0, time_otp = ?`                                                                                                                                                                                      | accountController.ts | 224       | INSERT |
| 8   | `INSERT INTO recharge SET id_order = ?, transaction_id = ?, phone = ?, money = ?, type = ?, status = ?, today = ?, url = ?, time = ?`                                                                                                                   | userController.js    | 777-786   | INSERT |
| 9   | `INSERT INTO recharge SET id_order = ?, transaction_id = ?, phone = ?, money = ?, type = ?, status = ?, today = ?, url = ?, time = ?`                                                                                                                   | userController.js    | 817-826   | INSERT |
| 10  | `INSERT INTO user_bank SET phone = ?, name_bank = ?, name_user = ?, stk = ?, email = ?, tinh = ?, time = ?`                                                                                                                                             | userController.js    | 934-941   | INSERT |
| 11  | `INSERT INTO withdraw SET id_order = ?, phone = ?, money = ?, stk = ?, name_bank = ?, ifsc = ?, name_user = ?, status = ?, today = ?, time = ?`                                                                                                         | userController.js    | 1104-1114 | INSERT |
| 12  | `INSERT INTO result_5d SET id_product = ?, phone = ?, code = ?, invite = ?, stage = ?, level = ?, money = ?, price = ?, amount = ?, fee = ?, game = ?, join_bet = ?, bet = ?, status = ?, time = ?`                                                     | k5Controller.js      | 149       | INSERT |
| 13  | `INSERT INTO roses SET phone = ?, code = ?, invite = ?, f1 = ?, f2 = ?, f3 = ?, f4 = ?, time = ?`                                                                                                                                                       | k5Controller.js      | 161       | INSERT |
| 14  | `INSERT INTO 5d SET period = ?, result = ?, game = ?, status = ?, time = ?`                                                                                                                                                                             | k5Controller.js      | 274       | INSERT |
| 15  | `INSERT INTO result_k3 SET id_product = ?, phone = ?, code = ?, invite = ?, stage = ?, level = ?, money = ?, price = ?, amount = ?, fee = ?, game = ?, join_bet = ?, typeGame = ?, bet = ?, status = ?, time = ?`                                       | k3Controller.js      | 184       | INSERT |
| 16  | `INSERT INTO roses SET phone = ?, code = ?, invite = ?, f1 = ?, f2 = ?, f3 = ?, f4 = ?, time = ?`                                                                                                                                                       | k3Controller.js      | 201       | INSERT |
| 17  | `INSERT INTO k3 SET period = ?, result = ?, game = ?, status = ?, time = ?`                                                                                                                                                                             | k3Controller.js      | 269       | INSERT |
| 18  | `INSERT INTO users SET id_user = ?, phone = ?, name_user = ?, password = ?, money = ?, level = ?, code = ?, invite = ?, veri = ?, ip_address = ?, status = ?, time = ?`                                                                                 | adminController.js   | 1093-1105 | INSERT |
| 19  | `INSERT INTO point_list SET phone = ?, level = 2`                                                                                                                                                                                                       | adminController.js   | 1106      | INSERT |
| 20  | `INSERT INTO redenvelopes SET id_redenvelope = ?, phone = ?, money = ?, used = ?, amount = ?, status = ?, time = ?`                                                                                                                                     | adminController.js   | 980       | INSERT |
| 21  | `INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, type = 'momo'`                                                                                                                                                 | adminController.js   | 789       | INSERT |
| 22  | `INSERT INTO salary (phone, amount, type, time) VALUES (?, ?, ?, ?)`                                                                                                                                                                                    | paymentController.js | 775       | INSERT |
| 23  | `INSERT INTO salary (phone, amount, type, time) VALUES (?, ?, ?, ?)`                                                                                                                                                                                    | adminController.js   | 623       | INSERT |

### UPDATE Queries

| #   | Query                                                                                                                                              | File                 | Line      | Type   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------- | ------ |
| 1   | `UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ?`                                         | winGoController.js   | 95        | UPDATE |
| 2   | `UPDATE users SET money = money - ? WHERE token = ?`                                                                                               | winGoController.js   | 420-421   | UPDATE |
| 3   | `UPDATE wingo SET amount = ?, status = ? WHERE period = ? AND game = "${join}"`                                                                    | winGoController.js   | 805       | UPDATE |
| 4   | `UPDATE wingo SET amount = ?, status = ? WHERE period = ? AND game = "${join}"`                                                                    | winGoController.js   | 823-824   | UPDATE |
| 5   | `UPDATE admin SET ${join} = ?`                                                                                                                     | winGoController.js   | 842       | UPDATE |
| 6   | `UPDATE minutes_1 SET result = ? WHERE status = 0 AND game = '${game}'`                                                                            | winGoController.js   | 862-863   | UPDATE |
| 7   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "0" AND bet != "t"` | winGoController.js   | 869-870   | UPDATE |
| 8   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "1"`                | winGoController.js   | 875-876   | UPDATE |
| 9   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "2"`                | winGoController.js   | 881-882   | UPDATE |
| 10  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "3"`                | winGoController.js   | 887-888   | UPDATE |
| 11  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "4"`                | winGoController.js   | 893-894   | UPDATE |
| 12  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "5" AND bet != "t"` | winGoController.js   | 899-900   | UPDATE |
| 13  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "6"`                | winGoController.js   | 905-906   | UPDATE |
| 14  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "7"`                | winGoController.js   | 911-912   | UPDATE |
| 15  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "8"`                | winGoController.js   | 917-918   | UPDATE |
| 16  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "9"`                | winGoController.js   | 923-924   | UPDATE |
| 17  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "l"`                                                              | winGoController.js   | 933-934   | UPDATE |
| 18  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "n"`                                                              | winGoController.js   | 938-939   | UPDATE |
| 19  | `UPDATE minutes_1 SET get = ?, status = 1 WHERE id = ?`                                                                                            | winGoController.js   | 1046-1047 | UPDATE |
| 20  | `UPDATE users SET money = ? WHERE phone = ?`                                                                                                       | winGoController.js   | 1050-1051 | UPDATE |
| 21  | `UPDATE users SET otp = ?, time_otp = ? WHERE phone = ?`                                                                                           | userController.js    | 33        | UPDATE |
| 22  | `UPDATE users SET name_user = ? WHERE token = ?`                                                                                                   | userController.js    | 108       | UPDATE |
| 23  | `UPDATE users SET otp = ?, password = ?, plain_password = ? WHERE token = ?`                                                                       | userController.js    | 163       | UPDATE |
| 24  | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | userController.js    | 207       | UPDATE |
| 25  | `UPDATE point_list SET total1 = ? WHERE phone = ?`                                                                                                 | userController.js    | 208       | UPDATE |
| 26  | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | userController.js    | 226       | UPDATE |
| 27  | `UPDATE point_list SET total2 = ? WHERE phone = ?`                                                                                                 | userController.js    | 227       | UPDATE |
| 28  | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | userController.js    | 245       | UPDATE |
| 29  | `UPDATE point_list SET total3 = ? WHERE phone = ?`                                                                                                 | userController.js    | 246       | UPDATE |
| 30  | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | userController.js    | 264       | UPDATE |
| 31  | `UPDATE point_list SET total4 = ? WHERE phone = ?`                                                                                                 | userController.js    | 265       | UPDATE |
| 32  | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | userController.js    | 283       | UPDATE |
| 33  | `UPDATE point_list SET total5 = ? WHERE phone = ?`                                                                                                 | userController.js    | 284       | UPDATE |
| 34  | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | userController.js    | 302       | UPDATE |
| 35  | `UPDATE point_list SET total6 = ? WHERE phone = ?`                                                                                                 | userController.js    | 303       | UPDATE |
| 36  | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | userController.js    | 321       | UPDATE |
| 37  | `UPDATE point_list SET total7 = ? WHERE phone = ?`                                                                                                 | userController.js    | 322       | UPDATE |
| 38  | `UPDATE recharge SET status = 2 WHERE phone = ? AND id_order = ? AND status = ?`                                                                   | userController.js    | 724       | UPDATE |
| 39  | `UPDATE user_bank SET stk = ? WHERE phone = ?`                                                                                                     | userController.js    | 948       | UPDATE |
| 40  | `UPDATE user_bank SET name_bank = ?, name_user = ?, stk = ?, email = ?, tinh = ?, time = ? WHERE phone = ?`                                        | userController.js    | 955       | UPDATE |
| 41  | `UPDATE users SET money = money - ? WHERE phone = ?`                                                                                               | userController.js    | 1115      | UPDATE |
| 42  | `UPDATE users SET first_deposit = ? WHERE phone = ?`                                                                                               | paymentController.js | 762       | UPDATE |
| 43  | `UPDATE users SET free_bonus = free_bonus - ? WHERE phone = ?`                                                                                     | paymentController.js | 768       | UPDATE |
| 44  | `UPDATE users SET free_bonus = ? WHERE phone = ?`                                                                                                  | paymentController.js | 771       | UPDATE |
| 45  | `UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ?`                                                                | paymentController.js | 778       | UPDATE |
| 46  | `UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ?`                                                                | paymentController.js | 779       | UPDATE |
| 47  | `UPDATE recharge SET status = 2 WHERE id = ?`                                                                                                      | paymentController.js | 852       | UPDATE |
| 48  | `UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ?`                                                                                     | paymentController.js | 862       | UPDATE |
| 49  | `UPDATE users SET token = ? WHERE phone = ?`                                                                                                       | accountController.ts | 93        | UPDATE |
| 50  | `UPDATE users SET user_level = ? WHERE code = ?`                                                                                                   | accountController.ts | 179       | UPDATE |
| 51  | `UPDATE users SET otp = ?, time_otp = ? WHERE phone = ?`                                                                                           | accountController.ts | 233       | UPDATE |
| 52  | `UPDATE users SET otp = ?, time_otp = ? WHERE phone = ?`                                                                                           | accountController.ts | 267       | UPDATE |
| 53  | `UPDATE users SET password = ?, otp = ?, time_otp = ? WHERE phone = ?`                                                                             | accountController.ts | 312       | UPDATE |
| 54  | `UPDATE users SET roses_today = ?`                                                                                                                 | cronJobContronler.js | 86        | UPDATE |
| 55  | `UPDATE point_list SET money = ?`                                                                                                                  | cronJobContronler.js | 87        | UPDATE |
| 56  | `UPDATE admin SET ${game} = ?`                                                                                                                     | adminController.js   | 352       | UPDATE |
| 57  | `UPDATE admin SET ${bs} = ?`                                                                                                                       | adminController.js   | 359       | UPDATE |
| 58  | `UPDATE recharge SET status = 1 WHERE id = ?`                                                                                                      | adminController.js   | 558       | UPDATE |
| 59  | `UPDATE users SET first_deposit = ? WHERE phone = ?`                                                                                               | adminController.js   | 581       | UPDATE |
| 60  | `UPDATE users SET free_bonus = free_bonus - ? WHERE phone = ?`                                                                                     | adminController.js   | 588       | UPDATE |
| 61  | `UPDATE users SET free_bonus = ? WHERE phone = ?`                                                                                                  | adminController.js   | 591       | UPDATE |
| 62  | `UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ?`                                                                | adminController.js   | 595       | UPDATE |
| 63  | `UPDATE users SET money = money + ?, total_money = total_money + ? WHERE phone = ?`                                                                | adminController.js   | 596       | UPDATE |
| 64  | `UPDATE recharge SET status = 2 WHERE id = ?`                                                                                                      | adminController.js   | 704       | UPDATE |
| 65  | `UPDATE withdraw SET status = 1 WHERE id = ?`                                                                                                      | adminController.js   | 694       | UPDATE |
| 66  | `UPDATE withdraw SET status = 2, remark = ? WHERE id = ?`                                                                                          | adminController.js   | 757       | UPDATE |
| 67  | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | adminController.js   | 759       | UPDATE |
| 68  | `UPDATE bank_recharge SET name_bank = ?, name_user = ?, stk = ? WHERE type = 'bank'`                                                               | adminController.js   | 772       | UPDATE |
| 69  | `UPDATE admin SET telegram = ?, cskh = ?, app = ?`                                                                                                 | adminController.js   | 842       | UPDATE |
| 70  | `UPDATE users SET status = 1 WHERE id = ?`                                                                                                         | adminController.js   | 854       | UPDATE |
| 71  | `UPDATE users SET status = 2 WHERE id = ?`                                                                                                         | adminController.js   | 857       | UPDATE |
| 72  | `UPDATE point_list SET money = money + ? WHERE level = 2`                                                                                          | adminController.js   | 917       | UPDATE |
| 73  | `UPDATE point_list SET money = money - ? WHERE level = 2`                                                                                          | adminController.js   | 920       | UPDATE |
| 74  | `UPDATE point_list SET money_us = money_us + ? WHERE level = 2`                                                                                    | adminController.js   | 930       | UPDATE |
| 75  | `UPDATE point_list SET money_us = money_us - ? WHERE level = 2`                                                                                    | adminController.js   | 933       | UPDATE |
| 76  | `UPDATE point_list SET money = money + ? WHERE level = 2 and phone = ?`                                                                            | adminController.js   | 946       | UPDATE |
| 77  | `UPDATE point_list SET money = money - ? WHERE level = 2 and phone = ?`                                                                            | adminController.js   | 949       | UPDATE |
| 78  | `UPDATE point_list SET money_us = money_us + ? WHERE level = 2 and phone = ?`                                                                      | adminController.js   | 965       | UPDATE |
| 79  | `UPDATE point_list SET money_us = money_us - ? WHERE level = 2 and phone = ?`                                                                      | adminController.js   | 968       | UPDATE |
| 80  | `UPDATE users SET money = money + ? WHERE id_user = ?`                                                                                             | adminController.js   | 1014      | UPDATE |
| 81  | `UPDATE users SET money = money - ? WHERE id_user = ?`                                                                                             | adminController.js   | 1017      | UPDATE |
| 82  | `UPDATE 5d SET result = ?, status = ? WHERE period = ? AND game = "${game}"`                                                                       | k5Controller.js      | 267       | UPDATE |
| 83  | `UPDATE 5d SET result = ?, status = ? WHERE period = ? AND game = ${game}`                                                                         | k5Controller.js      | 272       | UPDATE |
| 84  | `UPDATE admin SET ${join} = ?`                                                                                                                     | k5Controller.js      | 283       | UPDATE |
| 85  | `UPDATE result_5d SET result = ? WHERE status = 0 AND game = ${game}`                                                                              | k5Controller.js      | 305       | UPDATE |
| 86  | `UPDATE result_5d SET status = 2 WHERE id = ?`                                                                                                     | k5Controller.js      | 324       | UPDATE |
| 87  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'b'`                                                                               | k5Controller.js      | 329       | UPDATE |
| 88  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 's'`                                                                               | k5Controller.js      | 332       | UPDATE |
| 89  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'l'`                                                                               | k5Controller.js      | 335       | UPDATE |
| 90  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'c'`                                                                               | k5Controller.js      | 338       | UPDATE |
| 91  | `UPDATE result_5d SET status = 2 WHERE id = ?`                                                                                                     | k5Controller.js      | 351       | UPDATE |
| 92  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'b' AND bet = 'b'`                                                                               | k5Controller.js      | 356       | UPDATE |
| 93  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'b' AND bet = 's'`                                                                               | k5Controller.js      | 359       | UPDATE |
| 94  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'b' AND bet = 'l'`                                                                               | k5Controller.js      | 362       | UPDATE |
| 95  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'b' AND bet = 'c'`                                                                               | k5Controller.js      | 365       | UPDATE |
| 96  | `UPDATE result_5d SET status = 2 WHERE id = ?`                                                                                                     | k5Controller.js      | 378       | UPDATE |
| 97  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'c' AND bet = 'b'`                                                                               | k5Controller.js      | 383       | UPDATE |
| 98  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'c' AND bet = 's'`                                                                               | k5Controller.js      | 386       | UPDATE |
| 99  | `UPDATE result_5d SET status = 2 WHERE join_bet = 'c' AND bet = 'l'`                                                                               | k5Controller.js      | 389       | UPDATE |
| 100 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'c' AND bet = 'c'`                                                                               | k5Controller.js      | 392       | UPDATE |
| 101 | `UPDATE result_5d SET status = 2 WHERE id = ?`                                                                                                     | k5Controller.js      | 405       | UPDATE |
| 102 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'd' AND bet = 'b'`                                                                               | k5Controller.js      | 410       | UPDATE |
| 103 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'd' AND bet = 's'`                                                                               | k5Controller.js      | 413       | UPDATE |
| 104 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'd' AND bet = 'l'`                                                                               | k5Controller.js      | 416       | UPDATE |
| 105 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'd' AND bet = 'c'`                                                                               | k5Controller.js      | 419       | UPDATE |
| 106 | `UPDATE result_5d SET status = 2 WHERE id = ?`                                                                                                     | k5Controller.js      | 432       | UPDATE |
| 107 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'e' AND bet = 'b'`                                                                               | k5Controller.js      | 437       | UPDATE |
| 108 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'e' AND bet = 's'`                                                                               | k5Controller.js      | 440       | UPDATE |
| 109 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'e' AND bet = 'l'`                                                                               | k5Controller.js      | 443       | UPDATE |
| 110 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'e' AND bet = 'c'`                                                                               | k5Controller.js      | 446       | UPDATE |
| 111 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'total' AND bet = 'b'`                                                                           | k5Controller.js      | 453       | UPDATE |
| 112 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'total' AND bet = 's'`                                                                           | k5Controller.js      | 456       | UPDATE |
| 113 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'total' AND bet = 'l'`                                                                           | k5Controller.js      | 459       | UPDATE |
| 114 | `UPDATE result_5d SET status = 2 WHERE join_bet = 'total' AND bet = 'c'`                                                                           | k5Controller.js      | 462       | UPDATE |
| 115 | `UPDATE result_5d SET get = ?, status = 1 WHERE id = ?`                                                                                            | k5Controller.js      | 478       | UPDATE |
| 116 | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | k5Controller.js      | 481       | UPDATE |
| 117 | `UPDATE k3 SET result = ?, status = ? WHERE period = ? AND game = "${game}"`                                                                       | k3Controller.js      | 255       | UPDATE |
| 118 | `UPDATE k3 SET result = ?, status = ? WHERE period = ? AND game = ${game}`                                                                         | k3Controller.js      | 260       | UPDATE |
| 119 | `UPDATE admin SET ${join} = ?`                                                                                                                     | k3Controller.js      | 271       | UPDATE |
| 120 | `UPDATE result_k3 SET result = ? WHERE status = 0 AND game = ${game}`                                                                              | k3Controller.js      | 284       | UPDATE |
| 121 | `UPDATE result_k3 SET status = 2 WHERE id = ?`                                                                                                     | k3Controller.js      | 321       | UPDATE |
| 122 | `UPDATE result_k3 SET status = 0 WHERE id = ?`                                                                                                     | k3Controller.js      | 329       | UPDATE |
| 123 | `UPDATE result_k3 SET status = 2 WHERE id = ?`                                                                                                     | k3Controller.js      | 400       | UPDATE |
| 124 | `UPDATE result_k3 SET status = 2 WHERE id = ?`                                                                                                     | k3Controller.js      | 439       | UPDATE |
| 125 | `UPDATE result_k3 SET status = 2 WHERE id = ?`                                                                                                     | k3Controller.js      | 447       | UPDATE |
| 126 | `UPDATE result_k3 SET status = 2 WHERE id = ?`                                                                                                     | k3Controller.js      | 539       | UPDATE |
| 127 | `UPDATE result_k3 SET status = 2 WHERE id = ?`                                                                                                     | k3Controller.js      | 547       | UPDATE |
| 128 | `UPDATE result_k3 SET status = 2 WHERE id = ?`                                                                                                     | k3Controller.js      | 553       | UPDATE |
| 129 | `UPDATE result_k3 SET get = ?, status = 1 WHERE id = ?`                                                                                            | k3Controller.js      | 573       | UPDATE |
| 130 | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | k3Controller.js      | 576       | UPDATE |
| 131 | `UPDATE point_list SET telegram = ? WHERE phone = ?`                                                                                               | dailyController.js   | 77        | UPDATE |
| 132 | `UPDATE users SET money = money + ? WHERE phone = ?`                                                                                               | dailyController.js   | 1033      | UPDATE |

### DELETE Queries

| #   | Query                                                      | File               | Line | Type   |
| --- | ---------------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `DELETE FROM recharge WHERE phone = ? AND status = ?`      | userController.js  | 879  | DELETE |
| 2   | `DELETE FROM bank_recharge WHERE type = 'momo' AND id = ?` | adminController.js | 800  | DELETE |

---

## wingo TABLE

### SELECT Queries

| #   | Query                                                                                                    | File               | Line    | Type   |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------ | ------- | ------ |
| 1   | `SELECT period FROM wingo WHERE status = 0 AND game = '${gameJoin}' ORDER BY id DESC LIMIT 1`            | winGoController.js | 259-260 | SELECT |
| 2   | `SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}` | winGoController.js | 494-495 | SELECT |
| 3   | `SELECT * FROM wingo WHERE status != 0 AND game = '${game}'`                                             | winGoController.js | 497-498 | SELECT |
| 4   | `SELECT period FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`                | winGoController.js | 500-501 | SELECT |
| 5   | `SELECT period FROM wingo WHERE status = 0 AND game = "${join}" ORDER BY id DESC LIMIT 1`                | winGoController.js | 650-651 | SELECT |
| 6   | `SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`                    | winGoController.js | 857-858 | SELECT |
| 7   | `SELECT * FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`                     | adminController.js | 131     | SELECT |
| 8   | `SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10`                   | adminController.js | 132     | SELECT |

### INSERT Queries

| #   | Query                                                                          | File               | Line    | Type   |
| --- | ------------------------------------------------------------------------------ | ------------------ | ------- | ------ |
| 1   | `INSERT INTO wingo SET period = ?, amount = ?, game = ?, status = ?, time = ?` | winGoController.js | 828-833 | INSERT |

### UPDATE Queries

| #   | Query                                                                           | File               | Line    | Type   |
| --- | ------------------------------------------------------------------------------- | ------------------ | ------- | ------ |
| 1   | `UPDATE wingo SET amount = ?, status = ? WHERE period = ? AND game = "${join}"` | winGoController.js | 805     | UPDATE |
| 2   | `UPDATE wingo SET amount = ?, status = ? WHERE period = ? AND game = "${join}"` | winGoController.js | 823-824 | UPDATE |

---

## minutes_1 TABLE

### SELECT Queries

| #   | Query                                                                                                    | File               | Line    | Type   |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------ | ------- | ------ |
| 1   | `SELECT * FROM minutes_1 WHERE status = 0 AND game = "${join}"`                                          | winGoController.js | 656-657 | SELECT |
| 2   | `SELECT SUM(money) AS total_money FROM minutes_1 WHERE game = "${join}" AND status = 0 AND bet IN (...)` | winGoController.js | 678-680 | SELECT |
| 3   | `SELECT SUM(money) AS total_money FROM minutes_1 WHERE game = "${join}" AND status = 0 AND bet IN (...)` | winGoController.js | 747-749 | SELECT |
| 4   | `SELECT * FROM minutes_1 WHERE status = 0 AND game = '${game}'`                                          | winGoController.js | 945-946 | SELECT |
| 5   | `SELECT * FROM minutes_1 WHERE phone = ? AND game = ? ORDER BY id DESC LIMIT ?, ?`                       | winGoController.js | 572-573 | SELECT |
| 6   | `SELECT * FROM minutes_1 WHERE phone = ? AND game = ? ORDER BY id DESC`                                  | winGoController.js | 576-577 | SELECT |
| 7   | `SELECT get FROM minutes_1 WHERE stage = ? AND phone = ?`                                                | winGoController.js | 584-585 | SELECT |
| 8   | `SELECT SUM(money) as total FROM minutes_1 WHERE status = 1`                                             | adminController.js | 276     | SELECT |
| 9   | `SELECT SUM(money) as total FROM minutes_1 WHERE status = 2`                                             | adminController.js | 277     | SELECT |
| 10  | `SELECT money, time FROM minutes_1 WHERE phone = ? AND status = 1`                                       | dailyController.js | 491     | SELECT |
| 11  | `SELECT money, time FROM minutes_1 WHERE phone = ? AND status = 2`                                       | dailyController.js | 492     | SELECT |
| 12  | `SELECT * FROM minutes_1 WHERE game = "${game}" AND status = 0 AND level = 0 ORDER BY id ASC`            | adminController.js | 130     | SELECT |

### UPDATE Queries

| #   | Query                                                                                                                                              | File               | Line      | Type   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- | ------ |
| 1   | `UPDATE minutes_1 SET result = ? WHERE status = 0 AND game = '${game}'`                                                                            | winGoController.js | 862-863   | UPDATE |
| 2   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "0" AND bet != "t"` | winGoController.js | 869-870   | UPDATE |
| 3   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "1"`                | winGoController.js | 875-876   | UPDATE |
| 4   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "2"`                | winGoController.js | 881-882   | UPDATE |
| 5   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "3"`                | winGoController.js | 887-888   | UPDATE |
| 6   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "4"`                | winGoController.js | 893-894   | UPDATE |
| 7   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "5" AND bet != "t"` | winGoController.js | 899-900   | UPDATE |
| 8   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "6"`                | winGoController.js | 905-906   | UPDATE |
| 9   | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "7"`                | winGoController.js | 911-912   | UPDATE |
| 10  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "8"`                | winGoController.js | 917-918   | UPDATE |
| 11  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "9"`                | winGoController.js | 923-924   | UPDATE |
| 12  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "l"`                                                              | winGoController.js | 933-934   | UPDATE |
| 13  | `UPDATE minutes_1 SET status = 2 WHERE status = 0 AND game = "${game}" AND bet = "n"`                                                              | winGoController.js | 938-939   | UPDATE |
| 14  | `UPDATE minutes_1 SET get = ?, status = 1 WHERE id = ?`                                                                                            | winGoController.js | 1046-1047 | UPDATE |

---

## 5d TABLE

### SELECT Queries

| #   | Query                                                                                                 | File                 | Line | Type   |
| --- | ----------------------------------------------------------------------------------------------------- | -------------------- | ---- | ------ |
| 1   | `SELECT period FROM 5d WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                  | k5Controller.js      | 130  | SELECT |
| 2   | `SELECT * FROM 5d WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}` | k5Controller.js      | 189  | SELECT |
| 3   | `SELECT * FROM 5d WHERE status != 0 AND game = '${game}'`                                             | k5Controller.js      | 190  | SELECT |
| 4   | `SELECT period FROM 5d WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`                | k5Controller.js      | 191  | SELECT |
| 5   | `SELECT period FROM 5d WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                  | k5Controller.js      | 258  | SELECT |
| 6   | `SELECT * FROM 5d WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1`                      | k5Controller.js      | 300  | SELECT |
| 7   | `SELECT * FROM 5d WHERE game = 1 ORDER BY id DESC LIMIT 2`                                            | cronJobContronler.js | 16   | SELECT |
| 8   | `SELECT * FROM 5d WHERE game = 3 ORDER BY id DESC LIMIT 2`                                            | cronJobContronler.js | 25   | SELECT |
| 9   | `SELECT * FROM 5d WHERE game = 5 ORDER BY id DESC LIMIT 2`                                            | cronJobContronler.js | 34   | SELECT |
| 10  | `SELECT * FROM 5d WHERE game = 10 ORDER BY id DESC LIMIT 2`                                           | cronJobContronler.js | 43   | SELECT |

### INSERT Queries

| #   | Query                                                                       | File            | Line | Type   |
| --- | --------------------------------------------------------------------------- | --------------- | ---- | ------ |
| 1   | `INSERT INTO 5d SET period = ?, result = ?, game = ?, status = ?, time = ?` | k5Controller.js | 274  | INSERT |

### UPDATE Queries

| #   | Query                                                                        | File            | Line | Type   |
| --- | ---------------------------------------------------------------------------- | --------------- | ---- | ------ |
| 1   | `UPDATE 5d SET result = ?, status = ? WHERE period = ? AND game = "${game}"` | k5Controller.js | 267  | UPDATE |
| 2   | `UPDATE 5d SET result = ?, status = ? WHERE period = ? AND game = ${game}`   | k5Controller.js | 272  | UPDATE |

---

## k3 TABLE

### SELECT Queries

| #   | Query                                                                                | File                 | Line | Type   |
| --- | ------------------------------------------------------------------------------------ | -------------------- | ---- | ------ |
| 1   | `SELECT period FROM k3 WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1` | k3Controller.js      | 121  | SELECT |
| 2   | `SELECT period FROM k3 WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1` | k3Controller.js      | 246  | SELECT |
| 3   | `SELECT * FROM k3 WHERE status != 0 AND game = ${game} ORDER BY id DESC LIMIT 1`     | k3Controller.js      | 279  | SELECT |
| 4   | `SELECT * FROM k3 WHERE game = 1 ORDER BY id DESC LIMIT 2`                           | cronJobContronler.js | 20   | SELECT |
| 5   | `SELECT * FROM k3 WHERE game = 3 ORDER BY id DESC LIMIT 2`                           | cronJobContronler.js | 29   | SELECT |
| 6   | `SELECT * FROM k3 WHERE game = 5 ORDER BY id DESC LIMIT 2`                           | cronJobContronler.js | 38   | SELECT |
| 7   | `SELECT * FROM k3 WHERE game = 10 ORDER BY id DESC LIMIT 2`                          | cronJobContronler.js | 47   | SELECT |

### INSERT Queries

| #   | Query                                                                       | File            | Line | Type   |
| --- | --------------------------------------------------------------------------- | --------------- | ---- | ------ |
| 1   | `INSERT INTO k3 SET period = ?, result = ?, game = ?, status = ?, time = ?` | k3Controller.js | 269  | INSERT |

### UPDATE Queries

| #   | Query                                                                        | File            | Line | Type   |
| --- | ---------------------------------------------------------------------------- | --------------- | ---- | ------ |
| 1   | `UPDATE k3 SET result = ?, status = ? WHERE period = ? AND game = "${game}"` | k3Controller.js | 255  | UPDATE |
| 2   | `UPDATE k3 SET result = ?, status = ? WHERE period = ? AND game = ${game}`   | k3Controller.js | 260  | UPDATE |

---

## result_5d TABLE

### SELECT Queries

| #   | Query                                                                                                      | File            | Line | Type   |
| --- | ---------------------------------------------------------------------------------------------------------- | --------------- | ---- | ------ |
| 1   | `SELECT * FROM result_5d WHERE phone = ? AND game = '${game}' ORDER BY id DESC LIMIT ${pageno}, ${pageto}` | k5Controller.js | 219  | SELECT |
| 2   | `SELECT * FROM result_5d WHERE phone = ? AND game = '${game}' ORDER BY id DESC`                            | k5Controller.js | 220  | SELECT |
| 3   | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'a'`                     | k5Controller.js | 313  | SELECT |
| 4   | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'b'`                     | k5Controller.js | 340  | SELECT |
| 5   | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'c'`                     | k5Controller.js | 367  | SELECT |
| 6   | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'd'`                     | k5Controller.js | 394  | SELECT |
| 7   | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'e'`                     | k5Controller.js | 421  | SELECT |
| 8   | `SELECT id, bet FROM result_5d WHERE status = 0 AND game = ${game} AND join_bet = 'total'`                 | k5Controller.js | 448  | SELECT |
| 9   | `SELECT id, phone, bet, price, money, fee, amount FROM result_5d WHERE status = 0 AND game = ${game}`      | k5Controller.js | 465  | SELECT |

### UPDATE Queries

| #   | Query                                                                 | File            | Line | Type   |
| --- | --------------------------------------------------------------------- | --------------- | ---- | ------ |
| 1   | `UPDATE result_5d SET result = ? WHERE status = 0 AND game = ${game}` | k5Controller.js | 305  | UPDATE |
| 2   | `UPDATE result_5d SET status = 2 WHERE id = ?`                        | k5Controller.js | 324  | UPDATE |
| 3   | `UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'b'`  | k5Controller.js | 329  | UPDATE |
| 4   | `UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 's'`  | k5Controller.js | 332  | UPDATE |
| 5   | `UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'l'`  | k5Controller.js | 335  | UPDATE |
| 6   | `UPDATE result_5d SET status = 2 WHERE join_bet = 'a' AND bet = 'c'`  | k5Controller.js | 338  | UPDATE |
| 7   | `UPDATE result_5d SET get = ?, status = 1 WHERE id = ?`               | k5Controller.js | 478  | UPDATE |

---

## result_k3 TABLE

### SELECT Queries

| #   | Query                                                                                                 | File            | Line | Type   |
| --- | ----------------------------------------------------------------------------------------------------- | --------------- | ---- | ------ |
| 1   | `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'total'`            | k3Controller.js | 290  | SELECT |
| 2   | `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'two-same'`         | k3Controller.js | 332  | SELECT |
| 3   | `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'three-same'`       | k3Controller.js | 410  | SELECT |
| 4   | `SELECT id, bet FROM result_k3 WHERE status = 0 AND game = ${game} AND typeGame = 'unlike'`           | k3Controller.js | 455  | SELECT |
| 5   | `SELECT id, phone, bet, price, money, fee, amount FROM result_k3 WHERE status = 0 AND game = ${game}` | k3Controller.js | 557  | SELECT |

### UPDATE Queries

| #   | Query                                                                 | File            | Line | Type   |
| --- | --------------------------------------------------------------------- | --------------- | ---- | ------ |
| 1   | `UPDATE result_k3 SET result = ? WHERE status = 0 AND game = ${game}` | k3Controller.js | 284  | UPDATE |
| 2   | `UPDATE result_k3 SET status = 2 WHERE id = ?`                        | k3Controller.js | 321  | UPDATE |
| 3   | `UPDATE result_k3 SET status = 0 WHERE id = ?`                        | k3Controller.js | 329  | UPDATE |
| 4   | `UPDATE result_k3 SET get = ?, status = 1 WHERE id = ?`               | k3Controller.js | 573  | UPDATE |

---

## recharge TABLE

### SELECT Queries

| #   | Query                                                                                      | File               | Line | Type   |
| --- | ------------------------------------------------------------------------------------------ | ------------------ | ---- | ------ |
| 1   | `SELECT * FROM recharge WHERE phone = ? AND status = 1`                                    | userController.js  | 74   | SELECT |
| 2   | `SELECT * FROM recharge WHERE phone = ? AND status = ? AND type = ?`                       | userController.js  | 806  | SELECT |
| 3   | `SELECT * FROM recharge WHERE phone = ? AND status = ?`                                    | userController.js  | 808  | SELECT |
| 4   | `SELECT * FROM recharge WHERE id_order = ?`                                                | userController.js  | 826  | SELECT |
| 5   | `SELECT SUM(money) as total FROM recharge WHERE status = 1`                                | adminController.js | 280  | SELECT |
| 6   | `SELECT SUM(money) as total FROM recharge WHERE status = 1 AND today = ?`                  | adminController.js | 283  | SELECT |
| 7   | `SELECT SUM(money) as total FROM recharge WHERE phone = ? AND status = 1`                  | dailyController.js | 337  | SELECT |
| 8   | `SELECT money, time FROM recharge WHERE phone = ? AND status = 1`                          | dailyController.js | 474  | SELECT |
| 9   | `SELECT id, status, type, phone, money, time FROM recharge WHERE phone = ? AND status = 1` | dailyController.js | 529  | SELECT |
| 10  | `SELECT * FROM recharge WHERE status = 0`                                                  | adminController.js | 495  | SELECT |
| 11  | `SELECT * FROM recharge WHERE status != 0`                                                 | adminController.js | 496  | SELECT |
| 12  | `SELECT * FROM recharge WHERE id = ?`                                                      | adminController.js | 561  | SELECT |
| 13  | `SELECT * FROM recharge WHERE phone = ? AND status = 1`                                    | userController.js  | 978  | SELECT |
| 14  | `SELECT * FROM recharge WHERE phone = ? AND status = 0`                                    | userController.js  | 720  | SELECT |
| 15  | `SELECT * FROM recharge WHERE phone = ? AND status = ?`                                    | userController.js  | 789  | SELECT |
| 16  | `SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT 10`                         | adminController.js | 1139 | SELECT |
| 17  | `SELECT SUM(money) as money FROM recharge WHERE phone = ? AND status = 1`                  | adminController.js | 1255 | SELECT |
| 18  | `SELECT money, time FROM recharge WHERE phone = ? AND status = 1`                          | adminController.js | 1266 | SELECT |
| 19  | `SELECT id, status, type, phone, money, time FROM recharge WHERE phone = ? AND status = 1` | adminController.js | 1321 | SELECT |

### INSERT Queries

| #   | Query                                                                                                                                 | File              | Line    | Type   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------- | ------ |
| 1   | `INSERT INTO recharge SET id_order = ?, transaction_id = ?, phone = ?, money = ?, type = ?, status = ?, today = ?, url = ?, time = ?` | userController.js | 777-786 | INSERT |
| 2   | `INSERT INTO recharge SET id_order = ?, transaction_id = ?, phone = ?, money = ?, type = ?, status = ?, today = ?, url = ?, time = ?` | userController.js | 817-826 | INSERT |

### UPDATE Queries

| #   | Query                                                                            | File                 | Line | Type   |
| --- | -------------------------------------------------------------------------------- | -------------------- | ---- | ------ |
| 1   | `UPDATE recharge SET status = 2 WHERE phone = ? AND id_order = ? AND status = ?` | userController.js    | 724  | UPDATE |
| 2   | `UPDATE recharge SET status = 1 WHERE id = ?`                                    | adminController.js   | 558  | UPDATE |
| 3   | `UPDATE recharge SET status = 2 WHERE id = ?`                                    | adminController.js   | 704  | UPDATE |
| 4   | `UPDATE recharge SET status = 2 WHERE id = ?`                                    | paymentController.js | 852  | UPDATE |
| 5   | `UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ?`                   | paymentController.js | 862  | UPDATE |

### DELETE Queries

| #   | Query                                                 | File              | Line | Type   |
| --- | ----------------------------------------------------- | ----------------- | ---- | ------ |
| 1   | `DELETE FROM recharge WHERE phone = ? AND status = ?` | userController.js | 879  | DELETE |

---

## withdraw TABLE

### SELECT Queries

| #   | Query                                                                                | File               | Line | Type   |
| --- | ------------------------------------------------------------------------------------ | ------------------ | ---- | ------ |
| 1   | `SELECT * FROM withdraw WHERE phone = ? AND status = 1`                              | userController.js  | 78   | SELECT |
| 2   | `SELECT SUM(money) as total FROM withdraw WHERE status = 1`                          | adminController.js | 281  | SELECT |
| 3   | `SELECT SUM(money) as total FROM withdraw WHERE status = 1 AND today = ?`            | adminController.js | 284  | SELECT |
| 4   | `SELECT SUM(money) as total FROM withdraw WHERE phone = ? AND status = 1`            | dailyController.js | 338  | SELECT |
| 5   | `SELECT money, time FROM withdraw WHERE phone = ? AND status = 1`                    | dailyController.js | 475  | SELECT |
| 6   | `SELECT id, status, phone, money, time FROM withdraw WHERE phone = ? AND status = 1` | dailyController.js | 530  | SELECT |
| 7   | `SELECT * FROM withdraw WHERE status = 0`                                            | adminController.js | 497  | SELECT |
| 8   | `SELECT * FROM withdraw WHERE status != 0`                                           | adminController.js | 498  | SELECT |
| 9   | `SELECT * FROM withdraw WHERE id = ?`                                                | adminController.js | 697  | SELECT |
| 10  | `SELECT * FROM withdraw WHERE phone = ? and status = 1`                              | userController.js  | 1078 | SELECT |
| 11  | `SELECT * FROM withdraw WHERE phone = ? AND today = ?`                               | userController.js  | 1079 | SELECT |
| 12  | `SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT 10`                   | adminController.js | 1140 | SELECT |
| 13  | `SELECT SUM(money) as money FROM withdraw WHERE phone = ? AND status = 1`            | adminController.js | 1256 | SELECT |
| 14  | `SELECT money, time FROM withdraw WHERE phone = ? AND status = 1`                    | adminController.js | 1267 | SELECT |
| 15  | `SELECT id, status, phone, money, time FROM withdraw WHERE phone = ? AND status = 1` | adminController.js | 1322 | SELECT |

### INSERT Queries

| #   | Query                                                                                                                                           | File              | Line      | Type   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | --------- | ------ |
| 1   | `INSERT INTO withdraw SET id_order = ?, phone = ?, money = ?, stk = ?, name_bank = ?, ifsc = ?, name_user = ?, status = ?, today = ?, time = ?` | userController.js | 1104-1114 | INSERT |

### UPDATE Queries

| #   | Query                                                     | File               | Line | Type   |
| --- | --------------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `UPDATE withdraw SET status = 1 WHERE id = ?`             | adminController.js | 694  | UPDATE |
| 2   | `UPDATE withdraw SET status = 2, remark = ? WHERE id = ?` | adminController.js | 757  | UPDATE |

---

## user_bank TABLE

### SELECT Queries

| #   | Query                                     | File               | Line | Type   |
| --- | ----------------------------------------- | ------------------ | ---- | ------ |
| 1   | `SELECT * FROM user_bank WHERE phone = ?` | dailyController.js | 339  | SELECT |
| 2   | `SELECT * FROM user_bank WHERE phone = ?` | adminController.js | 479  | SELECT |
| 3   | `SELECT * FROM user_bank WHERE stk = ?`   | userController.js  | 927  | SELECT |
| 4   | `SELECT * FROM user_bank WHERE phone = ?` | userController.js  | 928  | SELECT |
| 5   | `SELECT * FROM user_bank WHERE phone = ?` | userController.js  | 997  | SELECT |
| 6   | `SELECT * FROM user_bank WHERE phone = ?` | adminController.js | 1063 | SELECT |

### INSERT Queries

| #   | Query                                                                                                       | File              | Line    | Type   |
| --- | ----------------------------------------------------------------------------------------------------------- | ----------------- | ------- | ------ |
| 1   | `INSERT INTO user_bank SET phone = ?, name_bank = ?, name_user = ?, stk = ?, email = ?, tinh = ?, time = ?` | userController.js | 934-941 | INSERT |

### UPDATE Queries

| #   | Query                                                                                                       | File              | Line | Type   |
| --- | ----------------------------------------------------------------------------------------------------------- | ----------------- | ---- | ------ |
| 1   | `UPDATE user_bank SET stk = ? WHERE phone = ?`                                                              | userController.js | 948  | UPDATE |
| 2   | `UPDATE user_bank SET name_bank = ?, name_user = ?, stk = ?, email = ?, tinh = ?, time = ? WHERE phone = ?` | userController.js | 955  | UPDATE |

---

## point_list TABLE

### SELECT Queries

| #   | Query                                                    | File                 | Line | Type   |
| --- | -------------------------------------------------------- | -------------------- | ---- | ------ |
| 1   | `SELECT * FROM point_list WHERE phone = ?`               | userController.js    | 193  | SELECT |
| 2   | `SELECT money, money_us FROM point_list WHERE phone = ?` | dailyController.js   | 47   | SELECT |
| 3   | `SELECT telegram FROM point_list WHERE phone = ?`        | dailyController.js   | 66   | SELECT |
| 4   | `SELECT * FROM point_list WHERE phone = ?`               | dailyController.js   | 524  | SELECT |
| 5   | `SELECT * FROM point_list WHERE phone = ?`               | adminController.js   | 937  | SELECT |
| 6   | `SELECT * FROM point_list WHERE phone = ?`               | adminController.js   | 956  | SELECT |
| 7   | `SELECT telegram FROM point_list WHERE phone = ?`        | accountController.ts | 343  | SELECT |
| 8   | `SELECT * FROM point_list WHERE phone = ?`               | adminController.js   | 1316 | SELECT |

### UPDATE Queries

| #   | Query                                                                         | File                 | Line | Type   |
| --- | ----------------------------------------------------------------------------- | -------------------- | ---- | ------ |
| 1   | `UPDATE point_list SET total1 = ? WHERE phone = ?`                            | userController.js    | 208  | UPDATE |
| 2   | `UPDATE point_list SET total2 = ? WHERE phone = ?`                            | userController.js    | 227  | UPDATE |
| 3   | `UPDATE point_list SET total3 = ? WHERE phone = ?`                            | userController.js    | 246  | UPDATE |
| 4   | `UPDATE point_list SET total4 = ? WHERE phone = ?`                            | userController.js    | 265  | UPDATE |
| 5   | `UPDATE point_list SET total5 = ? WHERE phone = ?`                            | userController.js    | 284  | UPDATE |
| 6   | `UPDATE point_list SET total6 = ? WHERE phone = ?`                            | userController.js    | 303  | UPDATE |
| 7   | `UPDATE point_list SET total7 = ? WHERE phone = ?`                            | userController.js    | 322  | UPDATE |
| 8   | `UPDATE point_list SET telegram = ? WHERE phone = ?`                          | dailyController.js   | 77   | UPDATE |
| 9   | `UPDATE point_list SET money = money + ? WHERE level = 2`                     | adminController.js   | 917  | UPDATE |
| 10  | `UPDATE point_list SET money = money - ? WHERE level = 2`                     | adminController.js   | 920  | UPDATE |
| 11  | `UPDATE point_list SET money_us = money_us + ? WHERE level = 2`               | adminController.js   | 930  | UPDATE |
| 12  | `UPDATE point_list SET money_us = money_us - ? WHERE level = 2`               | adminController.js   | 933  | UPDATE |
| 13  | `UPDATE point_list SET money = money + ? WHERE level = 2 and phone = ?`       | adminController.js   | 946  | UPDATE |
| 14  | `UPDATE point_list SET money = money - ? WHERE level = 2 and phone = ?`       | adminController.js   | 949  | UPDATE |
| 15  | `UPDATE point_list SET money_us = money_us + ? WHERE level = 2 and phone = ?` | adminController.js   | 965  | UPDATE |
| 16  | `UPDATE point_list SET money_us = money_us - ? WHERE level = 2 and phone = ?` | adminController.js   | 968  | UPDATE |
| 17  | `UPDATE point_list SET money = ?`                                             | cronJobContronler.js | 87   | UPDATE |

### INSERT Queries

| #   | Query                                             | File                 | Line | Type   |
| --- | ------------------------------------------------- | -------------------- | ---- | ------ |
| 1   | `INSERT INTO point_list SET phone = ?`            | accountController.ts | 174  | INSERT |
| 2   | `INSERT INTO point_list SET phone = ?, level = 2` | adminController.js   | 1106 | INSERT |

---

## level TABLE

### SELECT Queries

| #   | Query                 | File               | Line | Type   |
| --- | --------------------- | ------------------ | ---- | ------ |
| 1   | `SELECT * FROM level` | winGoController.js | 74   | SELECT |
| 2   | `SELECT * FROM level` | userController.js  | 429  | SELECT |
| 3   | `SELECT * FROM level` | userController.js  | 564  | SELECT |
| 4   | `SELECT * FROM level` | k5Controller.js    | 52   | SELECT |
| 5   | `SELECT * FROM level` | k5Controller.js    | 159  | SELECT |
| 6   | `SELECT * FROM level` | k3Controller.js    | 49   | SELECT |
| 7   | `SELECT * FROM level` | k3Controller.js    | 199  | SELECT |

### UPDATE Queries

| #   | Query                                                      | File               | Line | Type   |
| --- | ---------------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `UPDATE level SET f1= ?, f2= ?, f3= ?, f4= ? WHERE id = ?` | adminController.js | 669  | UPDATE |

---

## roses TABLE

### SELECT Queries

| #   | Query                                                                                         | File              | Line | Type   |
| --- | --------------------------------------------------------------------------------------------- | ----------------- | ---- | ------ |
| 1   | `SELECT f1, invite, code, phone, time FROM roses WHERE invite = ? ORDER BY id DESC LIMIT 100` | userController.js | 594  | SELECT |

### INSERT Queries

| #   | Query                                                                                             | File               | Line   | Type   |
| --- | ------------------------------------------------------------------------------------------------- | ------------------ | ------ | ------ |
| 1   | `INSERT INTO roses SET phone = ?, code = ?, invite = ?, f1 = ?, time = ?`                         | winGoController.js | 99-103 | INSERT |
| 2   | `INSERT INTO roses SET phone = ?, code = ?, invite = ?, f1 = ?, f2 = ?, f3 = ?, f4 = ?, time = ?` | k5Controller.js    | 161    | INSERT |
| 3   | `INSERT INTO roses SET phone = ?, code = ?, invite = ?, f1 = ?, f2 = ?, f3 = ?, f4 = ?, time = ?` | k3Controller.js    | 201    | INSERT |

---

## turn_over TABLE

### INSERT Queries

| #   | Query                                                                                                                                                                                                                                                   | File               | Line    | Type   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------- | ------ |
| 1   | `INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE daily_turn_over = daily_turn_over + VALUES(daily_turn_over), total_turn_over = total_turn_over + VALUES(total_turn_over)` | winGoController.js | 114-119 | INSERT |

### SELECT Queries

| #   | Query                                                                           | File              | Line | Type   |
| --- | ------------------------------------------------------------------------------- | ----------------- | ---- | ------ |
| 1   | `SELECT phone, daily_turn_over, total_turn_over FROM turn_over WHERE phone = ?` | userController.js | 648  | SELECT |

---

## salary TABLE

### INSERT Queries

| #   | Query                                                                | File                 | Line | Type   |
| --- | -------------------------------------------------------------------- | -------------------- | ---- | ------ |
| 1   | `INSERT INTO salary (phone, amount, type, time) VALUES (?, ?, ?, ?)` | paymentController.js | 775  | INSERT |
| 2   | `INSERT INTO salary (phone, amount, type, time) VALUES (?, ?, ?, ?)` | adminController.js   | 623  | INSERT |

### SELECT Queries

| #   | Query                                                     | File              | Line | Type   |
| --- | --------------------------------------------------------- | ----------------- | ---- | ------ |
| 1   | `SELECT * FROM salary WHERE phone = ? ORDER BY time DESC` | homeController.js | 113  | SELECT |

---

## admin TABLE

### SELECT Queries

| #   | Query                                                                     | File                 | Line | Type   |
| --- | ------------------------------------------------------------------------- | -------------------- | ---- | ------ |
| 1   | `SELECT * FROM admin`                                                     | winGoController.js   | 653  | SELECT |
| 2   | `SELECT telegram FROM admin`                                              | dailyController.js   | 67   | SELECT |
| 3   | `SELECT * FROM admin`                                                     | k5Controller.js      | 259  | SELECT |
| 4   | `SELECT * FROM admin`                                                     | k3Controller.js      | 247  | SELECT |
| 5   | `SELECT cskh FROM admin`                                                  | homeController.js    | 78   | SELECT |
| 6   | `SELECT telegram, cskh FROM admin`                                        | accountController.ts | 337  | SELECT |
| 7   | `SELECT * FROM admin`                                                     | accountController.ts | 341  | SELECT |
| 8   | `SELECT * FROM admin`                                                     | adminController.js   | 133  | SELECT |
| 9   | `SELECT * FROM admin`                                                     | adminController.js   | 516  | SELECT |
| 10  | `SELECT SUM(money) as total FROM recharge WHERE status = 1 AND today = ?` | adminController.js   | 283  | SELECT |
| 11  | `SELECT SUM(money) as total FROM withdraw WHERE status = 1 AND today = ?` | adminController.js   | 284  | SELECT |

### UPDATE Queries

| #   | Query                                              | File               | Line | Type   |
| --- | -------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `UPDATE admin SET ${join} = ?`                     | winGoController.js | 842  | UPDATE |
| 2   | `UPDATE admin SET ${game} = ?`                     | adminController.js | 352  | UPDATE |
| 3   | `UPDATE admin SET ${bs} = ?`                       | adminController.js | 359  | UPDATE |
| 4   | `UPDATE admin SET telegram = ?, cskh = ?, app = ?` | adminController.js | 842  | UPDATE |
| 5   | `UPDATE admin SET ${join} = ?`                     | k5Controller.js    | 283  | UPDATE |
| 6   | `UPDATE admin SET ${join} = ?`                     | k3Controller.js    | 271  | UPDATE |

---

## bank_recharge TABLE

### SELECT Queries

| #   | Query                                             | File                 | Line | Type   |
| --- | ------------------------------------------------- | -------------------- | ---- | ------ |
| 1   | `SELECT * FROM bank_recharge WHERE type = 'momo'` | paymentController.js | 32   | SELECT |
| 2   | `SELECT * FROM bank_recharge WHERE type = 'momo'` | paymentController.js | 60   | SELECT |
| 3   | `SELECT * FROM bank_recharge`                     | adminController.js   | 514  | SELECT |
| 4   | `SELECT * FROM bank_recharge WHERE type = 'momo'` | adminController.js   | 515  | SELECT |
| 5   | `SELECT * FROM bank_recharge WHERE type = 'momo'` | adminController.js   | 767  | SELECT |

### INSERT Queries

| #   | Query                                                                                                   | File               | Line | Type   |
| --- | ------------------------------------------------------------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, type = 'momo'` | adminController.js | 789  | INSERT |

### DELETE Queries

| #   | Query                                                      | File               | Line | Type   |
| --- | ---------------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `DELETE FROM bank_recharge WHERE type = 'momo' AND id = ?` | adminController.js | 800  | DELETE |

### UPDATE Queries

| #   | Query                                                                                | File               | Line | Type   |
| --- | ------------------------------------------------------------------------------------ | ------------------ | ---- | ------ |
| 1   | `UPDATE bank_recharge SET name_bank = ?, name_user = ?, stk = ? WHERE type = 'bank'` | adminController.js | 772  | UPDATE |

---

## redenvelopes TABLE

### SELECT Queries

| #   | Query                                         | File               | Line | Type   |
| --- | --------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `SELECT * FROM redenvelopes WHERE status = 0` | adminController.js | 989  | SELECT |

### INSERT Queries

| #   | Query                                                                                                               | File               | Line | Type   |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `INSERT INTO redenvelopes SET id_redenvelope = ?, phone = ?, money = ?, used = ?, amount = ?, status = ?, time = ?` | adminController.js | 980  | INSERT |

---

## redenvelopes_used TABLE

### SELECT Queries

| #   | Query                                             | File               | Line | Type   |
| --- | ------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `SELECT * FROM redenvelopes_used WHERE phone = ?` | dailyController.js | 543  | SELECT |
| 2   | `SELECT * FROM redenvelopes_used WHERE phone = ?` | adminController.js | 1335 | SELECT |

---

## financial_details TABLE

### SELECT Queries

| #   | Query                                             | File               | Line | Type   |
| --- | ------------------------------------------------- | ------------------ | ---- | ------ |
| 1   | `SELECT * FROM financial_details WHERE phone = ?` | dailyController.js | 552  | SELECT |
| 2   | `SELECT * FROM financial_details WHERE phone = ?` | adminController.js | 1344 | SELECT |

---

## SUMMARY BY QUERY TYPE

### Total SELECT Queries: 240+

### Total INSERT Queries: 23+

### Total UPDATE Queries: 132+

### Total DELETE Queries: 3+

---

## DATABASE TABLES IDENTIFIED

1. **users** - User accounts and authentication
2. **wingo** - WinGo game results and periods
3. **minutes_1** - Bet records for WinGo games
4. **5d** - 5D game results and periods
5. **k3** - K3 game results and periods
6. **result_5d** - 5D game bet records
7. **result_k3** - K3 game bet records
8. **recharge** - User deposit/recharge records
9. **withdraw** - User withdrawal records
10. **user_bank** - User bank account information
11. **point_list** - User points/bonus tracking (CTV related)
12. **level** - Commission level configuration
13. **roses** - Referral commission records
14. **turn_over** - User turnover tracking
15. **salary** - Agent/CTV salary records
16. **admin** - Admin settings and game controls
17. **bank_recharge** - Bank recharge configuration
18. **redenvelopes** - Red envelope bonuses
19. **redenvelopes_used** - Used red envelope records
20. **financial_details** - Financial transaction details

---

## NOTES FOR PRISMA MIGRATION

1. **Parameterized Queries**: All queries use parameterized statements with `?` placeholders - these map well to Prisma's parameterized queries.

2. **Dynamic Table Names**: Some queries use dynamic table names (e.g., `${game}`, `${join}`) - these need special handling in Prisma.

3. **ON DUPLICATE KEY UPDATE**: MySQL-specific syntax used in turn_over table - Prisma has `upsert` for this.

4. **Date/Time Handling**: Many queries use `time`, `today` fields - ensure proper DateTime handling in Prisma schema.

5. **JSON Fields**: The `admin` table has fields that store array data as strings (e.g., `wingo1`, `wingo3`) - consider JSON type in Prisma.

6. **Soft Deletes**: Status fields (0, 1, 2) are used for soft deletes - consider Prisma enums or union types.

7. **Relations**: Many-to-many and one-to-many relations exist between users, recharge, withdraw, bets, etc.

8. **Raw Queries**: Some complex queries with dynamic SQL may need `prisma.$queryRaw` in Prisma.

---

**END OF DOCUMENT**
