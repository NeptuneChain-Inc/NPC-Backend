const { db } = require("./firebase");
const {
  ref,
  set,
  get,
  update,
  remove,
  push,
  query,
  orderByChild,
  startAt,
  endAt,
} = require("firebase/database");
const { handleError } = require("../scripts/helpers");

/** **HELPER-FUNCTIONS***** */

// Validate Device ID and Check Availability
const validateDeviceId = async (deviceId) => {
  if (
    (typeof deviceId !== "string" && typeof deviceId !== "number") ||
    !deviceId
  ) {
    return false;
  }

  try {
    const snapshot = await get(ref(db, `devices/${String(deviceId)}`));
    return snapshot.exists();
  } catch (error) {
    handleError(`Error validating device ID ${deviceId}:`, error);
  }
};

const generateRandomRecords = () => {
  return {
    "Chlorophyll-a": (Math.random() * 30).toFixed(2),
    "Dissolved Oxygen": (Math.random() * 15).toFixed(2),
    Phycocyanin: (Math.random() * 25).toFixed(2),
    Timestamp: new Date().toISOString(),
    Turbidity: (Math.random() * 40).toFixed(2),
    "Water Temperature": (Math.random() * 35).toFixed(2),
    "pH Level": (Math.random() * 14).toFixed(2),
  };
};

/** **HELPER-FUNCTIONS-END***** */

async function getDevices() {
  try {
    const snapshot = await get(ref(db, `devices`));
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    }
  } catch (error) {
    handleError(`Error getting device:`, error);
  }
  return null;
}

// Function to Add a Device
async function addDevice(device) {
  const { id } = device || {};
  const isValid = await validateDeviceId(id);
  if (!isValid) {
    throw new Error("Invalid device ID");
  }

  try {
    await set(ref(db, `devices/${id}`), device);
    console.log(`Device ${id} added successfully.`);
    return true;
  } catch (error) {
    handleError(`Error adding device ${id}:`, error);
  }
}

// Function to Edit a Device
async function editDevice(deviceId, updateData) {
  const isValid = await validateDeviceId(deviceId);
  if (!isValid || !updateData) {
    throw new Error("Invalid input");
  }

  try {
    await update(ref(db, `devices/${deviceId}`), updateData);
    console.log(`Device ${deviceId} updated successfully.`);
    return true;
  } catch (error) {
    handleError(`Error updating device ${deviceId}:`, error);
  }
}

// Function to Remove a Device
async function removeDevice(deviceId) {
  const isValid = await validateDeviceId(deviceId);
  if (!isValid) {
    throw new Error("Invalid device ID");
  }

  try {
    await remove(ref(db, `devices/${deviceId}`));
    console.log(`Device ${deviceId} removed successfully.`);
    return true;
  } catch (error) {
    handleError(`Error removing device ${deviceId}:`, error);
  }
}

// Function to Retrieve Device Details
async function getDeviceDetails(deviceId) {
  const isValid = await validateDeviceId(deviceId);
  if (!isValid) {
    throw new Error("Invalid device ID");
  }

  try {
    const snapshot = await get(ref(db, `devices/${deviceId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      handleError(`Device ${deviceId} not found.`);
      return null;
    }
  } catch (error) {
    handleError(`Error retrieving details for device ${deviceId}:`, error);
  }
}

// Function to Record Data
async function recordData(deviceId, data) {
  const isValid = await validateDeviceId(deviceId);
  if (!isValid || !data) {
    throw new Error("Invalid input");
  }

  try {
    await push(ref(db, `devices/${deviceId}/records`), data);
    console.log(`Data recorded for device ${deviceId}.`);
    return true;
  } catch (error) {
    handleError(`Error recording data for device ${deviceId}:`, error);
  }
}

/**
 * Fetches recorded data for a given device within a specified time range.
 *
 * @param {string} deviceId - The ID of the device to fetch records for.
 * @param {string} [startTimestamp=null] - The start timestamp to filter records.
 * @param {string} [endTimestamp=null] - The end timestamp to filter records.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of recorded data objects.
 * @throws {Error} - Throws an error if the device ID is invalid or if data retrieval fails.
 */
async function getRecordedData(
  deviceId,
  startTimestamp = null,
  endTimestamp = null
) {
  const isValid = await validateDeviceId(deviceId);
  if (!isValid) {
    throw new Error("Invalid device ID");
  }

  try {
    // let recordsQuery = query(ref(db, `devices/${deviceId}/records`), orderByChild('Timestamp'));

    // if (startTimestamp) {
    //   recordsQuery = query(recordsQuery, startAt(startTimestamp));
    // }
    // if (endTimestamp) {
    //   recordsQuery = query(recordsQuery, endAt(endTimestamp));
    // }

    const recordsQuery = ref(db, `devices/${deviceId}/records`);
    const snapshot = await get(recordsQuery);
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  } catch (error) {
    handleError(
      `Error retrieving recorded data for device ${deviceId}:`,
      error
    );
  }
}

// Emulate Device Functionality
async function emulateDeviceFunction(deviceId, interval, maxRunTime = 60000) {
  const isValid = await validateDeviceId(deviceId);
  if (!isValid || typeof interval !== "number" || interval <= 0) {
    throw new Error("Invalid input");
  }

  try {
    const device = await getDeviceDetails(deviceId);
    if (device && device.status === "active") {
      const data = generateRandomRecords();
      if (await recordData(deviceId, data)) {
        console.log(`Recorded data for device ${deviceId}:`, data);
        return true;
      } else {
        handleError(`Could not record data for device ${deviceId}:`, data);
      }
    } else {
      handleError(`Inactive device: Device ${deviceId}:`);
    }
  } catch (error) {
    handleError(
      `Error emulating device function for Device ${deviceId}: ${error.message}`,
      error
    );
  }
}

module.exports = {
  getDevices,
  addDevice,
  editDevice,
  removeDevice,
  getDeviceDetails,
  recordData,
  getRecordedData,
  emulateDeviceFunction,
};
