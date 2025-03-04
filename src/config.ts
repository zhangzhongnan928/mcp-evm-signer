import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

// Load environment variables
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the configuration
export const config = {
  // Infura configuration
  infura: {
    apiKey: process.env.INFURA_API_KEY || '',
    defaultNetwork: process.env.DEFAULT_NETWORK || 'sepolia',
  },
  
  // Key storage configuration
  keys: {
    encrypt: process.env.ENCRYPT_KEYS === 'true',
    password: process.env.KEY_PASSWORD || '',
    path: process.env.KEYS_PATH || path.resolve(__dirname, '../keys'),
  },
};

// Ensure key storage directory exists
fs.ensureDirSync(config.keys.path);

// Validate critical configuration
if (!config.infura.apiKey) {
  console.error('ERROR: INFURA_API_KEY is not set in .env file');
  process.exit(1);
}

if (config.keys.encrypt && !config.keys.password) {
  console.error('ERROR: KEY_PASSWORD is required when ENCRYPT_KEYS=true');
  process.exit(1);
}

export default config;