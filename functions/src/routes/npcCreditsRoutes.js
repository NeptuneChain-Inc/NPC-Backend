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
    const receipt = await npcCredits.buyCredits(accountID, producer, verifier, creditType, amount, price);
    return res.send({ receipt });
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
    const result = await npcCredits.get.creditTypes(tokenId);
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
    const result = await npcCredits.get.creditSupplyLimit(tokenId, creditType);
    return res.send({ result });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
