const express = require("express");

const router = express.Router();

const alchemy = require("../apis/alchemy");

/**
 * @api {post} /alchemy/get/wallet_nfts
 * @apiName GetWalletNFTs
 * @apiDescription Get Wallet NFTs
 * @apiGroup Alchemy
 *
 * @apiParam {String} address - Wallet address to get NFTs for.
 *
 * @apiSuccess {Array} wallet_nfts - Returns array of NFTs in Wallet Address
 *
 * @apiError {Object} error - Error message.
 */
router.post("/get/wallet_nfts", async (req, res) => {
  try {
    const { address } = req.body || {};
    const wallet_nfts = await alchemy.getWalletNFTs(address);
    return res.send({ wallet_nfts });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {post} /alchemy/get/nft_metadata
 * @apiName GetNFTMetadata
 * @apiDescription Get NFT Metadata
 * @apiGroup Alchemy
 *
 * @apiParam {String} tokenId - Token ID of the NFT.
 * @apiParam {String} address - Contract address of the NFT.
 *
 * @apiSuccess {Object} nft_metadata - Returns NFT metadata
 *
 * @apiError {Object} error - Error message.
 */
router.post("/get/nft_metadata", async (req, res) => {
  try {
    const { address, tokenId } = req.body || {};
    const nft_metadata = await alchemy.getNFTMetadata(address, tokenId);
    return res.send({ nft_metadata });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;