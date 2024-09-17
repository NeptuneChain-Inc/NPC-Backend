const { ethers } = require("ethers");
const crypto = require("crypto");
const { promisify } = require("util");

// Promisify crypto functions for easier async/await usage
const pbkdf2 = promisify(crypto.pbkdf2);
const randomBytes = promisify(crypto.randomBytes);

const getSigner = () => {
  const network =
    process.env.NETWORK_TYPE === "production" ? "mainnet" : "testnet";
  const rpc = process.env[`${network.toUpperCase()}_RPC`];
  const key = process.env.APP_WALLET_KEY;

  if (rpc && key) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      const wallet = new ethers.Wallet(key, provider);
      const signer = wallet.connect(provider);
      return signer;
    } catch (error) {
      throw error;
    }
  }

  return null;
};

// Helper function to derive a key from userUID and PIN
const deriveKey = async (userUID, PIN) => {
  const salt = crypto.createHash("sha256").update(userUID).digest();
  const key = await pbkdf2(PIN.toString(), salt, 100000, 32, "sha256");
  return key;
};

// Encrypt a private key using the derived key
const encryptKey = async (prvKey, derivedKey) => {
  const iv = await randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);
  let encrypted = cipher.update(prvKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

// Decrypt a private key using the derived key
const decryptKey = async (encryptedKey, derivedKey) => {
  const [ivHex, encrypted] = encryptedKey.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

/**
 * Generates an ethereum wallet address pair and binds Private Key with a user by encrypting the key with the userUID and 6-figure access pin and returning the encrypted key for storage.
 */
const generateWallet = async (userUID, PIN) => {
  const wallet = ethers.Wallet.createRandom();
  const derivedKey = await deriveKey(userUID, PIN);
  const encryptedKey = await encryptKey(wallet.privateKey, derivedKey);
  return encryptedKey;
};

/**
 * Unlocks the encrypted key of a userUID to access the private key of the user's ethereum wallet address pair.
 * @param {string} userUID Unique Identifier of user to unlock wallet address
 * @param {string} encryptedKey User's encryptedKey from database
 * @param {number} PIN 6-figure access pin for wallet access
 * @returns {{prvKey: string, address: string}} Wallet Address Pairs
 */
const unlockWallet = async (userUID, encryptedKey, PIN) => {
  const derivedKey = await deriveKey(userUID, PIN);
  const prvKey = await decryptKey(encryptedKey, derivedKey);
  const wallet = new ethers.Wallet(prvKey);
  return { prvKey, address: wallet.address };
};

/**
 * Get Wallet signature for transactions.
 * @param {string} userUID Unique Identifier of user to unlock wallet address
 *  * @param {string} encryptedKey User's encryptedKey from database
 * @param {number} PIN 6-figure access pin for wallet access
 *
 * @returns {Signer} Wallet Signer
 */
const signWallet = async (userUID, encryptedKey, PIN) => {
  const network =
    process.env.NETWORK_TYPE === "production" ? "mainnet" : "testnet";
  const rpc = process.env[`${network.toUpperCase()}_RPC`];

  const { prvKey } = await unlockWallet(userUID, PIN, encryptedKey);

  if (rpc && prvKey) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      const wallet = new ethers.Wallet(prvKey, provider);
      const signer = wallet.connect(provider);
      return signer;
    } catch (error) {
      throw error;
    }
  }

  return null;
};

/**
 * Rebinds the wallet private key by unlocking with the current pin, then updating the decryption to use the new pin
 * @param {string} userUID Unique Identifier of user to rebind wallet address
 * @param {string} encryptedKey User's encryptedKey from database
 * @param {number} currentPIN Current 6-figure access pin for wallet access
 * @param {number} newPIN New 6-figure number access pin of wallet access
 *
 * @returns {string} encryptedKey - New encryptedKey for storage
 */
const rebindWallet = async (userUID, encryptedKey, currentPIN, newPIN) => {
  const { prvKey } = await unlockWallet(userUID, currentPIN, encryptedKey);
  const newDerivedKey = await deriveKey(userUID, newPIN);
  const newEncryptedKey = await encryptKey(prvKey, newDerivedKey);
  return newEncryptedKey;
};

module.exports = {
  getSigner,
  generateWallet,
  unlockWallet,
  signWallet,
  rebindWallet,
};
