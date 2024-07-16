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
const getUsername = async (username) =>
  await getUser(
    await _getData(
      `neptunechain/users/usernames/${sanitizeUserInput(username)}`
    )
  );

const getMedia = async (assetId) =>
  await _getData(`neptunechain/livepeer/media/${assetId}`);

const getStream = async (playbackId) =>
  await _getData(`neptunechain/livepeer/streams/${playbackId}`);

/** #GET_USER_DATA */

const getUser = async (uid) => await _getData(`neptunechain/users/data/${uid}`);

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

const getUserClosedDisputes = async (uid) => _getCollection(`neptunechain/users/data/${uid}/assets/disputes/closed`);

const getUserApprovals = async (uid) =>
  _getCollection(`neptunechain/users/data/${uid}/assets/approvals`);

const getUserStreams = async (uid) =>
  _getCollection(`neptunechain/users/data/${uid}/streams/`);

/**************************************************************************************** */

/**
 * Creates a new user with the provided user data.
 *
 * @param {Object} userData - The user data object.
 * @param {string} userData.uid - The unique identifier for the user.
 * @param {string} userData.username - The username for the user.
 * @param {string} userData.type - The type of the user.
 * @throws {Error} - Throws an error if any required fields are missing or if the user already exists.
 */
const createUser = async (userData) => {
  try {
    const { uid, username, type } = userData || {};

    if (!uid || !username || !type) {
      throw new Error("Missing required fields");
    }

    if (await _getData(`neptunechain/users/data/${uid}`)) {
      throw new Error("User already exists");
    }

    await _saveData(`neptunechain/users/data/${uid}`, userData);
    await _saveData(
      `neptunechain/users/usernames/${sanitizeUserInput(
        username
      ).toLowerCase()}`,
      uid
    );
    await _loadDefaultTemplate(uid, type);
    console.log(`User created: ${uid}`);
    return true;
  } catch (e) {
    console.error(`Error creating user: ${e}`);
    throw e;
  }
};

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
      {assetID, txHash}
    );
  } catch (error) {
    throw error;
  }
};

const AddUserDispute = async (uid, assetID, txHash) => {
  try {
    return await _pushData(
      `neptunechain/users/data/${uid}/assets/disputes`,
      {assetID, txHash}
    );
  } catch (error) {
    throw error;
  }
};

const AddUserClosedDispute = async (uid, disputeID, txHash) => {
  try {
    return await _pushData(
      `neptunechain/users/data/${uid}/assets/disputes/closed`,
      {disputeID, txHash}
    );
  } catch (error) {
    throw error;
  }
};

const AddUserApproval = async (uid, assetID, txHash) => {
  try {
    return await _pushData(
      `neptunechain/users/data/${uid}/assets/approvals`,
      {assetID, txHash}
    );
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
    username: getUsername,
    dashboard: getUserDashboard,
    media: {
      media: getUserMedia,
      streams: getUserStreams,
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
