const { getSigner } = require("./ethereum");
const {
  getAccountManagerInteractions,
} = require("../smart_contracts/interactions/accountManager");
const {
  getVerificationInteractions,
} = require("../smart_contracts/interactions/verification");
const {
  getNeptuneChainCreditsInteractions,
} = require("../smart_contracts/interactions/npcCredits");
const { startListeners, stopListeners } = require("../smart_contracts/listeners/npcc_interactions");
// const {
//   getMarketplaceInteractions,
// } = require("../smart_contracts/interactions/marketplace");
const { UserDB } = require("./database");

const signer = getSigner();
const accountManagerInteractions = getAccountManagerInteractions(signer);
const verificationInteractions = getVerificationInteractions(signer);
const neptuneChainCreditsInteractions = getNeptuneChainCreditsInteractions(signer);
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

/**************************NeptuneChainCredits Handles********************************/

const handleIssueCredits = async (
  senderID,
  nftTokenId,
  producer,
  verifier,
  creditType,
  amount
) => {
  try {
    const _lastCertId = await neptuneChainCreditsInteractions.Functions.getTotalCertificates();
      const receipt = await neptuneChainCreditsInteractions.Functions.issueCredits(
        senderID,
        nftTokenId,
        producer,
        verifier,
        creditType,
        amount
      );
    if (UserDB.get.credits.add.issued(senderID, nftTokenId, receipt?.hash)) {
      return { receipt, certID: ++Number(_lastCertId) };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleBuyCredits = async (
  accountID,
  producer,
  verifier,
  creditType,
  amount,
  price
) => {
  try {
    //get last certificateID
    const _lastCertId = await neptuneChainCreditsInteractions.Functions.getTotalCertificates();
    const receipt = await neptuneChainCreditsInteractions.Functions.buyCredits(
      accountID,
      producer,
      verifier,
      creditType,
      amount,
      price
    );
    const certID = Number(_lastCertId)+1;
    if (UserDB.get.credits.add(accountID, receipt?.hash, certID)) {
      return { receipt, certID };
    }
    return { error: { message: "DB Not Updated!"}};
  } catch (error) {
    return { error };
  }
};

const handleTransferCredits = async (
  senderID,
  recipientID,
  producer,
  verifier,
  creditType,
  amount,
  price
) => {
  try {
    const receipt =
      await neptuneChainCreditsInteractions.Functions.transferCredits(
        senderID,
        recipientID,
        producer,
        verifier,
        creditType,
        amount,
        price
      );
    if (
      UserDB.get.credits.add.transferred(senderID, recipientID, receipt?.hash)
    ) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleDonateCredits = async (
  senderID,
  producer,
  verifier,
  creditType,
  amount
) => {
  try {
    const receipt =
      await neptuneChainCreditsInteractions.Functions.donateCredits(
        senderID,
        producer,
        verifier,
        creditType,
        amount
      );
    if (UserDB.get.credits.add.donated(senderID, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleOwnerOf = async (tokenId) => {
  try {
    const result = await neptuneChainCreditsInteractions.Functions.ownerOf(
      tokenId
    );
    return { result };
  } catch (error) {
    throw error;
  }
};

const handleGetCreditTypes = async (tokenId) => {
  try {
    const result =
      await neptuneChainCreditsInteractions.Functions.getCreditTypes(tokenId);
    return { result };
  } catch (error) {
    throw error;
  }
};

const handleGetCreditSupplyLimit = async (tokenId, creditType) => {
  try {
    const result =
      await neptuneChainCreditsInteractions.Functions.getCreditSupplyLimit(
        tokenId,
        creditType
      );
    return { result };
  } catch (error) {
    throw error;
  }
};

const npcCreditFunctions = neptuneChainCreditsInteractions.Functions;

const listenCreditInteractions = async () =>  await startListeners(signer);
const stopListenCreditInteractions = async () =>  await stopListeners();


const npcCredits = {
  issueCredits: handleIssueCredits,
  buyCredits: handleBuyCredits,
  transferCredits: handleTransferCredits,
  donateCredits: handleDonateCredits,
  get: {
    accounts: {
      getProducers: npcCreditFunctions.getProducers,
    getProducerVerifiers: npcCreditFunctions.getProducerVerifiers,
    getAccountCreditBalance: npcCreditFunctions.getAccountCreditBalance,
    },
    supplies: {
      creditTypes: handleGetCreditTypes,
    creditSupplyLimit: handleGetCreditSupplyLimit,
    getSupply: npcCreditFunctions.getSupply,
    totalSold: npcCreditFunctions.getTotalSold,
    },
    certificates: {
      certificate: npcCreditFunctions.getCertificateById,
    totalCertificates: npcCreditFunctions.getTotalCertificates,
    userCertificats: npcCreditFunctions.getAccountCertificates
    },
    events: npcCreditFunctions.getEvents
  },
  checks: {
    isProducerRegistered: npcCreditFunctions.isProducerRegistered,
    isVerifierRegistered: npcCreditFunctions.isVerifierRegistered,
    getRecoveryDuration: npcCreditFunctions.getRecoveryDuration

  },
  startListening: listenCreditInteractions,
  stopListening: stopListenCreditInteractions,
  ownerOf: handleOwnerOf,

};

module.exports = { Account, Verification, npcCredits };
