import { ethers } from 'ethers';
import config from './config.js';
import * as crypto from './crypto.js';

/**
 * Get Ethereum provider for a specific network
 */
export function getProvider(network: string = config.infura.defaultNetwork): ethers.JsonRpcProvider {
  const rpcUrl = `https://${network}.infura.io/v3/${config.infura.apiKey}`;
  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Get a signer for the specified address
 */
export async function getSigner(
  address: string,
  network: string = config.infura.defaultNetwork
): Promise<ethers.Wallet | null> {
  const wallet = await crypto.loadWallet(address);
  if (!wallet) return null;
  
  const provider = getProvider(network);
  return wallet.connect(provider);
}

/**
 * Check the ETH balance for an address
 */
export async function checkBalance(
  address: string,
  network: string = config.infura.defaultNetwork
): Promise<string> {
  const provider = getProvider(network);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

/**
 * Get transactions for an address
 */
export async function getTransactions(
  address: string,
  limit: number = 10,
  network: string = config.infura.defaultNetwork
): Promise<any[]> {
  const provider = getProvider(network);
  
  // Get the current block number
  const currentBlock = await provider.getBlockNumber();
  
  // Get recent blocks
  const blockPromises = [];
  const blockCount = Math.min(limit * 2, 100); // Look at up to 100 blocks
  
  for (let i = 0; i < blockCount; i++) {
    if (currentBlock - i > 0) {
      blockPromises.push(provider.getBlock(currentBlock - i, true));
    }
  }
  
  const blocks = await Promise.all(blockPromises);
  const transactions: any[] = [];
  const normalizedAddress = address.toLowerCase();
  
  // Filter transactions involving the address
  for (const block of blocks) {
    if (!block || !block.transactions) continue;
    
    for (const tx of block.transactions) {
      if (
        (tx.from && tx.from.toLowerCase() === normalizedAddress) ||
        (tx.to && tx.to.toLowerCase() === normalizedAddress)
      ) {
        transactions.push({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value ? ethers.formatEther(tx.value) : '0',
          blockNumber: tx.blockNumber,
          timestamp: block.timestamp,
          // Add more tx details as needed
        });
        
        if (transactions.length >= limit) {
          return transactions;
        }
      }
    }
  }
  
  return transactions;
}

/**
 * Send ETH to an address
 */
export async function sendTransaction(
  fromAddress: string,
  toAddress: string,
  etherAmount: string,
  network: string = config.infura.defaultNetwork
): Promise<{hash: string; explorer: string}> {
  const signer = await getSigner(fromAddress, network);
  if (!signer) {
    throw new Error(`Unable to load wallet for address ${fromAddress}`);
  }
  
  const tx = await signer.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(etherAmount)
  });
  
  // Get the network-specific explorer URL
  let explorerUrl = '';
  switch (network) {
    case 'mainnet':
      explorerUrl = 'https://etherscan.io/tx/';
      break;
    case 'goerli':
      explorerUrl = 'https://goerli.etherscan.io/tx/';
      break;
    case 'sepolia':
      explorerUrl = 'https://sepolia.etherscan.io/tx/';
      break;
    default:
      explorerUrl = 'https://etherscan.io/tx/';
  }
  
  return {
    hash: tx.hash,
    explorer: `${explorerUrl}${tx.hash}`
  };
}

/**
 * Deploy a contract
 */
export async function deployContract(
  fromAddress: string,
  abi: any[],
  bytecode: string,
  constructorArgs: any[] = [],
  network: string = config.infura.defaultNetwork
): Promise<{
  address: string;
  deploymentHash: string;
  explorer: string;
}> {
  const signer = await getSigner(fromAddress, network);
  if (!signer) {
    throw new Error(`Unable to load wallet for address ${fromAddress}`);
  }
  
  // Create the factory
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  
  // Deploy the contract
  const contract = await factory.deploy(...constructorArgs);
  await contract.waitForDeployment();
  
  const receipt = await contract.deploymentTransaction()?.wait();
  const deploymentHash = receipt?.hash || '';
  const contractAddress = await contract.getAddress();
  
  // Get the network-specific explorer URL
  let explorerUrl = '';
  switch (network) {
    case 'mainnet':
      explorerUrl = 'https://etherscan.io/address/';
      break;
    case 'goerli':
      explorerUrl = 'https://goerli.etherscan.io/address/';
      break;
    case 'sepolia':
      explorerUrl = 'https://sepolia.etherscan.io/address/';
      break;
    default:
      explorerUrl = 'https://etherscan.io/address/';
  }
  
  return {
    address: contractAddress,
    deploymentHash,
    explorer: `${explorerUrl}${contractAddress}`
  };
}

/**
 * Call a contract method
 */
export async function callContract(
  contractAddress: string,
  abi: any[],
  methodName: string,
  methodArgs: any[] = [],
  fromAddress?: string,
  network: string = config.infura.defaultNetwork
): Promise<any> {
  // Create a contract instance
  let contractInstance;
  
  if (fromAddress) {
    // With signer (can make state changes)
    const signer = await getSigner(fromAddress, network);
    if (!signer) {
      throw new Error(`Unable to load wallet for address ${fromAddress}`);
    }
    contractInstance = new ethers.Contract(contractAddress, abi, signer);
  } else {
    // Read-only
    const provider = getProvider(network);
    contractInstance = new ethers.Contract(contractAddress, abi, provider);
  }
  
  // Check if the method exists
  if (typeof contractInstance[methodName] !== 'function') {
    throw new Error(`Method ${methodName} does not exist on contract`);
  }
  
  // Call the method
  const result = await contractInstance[methodName](...methodArgs);
  return result;
}