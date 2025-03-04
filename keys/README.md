# Private Keys Storage

This directory is used to store your private keys. The files in this directory are gitignored by default.

Each key is stored in a separate JSON file with the following format:

```json
{
  "address": "0x...",
  "privateKey": "0x...",
  "encrypted": false,
  "encryptedData": null
}
```

If encryption is enabled (ENCRYPT_KEYS=true in .env), the `privateKey` field will be empty and the `encrypted` field will be true. The encrypted key will be stored in the `encryptedData` field.

## Security Warning

Do NOT commit your private key files to a public repository!