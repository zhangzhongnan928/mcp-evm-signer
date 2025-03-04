import fetch from 'node-fetch';

// Interface for the compiler API response
interface CompilerOutput {
  errors?: {
    type: string;
    severity: string;
    message: string;
  }[];
  contracts?: {
    [fileName: string]: {
      [contractName: string]: {
        abi: any[];
        evm: {
          bytecode: {
            object: string;
          };
        };
      };
    };
  };
}

/**
 * Compile Solidity source code using a public API
 * (This uses a public endpoint but in production you might want to use a local solc compiler)
 */
export async function compileSolidity(
  source: string,
  contractName: string = 'Contract'
): Promise<{ abi: any[]; bytecode: string }> {
  // Prepare the JSON for the API request
  const input = {
    language: 'Solidity',
    sources: {
      'main.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };

  // Make a request to the Solidity compiler API
  const response = await fetch('https://solc-bin.ethereum.org/api/compiler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Compilation failed: ${response.statusText}`);
  }

  const output: CompilerOutput = await response.json();

  // Check for compilation errors
  if (output.errors) {
    const errorMessages = output.errors
      .filter(error => error.severity === 'error')
      .map(error => error.message)
      .join('\n');

    if (errorMessages) {
      throw new Error(`Compilation errors:\n${errorMessages}`);
    }
  }

  // Find the contract in the output
  if (!output.contracts || !output.contracts['main.sol']) {
    throw new Error('Compilation succeeded but no contracts found');
  }

  // If the contract name is not specified, take the first contract
  const contracts = output.contracts['main.sol'];
  const contractKeys = Object.keys(contracts);
  
  if (contractKeys.length === 0) {
    throw new Error('No contracts found in the compiled output');
  }

  // Try to find the named contract, or use the first one
  const compiledContract = contracts[contractName] || contracts[contractKeys[0]];

  if (!compiledContract) {
    throw new Error(`Contract '${contractName}' not found in compilation output`);
  }

  return {
    abi: compiledContract.abi,
    bytecode: compiledContract.evm.bytecode.object,
  };
}

/**
 * Extract function arguments from ABI and contract deployment parameters
 */
export function parseConstructorArgs(abi: any[], args: string): any[] {
  // Find the constructor in the ABI
  const constructor = abi.find(item => item.type === 'constructor');
  
  if (!constructor || !constructor.inputs || constructor.inputs.length === 0) {
    // No constructor arguments needed
    return [];
  }
  
  // Parse the arguments string as JSON
  try {
    return JSON.parse(args);
  } catch (error) {
    throw new Error('Failed to parse constructor arguments. Must be a valid JSON array.');
  }
}