const express = require("express");

const router = express.Router();

const database = require("../apis/database");

/************************************************************************************************************************************************************************* */

/**
 * @api {post} /db/user/get/fuid
 * @apiName GetUserDatabaseFromUID
 * @apiDescription Gets user data using (from) account's unique identifier.
 * @apiGroup UserDatabase
 *
 * @apiParam {String} userUID - User's unique identifier from firebase
 *
 * @apiSuccess {Object} userdata - Returns userdata object
 *
 * @apiError {Object} error Error message.
 */
router.post("/get/from/uid", async (req, res) => {
  const { userUID } = req.body;
  try {
    const { user } = database.UserDB.get;
    const userdata = await user(userUID);
    return res.send({ userdata });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/user/get/from-username
 * @apiName GetUserDatabaseFromName
 * @apiDescription Gets user data using (from) account username. It first resolves userUID before retrieving user.
 * @apiGroup UserDatabase
 *
 * @apiParam {String} username - User's account name.
 *
 * @apiSuccess {Object} userdata - Returns userdata object
 *
 * @apiError {Object} error Error message.
 */
router.post("/get/from/username", async (req, res) => {
  const { username } = req.body;
  try {
    const { get } = database.UserDB;
    const userdata = await get.user(get.username(username));
    return res.send({ userdata });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/user/get/username
 * @apiName GetUserUIDFromName
 * @apiDescription Gets the userUID of a registered username.
 * @apiGroup UserDatabase
 *
 * @apiParam {String} username - User's account name.
 *
 * @apiSuccess {String} userUID - Returns User's unique identifier
 *
 * @apiError {Object} error Error message.
 */
router.post("/get/uid/from/username", async (req, res) => {
  const { username } = req.body;
  try {
    const { get } = database.UserDB;
    const userUID = await get.username(username);
    return res.send({ userUID });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*******************************MEDIA******************************* */

/**
 * @api {post} /db/user/get/media Get media  from user database
 * @apiName GetUserMedia
 * @apiGroup UserMedia
 *
 * @apiParam {String} userUID User's Unique identifier from firebase authentication.
 *
 * @apiSuccess {Array} user_media Array of User's media.
 *
 * @apiError {Object} error Error message.
 */
router.post("/get/media", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_media = await database.UserDB.get.media.media(userUID);
    return res.send({ user_media });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/user/get/streams
 * @apiName GetUserStreams
 * @apiDescription Get streams from user database
 * @apiGroup UserMedia
 *
 * @apiParam {String} userUID - User's unique identifier from firebase authentication.
 *
 * @apiSuccess {Array} user_streams - Array of User's streams.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/get/streams", async (req, res) => {
  try {
    const { userUID } = req.body;
    const user_streams = await database.UserDB.get.media.streams(userUID);
    return res.send({ user_streams });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**************************************USER*ASSETS******************************************** */
/**
 * @api {post} /db/user/get/assets Get assets submitted by user (submissions)
 * @apiName GetUserAssets
 * @apiGroup UserAssets
 *
 * @apiParam {String} userUID User's Unique identifier from firebase authentication.
 *
 * @apiSuccess {Array} user_assets Array of User's assets (submissions).
 *
 * @apiError {Object} error Error message.
 */
router.post("/get/assets", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_assets = await database.UserDB.get.assets.get.submissions(
      userUID
    );
    return res.send({ user_assets });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/user/get/asset/disputes Get asset disputes from user database
 * @apiName GetUserAssetDisputes
 * @apiGroup UserAssets
 *
 * @apiParam {String} userUID User's Unique identifier from firebase authentication.
 *
 * @apiSuccess {Array} user_disputes Array of User's asset disputes.
 *
 * @apiError {Object} error Error message.
 */
router.post("/get/asset/disputes", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_disputes = await database.UserDB.get.assets.get.disputes(
      userUID
    );
    return res.send({ user_disputes });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/user/get/asset/approvals Get asset approvals from user database
 * @apiName GetUserAssetApprovals
 * @apiGroup UserAssets
 *
 * @apiParam {String} userUID User's Unique identifier from firebase authentication.
 *
 * @apiSuccess {Array} user_approvals Array of User's asset approvals.
 *
 * @apiError {Object} error Error message.
 */
router.post("/get/asset/approvals", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_approvals = await database.UserDB.get.assets.get.approvals(
      userUID
    );
    return res.send({ user_approvals });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;