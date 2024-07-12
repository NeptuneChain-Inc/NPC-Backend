/**
 * NOTES:
 *  STATUS CODES : {
 *  500:  Indicating that the request was accepted, but that an error on the server prevented the fulfillment of the request.
 * }
 */

/***
 * TO-DO
 *
 * CONVERT TO TYPESCRIPT
 */

/** SERVER MODULES */
const express = require("express");
const { resolve } = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

/** SERVER CONFIGS */
dotenv.config({ path: "./src/.env" });

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("./public"));

// ##NB Set which addresses have access to server.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://app.neptunechain.io");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

/** API IMPORTS */
const authentication = require("./apis/authentication");
const database = require("./apis/database");
const ethereum = require("./apis/ethereum");
const moralis = require("./apis/moralis");
const livepeer = require("./apis/livepeer");
const maps = require("./apis/maps");
const stripe = require("./apis/stripe");
const { firebaseConfig } = require("./apis/firebase");
const {
  addDevice,
  editDevice,
  removeDevice,
  getDeviceDetails,
  emulateDeviceFunction,
  getRecordedData,
  getDevices,
} = require("./apis/deviceManager");

/***********************************#WEB*ROUTES*********************************************** */
app.get("/", (req, res) => {
  const path = resolve("/index.html");
  res.sendFile(path);
});

app.get("/docs", (req, res) => {
  const path = resolve("/docs.html");
  res.sendFile(path);
});

/***********************************#FIREBASE*ROUTES******************************************* */
app.post("/firebase/config", (req, res) => {
  return res.send({
    firebaseConfig,
  });
});

/***********************************#AUTHENTICATION*ROUTES******************************************* */
// #EmailUser routes
//Required Body params: email, username, type, password
app.post("/auth/email/create", async (req, res) => {
  try {
    const user = await authentication.EmailUser.create(req.body);
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

//Required Body params: email
app.post("/auth/email/password_reset", async (req, res) => {
  try {
    const requested = await authentication.EmailUser.reset_password(req.body);
    return res.send({ requested });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/***********************************#DATABASE*ROUTES******************************************* */
// #UserDB get routes
app.post("/db/user/create/user", async (req, res) => {
  const { uid, email, username, type } = req.body || {};
  try {
    const result = await database.UserDB.create.user({
      uid,
      email,
      username,
      type,
    });
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/user", async (req, res) => {
  try {
    const user = await database.UserDB.get.user(req.body.uid);
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/username", async (req, res) => {
  try {
    const username = await database.UserDB.get.username(req.body.username);
    return res.send({ username });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/dashboard", async (req, res) => {
  try {
    const dashboard = await database.UserDB.get.dashboard(req.body.uid);
    return res.send({ dashboard });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// USER MEDIA

app.post("/db/user/get/media/assets", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_media = await database.UserDB.get.media.media(userUID);
    return res.send({ user_media });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/media/assets/submissions", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_submissions = await database.UserDB.get.assets.get.submissions(userUID);
    return res.send({ user_submissions });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/media/assets/disputes", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_disputes = await database.UserDB.get.assets.get.disputes(userUID);
    return res.send({ user_disputes });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/media/assets/approvals", async (req, res) => {
  const { userUID } = req.body;
  try {
    const user_approvals = await database.UserDB.get.assets.get.approvals(userUID);
    return res.send({ user_approvals });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/media/streams", async (req, res) => {
  try {
    const { userUID } = req.body;
    const user_streams = await database.UserDB.get.media.streams(userUID);
    return res.send({ user_streams });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// #MediaDB get routes
app.post("/db/media/get/asset", async (req, res) => {
  try {
    const { assetID } = req.body;
    const media = await database.MediaDB.get.media(assetID);
    return res.send({ media });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/get/stream", async (req, res) => {
  try {
    const { assetID } = req.body;
    const stream = await database.MediaDB.get.stream(assetID);
    return res.send({ stream });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// #MediaDB set routes
app.post("/db/media/create/asset", async (req, res) => {
  try {
    const { newAssetPaylaod, userUID } = req.body;
    const result = await database.MediaDB.set.media(newAssetPaylaod, userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/create/asset/submission", async (req, res) => {
  try {
    const { assetID, userUID } = req.body;
    const result = await database.UserDB.get.assets.add.submission(assetID,userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/create/asset/dispute", async (req, res) => {
  try {
    const { assetID, userUID } = req.body;
    const result = await database.UserDB.get.assets.add.dispute(assetID, userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/create/asset/approval", async (req, res) => {
  try {
    const { assetID, userUID } = req.body;
    const result = await database.UserDB.get.assets.add.approval(assetID,userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/create/asset/metadata", async (req, res) => {
  try {
    const { assetID, metadata } = req.body;
    const result = await database.MediaDB.set.mediaMetadata(assetID, metadata);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/create/stream", async (req, res) => {
  try {
    const {streamData, creatorUID} = req.body;
    const result = await database.MediaDB.set.stream(
      streamData,
      creatorUID
    );
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/***********************************#ETHEREUM*ROUTES******************************************* */
/** #ENSURE PROPER AUTHORIZATIONS */
app.post("/ethereum/get/signer", async (req, res) => {
  try {
    const signer = await ethereum.getSigner();
    return res.send({ signer });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/***********************************#LIVEPEER*ROUTES******************************************* */

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

app.post("/livepeer/asset/create", async (req, res) => {
  const { newAssetPayload, userUID } = req.body;
  try {
    const result = await livepeer.AssetOps.create(newAssetPayload, userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

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

app.post("/livepeer/playback/info", async (req, res) => {
  const { playbackID } = req.body;
  try {
    const playbackInfo = await livepeer.PlaybackOps.get.playbackInfo(playbackID);
    return res.send({ playbackInfo });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/***********************************#MAPS*ROUTES*********************************************** */
app.post("/maps/get/api", async (req, res) => {
  try {
    const api = await maps.getMapsAPI();
    return res.send({ api });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/***********************************#MORALIS*ROUTES******************************************** */
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

/***********************************#STIPE*ROUTES******************************************* */
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
/*****************************************DEVICE*MANAGEMENT********************************** */

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
      res.status(200).send(device);
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
      res.status(200).send(data);
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
