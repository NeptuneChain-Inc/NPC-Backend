/**
 * NOTES:
 * #TODO: Create getMedia && getStreams query functions
 */
const { ref, get, set, push } = require("firebase/database");
const { db } = require("../apis/firebase");

/*************************************************************************************** */
/**
 *
 * @param {* Input that needs sanitizing} input
 * @returns sanitized input
 */
const sanitizeUserInput = (input) => String(input).replace(/[^a-z0-9]/gi, "");

/*************************************************************************************** */

const _getData = async (path) => (await get(ref(db, path)))?.val();

const _saveData = async (path, data) => {
  await set(ref(db, path), data);
  return Promise.resolve(true);
};

const _pushData = async (path, data) => {
  await push(ref(db, path), data);
  return Promise.resolve(true);
};
/**
 * Loads the default template for a user's dashboard data.
 *
 * @param {string} uid - The unique identifier of the user.
 * @param {string} accountType - The account type of the user.
 * @returns {Promise<boolean|null>} - Returns a promise that resolves to a boolean value indicating whether the default template was successfully loaded, or null if the default template is not available.
 *
 * @throws {Error} - Throws an error if there is an issue loading the default template.
 */
const _loadDefaultTemplate = async (uid, accountType) => {
  const defaultUserDashes = await _getData(
    `neptunechain/defaults/dashboard/${sanitizeUserInput(
      accountType
    ).toLowerCase()}`
  );
  return await _saveData(
    `neptunechain/users/data/${uid}/dashboard/`,
    defaultUserDashes
  );
};
/*************************************************************************************** */

/*******GETTERS********************GETTERS*******************GETTERS******************** */

/** #GET_PUBLIC_DATA */
const getUser = async (uid) => await _getData(`neptunechain/users/data/${uid}`);

const getUserUIDFromName = async (username) =>
  await _getData(`neptunechain/users/usernames/${sanitizeUserInput(username)}`);

const getUserFromName = async (username) =>
  await getUser(await getUserUIDFromName(username));

const getMedia = async (assetId) =>
  await _getData(`neptunechain/livepeer/media/${assetId}`);

const getStream = async (playbackId) =>
  await _getData(`neptunechain/livepeer/streams/${playbackId}`);

/** #GET_USER_DATA */

const getUserDashboard = async (uid) =>
  await _getData(`neptunechain/users/data/${uid}/dashboard/`);

const _getCollection = async (path) => {
  const collectionIDs = await _getData(path);
  const collection = [];
  for (const collectionID of Object.values(collectionIDs || {})) {
    const collectionData = await getMedia(collectionID);
    if (collectionData) {
      collection.push(collectionData);
    }
  }
  return collection;
};

const getUserMedia = async (uid) =>
  _getCollection(`neptunechain/users/data/${uid}/media/`);

const getUserSubmissions = async (uid) =>
  _getCollection(`neptunechain/users/data/${uid}/assets/submissions`);

const getUserDisputes = async (uid) =>
  _getCollection(`neptunechain/users/data/${uid}/assets/disputes`);

const getUserClosedDisputes = async (uid) =>
  _getCollection(`neptunechain/users/data/${uid}/assets/disputes/closed`);

const getUserApprovals = async (uid) =>
  _getCollection(`neptunechain/users/data/${uid}/assets/approvals`);

const getUserStreams = async (uid) =>
  _getCollection(`neptunechain/users/data/${uid}/streams/`);

/************************************USER REGISTRATION*************************************** */
const { generateWallet } = require("./walletUtils"); // Import generateWallet function

/**
 * Adds a user to the verification queue in the database.
 * @param {string} uid - The unique identifier of the user to add to the verification queue.
 */
const addToVerificationQueue = async (uid) => {
  try {
    await _saveData(`neptunechain/verification/queue/${uid}`, { uid });
    console.log(`User UID ${uid} added to verification queue.`);
  } catch (e) {
    console.error(`Error adding user UID ${uid} to verification queue: ${e}`);
    throw e;
  }
};

/**
 * Checks if user is in the verification queue in the database.
 * @param {string} uid - The unique identifier of the user to check.
 */
const inVerificationQueue = async (uid) => {
  try {
    if (await _getData(`neptunechain/verification/queue/${uid}`)) {
      return true;
    }
    return false;
  } catch (e) {
    throw e;
  }
};

/**
 * Removes a user from the verification queue in the database.
 * @param {string} uid - The unique identifier of the user to remove from the verification queue.
 */
const removeFromVerificationQueue = async (uid) => {
  try {
    await _saveData(`neptunechain/verification/queue/${uid}`, null);
    console.log(`User UID ${uid} removed from verification queue.`);
  } catch (e) {
    console.error(
      `Error removing user UID ${uid} from verification queue: ${e}`
    );
    throw e;
  }
};

/**
 * Creates a new user with the provided user data.
 *
 * @param {Object} userData - The user data object.
 * @param {string} userData.uid - The unique identifier for the user.
 * @param {string} userData.username - The username for the user.
 * @param {string} userData.role - The role of the user.
 * @param {number} userData.PIN 6-figure access pin for wallet access
 * @throws {Error} - Throws an error if any required fields are missing or if the user already exists.
 */
