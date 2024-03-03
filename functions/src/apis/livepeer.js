const {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} = require("@livepeer/react");

const getLivepeerClient = () =>
  createReactClient({
    provider: studioProvider({
      apiKey: process.env.LIVEPEER_API_KEY,
    }),
  });

/**
 * Retrieves viewership data for a given playback ID from the Livepeer Studio API.
 * @param {string} playbackId - The ID of the playback for which viewership data is requested.
 * @returns {Promise<Object|null>} - An object containing the viewership data for the specified playback ID.
 * The object has two properties: `viewers` (number) representing the number of viewers and `duration` (number)
 * representing the duration of the playback in seconds. Returns `null` if the response is empty.
 */
const getViewership = async (playbackId) => {
  try {
    const response = await fetch(
      `https://livepeer.studio/api/data/views/query/total/${playbackId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
        },
      }
    );

    return await response.json();
  } catch (e) {
    console.error("Error retrieving viewership data:", e);
    return null;
  }
};

/**
 * Retrieves asset metrics from the Livepeer API.
 * @param {string} assetId - The ID of the asset for which to retrieve metrics.
 * @returns {Promise<Object|null>} - The JSON response from the Livepeer API or null if there is no response.
 */
const getAssetMetrics = async (assetId) => {
  try {
    const response = await fetch(
      `https://livepeer.studio/api/data/views/query/creator?assetId=${assetId}&timeStep=day&breakdownBy[]=timezone`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
        },
      }
    );
    return await response.json();
  } catch (e) {
    console.error("Error retrieving asset metrics:", e);
    return null;
  }
};

module.exports = { getViewership, getViewership, getAssetMetrics };
