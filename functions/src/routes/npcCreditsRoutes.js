const express = require("express");
const { npcCredits } = require("../apis/neptunechain");

const router = express.Router();

/**
 * @api {post} /credits/issue
 * @apiName IssueCredits
 * @apiDescription Issue credits to a producer
 * @apiGroup Credits
 */
router.post("/credits/issue", async (req, res) => {
  const { senderID, nftTokenId, producer, verifier, creditType, amount } = req.body;
  try {
    const receipt = await npcCredits.issueCredits(senderID, nftTokenId, producer, verifier, creditType, amount);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /credits/buy
 * @apiName BuyCredits
 * @apiDescription Buy credits from a producer
 * @apiGroup Credits
 */
router.post("/credits/buy", async (req, res) => {
  const { accountID, producer, verifier, creditType, amount, price } = req.body;
  try {
    const response = await npcCredits.buyCredits(accountID, producer, verifier, creditType, amount, price);
    const { error, receipt, certID } = response || {};
    console.log("BuyCredits Response", {response});
    if(receipt && certID){
      return res.send({ response });
    } else {
      return res.status(510).send({ error: error ? error.message : "ERROR!" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /credits/transfer
 * @apiName TransferCredits
 * @apiDescription Transfer credits to another account
 * @apiGroup Credits
 */
router.post("/credits/transfer", async (req, res) => {
  const { senderID, recipientID, producer, verifier, creditType, amount, price } = req.body;
  try {
    const receipt = await npcCredits.transferCredits(senderID, recipientID, producer, verifier, creditType, amount, price);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /credits/donate
 * @apiName DonateCredits
 * @apiDescription Donate credits to a producer
 * @apiGroup Credits
 */
router.post("/credits/donate", async (req, res) => {
  const { senderID, producer, verifier, creditType, amount } = req.body;
  try {
    const receipt = await npcCredits.donateCredits(senderID, producer, verifier, creditType, amount);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /nft/owner/:tokenId
 * @apiName GetNFTOwner
 * @apiDescription Get the owner of an NFT by token ID
 * @apiGroup NFT
 */
router.get("/nft/owner/:tokenId", async (req, res) => {
  const { tokenId } = req.params;
  try {
    const result = await npcCredits.ownerOf(tokenId);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /nft/credit-types/:tokenId
 * @apiName GetCreditTypes
 * @apiDescription Get credit types allowed by a specific NFT
 * @apiGroup NFT
 */
router.get("/nft/credit-types/:tokenId", async (req, res) => {
  const { tokenId } = req.params;
  try {
    const result = await npcCredits.get.supplies.creditTypes(tokenId);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /nft/credit-supply-limit/:tokenId/:creditType
 * @apiName GetCreditSupplyLimit
 * @apiDescription Get the credit supply limit for a given NFT and credit type
 * @apiGroup NFT
 */
router.get("/nft/credit-supply-limit/:tokenId/:creditType", async (req, res) => {
  const { tokenId, creditType } = req.params;
  try {
    const result = await npcCredits.get.supplies.creditSupplyLimit(tokenId, creditType);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/total-certificates
 * @apiName GetTotalCertificates
 * @apiDescription Get the total number of certificates issued
 * @apiGroup Credits
 */
router.get("/credits/total-certificates", async (req, res) => {
  try {
    const result = await npcCredits.get.certificates.totalCertificates();
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/total-sold
 * @apiName GetTotalSold
 * @apiDescription Get the total number of credits sold
 * @apiGroup Credits
 */
router.get("/credits/total-sold", async (req, res) => {
  try {
    const result = await npcCredits.get.supplies.totalSold();
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/producer-registered/:producer
 * @apiName IsProducerRegistered
 * @apiDescription Check if a producer is registered
 * @apiGroup Credits
 */
router.get("/credits/producer-registered/:producer", async (req, res) => {
  const { producer } = req.params;
  try {
    const result = await npcCredits.checks.isProducerRegistered(producer);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/verifier-registered/:producer/:verifier
 * @apiName IsVerifierRegistered
 * @apiDescription Check if a verifier is registered for a producer
 * @apiGroup Credits
 */
router.get("/credits/verifier-registered/:producer/:verifier", async (req, res) => {
  const { producer, verifier } = req.params;
  try {
    const result = await npcCredits.checks.isVerifierRegistered(producer, verifier);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/verifiers/:producer
 * @apiName GetProducerVerifiers
 * @apiDescription Get the list of verifiers for a producer
 * @apiGroup Credits
 */
router.get("/credits/verifiers/:producer", async (req, res) => {
  const { producer } = req.params;
  try {
    const result = await npcCredits.get.accounts.getProducerVerifiers(producer);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/supply/:producer/:verifier/:creditType
 * @apiName GetSupply
 * @apiDescription Get supply details for a specific producer, verifier, and credit type
 * @apiGroup Credits
 */
router.get("/credits/supply/:producer/:verifier/:creditType", async (req, res) => {
  const { producer, verifier, creditType } = req.params;
  try {
    const result = await npcCredits.get.supplies.getSupply(producer, verifier, creditType);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /certificates/:certificateId
 * @apiName GetCertificateById
 * @apiDescription Get certificate details by ID
 * @apiGroup Certificates
 */
router.get("/certificates/:certificateId", async (req, res) => {
  const { certificateId } = req.params;
  try {
    const certificate = await npcCredits.get.certificates.certificate(certificateId);
    console.log("SEND", certificate)
    return res.send({ certificate });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/account-certificates/:accountID
 * @apiName GetAccountCertificates
 * @apiDescription Get all certificate IDs associated with an account
 * @apiGroup Credits
 */
router.get("/credits/account-certificates/:accountID", async (req, res) => {
  const { accountID } = req.params;
  try {
    const result = await npcCredits.get.certificates.userCertificats(accountID);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/account-balance/:accountID/:producer/:verifier/:creditType
 * @apiName GetAccountCreditBalance
 * @apiDescription Get the credit balance for a specific account, producer, verifier, and credit type
 * @apiGroup Credits
 */
router.get("/credits/account-balance/:accountID/:producer/:verifier/:creditType", async (req, res) => {
  const { accountID, producer, verifier, creditType } = req.params;
  try {
    const result = await npcCredits.get.accounts.getAccountCreditBalance(accountID, producer, verifier, creditType);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/all-producers
 * @apiName GetAllProducers
 * @apiDescription Get all registered producers
 * @apiGroup Credits
 */
router.get("/credits/all-producers", async (req, res) => {
  try {
    const result = await npcCredits.get.accounts.getProducers();
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /credits/recovery-duration
 * @apiName GetRecoveryDuration
 * @apiDescription Get the current recovery duration
 * @apiGroup Credits
 */
router.get("/credits/recovery-duration", async (req, res) => {
  try {
    const result = await npcCredits.checks.getRecoveryDuration();
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
