const { getSigner } = require("./ethereum");
const {
  getVerificationInteractions,
} = require("../smart_contracts/interactions/verification");
// const {
//   getMarketplaceInteractions,
// } = require("../smart_contracts/interactions/marketplace");
const { UserDB } = require("./database");

const signer = getSigner();
const verificationInteractions = getVerificationInteractions(signer);
// const marketplaceInteractions = getMarketplaceInteractions(signer);

//Verification Handles
const handleSubmitAsset = async (userUID, assetID) => {
  try {
    const receipt = await verificationInteractions.Functions.submitData(
      userUID,
      assetID
    );
    if (UserDB.get.assets.add.submission(userUID, assetID, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleApproveAsset = async (userUID, assetID, params) => {
  try {
    const receipt = await verificationInteractions.Functions.approveData(
      userUID,
      assetID,
      params
    );
    if (UserDB.get.assets.add.approval(userUID, assetID, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleDisputeAsset = async (userUID, assetID, reason) => {
  try {
    const receipt = await verificationInteractions.Functions.raiseDispute(
      userUID,
      assetID,
      reason
    );
    if (UserDB.get.assets.add.dispute(userUID, assetID, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleResolveAsset = async (userUID, disputeID, params) => {
  try {
    const receipt = await verificationInteractions.Functions.resolveDispute(
      userUID,
      disputeID,
      params
    );
    if (UserDB.get.assets.add.dispute_closed(userUID, disputeID, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const Verification = {
  submitAsset: handleSubmitAsset,
  approveAsset: handleApproveAsset,
  disputeAsset: handleDisputeAsset,
  resolveAsset: handleResolveAsset,
};

module.exports = { Verification };
