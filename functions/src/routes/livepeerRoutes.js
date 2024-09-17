const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const livepeer = require("../apis/livepeer");

const router = express.Router();

//SECURE
router.post("/key", async (req, res) => {
  try {
    const key = await livepeer.getLivepeerKey();;
    return res.send({ key });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

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
router.use(
  "/origin",
  createProxyMiddleware({
    target: "https://origin.livepeer.com",
    changeOrigin: true,
    pathRewrite: {
      "^/livepeer_origin": "",
    },
  })
);

/**
 * @api {post} /livepeer/asset/create
 * @apiName CreateLivepeerAsset
 * @apiDescription Create Livepeer Asset
 * @apiGroup Livepeer
 *
 *
 * @apiSuccess {Object} asset - Returns Livepeer asset 
 *
 * @apiError {Object} error - Error message.
 */
router.post("/asset/create", async (req, res) => {
  const { newAssetPaylaod, userUID } = req.body;
  try {
    const asset = await livepeer.AssetOps.create(newAssetPaylaod, userUID);
    return res.send({ asset });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

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
router.post("/asset/get", async (req, res) => {
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
router.post("/asset/update", async (req, res) => {
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
router.post("/asset/delete", async (req, res) => {
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
router.post("/asset/info/playback", async (req, res) => {
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

module.exports = router;