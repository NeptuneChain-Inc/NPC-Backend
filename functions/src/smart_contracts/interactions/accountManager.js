const { ethers } = require("ethers");
const { NPC_AccountManager } = require("../abis/account_manager_contract");

const getAccountManagerInteractions = (signer) => {
  const contract = new ethers.Contract(
    NPC_AccountManager.Address,
    NPC_AccountManager.ABI,
    signer
  );

  return {
    Contract: NPC_AccountManager,
    Instance: contract,
    Functions: {
      // Verify role of an account
      verifyRole: async (accountID, role) => {
        try {
          const result = await contract.verifyRole(accountID, role);
          console.log("verifyRole result:", result);
          return result;
        } catch (error) {
          console.error("Error verifying role:", error);
          throw error;
        }
      },

      // Check if an account is registered
      isRegistered: async (accountID) => {
        try {
          const result = await contract.isRegistered(accountID);
          console.log("isRegistered result:", result);
          return result;
        } catch (error) {
          console.error("Error checking registration:", error);
          throw error;
        }
      },

      // Check if an account is not blacklisted
      isNotBlacklisted: async (accountID) => {
        try {
          const result = await contract.isNotBlacklisted(accountID);
          console.log("isNotBlacklisted result:", result);
          return result;
        } catch (error) {
          console.error("Error checking blacklist status:", error);
          throw error;
        }
      },

      // Register a new account
      registerAccount: async (accountID, role, txAddress) => {
        try {
          const tx = await contract.registerAccount(accountID, role, txAddress);
          const receipt = await tx.wait();
          console.log("registerAccount txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error registering account:", error);
          throw error;
        }
      },

      // Blacklist or unblacklist an account
      blacklistAccount: async (accountID, status) => {
        try {
          const tx = await contract.blacklistAccount(accountID, status);
          const receipt = await tx.wait();
          console.log("blacklistAccount txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error blacklisting account:", error);
          throw error;
        }
      },

      // Update last active timestamp for an account
      updateLastActive: async (accountID) => {
        try {
          const tx = await contract.updateLastActive(accountID);
          const receipt = await tx.wait();
          console.log("updateLastActive txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error updating last active timestamp:", error);
          throw error;
        }
      },

      // Get account data by account ID
      getAccountData: async (accountID) => {
        try {
          const result = await contract.getAccountData(accountID);
          console.log("getAccountData result:", result);
          return result;
        } catch (error) {
          console.error("Error getting account data:", error);
          throw error;
        }
      },
    },
    Listeners: {
      // Listener for AccountRegistered event
      onAccountRegistered: (callback) => {
        contract.on(
          "AccountRegistered",
          (accountID, role, txAddress, event) => {
            callback({ accountID, role, txAddress, event });
          }
        );
      },

      // Listener for AccountBlacklisted event
      onAccountBlacklisted: (callback) => {
        contract.on("AccountBlacklisted", (accountID, isBlacklisted, event) => {
          callback({ accountID, isBlacklisted, event });
        });
      },

      // Remove all listeners (useful for cleanup)
      removeAllListeners: () => {
        contract.removeAllListeners();
      },
    },
  };
};

module.exports = { getAccountManagerInteractions };
