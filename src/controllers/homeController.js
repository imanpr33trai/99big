// import jwt from 'jsonwebtoken'
// import md5 from "md5";
// import e from "express";

import { safeExecute } from "../lib/utils.js";

const homePage = async (req, res) => {
  const [settings] = await safeExecute("SELECT `app` FROM admin");
  const app = settings[0].app;
  return res.render("home/index.ejs", { app });
};

const checkInPage = async (req, res) => {
  return res.render("checkIn/checkIn.ejs");
};

const checkDes = async (req, res) => {
  return res.render("checkIn/checkDes.ejs");
};

const checkRecord = async (req, res) => {
  return res.render("checkIn/checkRecord.ejs");
};

const addBank = async (req, res) => {
  return res.render("wallet/addbank.ejs");
};

// promotion
const promotionPage = async (req, res) => {
  return res.render("promotion/promotion.ejs");
};

const promotionmyTeamPage = async (req, res) => {
  return res.render("promotion/myTeam.ejs");
};

const promotionDesPage = async (req, res) => {
  return res.render("promotion/promotionDes.ejs");
};

const tutorialPage = async (req, res) => {
  return res.render("promotion/tutorial.ejs");
};

const bonusRecordPage = async (req, res) => {
  return res.render("promotion/bonusrecord.ejs");
};

// wallet
const walletPage = async (req, res) => {
  return res.render("wallet/index.ejs");
};

const rechargePage = async (req, res) => {
  return res.render("wallet/recharge.ejs", {
    MinimumMoney: process.env.MINIMUM_MONEY,
  });
};

const rechargerecordPage = async (req, res) => {
  return res.render("wallet/rechargerecord.ejs");
};

const withdrawalPage = async (req, res) => {
  return res.render("wallet/withdrawal.ejs");
};

const withdrawalrecordPage = async (req, res) => {
  return res.render("wallet/withdrawalrecord.ejs");
};
const transfer = async (req, res) => {
  return res.render("wallet/transfer.ejs");
};

// member page
const mianPage = async (req, res) => {
  const auth = req.cookies.auth;
  const [user] = await safeExecute("SELECT `level` FROM users WHERE `token` = ? ", [auth]);
  const [settings] = await safeExecute("SELECT `cskh` FROM admin");
  const cskh = settings[0].cskh;
  const level = user[0].level;
  return res.render("member/index.ejs", { level, cskh });
};
const aboutPage = async (req, res) => {
  return res.render("member/about/index.ejs");
};

const recordsalary = async (req, res) => {
  return res.render("member/about/recordsalary.ejs");
};

const privacyPolicy = async (req, res) => {
  return res.render("member/about/privacyPolicy.ejs");
};

const newtutorial = async (req, res) => {
  return res.render("member/newtutorial.ejs");
};

const forgot = async (req, res) => {
  const auth = req.cookies.auth;
  const [user] = await safeExecute("SELECT `time_otp` FROM users WHERE token = ? ", [auth]);
  const time = user[0].time_otp;
  return res.render("member/forgot.ejs", { time });
};

const redenvelopes = async (req, res) => {
  return res.render("member/redenvelopes.ejs");
};

const riskAgreement = async (req, res) => {
  return res.render("member/about/riskAgreement.ejs");
};

const myProfilePage = async (req, res) => {
  return res.render("member/myProfile.ejs");
};

const getSalaryRecord = async (req, res) => {
  const auth = req.cookies.auth;

  const [rows] = await safeExecute(`SELECT * FROM users WHERE token = ?`, [auth]);
  const rowstr = rows[0];
  if (!rows) {
    return res.status(200).json({
      message: "Failed",
      status: false,
    });
  }
  const [getPhone] = await safeExecute(`SELECT * FROM salary WHERE phone = ? ORDER BY time DESC`, [
    rowstr.phone,
  ]);

  console.log("asdasdasd : " + [rows.phone]);
  return res.status(200).json({
    message: "Success",
    status: true,
    data: {},
    rows: getPhone,
  });
};
export default {
  homePage,
  checkInPage,
  promotionPage,
  walletPage,
  mianPage,
  myProfilePage,
  promotionmyTeamPage,
  promotionDesPage,
  tutorialPage,
  bonusRecordPage,
  rechargePage,
  rechargerecordPage,
  withdrawalPage,
  withdrawalrecordPage,
  aboutPage,
  privacyPolicy,
  riskAgreement,
  newtutorial,
  redenvelopes,
  forgot,
  checkDes,
  checkRecord,
  addBank,
  transfer,
  recordsalary,
  getSalaryRecord,
};
