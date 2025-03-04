# MCP EVM Signer Usage Guide

This guide explains how to use the MCP EVM Signer server with Claude for Desktop or other MCP clients.

## Setting Up

### Prerequisites

1. Node.js v16 or higher
2. An Infura account with API key
3. Claude for Desktop app installed

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/zhangzhongnan928/mcp-evm-signer.git
   cd mcp-evm-signer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file to add your Infura API key and configure other settings.

### Integrating with Claude for Desktop

Add the server to your Claude for Desktop configuration:

1. Open Claude for Desktop's configuration file:
   * **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   * **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the MCP EVM Signer server:
   ```json
   {
     "mcpServers": {
       "evm-signer": {
         "command": "node",
         "args": ["/absolute/path/to/mcp-evm-signer/build/index.js"],
         "env": {
           "INFURA_API_KEY": "your_infura_api_key_here",
           "DEFAULT_NETWORK": "sepolia",
           "ENCRYPT_KEYS": "true",
           "KEY_PASSWORD": "your_secure_password_here"
         }
       }
     }
   }
   ```

3. Restart Claude for Desktop

## Available Tools

### Wallet Management Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `create-wallet` | Create a new Ethereum wallet | None |
| `import-wallet` | Import an existing wallet from a private key | `privateKey`: Private key (with or without 0x prefix) |
| `list-wallets` | List all saved wallets | None |

### Blockchain Interaction Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `check-balance` | Check the ETH balance of an address | `address`: Ethereum address (0x format)<br>`network` (optional): Network name (mainnet, goerli, sepolia) |
| `get-transactions` | Get recent transactions for an address | `address`: Ethereum address (0x format)<br>`limit` (optional): Number of transactions to return<br>`network` (optional): Network name |
| `send-transaction` | Send ETH to an address | `fromAddress`: Your wallet address<br>`toAddress`: Recipient address<br>`amount`: Amount of ETH to send<br>`network` (optional): Network name |

### Smart Contract Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `deploy-contract` | Deploy a smart contract | `fromAddress`: Your wallet address<br>`abi`: Contract ABI (JSON)<br>`bytecode`: Contract bytecode<br>`constructorArgs` (optional): Constructor arguments as JSON array<br>`network` (optional): Network name |
| `call-contract` | Call a contract method (read-only) | `contractAddress`: Contract address<br>`abi`: Contract ABI (JSON)<br>`method`: Method name<br>`args` (optional): Method arguments as JSON array<br>`network` (optional): Network name |
| `execute-contract` | Execute a contract method (write) | `fromAddress`: Your wallet address<br>`contractAddress`: Contract address<br>`abi`: Contract ABI (JSON)<br>`method`: Method name<br>`args` (optional): Method arguments as JSON array<br>`network` (optional): Network name |

## Example Usage in Claude

### 1. Creating a Wallet

Ask Claude:
```
Could you create a new Ethereum wallet for me using the evm-signer tools?
```

### 2. Checking Balance

Ask Claude:
```
Can you check the balance of my Ethereum wallet 0x1234567890123456789012345678901234567890 on the Sepolia network?
```

### 3. Deploying a Contract

See the [ERC-20 token example](examples/erc20-token.md) for detailed instructions on deploying and interacting with smart contracts.

## Security Considerations

1. **Private Key Storage**: Private keys are stored locally in the `keys` directory. These files are gitignored, but make sure to:
   - Keep backups of your keys
   - Protect access to your computer
   - Use the encryption feature by setting `ENCRYPT_KEYS=true`

2. **User Approval**: Claude for Desktop will ask for your approval before executing any transaction or contract deployment.

3. **Testing First**: Always test on testnets (sepolia, goerli) before using on mainnet.

4. **Review Transactions**: Carefully review all transaction details before approving them.

## Troubleshooting

### Common Issues

1. **Connection Problems**:
   - Ensure Claude for Desktop is properly configured
   - Check that the path to the server in `claude_desktop_config.json` is correct
   - Make sure the server is built (`npm run build`)

2. **Transaction Failures**:
   - Check that you have enough ETH for gas fees
   - Verify that the Infura API key is valid
   - Make sure the network name is correct

3. **Private Key Issues**:
   - If using encryption, ensure the password is correct
   - Check that keys are properly saved in the keys directory

### Debugging

If you encounter issues, check the logs:

```bash
# Run the server directly for debugging
node build/index.js
```

Claude for Desktop logs can be found at:
- **macOS**: `~/Library/Logs/Claude`
- **Windows**: `%APPDATA%\Claude\logs`