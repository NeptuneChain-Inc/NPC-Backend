const express = require("express");

const router = express.Router();

const maps = require("../apis/maps");

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
router.post("/get/api", async (req, res) => {
  try {
    const api = await maps.getMapsAPI();
    return res.send({ api });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;