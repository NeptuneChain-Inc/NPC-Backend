const express = require("express");

const router = express.Router();

const {
  addDevice,
  editDevice,
  removeDevice,
  getDeviceDetails,
  emulateDeviceFunction,
  getRecordedData,
  getDevices,
} = require("../apis/deviceManager");

/**
 * @api {post} /device/all
 * @apiName GetDevices
 * @apiDescription Get list of devices
 * @apiGroup DeviceManagement
 *
 * @apiSuccess {Array} devices - Returns list of devices
 *
 * @apiError {Object} error - Error message.
 */
router.post("/all", async (req, res) => {
  try {
    const devices = await getDevices();
    res.status(200).send({ devices });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /device/add
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
router.post("/add", async (req, res) => {
  const { devicePayload } = req.body;
  try {
    if (await addDevice(devicePayload)) {
      res.status(200).send({ message: "Device added successfully" });
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
router.post("/edit", async (req, res) => {
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
router.post("/remove", async (req, res) => {
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
router.post("/details", async (req, res) => {
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
router.post("/emulate", async (req, res) => {
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
router.post("/data", async (req, res) => {
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

module.exports = router;