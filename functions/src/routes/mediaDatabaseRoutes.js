const express = require("express");

const router = express.Router();

const database = require("../apis/database");

/**
 * @api {post} /db/media/get
 * @apiName GetMedia
 * @apiDescription Get Media
 * @apiGroup Media
 *
 * @apiParam {String} assetID - Asset's unique identifier.
 *
 * @apiSuccess {Object} dbAsset - Returns Database Asset object
 *
 * @apiError {Object} error - Error message.
 */
router.post("/get", async (req, res) => {
  try {
    const { assetID } = req.body;
    const dbAsset = await database.MediaDB.get.media(assetID);
    return res.send({ dbAsset });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

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
router.post("/get/stream", async (req, res) => {
  try {
    const { assetID } = req.body;
    const stream = await database.MediaDB.get.stream(assetID);
    return res.send({ stream });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /db/media/create
 * @apiName CreateMedia
 * @apiDescription Create/Upload Media
 * @apiGroup MediaM
 *
 * @apiParam {Object} newAssetPayload - New asset payload data.
 * @apiParam {String} userUID - User's unique identifier.
 *
 * @apiSuccess {Object} result - Returns result of asset creation
 *
 * @apiError {Object} error - Error message.
 */
router.post("/create", async (req, res) => {
  try {
    const { newAssetPaylaod, userUID } = req.body;
    const result = await database.MediaDB.set.media(newAssetPaylaod, userUID);
    return res.send({ result });
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
router.post("/create/stream", async (req, res) => {
  try {
    const { userUID, streamData } = req.body;
    const result = await database.MediaDB.set.stream(streamData, userUID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;