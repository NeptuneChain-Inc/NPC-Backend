const { ethers } = require("ethers");
const { NeptuneChainCreditsContract } = require("../abis/npc_credits");

const getNeptuneChainCreditsInteractions = (signer) => {
  
  const contract = new ethers.Contract(
    NeptuneChainCreditsContract.Address,
    NeptuneChainCreditsContract.ABI,
    signer
  );

  return {
    Contract: NeptuneChainCreditsContract,
    Instance: contract,
    Functions: {
      // Issue credits to a producer
      issueCredits: async (senderID, nftTokenId, producer, verifier, creditType, amount) => {
        try {
          const tx = await contract.issueCredits(senderID, nftTokenId, producer, verifier, creditType, amount);
          const receipt = await tx.wait();
          console.log("issueCredits txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error issuing credits:", error);
          throw error;
        }
      },

      // Buy credits from a producer
      buyCredits: async (accountID, producer, verifier, creditType, amount, price) => {
        try {
          const tx = await contract.buyCredits(accountID, producer, verifier, creditType, amount, price);
          const receipt = await tx.wait();
          console.log("buyCredits txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error buying credits:", error);
          throw error;
        }
      },

      // Transfer credits to another account
      transferCredits: async (senderID, recipientID, producer, verifier, creditType, amount, price) => {
        try {
          const tx = await contract.transferCredits(senderID, recipientID, producer, verifier, creditType, amount, price);
          const receipt = await tx.wait();
          console.log("transferCredits txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error transferring credits:", error);
          throw error;
        }
      },

      // Donate credits
      donateCredits: async (senderID, producer, verifier, creditType, amount) => {
        try {
          const tx = await contract.donateCredits(senderID, producer, verifier, creditType, amount);
          const receipt = await tx.wait();
          console.log("donateCredits txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error donating credits:", error);
          throw error;
        }
      },

      // Get the owner of an NFT
      ownerOf: async (tokenId) => {
        try {
          const result = await contract.ownerOf(tokenId);
          console.log("ownerOf result:", result);
          return result;
        } catch (error) {
          console.error("Error getting owner of NFT:", error);
          throw error;
        }
      },

      // Get credit types allowed by a specific NFT
      getCreditTypes: async (tokenId) => {
        try {
          const result = await contract.getCreditTypes(tokenId);
          console.log("getCreditTypes result:", result);
          return result;
        } catch (error) {
          console.error("Error getting credit types:", error);
          throw error;
        }
      },

      // Get the credit supply limit for a given NFT and credit type
      getCreditSupplyLimit: async (tokenId, creditType) => {
        try {
          const result = await contract.getCreditSupplyLimit(tokenId, creditType);
          console.log("getCreditSupplyLimit result:", result);
          return result;
        } catch (error) {
          console.error("Error getting credit supply limit:", error);
          throw error;
        }
      },
    },
    Listeners: {
      // Listener for CreditsIssued event
      onCreditsIssued: (callback) => {
        contract.on(
          "CreditsIssued",
          (producer, verifier, creditType, amount, event) => {
            callback({ producer, verifier, creditType, amount, event });
          }
        );
      },

      // Listener for CreditsBought event
      onCreditsBought: (callback) => {
        contract.on(
          "CreditsBought",
          (accountID, producer, verifier, creditType, amount, price, event) => {
            callback({ accountID, producer, verifier, creditType, amount, price, event });
          }
        );
      },

      // Listener for CreditsTransferred event
      onCreditsTransferred: (callback) => {
        contract.on(
          "CreditsTransferred",
          (senderAccountID, receiverAccountID, producer, verifier, creditType, amount, price, event) => {
            callback({ senderAccountID, receiverAccountID, producer, verifier, creditType, amount, price, event });
          }
        );
      },

      // Listener for CreditsDonated event
      onCreditsDonated: (callback) => {
        contract.on(
          "CreditsDonated",
          (accountID, producer, verifier, creditType, amount, event) => {
            callback({ accountID, producer, verifier, creditType, amount, event });
          }
        );
      },

      // Listener for CertificateCreated event
      onCertificateCreated: (callback) => {
        contract.on(
          "CertificateCreated",
          (certificateId, accountID, producer, verifier, creditType, balance, event) => {
            callback({ certificateId, accountID, producer, verifier, creditType, balance, event });
          }
        );
      },

      // Remove all listeners (useful for cleanup)
      removeAllListeners: () => {
        contract.removeAllListeners();
      },
    },
  };
};

module.exports = { getNeptuneChainCreditsInteractions };
