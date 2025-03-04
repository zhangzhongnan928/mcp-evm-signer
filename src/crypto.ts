import { ethers } from 'ethers';
import fs from 'fs-extra';
import path from 'path';
import config from './config.js';

// Key storage interface
interface KeyData {
  address: string;
  privateKey: string;
  encrypted: boolean;
  encryptedData: string | null;
}

/**
 * Encrypt a private key using password
 */
export async function encryptKey(privateKey: string, password: string): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  return await wallet.encrypt(password);
}

/**
 * Decrypt an encrypted key using password
 */
export async function decryptKey(encryptedData: string, password: string): Promise<string> {
  const wallet = await ethers.Wallet.fromEncryptedJson(encryptedData, password);
  return wallet.privateKey;
}

/**
 * Save a wallet to storage
 */
export async function saveWallet(wallet: ethers.Wallet): Promise<void> {
  const address = wallet.address.toLowerCase();
  const keyPath = path.join(config.keys.path, `${address}.json`);
  
  let keyData: KeyData;
  
  if (config.keys.encrypt) {
    const encryptedData = await wallet.encrypt(config.keys.password);
    keyData = {
      address,
      privateKey: '', // Don't store plaintext private key when encrypted
      encrypted: true,
      encryptedData,
    };
  } else {
    keyData = {
      address,
      privateKey: wallet.privateKey,
      encrypted: false,
      encryptedData: null,
    };
  }
  
  await fs.writeJson(keyPath, keyData, { spaces: 2 });
}

/**
 * Get all wallet addresses from storage
 */
export async function getWalletAddresses(): Promise<string[]> {
  const files = await fs.readdir(config.keys.path);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => path.basename(file, '.json'));
}

/**
 * Load a wallet from storage
 */
export async function loadWallet(address: string): Promise<ethers.Wallet | null> {
  const normalizedAddress = address.toLowerCase();
  const keyPath = path.join(config.keys.path, `${normalizedAddress}.json`);
  
  try {
    if (!await fs.pathExists(keyPath)) {
      return null;
    }
    
    const keyData: KeyData = await fs.readJson(keyPath);
    
    if (keyData.encrypted) {
      if (!keyData.encryptedData) {
        throw new Error(`Encrypted wallet missing encryptedData: ${address}`);
      }
      return await ethers.Wallet.fromEncryptedJson(keyData.encryptedData, config.keys.password);
    } else {
      if (!keyData.privateKey) {
        throw new Error(`Wallet missing privateKey: ${address}`);
      }
      return new ethers.Wallet(keyData.privateKey);
    }
  } catch (error) {
    console.error(`Error loading wallet ${address}:`, error);
    return null;
  }
}

/**
 * Create a new random wallet
 */
export function createWallet(): ethers.Wallet {
  return ethers.Wallet.createRandom();
}

/**
 * Create a wallet from a private key
 */
export function importWallet(privateKey: string): ethers.Wallet {
  return new ethers.Wallet(privateKey);
}