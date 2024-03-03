const axios = require("axios");

/**
 * Retrieves the Maps API data from the Google Maps API.
 * 
 * @returns {Promise} A promise that resolves with the Maps API data.
 * @throws {Error} If there is an error retrieving the data.
 */
const getMapsAPI = async () => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { getMapsAPI };
