const express = require("express");

const router = express.Router();

const database = require("../apis/database");
const { Verification } = require("../apis/neptunechain");

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
router.post("/create/metadata", async (req, res) => {
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
router.post("/create/submit", async (req, res) => {
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
router.post("/create/dispute", async (req, res) => {
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
router.post("/create/dispute/close", async (req, res) => {
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
router.post("/create/approve", async (req, res) => {
  try {
    const { userUID, assetID, params } = req.body;
    const result = await Verification.approveAsset(userUID, assetID, params);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;