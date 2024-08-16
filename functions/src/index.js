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
const { Account, Verification } = require("./apis/neptunechain");
const { EmailUser } = require("./apis/authentication");

/** SERVER CONFIGS */
dotenv.config({ path: "./src/.env" });

const app = express();

// Set COOP and COEP headers
// app.use((req, res, next) => {
//   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Or 'unsafe-none' if needed
//   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Or 'unsafe-none' if needed
//   next();
// });


// Configure CORS
const corsOptions = {
  origin: ['https://nutrient.trading'],
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true 
};

app.use(cors(corsOptions));

// Ensure that preflight (OPTIONS) requests are handled with a 200 response
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://nutrient.trading');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

app.use(express.json());
app.use(express.static("./public"));
app.use(bodyParser.json());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "https://app.neptunechain.io");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

/*[#1]**********************************#WEB*ROUTES*********************************************** */
app.get("/", (req, res) => {
  const path = resolve("/index.html");
  res.sendFile(path);
});

app.get("/docs", (req, res) => {
  const path = resolve("/docs.html");
  res.sendFile(path);
});

/**************************************ACCOUNT*CREATION*AND*REGISTRATION******************************
 * TO-DO: TEST
 */

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
 * @apiDescription Register a new account with a specific role
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
app.post("/account/register", async (req, res) => {
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
app.post("/account/verifyRole", async (req, res) => {
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
app.post("/account/isRegistered", async (req, res) => {
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
app.post("/account/isNotBlacklisted", async (req, res) => {
  const { accountID } = req.body;
  try {
    const result = await Account.isNotBlacklisted(accountID);
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /account/getAccountData
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
app.post("/account/getAccountData", async (req, res) => {
  const { accountID } = req.body;
  try {
    const result = await Account.getAccountData(accountID);
    return res.send(result);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#2]*********************************USER*DATABASE*ROUTES******************************************* */

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
/**
 * @api {post} /db/asset/get
 * @apiName GetAsset
 * @apiDescription Get Asset
 * @apiGroup AssetManagement
 *
 * @apiParam {String} assetID - Asset's unique identifier.
 *
 * @apiSuccess {Object} dbAsset - Returns Database Asset object
 *
 * @apiError {Object} error - Error message.
 */
app.post("/db/asset/get", async (req, res) => {
  try {
    const { assetID } = req.body;
    const dbAsset = await database.MediaDB.get.media(assetID);
    return res.send({ dbAsset });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/asset/create
 * @apiName CreateAsset
 * @apiDescription Create/Upload Asset
 * @apiGroup AssetManagement
 *
 * @apiParam {Object} newAssetPayload - New asset payload data.
 * @apiParam {String} userUID - User's unique identifier.
 *
 * @apiSuccess {Object} result - Returns result of asset creation
 *
 * @apiError {Object} error - Error message.
 */
app.post("/db/asset/create", async (req, res) => {
  try {
    const { newAssetPaylaod, userUID } = req.body;
    const result = await database.MediaDB.set.media(newAssetPaylaod, userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/asset/create/metadata
 * @apiName AddAssetMetadata
 * @apiDescription Amend metadata to asset
 * @apiGroup AssetManagement
 *
 * @apiParam {String} assetID - Asset's unique identifier.
 * @apiParam {Object} metadata - Metadata to add to asset.
 *
 * @apiSuccess {Object} result - Returns result of metadata addition
 *
 * @apiError {Object} error - Error message.
 */
app.post("/db/asset/create/metadata", async (req, res) => {
  try {
    const { assetID, metadata } = req.body;
    const result = await database.MediaDB.set.mediaMetadata(assetID, metadata);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/asset/create/submit
 * @apiName SubmitAsset
 * @apiDescription Submit Asset for review and approval
 * @apiGroup AssetManagement
 *
 * @apiParam {String} userUID User's Unique identifier.
 * @apiParam {String} assetID - Asset's unique identifier.
 *
 * @apiSuccess {Object} result - Returns result of asset submission
 *
 * @apiError {Object} error - Error message.
 */
app.post("/db/asset/create/submit", async (req, res) => {
  try {
    const { userUID, assetID } = req.body;
    const result = await Verification.submitAsset(userUID, assetID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/asset/create/dispute
 * @apiName DisputeAsset
 * @apiDescription Dispute Asset
 * @apiGroup AssetManagement
 *
 * @apiParam {String} userUID User's Unique identifier.
 * @apiParam {String} assetID - Asset's unique identifier.
 * @apiParam {String} reason - Reason for dispute.
 *
 * @apiSuccess {Object} result - Returns result of asset dispute
 *
 * @apiError {Object} error - Error message.
 */
app.post("/db/asset/create/dispute", async (req, res) => {
  try {
    const { userUID, assetID, reason } = req.body;
    const result = await Verification.disputeAsset(userUID, assetID, reason);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/asset/create/dispute/close
 * @apiName CloseAssetDispute
 * @apiDescription Close Asset Dispute
 * @apiGroup AssetManagement
 *
 * @apiParam {String} userUID User's Unique identifier.
 * @apiParam {String} disputeID - Dispute's unique identifier.
 * @apiParam {String} solution - A short summary of solution
 * @apiParam {String} status - One-word status of close (i.e resolved, invalid, cancelled, etc)
 *
 * @apiSuccess {Object} result - Returns result of closing asset dispute
 *
 * @apiError {Object} error - Error message.
 */
app.post("/db/asset/create/dispute/close", async (req, res) => {
  try {
    const { userUID, disputeID, solution, status } = req.body;
    const result = await Verification.resolveAsset(userUID, disputeID, {
      solution,
      status,
    });
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/asset/create/approve
 * @apiName ApproveAsset
 * @apiDescription Approve Asset
 * @apiGroup AssetManagement
 *
 * @apiParam {String} assetID - Asset's unique identifier.
 * @apiParam {Array<String>} creditTypes - An array of credit types the asset is allowed to issue
 * @apiParam {Array<Number>} creditSupplyLimits - A corresponding array of credit limits to limit the amount of credit issued per credit type
 *
 * @apiSuccess {Object} result - Returns result of asset approval
 *
 * @apiError {Object} error - Error message.
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

/**
 * @api {post} /livepeer_origin
 * @apiName LivepeerOrigin
 * @apiDescription Get Livepeer origin details
 * @apiGroup Livepeer
 *
 * @apiSuccess {Object} origin - Returns Livepeer origin details
 *
 * @apiError {Object} error - Error message.
 */
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

/**
 * @api {post} /livepeer/asset/get
 * @apiName GetLivepeerAsset
 * @apiDescription Get Livepeer Asset
 * @apiGroup Livepeer
 *
 * @apiParam {String} assetID - Asset's unique identifier.
 *
 * @apiSuccess {Object} asset - Returns Livepeer asset details
 *
 * @apiError {Object} error - Error message.
 */
app.post("/livepeer/asset/get", async (req, res) => {
  const { assetID } = req.body;
  try {
    const asset = await livepeer.AssetOps.get(assetID);
    return res.send({ asset });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /livepeer/asset/update
 * @apiName UpdateLivepeerAsset
 * @apiDescription Update Livepeer Asset
 * @apiGroup Livepeer
 *
 * @apiParam {String} assetID - Asset's unique identifier.
 * @apiParam {Object} updateData - Data to update in asset.
 *
 * @apiSuccess {Object} result - Returns result of asset update
 *
 * @apiError {Object} error - Error message.
 */
app.post("/livepeer/asset/update", async (req, res) => {
  const { assetID, patch } = req.body;
  try {
    const result = await livepeer.AssetOps.update(assetID, patch);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /livepeer/asset/delete
 * @apiName DeleteLivepeerAsset
 * @apiDescription Delete Livepeer Asset
 * @apiGroup Livepeer
 *
 * @apiParam {String} assetID - Asset's unique identifier.
 *
 * @apiSuccess {Object} result - Returns result of asset deletion
 *
 * @apiError {Object} error - Error message.
 */
app.post("/livepeer/asset/delete", async (req, res) => {
  const { assetID } = req.body;
  try {
    const result = await livepeer.AssetOps.delete(assetID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /livepeer/asset/info/playback
 * @apiName GetLivepeerAssetPlaybackInfo
 * @apiDescription Get Livepeer Asset Playback Info
 * @apiGroup Livepeer
 *
 * @apiParam {String} playbackID - Asset's unique identifier for playback.
 *
 * @apiSuccess {Object} playbackInfo - Returns playback info of asset
 *
 * @apiError {Object} error - Error message.
 */
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
/**
 * @api {post} /db/media/get/stream
 * @apiName GetMediaStream
 * @apiDescription Get Media Stream
 * @apiGroup Media
 *
 * @apiParam {String} streamID - Stream's unique identifier.
 *
 * @apiSuccess {Object} stream - Returns media stream
 *
 * @apiError {Object} error - Error message.
 */
app.post("/db/media/get/stream", async (req, res) => {
  try {
    const { assetID } = req.body;
    const stream = await database.MediaDB.get.stream(assetID);
    return res.send({ stream });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/media/create/stream
 * @apiName CreateMediaStream
 * @apiDescription Create Media Stream
 * @apiGroup Media
 *
 * @apiParam {String} userUID - User's unique identifier.
 * @apiParam {Object} streamData - Data for the new stream.
 *
 * @apiSuccess {Object} result - Returns result of stream creation
 *
 * @apiError {Object} error - Error message.
 */
app.post("/db/media/create/stream", async (req, res) => {
  try {
    const { userUID, streamData } = req.body;
    const result = await database.MediaDB.set.stream(streamData, userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#7]**********************************#MAPS*ROUTES*********************************************** */
/**
 * @api {get} /maps/get/api
 * @apiName GetMapsAPI
 * @apiDescription Get Maps API
 * @apiGroup Maps
 *
 * @apiSuccess {String} api - Returns Maps API
 *
 * @apiError {Object} error - Error message.
 */
app.post("/maps/get/api", async (req, res) => {
  try {
    const api = await maps.getMapsAPI();
    return res.send({ api });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/*[#8]**********************************#MORALIS*ROUTES******************************************** */
/**
 * @api {post} /moralis/get/wallet_nfts
 * @apiName GetWalletNFTs
 * @apiDescription Get Wallet NFTs
 * @apiGroup Moralis
 *
 * @apiParam {String} address - Wallet address to get NFTs for.
 *
 * @apiSuccess {Array} wallet_nfts - Returns array of NFTs in Wallet Address
 *
 * @apiError {Object} error - Error message.
 */
app.post("/moralis/get/wallet_nfts", async (req, res) => {
  try {
    const { address } = req.body || {};
    const wallet_nfts = await moralis.getWalletNFTs(address);
    return res.send({ wallet_nfts });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /moralis/get/nft_metadata
 * @apiName GetNFTMetadata
 * @apiDescription Get NFT Metadata
 * @apiGroup Moralis
 *
 * @apiParam {String} tokenId - Token ID of the NFT.
 * @apiParam {String} address - Contract address of the NFT.
 *
 * @apiSuccess {Object} nft_metadata - Returns NFT metadata
 *
 * @apiError {Object} error - Error message.
 */
app.post("/moralis/get/nft_metadata", async (req, res) => {
  try {
    const { address, tokenId } = req.body || {};
    const nft_metadata = await moralis.getNFTMetadata(address, tokenId);
    return res.send({ nft_metadata });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/***************************************#NPC_CREDIT_CONTRACT************************************ */
const neptuneChainCreditsRoutes = require("./routes/npcCreditsRoutes");

app.use("/npc_credits", neptuneChainCreditsRoutes);

/*[#9]**********************************#STIPE*ROUTES******************************************* */
/**
 * @api {get} /stripe/config
 * @apiName GetStripeConfig
 * @apiDescription Get Stripe Configuration
 * @apiGroup Stripe
 *
 * @apiSuccess {Object} result - Result object with publishableKey.
 * @apiError {Object} error - Error message.
 */
app.post("/stripe/config", (req, res) => {
  return res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

/**
 * @api {post} /stripe/create/payment_intent
 * @apiName CreatePaymentIntent
 * @apiDescription Create Payment Intent
 * @apiGroup Stripe
 *
 * @apiParam {String} amount - Amount to charge.
 * @apiParam {String} currency - Currency of the charge.
 *
 * @apiSuccess {Object} payment_intent - Returns payment intent details
 *
 * @apiError {Object} error - Error message.
 */
app.post("/stripe/create/payment_intent", async (req, res) => {
  const { amount, currency, optional_params } = req.body;
  try {
    const payment_intent = await stripe.createPaymentIntent(amount, currency, optional_params);
    return res.send({ payment_intent });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {get} /stripe/get/price
 * @apiName GetStripePrice
 * @apiDescription Get Stripe Price
 * @apiGroup Stripe
 *
 * @apiParam {String} priceID - Price ID to retrieve.
 *
 * @apiSuccess {Object} price - Returns price details
 *
 * @apiError {Object} error - Error message.
 */
app.post("/stripe/get/price", async (req, res) => {
  const { priceID } = req.body;
  try {
    const price = await stripe.getPrice(priceID);
    return res.send({ price });
  } catch (error) {
    return res.status(500).send({ error });
  }
});
/*[#10]****************************************DEVICE*MANAGEMENT*ROUTES********************************** */

/**
 * @api {get} /devices
 * @apiName GetDevices
 * @apiDescription Get list of devices
 * @apiGroup DeviceManagement
 *
 * @apiSuccess {Array} devices - Returns list of devices
 *
 * @apiError {Object} error - Error message.
 */
app.post("/devices", async (req, res) => {
  try {
    const devices = await getDevices();
    res.status(201).send({ devices });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /device
 * @apiName AddDevice
 * @apiDescription Add a specific device
 * @apiGroup DeviceManagement
 *
 * @apiParam {Object} devicePayload - New Device Payload.
 *
 * @apiSuccess {String} message - Operation Status
 *
 * @apiError {Object} error - Error message.
 */
app.post("/device", async (req, res) => {
  const { devicePayload } = req.body;
  try {
    if (await addDevice(devicePayload)) {
      res.status(201).send({ message: "Device added successfully" });
    } else {
      res.status(501).send({ message: "Could not add device" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /device/edit
 * @apiName EditDevice
 * @apiDescription Edit a specific device
 * @apiGroup DeviceManagement
 *
 * @apiParam {String} deviceID - Device's unique identifier.
 * @apiParam {Object} updateData - Data to update in device.
 *
 * @apiSuccess {String} message - Operation Status
 *
 * @apiError {Object} error - Error message.
 */
app.post("/device/edit", async (req, res) => {
  try {
    const { deviceID, updateData } = req.body;
    if (await editDevice(deviceID, updateData)) {
      res.status(200).send({ message: "Device updated successfully" });
    } else {
      res.status(501).send({ message: "Could not update device" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /device/remove
 * @apiName RemoveDevice
 * @apiDescription Remove a specific device
 * @apiGroup DeviceManagement
 *
 * @apiParam {String} deviceID - Device's unique identifier.
 *
 * @apiSuccess {String} message - Operation Status
 *
 * @apiError {Object} error - Error message.
 */
app.post("/device/remove", async (req, res) => {
  try {
    const { deviceID } = req.body;
    if (await removeDevice(deviceID)) {
      res.status(200).send({ message: "Device removed successfully" });
    } else {
      res.status(501).send({ message: "Could not remove device" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /device/details
 * @apiName GetDeviceDetails
 * @apiDescription Get details of a specific device
 * @apiGroup DeviceManagement
 *
 * @apiParam {String} deviceID - Device's unique identifier.
 *
 * @apiSuccess {Object} device - Returns device details
 *
 * @apiError {Object} error - Error message.
 */
app.post("/device/details", async (req, res) => {
  try {
    const { deviceID } = req.body;
    const device = await getDeviceDetails(deviceID);
    if (device) {
      res.status(200).send({ device });
    } else {
      res.status(501).send({ message: "Could not get device details" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /device/emulate
 * @apiName EmulateDevice
 * @apiDescription Emulate a specific device
 * @apiGroup DeviceManagement
 *
 * @apiParam {String} deviceID - Device's unique identifier.
 * @apiParam {Number} interval - Intervals to rerun emulation (milliseconds)
 *
 * @apiSuccess {String} message - Operation Status
 *
 * @apiError {Object} error - Error message.
 */
app.post("/device/emulate", async (req, res) => {
  try {
    const { deviceID, interval } = req.body;
    if (await emulateDeviceFunction(deviceID, interval)) {
      res
        .status(200)
        .send({ message: `Emulation started for device ${deviceID}` });
    } else {
      res.status(501).send({ message: "Could not emulate device" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /device/data
 * @apiName GetDeviceData
 * @apiDescription Get data of a specific device
 * @apiGroup DeviceManagement
 *
 * @apiParam {String} deviceID - Device's unique identifier.
 *
 * @apiSuccess {Object} data - Returns device data
 *
 * @apiError {Object} error - Error message.
 */
app.post("/device/data", async (req, res) => {
  try {
    const { deviceID } = req.body;
    const data = await getRecordedData(deviceID);
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
