const { Livepeer } = require("livepeer");
const { MediaDB } = require("./database");

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
});

const handleError = (error) => {
  console.log("ERROR", error.message)
}

 const AssetOps = {
  create: async (newAssetPaylaod, userUID) => {
    var result = null;
    try {
      const response = await livepeer.asset.create(newAssetPaylaod);
      const AssetUploadData = response.data;
      const { asset, tusEndpoint, task } = AssetUploadData || {};

      //Save Transaction To Demo Database
      if(await MediaDB.set.media(
        { assetID: asset.id, playbackID: asset.playbackId, tusEndpoint, taskID: task.id },
        userUID
      )){
        result = AssetUploadData;
      }
    } catch (error) {
      handleError(error);
      
    }
    return result;
  },
  get: async (assetID) => {
    var response = null;
    try {
      response = await livepeer.asset.get(assetID);
    } catch (error) {
      handleError(error);
    }
    return response?.asset;
  },
  update: async (assetID, patch) => {
    var response = null;
    try {
      response = await livepeer.asset.update(assetID, patch);
    } catch (error) {
      handleError(error);
    }
    return response?.asset ? true : null;
  },
  delete: async (assetID) => {
    var response = null;
    try {
      response = await livepeer.asset.delete(assetID);
    } catch (error) {
      handleError(error);
    }
    return response.statusCode === 200 ? true : null;
  },
};

const getPlaybackInfo = async (playbackID) => {
  const {playbackInfo} = await livepeer.playback.get(playbackID) || {};
  return playbackInfo;
}

const PlaybackOps = {
  get: {
    playbackInfo: getPlaybackInfo
  }
}

module.exports = {
  AssetOps,
  PlaybackOps
};
