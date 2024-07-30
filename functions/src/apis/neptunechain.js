const { getSigner } = require("./ethereum");
const {
  getAccountManagerInteractions,
} = require("../smart_contracts/interactions/account_manager");
const {
  getVerificationInteractions,
} = require("../smart_contracts/interactions/verification");
// const {
//   getMarketplaceInteractions,
// } = require("../smart_contracts/interactions/marketplace");
const { UserDB } = require("./database");

const signer = getSigner();
const accountManagerInteractions = getAccountManagerInteractions(signer);
const verificationInteractions = getVerificationInteractions(signer);
// const marketplaceInteractions = getMarketplaceInteractions(signer);

/**************************Account Management Handles********************************
 * TO-DO: TEST
 */
const handleRegisterAccount = async (accountID, role, txAddress) => {
  try {
    const receipt = await accountManagerInteractions.Functions.registerAccount(
      accountID,
      role,
      txAddress
    );
    if (
      UserDB.get.accounts.add.registration(
        accountID,
        role,
        txAddress,
        receipt?.hash
      )
    ) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleBlacklistAccount = async (accountID, status) => {
  try {
    const receipt = await accountManagerInteractions.Functions.blacklistAccount(
      accountID,
      status
    );
    if (UserDB.get.accounts.add.blacklist(accountID, status, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleUpdateLastActive = async (accountID) => {
  try {
    const receipt = await accountManagerInteractions.Functions.updateLastActive(
      accountID
    );
    if (UserDB.get.accounts.update.lastActive(accountID, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleVerifyRole = async (accountID, role) => {
  try {
    const result = await accountManagerInteractions.Functions.verifyRole(
      accountID,
      role
    );
    return { result };
  } catch (error) {
    throw error;
  }
};

const handleIsRegistered = async (accountID) => {
  try {
    const result = await accountManagerInteractions.Functions.isRegistered(
      accountID
    );
    return { result };
  } catch (error) {
    throw error;
  }
};

const handleIsNotBlacklisted = async (accountID) => {
  try {
    const result = await accountManagerInteractions.Functions.isNotBlacklisted(
      accountID
    );
    return { result };
  } catch (error) {
    throw error;
  }
};

const handleGetAccountData = async (accountID) => {
  try {
    const result = await accountManagerInteractions.Functions.getAccountData(
      accountID
    );
    return { result };
  } catch (error) {
    throw error;
  }
};

const Account = {
  register: handleRegisterAccount,
  blacklist: handleBlacklistAccount,
  updateLastActive: handleUpdateLastActive,
  verifyRole: handleVerifyRole,
  isRegistered: handleIsRegistered,
  isNotBlacklisted: handleIsNotBlacklisted,
  getAccountData: handleGetAccountData,
};

/**********************************Verification Handles*********************************** */
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
    if (
      UserDB.get.assets.add.dispute_closed(userUID, disputeID, receipt?.hash)
    ) {
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

module.exports = { Account, Verification };
