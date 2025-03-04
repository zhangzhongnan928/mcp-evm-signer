# Troubleshooting Guide

This guide helps you troubleshoot common issues when setting up and using the MCP EVM Signer.

## Build Issues

### Missing Dependencies

If you encounter errors related to missing dependencies, try:

```bash
# Clean your node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall dependencies
npm install
```

### TypeScript Errors

This project requires TypeScript 5.3.2 or higher. If you encounter type errors during building:

1. Make sure you have the correct TypeScript version:
   ```bash
   npm list typescript
   ```

2. If errors persist, check for compatibility issues with the ethers.js version:
   ```bash
   npm install ethers@6.9.0 --save-exact
   ```

### Build Command

The proper way to build the project:

```bash
npm run build
```

## Runtime Issues

### Server Connection Problems

If Claude for Desktop can't connect to the server:

1. Check that the path to the server is correct in your Claude for Desktop configuration
2. Make sure your `.env` file is set up with the correct Infura API key
3. Try running the server directly to see the output:
   ```bash
   node build/index.js
   ```

### Infura API Issues

If you encounter Infura API errors:

1. Verify your API key is correct in the `.env` file
2. Check your Infura dashboard to ensure your account is active
3. Verify the network name is correct (mainnet, goerli, sepolia, etc.)

### Wallet Access Issues

If you have problems accessing wallets:

1. Verify the wallets exist in the keys directory
2. If you're using encryption, ensure the KEY_PASSWORD is correct
3. Check file permissions on the keys directory

## Common Fixes

### Fix: Missing @modelcontextprotocol/sdk Module

If you encounter an error saying `Cannot find module '@modelcontextprotocol/sdk/server/mcp.js'`:

```bash
# Install the SDK explicitly
npm install @modelcontextprotocol/sdk@0.6.0
```

### Fix: Ethers.js Type Issues

If you have type issues with ethers.js:

1. Add type assertions where needed, as shown in the code
2. Ensure you're using a compatible TypeScript version

### Fix: Claude Desktop Configuration

If Claude for Desktop isn't recognizing your server, make sure your configuration looks like:

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

Ensure that the path to the server is absolute and correct for your system.

## Getting Help

If you're still having issues, you can:

1. Open an issue on the GitHub repository
2. Check the server logs for more detailed error information
3. Try running the server directly using Node.js to see any error output