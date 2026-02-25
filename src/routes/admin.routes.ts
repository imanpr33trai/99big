// src/routes/admin.routes.ts
import { Router } from "express";
import { Pool } from "mysql2/promise";
import { createAdminAuthController } from "../controllers/admin/adminAuth.controller";
import { createAdminGameController } from "../controllers/admin/adminGame.controller";
import { createAdminMemberController } from "../controllers/admin/adminMember.controller";
import { createAdminAuthMiddleware } from "../middleware/adminAuth.middleware";

/**
 * Create admin routes
 */
export const createAdminRoutes = (db: Pool): Router => {
  const router = Router();

  // Initialize middleware
  const adminAuth = createAdminAuthMiddleware(db);

  // Initialize controllers
  const authController = createAdminAuthController(db);
  const memberController = createAdminMemberController(db);
  const gameController = createAdminGameController(db);

  // ==========================================
  // PUBLIC ROUTES (No authentication required)
  // ==========================================

  /**
   * @route   POST /api/admin/login
   * @desc    Admin login
   * @access  Public
   */
  router.post("/login", authController.login);

  /**
   * @route   POST /api/admin/register
   * @desc    Register new admin/CTV
   * @access  Public
   */
  router.post("/register", authController.register);

  // ==========================================
  // PROTECTED ROUTES (Admin authentication required)
  // ==========================================

  // Apply auth middleware to all routes below
  router.use(adminAuth);

  // ------------------------------------------
  // Member Management
  // ------------------------------------------

  /**
   * @route   POST /api/admin/listMember
   * @desc    List all members with pagination
   * @access  Private (Admin)
   */
  router.post("/listMember", memberController.listMember);

  /**
   * @route   POST /api/admin/listCTV
   * @desc    List all CTVs with pagination
   * @access  Private (Admin)
   */
  router.post("/listCTV", memberController.listCTV);

  /**
   * @route   POST /api/admin/userInfo
   * @desc    Get detailed user info with referral hierarchy
   * @access  Private (Admin)
   */
  router.post("/userInfo", memberController.userInfo);

  /**
   * @route   POST /api/admin/profileUser
   * @desc    Get user profile with recent transactions
   * @access  Private (Admin)
   */
  router.post("/profileUser", memberController.profileUser);

  /**
   * @route   POST /api/admin/infoCtv
   * @desc    Get CTV dashboard data
   * @access  Private (Admin)
   */
  router.post("/infoCtv", memberController.infoCtv);

  // ------------------------------------------
  // Financial Operations
  // ------------------------------------------

  /**
   * @route   GET /api/admin/statistical2
   * @desc    Get platform statistics
   * @access  Private (Admin)
   */
  router.get("/statistical2", memberController.statistical2);

  /**
   * @route   GET /api/admin/recharge
   * @desc    Get all deposits and withdrawals
   * @access  Private (Admin)
   */
  router.get("/recharge", memberController.recharge);

  /**
   * @route   POST /api/admin/rechargeDuyet
   * @desc    Approve or reject deposit
   * @access  Private (Admin)
   */
  router.post("/rechargeDuyet", memberController.rechargeDuyet);

  /**
   * @route   POST /api/admin/handlWithdraw
   * @desc    Approve or reject withdrawal
   * @access  Private (Admin)
   */
  router.post("/handlWithdraw", memberController.handlWithdraw);

  /**
   * @route   POST /api/admin/listRechargeMem/:phone
   * @desc    Get user's deposit history
   * @access  Private (Admin)
   */
  router.post("/listRechargeMem/:phone", memberController.listRechargeMem);

  /**
   * @route   POST /api/admin/listWithdrawMem/:phone
   * @desc    Get user's withdrawal history
   * @access  Private (Admin)
   */
  router.post("/listWithdrawMem/:phone", memberController.listWithdrawMem);

  /**
   * @route   POST /api/admin/listBet/:phone
   * @desc    Get user's bet history
   * @access  Private (Admin)
   */
  router.post("/listBet/:phone", memberController.listBet);

  // ------------------------------------------
  // Settings Management
  // ------------------------------------------

  /**
   * @route   POST /api/admin/changeAdmin
   * @desc    Update game control settings
   * @access  Private (Admin)
   */
  router.post("/changeAdmin", authController.changeAdmin);

  /**
   * @route   GET /api/admin/settingGet
   * @desc    Get all settings
   * @access  Private (Admin)
   */
  router.get("/settingGet", memberController.settingGet);

  /**
   * @route   POST /api/admin/settingBank
   * @desc    Update bank/UPI settings
   * @access  Private (Admin)
   */
  router.post("/settingBank", memberController.settingBank);

  /**
   * @route   POST /api/admin/settingCskh
   * @desc    Update customer service settings
   * @access  Private (Admin)
   */
  router.post("/settingCskh", authController.settingCskh);

  /**
   * @route   POST /api/admin/banned
   * @desc    Ban or unban user
   * @access  Private (Admin)
   */
  router.post("/banned", authController.banned);

  // ------------------------------------------
  // Bonus & Promotions
  // ------------------------------------------

  /**
   * @route   POST /api/admin/createBonus
   * @desc    Create bonus or red envelope
   * @access  Private (Admin)
   */
  router.post("/createBonus", memberController.createBonus);

  /**
   * @route   GET /api/admin/listRedenvelops
   * @desc    List red envelopes
   * @access  Private (Admin)
   */
  router.get("/listRedenvelops", memberController.listRedenvelops);

  /**
   * @route   POST /api/admin/settingbuff
   * @desc    Adjust user balance (buff)
   * @access  Private (Admin)
   */
  router.post("/settingbuff", memberController.settingBuff);

  // ------------------------------------------
  // Commission & Levels
  // ------------------------------------------

  /**
   * @route   GET /api/admin/getLevelInfo
   * @desc    Get commission levels
   * @access  Private (Admin)
   */
  router.get("/getLevelInfo", memberController.getLevelInfo);

  /**
   * @route   POST /api/admin/updateLevel
   * @desc    Update commission rates
   * @access  Private (Admin)
   */
  router.post("/updateLevel", memberController.updateLevel);

  // ------------------------------------------
  // Salary Management
  // ------------------------------------------

  /**
   * @route   POST /api/admin/CreatedSalary
   * @desc    Create salary record for user
   * @access  Private (Admin)
   */
  router.post("/CreatedSalary", memberController.CreatedSalary);

  /**
   * @route   GET /api/admin/getSalary
   * @desc    Get salary records
   * @access  Private (Admin)
   */
  router.get("/getSalary", memberController.getSalary);

  // ------------------------------------------
  // Game Management
  // ------------------------------------------

  /**
   * @route   GET /api/admin/totalJoin
   * @desc    Get game statistics by type
   * @access  Private (Admin)
   */
  router.get("/totalJoin", gameController.totalJoin);

  /**
   * @route   POST /api/admin/listOrderOld
   * @desc    Get 5D game history
   * @access  Private (Admin)
   */
  router.post("/listOrderOld", gameController.listOrderOld);

  /**
   * @route   POST /api/admin/listOrderOldK3
   * @desc    Get K3 game history
   * @access  Private (Admin)
   */
  router.post("/listOrderOldK3", gameController.listOrderOldK3);

  /**
   * @route   POST /api/admin/editResult
   * @desc    Edit 5D result settings
   * @access  Private (Admin)
   */
  router.post("/editResult", gameController.editResult);

  /**
   * @route   POST /api/admin/editResult2
   * @desc    Edit K3 result settings
   * @access  Private (Admin)
   */
  router.post("/editResult2", gameController.editResult2);

  // ------------------------------------------
  // Referral Management
  // ------------------------------------------

  /**
   * @route   GET /api/admin/getPhoneByInvite/:invite
   * @desc    Get phone by referral code
   * @access  Private (Admin)
   */
  router.get("/getPhoneByInvite/:invite", gameController.getPhoneByInvite);

  /**
   * @route   GET /api/admin/getUserCount/:code
   * @desc    Get user count by invite code
   * @access  Private (Admin)
   */
  router.get("/getUserCount/:code", gameController.getUserByCode);

  /**
   * @route   GET /api/admin/referredUsers/:code
   * @desc    Get all referred users
   * @access  Private (Admin)
   */
  router.get("/referredUsers/:code", gameController.getReferredUsers);

  return router;
};
