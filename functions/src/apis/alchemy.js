const { Network, Alchemy } = require("alchemy-sdk");

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_AMOY,
};

const alchemy = new Alchemy(settings);

/**
 * Retrieves the NFTs owned by a specific wallet address.
 *
 * @param {string} address - The wallet address to retrieve NFTs for.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the NFTs owned by the wallet address.
 */
const getWalletNFTs = async (address) => {
  const nftsForOwner = await alchemy.nft.getNftsForOwner(address);
  const wallet_nfts = [];

  for (const nft of nftsForOwner.ownedNfts) {
    wallet_nfts.push(nft);
  }
  return wallet_nfts;
};

/**
 * Retrieves the metadata of a specific NFT.
 *
 * @param {string} address - The address of the NFT contract.
 * @param {string} tokenId - The ID of the NFT.
 * @returns {Promise<Object>} - A promise that resolves to the metadata of the NFT.
 */
const getNFTMetadata = async (address, tokenId) => {
  const response = await alchemy.nft.getNftMetadata(address, tokenId);

  const metadata = {
    name: response.contract.name,
    symbol: response.contract.symbol,
    type: response.tokenType,
    tokenUri: response.tokenUri,
  };

  return metadata;
};

module.exports = { getWalletNFTs, getNFTMetadata };
