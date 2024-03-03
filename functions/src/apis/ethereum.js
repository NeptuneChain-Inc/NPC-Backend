const { ethers } = require("ethers");

/**
 * Retrieves the signer object for the current application wallet.
 * 
 * @returns {Object} An object containing the provider, wallet, and signer.
 * @throws {Error} If there is an error retrieving the signer.
 */
const getSigner = async () => {
  try {
    const network = process.env.NETWORK_TYPE === "production" ? "mainnet" : "testnet";
    const provider = new ethers.providers.JsonRpcProvider(process.env[`${network.toUpperCase()}_RPC`]);
    const wallet = new ethers.Wallet(process.env.APP_WALLET_KEY, provider);
    const signer = wallet.connect(provider);
    return { provider, wallet, signer };
  } catch (error) {
    throw error;
  }
};

module.exports = { getSigner }