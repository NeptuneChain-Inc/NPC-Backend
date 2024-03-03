/**
 * NOTES:
 *  STATUS CODES : {
 *  500:  Indicating that the request was accepted, but that an error on the server prevented the fulfillment of the request.
 * }
 */

/** SERVER MODULES */
const express = require("express");
const { resolve } = require("path");
const dotenv = require("dotenv");

/** SERVER CONFIGS */
dotenv.config({ path: ".env" });

const app = express();

app.use(express.json());

app.use(express.static("../public"));

// ##NB Set which addresses have access to server.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://app.neptunechain.io");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/** API IMPORTS */
const authentication = require("./apis/authentication");
const database = require("./apis/database");
const ethereum = require("./apis/ethereum");
const moralis = require("./apis/moralis");
const livepeer = require("./apis/livepeer");
const maps = require("./apis/maps");
const stripe = require("./apis/stripe");
const { firebaseConfig } = require("./apis/firebase");

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
    firebaseConfig
  });
});

/***********************************#AUTHENTICATION*ROUTES******************************************* */
// #EmailUser routes
//Required Body params: email, username, type, password
app.post("/auth/email/create", async (req, res) => {
  try {
    const user = await authentication.EmailUser.create(req.body)
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

//Required Body params: email
app.post("/auth/email/password_reset", async (req, res) => {
  try {
    const requested = await authentication.EmailUser.reset_password(req.body)
    return res.send({ requested });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/***********************************#DATABASE*ROUTES******************************************* */
// #UserDB get routes
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

app.post("/db/user/get/media/videos", async (req, res) => {
  try {
    const videos = await database.UserDB.get.media.videos(req.body.uid);
    return res.send({ videos });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/user/get/media/streams", async (req, res) => {
  try {
    const streams = await database.UserDB.get.media.streams(req.body.uid);
    return res.send({ streams });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// #UserDB set routes
app.post("/db/user/set/user", async (req, res) => {
  try {
    const result = await database.UserDB.set.create(req.body.userdata);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// #MediaDB get routes
app.post("/db/media/get/video", async (req, res) => {
  try {
    const video = await database.MediaDB.get.video(req.body.playbackId);
    return res.send({ video });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/get/stream", async (req, res) => {
  try {
    const stream = await database.MediaDB.get.stream(req.body.playbackId);
    return res.send({ stream });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// #MediaDB set routes
app.post("/db/media/set/video", async (req, res) => {
  try {
    const result = await database.MediaDB.set.video(
      req.body.videoAsset,
      req.body.creatorUID
    );
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post("/db/media/set/stream", async (req, res) => {
  try {
    const result = await database.MediaDB.set.stream(
      req.body.streamData,
      req.body.creatorUID
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
app.post("/livepeer/get/client", async (req, res) => {
  try {
    const livepeerClient = livepeer.getLivepeerClient();
    return res.send({ livepeerClient });
  } catch (error) {
    return res.status(500).send({ error });
  }
});
app.post("/livepeer/get/viewership", async (req, res) => {
  try {
    const viewership = await livepeer.getViewership(req.body.playbackId);
    return res.send({ viewership });
  } catch (error) {
    return res.status(500).send({ error });
  }
});
app.post("/livepeer/get/asset_metrics", async (req, res) => {
  try {
    const asset_metrics = await livepeer.getAssetMetrics(req.body.assetId);
    return res.send({ asset_metrics });
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
/****************************************************************************************** */

const isFirebaseEnv = false;

if (isFirebaseEnv) {
  exports.app = require("firebase-functions").https.onRequest(app);
  console.log(`SERVER IS LIVE!!`);
} else {
  const PORT = process.env.TEST_PORT;
  app.listen(PORT || 3000, () =>
    console.log(`Node server listening at http://localhost:${PORT}`)
  );
}
