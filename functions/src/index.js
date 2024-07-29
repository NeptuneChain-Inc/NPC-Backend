/** SERVER MODULES */
const express = require("express");
const { resolve } = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

/** API IMPORTS */
const database = require("./apis/database");
const moralis = require("./apis/moralis");
const livepeer = require("./apis/livepeer");
const maps = require("./apis/maps");
const stripe = require("./apis/stripe");
const {
  addDevice,
  editDevice,
  removeDevice,
  getDeviceDetails,
  emulateDeviceFunction,
  getRecordedData,
  getDevices,
} = require("./apis/deviceManager");
const { Verification } = require("./apis/neptunechain");

/** SERVER CONFIGS */
dotenv.config({ path: "./src/.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://app.neptunechain.io");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/*[#1]**********************************#WEB*ROUTES*********************************************** */
app.get("/", (req, res) => {
  const path = resolve("/index.html");
  res.sendFile(path);
});

app.get("/docs", (req, res) => {
  const path = resolve("/docs.html");
  res.sendFile(path);
});

/*[#2]*********************************USER*DATABASE*ROUTES******************************************* */

/**
 * @api {post} /db/user/create
 * @apiName CreateUserDatabase
 * @apiDescription Initiate database for new user
 * @apiGroup UserDatabase
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
app.post("/db/user/create", async (req, res) => {
  const { userUID, email, username, role, PIN } = req.body;
  try {
    const { create } = database.UserDB;
    const result = await create.user({
      userUID,
      email,
      username,
      role,
      PIN
    });
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

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
app.post("/db/user/get/fuid", async (req, res) => {
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
 * @api {post} /db/user/get/fusername
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
app.post("/db/user/get/fusername", async (req, res) => {
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
app.post("/db/user/get/username", async (req, res) => {
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
app.post("/db/user/get/media", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_media = await database.UserDB.get.media.media(userUID);
    return res.send({ user_media });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/streams", async (req, res) => {
  try {
    const { userUID } = req.body;
    const user_streams = await database.UserDB.get.media.streams(userUID);
    return res.send({ user_streams });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#3]******************USER*ASSETS*ROUTES************************ */
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
app.post("/db/user/get/assets", async (req, res) => {
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
app.post("/db/user/get/asset/disputes", async (req, res) => {
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
app.post("/db/user/get/asset/approvals", async (req, res) => {
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

/*[#4]**********************DATABASE*ASSET*CREATION********************** */
// Get Asset
app.post("/db/asset/get", async (req, res) => {
  try {
    const { assetID } = req.body;
    const media = await database.MediaDB.get.media(assetID);
    return res.send({ media });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Create/Upload Asset
app.post("/db/asset/create", async (req, res) => {
  try {
    const { newAssetPaylaod, userUID } = req.body;
    const result = await database.MediaDB.set.media(newAssetPaylaod, userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Ammend metadata to asset
app.post("/db/asset/create/metadata", async (req, res) => {
  try {
    const { assetID, metadata } = req.body;
    const result = await database.MediaDB.set.mediaMetadata(assetID, metadata);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Submit asset
app.post("/db/asset/create/submit", async (req, res) => {
  try {
    const { userUID, assetID } = req.body;
    const result = await Verification.submitAsset(userUID, assetID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// Dispute Asset
app.post("/db/asset/create/dispute", async (req, res) => {
  try {
    const { userUID, assetID, reason } = req.body;
    const result = await Verification.disputeAsset(userUID, assetID, reason);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/** Resolve Dispute
 * { solution, status } = params
 */
app.post("/db/asset/create/dispute/close", async (req, res) => {
  try {
    const { userUID, disputeID, params } = req.body;
    const result = await Verification.resolveAsset(userUID, disputeID, params);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/** Approve Asset
 * { creditTypes, creditSupplyLimits } = params
 */
app.post("/db/asset/create/approve", async (req, res) => {
  try {
    const { userUID, assetID, params } = req.body;
    const result = await Verification.approveAsset(userUID, assetID, params);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#5]**********************************#LIVEPEER*ROUTES******************************************* */

/** Livepeer Proxy */
app.use(
  "/livepeer_origin",
  createProxyMiddleware({
    target: "https://origin.livepeer.com",
    changeOrigin: true,
    pathRewrite: {
      "^/livepeer_origin": "",
    },
  })
);

app.post("/livepeer/asset/get", async (req, res) => {
  const { assetID } = req.body;
  try {
    const asset = await livepeer.AssetOps.get(assetID);
    return res.send({ asset });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/livepeer/asset/update", async (req, res) => {
  const { assetID, patch } = req.body;
  try {
    const result = await livepeer.AssetOps.update(assetID, patch);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/livepeer/asset/delete", async (req, res) => {
  const { assetID } = req.body;
  try {
    const result = await livepeer.AssetOps.delete(assetID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/livepeer/asset/info/playback", async (req, res) => {
  const { playbackID } = req.body;
  try {
    const playbackInfo = await livepeer.PlaybackOps.get.playbackInfo(
      playbackID
    );
    return res.send({ playbackInfo });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#6]*************************STREAM**MANAGEMENT************************************************** */
app.post("/db/media/get/stream", async (req, res) => {
  try {
    const { assetID } = req.body;
    const stream = await database.MediaDB.get.stream(assetID);
    return res.send({ stream });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/create/stream", async (req, res) => {
  try {
    const { streamData, creatorUID } = req.body;
    const result = await database.MediaDB.set.stream(streamData, creatorUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#7]**********************************#MAPS*ROUTES*********************************************** */
app.post("/maps/get/api", async (req, res) => {
  try {
    const api = await maps.getMapsAPI();
    return res.send({ api });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#8]**********************************#MORALIS*ROUTES******************************************** */
app.post("/moralis/get/wallet_nfts", async (req, res) => {
  try {
    const { address } = req.body || {};
    const wallet_nfts = await moralis.getWalletNFTs(address);
    return res.send({ wallet_nfts });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/moralis/get/nft_metadata", async (req, res) => {
  try {
    const { address, tokenId } = req.body || {};
    const nft_metadata = await moralis.getNFTMetadata(address, tokenId);
    return res.send({ nft_metadata });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#9]**********************************#STIPE*ROUTES******************************************* */
app.post("/stripe/config", (req, res) => {
  return res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/stripe/create/payment_intent", async (req, res) => {
  try {
    const payment_intent = await stripe.createPaymentIntent(req.body);
    return res.send({ payment_intent });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/stripe/get/price", async (req, res) => {
  try {
    const price = await stripe.getPrice(req.body);
    return res.send({ price });
  } catch (error) {
    return res.status(500).send({ error });
  }
});
/*[#10]****************************************DEVICE*MANAGEMENT*ROUTES********************************** */

// Add Device
app.post("/devices", async (req, res) => {
  try {
    const devices = await getDevices();
    res.status(201).send({ devices });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Add Device
app.post("/device", async (req, res) => {
  try {
    if (await addDevice(req.body)) {
      res.status(201).send({ message: "Device added successfully" });
    } else {
      res.status(501).send({ message: "Could not add device" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Edit Device
app.post("/device/edit", async (req, res) => {
  try {
    const { deviceId, update } = req.body;
    if (await editDevice(deviceId, update)) {
      res.status(200).send({ message: "Device updated successfully" });
    } else {
      res.status(501).send({ message: "Could not update device" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Remove Device
app.post("/device/remove", async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (await removeDevice(deviceId)) {
      res.status(200).send({ message: "Device removed successfully" });
    } else {
      res.status(501).send({ message: "Could not remove device" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get Device Details
app.post("/device/details", async (req, res) => {
  try {
    const { deviceId } = req.body;
    const device = await getDeviceDetails(deviceId);
    if (device) {
      res.status(200).send({ device });
    } else {
      res.status(501).send({ message: "Could not get device details" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Emulate Device Function
app.post("/device/emulate", async (req, res) => {
  try {
    const { deviceId, interval } = req.body;
    if (await emulateDeviceFunction(deviceId, interval)) {
      res
        .status(200)
        .send({ message: `Emulation started for device ${deviceId}` });
    } else {
      res.status(501).send({ message: "Could not emulate device" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get Recorded Data
app.post("/device/data", async (req, res) => {
  try {
    const { deviceId } = req.body;
    const data = await getRecordedData(deviceId);
    if (data) {
      res.status(200).send({ data });
    } else {
      res.status(501).send({ message: "Could not get device records" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
/****************************************************************************************** */
exports.app = require("firebase-functions").https.onRequest(app);
console.log(`SERVER IS LIVE!!`);
