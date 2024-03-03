const Moralis = require("moralis").default;

/**
 * Initializes the Moralis SDK.
 *
 * This function initializes the Moralis SDK by starting the Moralis server with the provided API key.
 *
 * @returns {Promise<void>} A promise that resolves when the Moralis SDK is successfully initialized.
 *
 * @throws {Error} If the Moralis SDK fails to start.
 */
async function initializeMoralis() {
  await Moralis.start({
    apiKey: process.env.MORALIS_KEY,
  });
}
initializeMoralis().catch(console.error);

const chain = process.env.TESTNET_ID;

/**
 * Retrieves the NFTs owned by a specific wallet address.
 *
 * @param {string} address - The wallet address to retrieve NFTs for.
 * @returns {Promise<Object>} - A promise that resolves to an object representing the NFTs owned by the wallet address.
 */
const getWalletNFTs = async (address) => {
  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain,
  });

  return response.toJSON();
};

/**
 * Retrieves the metadata of a specific NFT.
 *
 * @param {string} address - The address of the NFT contract.
 * @param {string} tokenId - The ID of the NFT.
 * @returns {Promise<Object>} - A promise that resolves to the metadata of the NFT.
 */
const getNFTMetadata = async (address, tokenId) => {
  const response = await Moralis.EvmApi.nft.getNFTMetadata({
    address,
    chain,
    tokenId,
  });

  return response.toJSON();
};

module.exports = { getWalletNFTs, getNFTMetadata };
