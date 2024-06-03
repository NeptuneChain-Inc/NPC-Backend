const { db } = require('./firebase');
const { ref, set, get, update, remove, push, query, orderByChild, startAt, endAt } = require("firebase/database");

// Function to Add a Device
async function addDevice(device) {
  try {
    const { id } = device || {};
    if(id >= 0){
      await set(ref(db, `devices/${id}`), device);
      console.log(`Device ${device.id} added successfully.`);
      return true
    }
    return null;
  } catch (error) {
    console.error(`Error adding device ${device.id}:`, error);
    throw error
  }
}

// Function to Edit a Device
async function editDevice(deviceId, updateData) {
  try {
    if(deviceId >= 0 && updateData){
      await update(ref(db, `devices/${deviceId}`), updateData);
      console.log(`Device ${deviceId} updated successfully.`);
      return true;
    }
    return null;
  } catch (error) {
    console.error(`Error updating device ${deviceId}:`, error);
    throw error
  }
}

// Function to Remove a Device
async function removeDevice(deviceId) {
  try {
    if(deviceId >= 0){
      await remove(ref(db, `devices/${deviceId}`));
      console.log(`Device ${deviceId} removed successfully.`);
      return true;
    }
   return null;
  } catch (error) {
    console.error(`Error removing device ${deviceId}:`, error);
    throw error
  }
}

// Function to Retrieve Device Details
async function getDeviceDetails(deviceId) {
  try {
    if(deviceId >= 0){
      const snapshot = await get(ref(db, `devices/${deviceId}`));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log(`Device ${deviceId} not found.`);
        return undefined;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving details for device ${deviceId}:`, error);
    throw error
  }
}

// Function to Record Data
async function recordData(deviceId, data) {
  try {
    if(deviceId >= 0 && data){
      await push(ref(db, `devices/${deviceId}/records`), data);
      console.log(`Data recorded for device ${deviceId}.`);
      return true;
    }
    return null;
  } catch (error) {
    console.error(`Error recording data for device ${deviceId}:`, error);
    throw error
  }
}

// Enhanced Function to Retrieve Recorded Data with Optional Filtering
async function getRecordedData(deviceId, startTimestamp, endTimestamp) {
  try {
    let recordsQuery = query(ref(db, `devices/${deviceId}/records`), orderByChild('timestamp'));

    if (startTimestamp) {
      recordsQuery = query(recordsQuery, startAt(startTimestamp));
    }
    if (endTimestamp) {
      recordsQuery = query(recordsQuery, endAt(endTimestamp));
    }

    const snapshot = await get(recordsQuery);
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  } catch (error) {
    console.error(`Error retrieving recorded data for device ${deviceId}:`, error);
    throw error
  }
}

// Emulate Device Functionality
async function emulateDeviceFunction(deviceId, interval, maxRunTime = 60000) {
  if(deviceId >= 0 && interval) {
    const intervalId = setInterval(async () => {
      try {
        const device = await getDeviceDetails(deviceId);
        if (device && device.status === 'active') {
          const data = {
            timestamp: Date.now(),
            value: Math.random() * 100, // Simulating random data
          };
          await recordData(deviceId, data);
          console.log(`Recorded data for device ${deviceId}:`, data);
        }
      } catch (error) {
        console.error(`Error emulating device function for ${deviceId}:`, error);
      }
    }, interval);
  
    // Stop emulation after some time for demonstration
    setTimeout(() => {
      clearInterval(intervalId);
      console.log(`Stopped emulation for device ${deviceId}`);
      return true;
    }, maxRunTime);
  }
  return null;
}

module.exports = {
  addDevice,
  editDevice,
  removeDevice,
  getDeviceDetails,
  recordData,
  getRecordedData,
  emulateDeviceFunction
};
