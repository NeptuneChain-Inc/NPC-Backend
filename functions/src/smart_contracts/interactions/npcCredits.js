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
      issueCredits: async (
        senderID,
        nftTokenId,
        producer,
        verifier,
        creditType,
        amount
      ) => {
        try {
          const tx = await contract.issueCredits(
            senderID,
            nftTokenId,
            producer,
            verifier,
            creditType,
            amount
          );
          const receipt = await tx.wait();
          console.log("issueCredits txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error issuing credits:", error);
          throw error;
        }
      },

      // Buy credits from a producer
      buyCredits: async (
        accountID,
        producer,
        verifier,
        creditType,
        amount,
        price
      ) => {
        try {
          const tx = await contract.buyCredits(
            accountID.toLowerCase(),
            producer.toLowerCase(),
            verifier.toLowerCase(),
            creditType.toLowerCase(),
            amount,
            price
          );
          const receipt = await tx.wait();
          console.log("buyCredits txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error buying credits:", error);
          throw error;
        }
      },

      // Transfer credits to another account
      transferCredits: async (
        senderID,
        recipientID,
        producer,
        verifier,
        creditType,
        amount,
        price
      ) => {
        try {
          const tx = await contract.transferCredits(
            senderID,
            recipientID,
            producer,
            verifier,
            creditType,
            amount,
            price
          );
          const receipt = await tx.wait();
          console.log("transferCredits txSuccessful", receipt);
          return receipt;
        } catch (error) {
          console.error("Error transferring credits:", error);
          throw error;
        }
      },

      // Donate credits
      donateCredits: async (
        senderID,
        producer,
        verifier,
        creditType,
        amount
      ) => {
        try {
          const tx = await contract.donateCredits(
            senderID,
            producer,
            verifier,
            creditType,
            amount
          );
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
          const result = await contract.getCreditSupplyLimit(
            tokenId,
            creditType
          );
          console.log("getCreditSupplyLimit result:", result);
          return result;
        } catch (error) {
          console.error("Error getting credit supply limit:", error);
          throw error;
        }
      },

      // Get the total number of certificates issued
      getTotalCertificates: async () => {
        try {
          const result = await contract.getTotalCertificates();
          console.log("getTotalCertificates result:", result);
          return result;
        } catch (error) {
          console.error("Error getting total certificates:", error);
          throw error;
        }
      },

      // Get the total number of credits sold
      getTotalSold: async () => {
        try {
          const result = await contract.getTotalSold();
          console.log("getTotalSold result:", result);
          return result;
        } catch (error) {
          console.error("Error getting total sold credits:", error);
          throw error;
        }
      },

      // Check if a producer is registered
      isProducerRegistered: async (producer) => {
        try {
          const result = await contract.isProducerRegistered(producer);
          console.log("isProducerRegistered result:", result);
          return result;
        } catch (error) {
          console.error("Error checking if producer is registered:", error);
          throw error;
        }
      },

      // Check if a verifier is registered for a producer
      isVerifierRegistered: async (producer, verifier) => {
        try {
          const result = await contract.isVerifierRegistered(
            producer,
            verifier
          );
          console.log("isVerifierRegistered result:", result);
          return result;
        } catch (error) {
          console.error("Error checking if verifier is registered:", error);
          throw error;
        }
      },

      // Get the list of verifiers for a producer
      getProducerVerifiers: async (producer) => {
        try {
          const result = await contract.getProducerVerifiers(producer);
          console.log("getProducerVerifiers result:", result);
          return result;
        } catch (error) {
          console.error("Error getting producer verifiers:", error);
          throw error;
        }
      },

      // Get supply details for a specific producer, verifier, and credit type
      getSupply: async (producer, verifier, creditType) => {
        try {
          const result = await contract.getSupply(
            producer,
            verifier,
            creditType
          );
          console.log("getSupply result:", result);
          return result;
        } catch (error) {
          console.error("Error getting supply details:", error);
          throw error;
        }
      },

      getCertificateById: async (certificateId) => {
        try {
          const result = await contract.getCertificateById(
            Number(certificateId)
          );
          console.log("getCertificateById result:", result);

          // const serializedResult = JSON.parse(
          //   JSON.stringify(result, (key, value) =>
          //     typeof value === "bigint" ? value.toString() : value
          //   )
          // );

          const certificate = {
            id: Number(result[0]),             // Assuming id is a BigInt
            recipient: result[1],
            producer: result[2],
            verifier: result[3],
            creditType: result[4],
            balance: Number(result[5]),        // Assuming balance is a BigInt
            price: Number(result[6]),          // Assuming price is a BigInt
            timestamp: Number(result[7])       // Assuming timestamp is a BigInt
          };

          return certificate;
        } catch (error) {
          console.error("Error getting certificate by ID:", error);
          throw error;
        }
      },

      // Get all certificate IDs associated with an account
      getAccountCertificates: async (accountID) => {
        try {
          const result = await contract.getAccountCertificates(accountID);
          console.log("getAccountCertificates result:", result);
          return result;
        } catch (error) {
          console.error("Error getting account certificates:", error);
          throw error;
        }
      },

      // Get the credit balance for a specific account, producer, verifier, and credit type
      getAccountCreditBalance: async (
        accountID,
        producer,
        verifier,
        creditType
      ) => {
        try {
          const result = await contract.getAccountCreditBalance(
            accountID,
            producer,
            verifier,
            creditType
          );
          console.log("getAccountCreditBalance result:", result);
          return result;
        } catch (error) {
          console.error("Error getting account credit balance:", error);
          throw error;
        }
      },

      // Get all registered producers
      getProducers: async () => {
        try {
          const result = await contract.getProducers();
          console.log("getProducers result:", result);
          return result;
        } catch (error) {
          console.error("Error getting all producers:", error);
          throw error;
        }
      },

      // Get the current recovery duration
      getRecoveryDuration: async () => {
        try {
          const result = await contract.getRecoveryDuration();
          console.log("getRecoveryDuration result:", result);
          return result;
        } catch (error) {
          console.error("Error getting recovery duration:", error);
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
            callback({
              accountID,
              producer,
              verifier,
              creditType,
              amount,
              price,
              event,
            });
          }
        );
      },

      // Listener for CreditsTransferred event
      onCreditsTransferred: (callback) => {
        contract.on(
          "CreditsTransferred",
          (
            senderAccountID,
            receiverAccountID,
            producer,
            verifier,
            creditType,
            amount,
            price,
            event
          ) => {
            callback({
              senderAccountID,
              receiverAccountID,
              producer,
              verifier,
              creditType,
              amount,
              price,
              event,
            });
          }
        );
      },

      // Listener for CreditsDonated event
      onCreditsDonated: (callback) => {
        contract.on(
          "CreditsDonated",
          (accountID, producer, verifier, creditType, amount, event) => {
            callback({
              accountID,
              producer,
              verifier,
              creditType,
              amount,
              event,
            });
          }
        );
      },

      // Listener for CertificateCreated event
      onCertificateCreated: (callback) => {
        contract.on(
          "CertificateCreated",
          (
            certificateId,
            accountID,
            producer,
            verifier,
            creditType,
            balance,
            event
          ) => {
            callback({
              certificateId,
              accountID,
              producer,
              verifier,
              creditType,
              balance,
              event,
            });
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
