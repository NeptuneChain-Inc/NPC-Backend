const { ethers } = require("ethers");
const { VerificationContract } = require("../abis/verification_contract");

const getVerificationInteractions = (signer) => {
  const contract = new ethers.Contract(
    VerificationContract.Address,
    VerificationContract.ABI,
    signer
  );
  return {
    Contract: VerificationContract,
    Instance: contract,
    Functions: {
      // Submit data to the contract
      submitAsset: async (accountID, assetID) => {
        try {
          const tx = await contract.submitAsset(accountID, assetID);
          const receipt = await tx.wait();
          console.log("submitAsset txSuccessfull", receipt);
          return receipt;
        } catch (error) {
          console.error("Error submitting asset:", error);
          throw error;
        }
      },

      // Approve data in the contract
      approveAsset: async (accountID, assetID, params) => {
        const { creditTypes, creditSupplyLimits } = params || {};
        try {
          const tx = await contract.approveAsset(accountID, assetID, creditTypes, creditSupplyLimits);
          const receipt = await tx.wait();
          console.log("approveAsset txSuccessfull", receipt);
          return receipt;
        } catch (error) {
          console.error("Error approving asset:", error);
          throw error;
        }
      },

      // Raise a dispute for a specific assetID
      raiseDispute: async (accountID, assetID, reason) => {
        try {
          const tx = await contract.raiseDispute(accountID, assetID, reason);
          const receipt = await tx.wait();
          return receipt;
        } catch (error) {
          console.error("Error raising dispute:", error);
          throw error;
        }
      },

      // Resolve a dispute for a specific disputeID
      resolveDispute: async (accountID, disputeID, params) => {
        const { solution, status } = params || {};
        try {
          const tx = await contract.resolveDispute(accountID, disputeID, solution, status);
          const receipt = await tx.wait();
          return receipt;
        } catch (error) {
          console.error("Error resolving dispute:", error);
          throw error;
        }
      },

      // Add a verifier to the contract
      addVerifier: async (verifierAddress) => {
        try {
          const tx = await contract.addVerifier(verifierAddress);
          const receipt = await tx.wait();
          return receipt;
        } catch (error) {
          console.error("Error adding verifier:", error);
          throw error;
        }
      },

      // Remove a verifier from the contract
      removeVerifier: async (verifierAddress) => {
        try {
          const tx = await contract.removeVerifier(verifierAddress);
          const receipt = await tx.wait();
          return receipt;
        } catch (error) {
          console.error("Error removing verifier:", error);
          throw error;
        }
      },

      // Pause the contract
      pauseContract: async () => {
        try {
          const tx = await contract.pause();
          const receipt = await tx.wait();
          return receipt;
        } catch (error) {
          console.error("Error pausing contract:", error);
          throw error;
        }
      },

      // Unpause the contract
      unpauseContract: async () => {
        try {
          const tx = await contract.unpause();
          const receipt = await tx.wait();
          return receipt;
        } catch (error) {
          console.error("Error unpausing contract:", error);
          throw error;
        }
      },

      // Emergency withdraw function
      emergencyWithdraw: async () => {
        try {
          const tx = await contract.emergencyWithdraw();
          const receipt = await tx.wait();
          return receipt;
        } catch (error) {
          console.error("Error in emergency withdrawal:", error);
          throw error;
        }
      },
    },
    Listeners: {
      // Listener for AssetSubmitted event
      onAssetSubmitted: (callback) => {
        contract.on("AssetSubmitted", (id, assetID, accountID, event) => {
          callback({ id, assetID, accountID, event });
        });
      },

      // Listener for AssetVerified event
      onAssetVerified: (callback) => {
        contract.on("AssetVerified", (id, assetID, accountID, event) => {
          callback({ id, assetID, accountID, event });
        });
      },

      // Listener for DisputeRaised event
      onDisputeRaised: (callback) => {
        contract.on("DisputeRaised", (assetID, disputeID, reason, accountID, event) => {
          callback({ assetID, disputeID, reason, accountID, event });
        });
      },

      // Listener for DisputeResolved event
      onDisputeResolved: (callback) => {
        contract.on("DisputeResolved", (assetID, disputeID, solution, accountID, event) => {
          callback({ assetID, disputeID, solution, accountID, event });
        });
      },

      // Remove all listeners (useful for cleanup)
      removeAllListeners: () => {
        contract.removeAllListeners();
      },
    },
  };
};

module.exports = { getVerificationInteractions };
