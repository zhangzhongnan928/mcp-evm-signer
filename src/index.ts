#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as crypto from './crypto.js';
import * as ethereum from './ethereum.js';
import config from './config.js';

// Define interface types for the tool handlers
interface CreateWalletParams {}

interface ImportWalletParams {
  privateKey: string;
}

interface ListWalletsParams {}

interface CheckBalanceParams {
  address: string;
  network?: string;
}

interface GetTransactionsParams {
  address: string;
  limit?: number;
  network?: string;
}

interface SendTransactionParams {
  fromAddress: string;
  toAddress: string;
  amount: string;
  network?: string;
}

interface DeployContractParams {
  fromAddress: string;
  abi: string;
  bytecode: string;
  constructorArgs?: string;
  network?: string;
}

interface CallContractParams {
  contractAddress: string;
  abi: string;
  method: string;
  args?: string;
  network?: string;
}

interface ExecuteContractParams {
  fromAddress: string;
  contractAddress: string;
  abi: string;
  method: string;
  args?: string;
  network?: string;
}

async function main() {
  console.error('Starting MCP EVM Signer server...');

  // Create the MCP server
  const server = new McpServer({
    name: 'evm-signer',
    version: '1.0.0',
  });

  // === Wallet Management Tools ===

  // Create a new wallet
  server.tool(
    'create-wallet',
    'Create a new Ethereum wallet',
    {},
    async ({}: CreateWalletParams) => {
      try {
        const wallet = crypto.createWallet();
        await crypto.saveWallet(wallet);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              address: wallet.address,
              message: 'Wallet created and saved successfully.',
              privateKey: wallet.privateKey
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error creating wallet: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Import an existing wallet
  server.tool(
    'import-wallet',
    'Import an existing wallet from a private key',
    {
      privateKey: z.string().describe('Private key (with or without 0x prefix)')
    },
    async ({ privateKey }: ImportWalletParams) => {
      try {
        const wallet = crypto.importWallet(privateKey);
        await crypto.saveWallet(wallet);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              address: wallet.address,
              message: 'Wallet imported and saved successfully.'
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error importing wallet: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // List all wallets
  server.tool(
    'list-wallets',
    'List all saved wallets',
    {},
    async ({}: ListWalletsParams) => {
      try {
        const addresses = await crypto.getWalletAddresses();
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              wallets: addresses,
              count: addresses.length
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error listing wallets: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // === Blockchain Interaction Tools ===

  // Check balance
  server.tool(
    'check-balance',
    'Check the ETH balance of an Ethereum address',
    {
      address: z.string().describe('Ethereum address (0x format)'),
      network: z.string().optional().describe('Network name (e.g. mainnet, goerli, sepolia)')
    },
    async ({ address, network }: CheckBalanceParams) => {
      try {
        const balance = await ethereum.checkBalance(
          address,
          network || config.infura.defaultNetwork
        );
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              address,
              network: network || config.infura.defaultNetwork,
              balance: `${balance} ETH`
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error checking balance: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Get recent transactions
  server.tool(
    'get-transactions',
    'Get recent transactions for an Ethereum address',
    {
      address: z.string().describe('Ethereum address (0x format)'),
      limit: z.number().optional().describe('Number of transactions to return (max 100)'),
      network: z.string().optional().describe('Network name (e.g. mainnet, goerli, sepolia)')
    },
    async ({ address, limit = 10, network }: GetTransactionsParams) => {
      try {
        const transactions = await ethereum.getTransactions(
          address,
          Math.min(limit, 100),
          network || config.infura.defaultNetwork
        );
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              address,
              network: network || config.infura.defaultNetwork,
              transactions,
              count: transactions.length
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error getting transactions: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Send transaction
  server.tool(
    'send-transaction',
    'Send ETH to an address',
    {
      fromAddress: z.string().describe('Your wallet address'),
      toAddress: z.string().describe('Recipient address'),
      amount: z.string().describe('Amount of ETH to send'),
      network: z.string().optional().describe('Network name (e.g. mainnet, goerli, sepolia)')
    },
    async ({ fromAddress, toAddress, amount, network }: SendTransactionParams) => {
      try {
        const result = await ethereum.sendTransaction(
          fromAddress,
          toAddress,
          amount,
          network || config.infura.defaultNetwork
        );
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              message: `Sent ${amount} ETH from ${fromAddress} to ${toAddress}`,
              transaction: result.hash,
              explorer: result.explorer,
              network: network || config.infura.defaultNetwork
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error sending transaction: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Deploy contract
  server.tool(
    'deploy-contract',
    'Deploy a smart contract',
    {
      fromAddress: z.string().describe('Your wallet address'),
      abi: z.string().describe('Contract ABI (JSON)'),
      bytecode: z.string().describe('Contract bytecode'),
      constructorArgs: z.string().optional().describe('Constructor arguments as JSON array'),
      network: z.string().optional().describe('Network name (e.g. mainnet, goerli, sepolia)')
    },
    async ({ fromAddress, abi, bytecode, constructorArgs, network }: DeployContractParams) => {
      try {
        let parsedAbi;
        try {
          parsedAbi = JSON.parse(abi);
        } catch (e) {
          throw new Error('Invalid ABI JSON');
        }
        
        let parsedArgs: any[] = [];
        if (constructorArgs) {
          try {
            parsedArgs = JSON.parse(constructorArgs);
            if (!Array.isArray(parsedArgs)) {
              throw new Error('Constructor arguments must be an array');
            }
          } catch (e) {
            throw new Error('Invalid constructor arguments JSON');
          }
        }
        
        const result = await ethereum.deployContract(
          fromAddress,
          parsedAbi,
          bytecode,
          parsedArgs,
          network || config.infura.defaultNetwork
        );
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              message: 'Contract deployed successfully',
              contractAddress: result.address,
              deploymentTransaction: result.deploymentHash,
              explorer: result.explorer,
              network: network || config.infura.defaultNetwork
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error deploying contract: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Call contract (read-only)
  server.tool(
    'call-contract',
    'Call a contract method (read-only)',
    {
      contractAddress: z.string().describe('Contract address'),
      abi: z.string().describe('Contract ABI (JSON)'),
      method: z.string().describe('Method name'),
      args: z.string().optional().describe('Method arguments as JSON array'),
      network: z.string().optional().describe('Network name (e.g. mainnet, goerli, sepolia)')
    },
    async ({ contractAddress, abi, method, args, network }: CallContractParams) => {
      try {
        let parsedAbi;
        try {
          parsedAbi = JSON.parse(abi);
        } catch (e) {
          throw new Error('Invalid ABI JSON');
        }
        
        let parsedArgs: any[] = [];
        if (args) {
          try {
            parsedArgs = JSON.parse(args);
            if (!Array.isArray(parsedArgs)) {
              throw new Error('Method arguments must be an array');
            }
          } catch (e) {
            throw new Error('Invalid method arguments JSON');
          }
        }
        
        const result = await ethereum.callContractMethod(
          contractAddress,
          parsedAbi,
          method,
          parsedArgs,
          network || config.infura.defaultNetwork
        );
        
        // Format the result
        let formattedResult;
        if (typeof result === 'object' && result !== null) {
          // Handle BigInts or other objects
          formattedResult = JSON.stringify(result, (_, value) => 
            typeof value === 'bigint' ? value.toString() : value
          );
        } else {
          formattedResult = String(result);
        }
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              contractAddress,
              method,
              result: formattedResult,
              network: network || config.infura.defaultNetwork
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error calling contract method: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Execute contract (write)
  server.tool(
    'execute-contract',
    'Execute a contract method (write)',
    {
      fromAddress: z.string().describe('Your wallet address'),
      contractAddress: z.string().describe('Contract address'),
      abi: z.string().describe('Contract ABI (JSON)'),
      method: z.string().describe('Method name'),
      args: z.string().optional().describe('Method arguments as JSON array'),
      network: z.string().optional().describe('Network name (e.g. mainnet, goerli, sepolia)')
    },
    async ({ fromAddress, contractAddress, abi, method, args, network }: ExecuteContractParams) => {
      try {
        let parsedAbi;
        try {
          parsedAbi = JSON.parse(abi);
        } catch (e) {
          throw new Error('Invalid ABI JSON');
        }
        
        let parsedArgs: any[] = [];
        if (args) {
          try {
            parsedArgs = JSON.parse(args);
            if (!Array.isArray(parsedArgs)) {
              throw new Error('Method arguments must be an array');
            }
          } catch (e) {
            throw new Error('Invalid method arguments JSON');
          }
        }
        
        const result = await ethereum.executeContractMethod(
          fromAddress,
          contractAddress,
          parsedAbi,
          method,
          parsedArgs,
          network || config.infura.defaultNetwork
        );
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              message: `Successfully executed ${method} on contract ${contractAddress}`,
              transaction: result.hash,
              explorer: result.explorer,
              network: network || config.infura.defaultNetwork
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error executing contract method: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Start the server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MCP EVM Signer server running');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});