const createUser = async (userData) => {
  try {
    const { uid, username, role, PIN } = userData || {};

    if (!uid || !username || !role) {
      throw new Error("Missing required fields");
    }

    if (await getUserUIDFromName(username)) {
      throw new Error("Username already exists");
    }

    if (await getUser(uid)) {
      throw new Error("User already exists");
    }

    const encryptedKey = await generateWallet(uid, PIN);
    userData.walletKey = encryptedKey;

    // Save user data
    await _saveData(`neptunechain/users/data/${uid}`, userData);
    await _saveData(
      `neptunechain/users/usernames/${sanitizeUserInput(
        username
      ).toLowerCase()}`,
      uid
    );

    // Handle role-based verification
    if (role === "farmer" || role === "verifier") {
      await addToVerificationQueue(uid);
    }

    console.log(`User created: ${uid}`);
    return true;
  } catch (e) {
    console.error(`Error creating user: ${e}`);
    throw e;
  }
};

/***************************************************************** */
/**
 * Saves a stream data to the database and associates it with a creator.
 *
 * @param {Object} streamData - The data of the stream to be saved.
 * @param {string} creatorUID - The UID of the creator associated with the stream.
 * @returns {Promise<string|null>} - A promise that resolves to the playbackId of the saved stream, or null if the saving process fails.
 * @throws {Error} - If an error occurs during the saving process.
 */
const saveStream = async (streamData, creatorUID) => {
  try {
    const { playbackId } = streamData || {};
    if (playbackId && creatorUID) {
      if (
        await _saveData(
          `neptunechain/livepeer/streams/${playbackId}`,
          streamData
        )
      ) {
        return await _pushData(
          `neptunechain/users/data/${creatorUID}/streams`,
          playbackId
        );
      }
    }
  } catch (e) {
    throw e;
  }
};

// const saveAsset = async (newAssetPaylaod, creatorUID) => {
//   try {
//     const { asset_id } = newAssetPaylaod || {};
//     if (asset_id && creatorUID) {
//       if (
//         await _saveData(
//           `neptunechain/livepeer/media/${asset_id}`,
//           {
//             tusEnd
//           }
//         )
//       ) {
//         return await _pushData(
//           `neptunechain/users/data/${creatorUID}/media`,
//           playbackId
//         );
//       }
//     }
//   } catch (e) {
//     throw e;
//   }
// };

const saveMedia = async (newMediaPaylaod, creatorUID) => {
  try {
    const { assetID, playbackID, tusEndpoint, taskID } = newMediaPaylaod || {};
    if (assetID && creatorUID) {
      if (
        await _saveData(`neptunechain/livepeer/media/${assetID}`, {
          assetID,
          creatorUID,
          playbackID,
          tusEndpoint,
          taskID,
        })
      ) {
        return await _pushData(
          `neptunechain/users/data/${creatorUID}/media`,
          assetID
        );
      }
    }
  } catch (e) {
    throw e;
  }
};

const AddUserSubmission = async (uid, assetID, txHash) => {
  try {
    return await _pushData(
      `neptunechain/users/data/${uid}/assets/submissions`,
      { assetID, txHash }
    );
  } catch (error) {
    throw error;
  }
};

const AddUserDispute = async (uid, assetID, txHash) => {
  try {
    return await _pushData(`neptunechain/users/data/${uid}/assets/disputes`, {
      assetID,
      txHash,
    });
  } catch (error) {
    throw error;
  }
};

const AddUserClosedDispute = async (uid, disputeID, txHash) => {
  try {
    return await _pushData(
      `neptunechain/users/data/${uid}/assets/disputes/closed`,
      { disputeID, txHash }
    );
  } catch (error) {
    throw error;
  }
};

const AddUserApproval = async (uid, assetID, txHash) => {
  try {
    return await _pushData(`neptunechain/users/data/${uid}/assets/approvals`, {
      assetID,
      txHash,
    });
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {string} assetID
 * @param {{ name: string, description: string, tags: string[], thumbnailUrl: string }} metadata
 * @returns
 */
const setMediaMetadata = async (assetID, metadata) => {
  try {
    if (assetID) {
      const path = `neptunechain/livepeer/media/${assetID}`;
      const media = await _getData(path);
      if (
        await _saveData(path, {
          ...media,
          metadata,
        })
      ) {
        return true;
      }
    }
  } catch (e) {
    throw e;
  }
};

const UserDB = {
  get: {
    user: getUser,
    username: getUserFromName,
    dashboard: getUserDashboard,
    media: {
      media: getUserMedia,
      streams: getUserStreams,
    },
    accountVerification: {
      add: addToVerificationQueue,
      inQueue: inVerificationQueue,
      remove: removeFromVerificationQueue,
    },
    assets: {
      add: {
        submission: AddUserSubmission,
        dispute: AddUserDispute,
        dispute_closed: AddUserClosedDispute,
        approval: AddUserApproval,
      },
      get: {
        submissions: getUserSubmissions,
        disputes: getUserDisputes,
        dispute_closed: getUserClosedDisputes,
        approvals: getUserApprovals,
      },
    },
  },
  create: {
    user: createUser,
  },
};

const MediaDB = {
  get: {
    media: getMedia,
    stream: getStream,
    // media: getMedia,
    // streams: getStreams,
  },
  set: {
    media: saveMedia,
    mediaMetadata: setMediaMetadata,
    stream: saveStream,
  },
};

module.exports = { UserDB, MediaDB };
