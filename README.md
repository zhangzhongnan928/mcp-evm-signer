# MCP EVM Signer

A Model Context Protocol (MCP) server for managing Ethereum private keys and deploying smart contracts using Infura. This server enables Claude for Desktop and other MCP clients to interact with EVM-compatible blockchains.

## Features

- Securely store and manage Ethereum private keys locally
- Connect to Infura for blockchain interactions
- Deploy smart contracts from Solidity source
- Sign and send transactions
- View account balances and transaction history
- Query blockchain data

## Installation

1. Clone the repository:

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

4. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file to add your Infura API key and configure other settings.

## Usage with Claude for Desktop

1. Add the server to your Claude for Desktop configuration:

```json
{
  "mcpServers": {
    "evm-signer": {
      "command": "node",
      "args": ["/path/to/mcp-evm-signer/build/index.js"]
    }
  }
}
```

2. Restart Claude for Desktop

3. You can now ask Claude to deploy smart contracts, check balances, or interact with EVM blockchains

## Available Tools

- `create-wallet`: Create a new Ethereum wallet
- `import-wallet`: Import an existing wallet from a private key
- `check-balance`: Check the ETH balance of an address
- `get-transactions`: Get recent transactions for an address
- `deploy-contract`: Deploy a smart contract from Solidity source code
- `send-transaction`: Send ETH to an address
- `call-contract`: Call a smart contract method

## Security Notes

- Private keys are stored locally on your machine
- Keys can be encrypted with a password
- The server only exposes functionality through the MCP protocol
- Always review transactions before approving them

## License

MIT