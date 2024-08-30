const express = require("express");

const router = express.Router();

const database = require("../apis/database");
const { EmailUser } = require("../apis/authentication");
const { Account } = require("../apis/neptunechain");

/**
 * @api {post} /account/create
 * @apiName CreateAccount
 * @apiDescription Initiate database for new user
 * @apiGroup Account
 *
 * @apiParam {String} userUID - User's unique identifier from firebase authentication.
 * @apiParam {String} email - User's email address from account registration form input.
 * @apiParam {String} username - User's account name from registration form input.
 * @apiParam {String} role - User's account role chosen from registration form.
 * @apiparam {number} PIN 6-figure access pin for wallet access
 *
 * @apiSuccess {Object} result - Returns true if user account created
 *
 * @apiError {Object} error Error message.
 */
router.post("/create", async (req, res) => {
  const { userUID, email, username, role, PIN } = req.body;
  try {
    const { create } = database.UserDB;
    const result = await create.user({
      userUID,
      email,
      username,
      role,
      PIN,
    });
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /account/register
 * @apiName RegisterAccount
 * @apiDescription Register a new account with a specific role on blockchain
 * @apiGroup Account
 *
 * @apiParam {String} accountID - The ID of the account to register.
 * @apiParam {String} role - The role of the account.
 * @apiParam {String} txAddress - The address of the account.
 *
 * @apiSuccess {Object} receipt - Transaction receipt
 *
 * @apiError {Object} error Error message.
 */
router.post("/register", async (req, res) => {
  const { accountID, role, txAddress } = req.body;
  try {
    //Check if UID is email verified first
    if (!(await EmailUser.isVerified(accountID))) {
      throw new Error("User Email Not Verified");
    }

    // Then check if user is in verification queue
    if (await database.UserDB.get.accountVerification.inQueue(accountID)) {
      throw new Error("Account Still in verification queue");
    }

    // Proceed to register if no premature return (Passes all checks)
    const result = await Account.register(accountID, role, txAddress);
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /account/verifyRole
 * @apiName VerifyRole
 * @apiDescription Verify the role of an account
 * @apiGroup Account
 *
 * @apiParam {String} accountID - The ID of the account.
 * @apiParam {String} role - The role to verify.
 *
 * @apiSuccess {Object} result - Result of role verification
 *
 * @apiError {Object} error Error message.
 */
router.post("/verifyRole", async (req, res) => {
  const { accountID, role } = req.body;
  try {
    const result = await Account.verifyRole(accountID, role);
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /account/isRegistered
 * @apiName IsRegistered
 * @apiDescription Check if an account is registered
 * @apiGroup Account
 *
 * @apiParam {String} accountID - The ID of the account.
 *
 * @apiSuccess {Object} result - Result of registration status check
 *
 * @apiError {Object} error Error message.
 */
router.post("/isRegistered", async (req, res) => {
  const { accountID } = req.body;
  try {
    const result = await Account.isRegistered(accountID);
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /account/isNotBlacklisted
 * @apiName IsNotBlacklisted
 * @apiDescription Check if an account is not blacklisted
 * @apiGroup Account
 *
 * @apiParam {String} accountID - The ID of the account.
 *
 * @apiSuccess {Object} result - Result of blacklist status check
 *
 * @apiError {Object} error Error message.
 */
router.post("/isNotBlacklisted", async (req, res) => {
  const { accountID } = req.body;
  try {
    const result = await Account.isNotBlacklisted(accountID);
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /account/data
 * @apiName GetAccountData
 * @apiDescription Get account data by account ID
 * @apiGroup Account
 *
 * @apiParam {String} accountID - The ID of the account.
 *
 * @apiSuccess {Object} result - Account data
 *
 * @apiError {Object} error Error message.
 */
router.post("/data", async (req, res) => {
  const { accountID } = req.body;
  try {
    const result = await Account.getAccountData(accountID);
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;