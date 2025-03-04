# ERC-20 Token Example

This example shows how to deploy and interact with an ERC-20 token contract using the MCP EVM Signer and Claude for Desktop.

## Step 1: Create a new wallet

```
Could you create a new Ethereum wallet for me using the evm-signer tools?
```

Claude will use the `create-wallet` tool to generate a new wallet for you. Make sure to save the address and private key somewhere secure.

## Step 2: Get some test ETH

For Sepolia testnet:
1. Go to https://sepoliafaucet.com/ and follow the instructions
2. Request ETH for your new wallet address

## Step 3: Check your balance

```
Can you check the balance of my Ethereum wallet [YOUR_ADDRESS] on the Sepolia network?
```

Claude will use the `check-balance` tool to verify that you have received the test ETH.

## Step 4: Deploy an ERC-20 Token

```
I want to deploy an ERC-20 token on Sepolia testnet. Can you help me with this?

- Token Name: "MyToken"
- Token Symbol: "MTK"
- Total Supply: 1,000,000 tokens
- Use my wallet address: [YOUR_ADDRESS]
```

Claude will deploy the contract using the compiled ABI and bytecode through the `deploy-contract` tool. You'll receive the contract address when successful.

Here's the ABI and bytecode for a basic ERC-20 token you can use:

### ERC-20 Token ABI
```json
[
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

### ERC-20 Token Bytecode
```
0x60806040523480156200001157600080fd5b506040516200110838038062001108833981810160405281019062000037919062000363565b828281600390805190602001906200005192919062000201565b5080600490805190602001906200006a92919062000201565b5050506200009f336200008383620000e060201b62000a911790919060201c565b836200008f60201b62000a9f1790919060201c565b6200009d60201b60201c565b505050620004ea565b6200009e3382620000ea565b50565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415620000dd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000d49062000409565b60405180910390fd5b620000e781600054620000e060201b60201c565b5050565b620000e78282620002e2565b6000818362000120919062000455565b905092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200019e57607f821691505b602082108103620001b457620001b362000156565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620002227fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000183565b6200022e868362000183565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006200027b6200027562000270846200024b565b62000253565b6200024b565b9050919050565b6000819050919050565b6200029783620002fa565b620002af620002a68262000282565b84845462000190565b825550505050565b600090565b620002c6620002b7565b620002d38184846200028c565b505050565b5b818110156200029f57620002fa600082620002bc565b600181019050620002d9565b5050565b60008162000310919062000314565b9050919050565b600062000322826200024b565b91506200032f836200024b565b9250826fffffffffffffffffffffffffffffffff0382111562000357576200035662000127565b5b828202905092915050565b6000806000606084860312156200037f576200037e620004e5565b5b600084015167ffffffffffffffff811115620003a0576200039f620004e0565b5b620003ae86828701620003db565b935050602084015167ffffffffffffffff811115620003d257620003d1620004e0565b5b620003e086828701620003db565b9250506040620003f386828701620004a6565b9150509250925092565b600082825260208201905092915050565b6000620004178262000489565b9150620004248362000489565b925082820390508181111562000440576200043f62000127565b5b92915050565b6000819050919050565b6000620004628262000446565b91506200046f8362000446565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200048f57620004a762000127565b5b828201905092915050565b6000819050919050565b600082825260208201905092915050565b6000620004af82620004c8565b9050919050565b6000620004c38262000446565b9050919050565b600062000fd7620004db8362000446565b9050919050565b600080fd565b600080fd565b6106dd80620004fa6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610422565b60405180910390f35b6100e660048036038101906100e19190610449565b610308565b6040516100f39190610547565b60405180910390f35b61010461032b565b6040516101119190610562565b60405180910390f35b610134600480360381019061012f919061057d565b610335565b6040516101419190610547565b60405180910390f35b610152610364565b60405161015f91906105ec565b60405180910390f35b610182600480360381019061017d9190610449565b61036d565b60405161018f9190610547565b60405180910390f35b6101b260048036038101906101ad9190610607565b6103a4565b6040516101bf9190610562565b60405180910390f35b6101d06103ec565b6040516101dd9190610422565b60405180910390f35b61020060048036038101906101fb9190610449565b61047e565b60405161020d9190610547565b60405180910390f35b610230600480360381019061022b9190610449565b6104f5565b60405161023d9190610547565b60405180910390f35b610260600480360381019061025b9190610634565b610518565b60405161026d9190610562565b60405180910390f35b60606003805461028590610687565b80601f01602080910402602001604051908101604052809291908181526020018280546102b190610687565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b6000806103138561059f565b905061032081858561056a565b600191505092915050565b6000600254905090565b600080610340856105a7565b905061034d858285610599565b61035885858561056a565b60019150509392505050565b60006012905090565b60008061037883610582565b90506103999185856103868589610518565b61039391906106e8565b61056a565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb90610687565b80601f016020809104026020016040519081016040528092919081815260200182805461042790610687565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b6000806104898361059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610762565b60405180910390fd5b6104e982868684036105fd565b60019250505092915050565b60008061050084610582565b905061050d8185856105fd565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60006105a98383610a9f565b905092915050565b600033905090565b600080600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508481101561067c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067390610793565b60405180910390fd5b6106898582866106a4565b61069683868686610a2b565b60019150509392505050565b6106b7836106b1848461080f565b610a91565b6106c08561059f565b6106ca858461059f565b6106d4828661059f565b60008086600086866106e69190610828565b9050806000819055505050505050565b600080831360005061072c84836106f886610582565b60016106ff565b91505061070a8661059f565b6107138361059f565b6107238387846107309190610828565b9150505b92915050565b600082825260208201905092915050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b600061074c602583610735565b915061075782610746565b604082019050919050565b6000602082019050818103600052815261077b8161073f565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b600061077d602883610735565b600081549050919050565b60008261081f57600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548290556108d7565b82600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5050505050565b6000819050919050565b600061089f8261089f565b9150610a8b8361080f565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610a2357610a8b817f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd565b508291505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610a9c57600080fd5b5050505050565b60008183610aa291906106e8565b905092915050565b600061080f82600054610a9191906106e8565b60008061059993846105958686610aa991906106e8565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000819050919050565b6000610abc82610ab3565b9150610ac783610ab3565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610afc57610afb610a8c565b5b82820190509291505056fea264697066735822122047efb6b7e95ca059d2cb61c4fa18dc6e7afd4fa7ed2f1a08d8f1d9ef2cd01c2364736f6c63430008090033
```

## Step 5: Check your token balance

```
Can you check my token balance for the contract we just deployed? The contract address is [CONTRACT_ADDRESS] and my wallet address is [YOUR_ADDRESS].
```

Claude will use the `call-contract` tool to call the `balanceOf` function on your token contract.

## Step 6: Transfer tokens to another address

```
I'd like to transfer 100 of my tokens to another address. Can you help me with that?

- My wallet address: [YOUR_ADDRESS]
- Token contract address: [CONTRACT_ADDRESS]
- Recipient address: [RECIPIENT_ADDRESS]
- Amount to transfer: 100 tokens
```

Claude will use the `execute-contract` tool to call the `transfer` function on your token contract.

## Step 7: Check the recipient's balance

```
Can you now check the token balance of the recipient at [RECIPIENT_ADDRESS] for our token contract at [CONTRACT_ADDRESS]?
```

Claude will use the `call-contract` tool again to verify that the transfer was successful.
