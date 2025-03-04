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
      // Handle both string type and object type transactions for compatibility
      const txFrom = typeof tx === 'string' ? '' : (tx.from || '');
      const txTo = typeof tx === 'string' ? '' : (tx.to || '');
      
      if (
        (txFrom.toLowerCase && txFrom.toLowerCase() === normalizedAddress) ||
        (txTo.toLowerCase && txTo.toLowerCase() === normalizedAddress)
      ) {
        if (typeof tx === 'string') {
          // If tx is just a transaction hash, fetch the full transaction
          const fullTx = await provider.getTransaction(tx);
          if (fullTx) {
            transactions.push({
              hash: fullTx.hash,
              from: fullTx.from,
              to: fullTx.to,
              value: fullTx.value ? ethers.formatEther(fullTx.value) : '0',
              blockNumber: fullTx.blockNumber,
              timestamp: block.timestamp,
            });
          }
        } else {
          // If tx is already a full transaction object
          transactions.push({
            hash: tx.hash,
            from: tx.from || '',
            to: tx.to || '',
            value: tx.value ? ethers.formatEther(tx.value) : '0',
            blockNumber: tx.blockNumber,
            timestamp: block.timestamp,
          });
        }
        
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
  const contractAddress = await contract.getAddress();
  
  const receipt = await contract.deploymentTransaction()?.wait();
  const deploymentHash = receipt?.hash || '';
  
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
 * Call a contract method (read-only)
 */
export async function callContractMethod(
  contractAddress: string,
  abi: any[],
  methodName: string,
  methodArgs: any[] = [],
  network: string = config.infura.defaultNetwork
): Promise<any> {
  const provider = getProvider(network);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  return await contract[methodName](...methodArgs);
}

/**
 * Execute a contract method (write)
 */
export async function executeContractMethod(
  fromAddress: string,
  contractAddress: string,
  abi: any[],
  methodName: string,
  methodArgs: any[] = [],
  network: string = config.infura.defaultNetwork
): Promise<{
  hash: string;
  explorer: string;
}> {
  const signer = await getSigner(fromAddress, network);
  if (!signer) {
    throw new Error(`Unable to load wallet for address ${fromAddress}`);
  }
  
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract[methodName](...methodArgs);
  await tx.wait();
  
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