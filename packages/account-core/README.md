# @sophon-labs/account-core

Core functionality for the Sophon Account SDK, providing essential wallet and configuration utilities.

## Features

- Wallet client creation and management
- Network configuration (mainnet and testnet)
- Type definitions for wallet interfaces
- Ethereum and ZKsync wallet support

## Installation

```bash
npm install @sophon-labs/account-core
# or
yarn add @sophon-labs/account-core
```

## Usage

```typescript
import {
  SophonWallet,
  SophonTestnetWallet,
  WalletConfig,
  WalletTestnetConfig,
} from "@sophon-labs/account-core";

// Use mainnet wallet
const wallet = SophonWallet;

// Use testnet wallet
const testnetWallet = SophonTestnetWallet;

// Access configuration
const config = WalletConfig;
const testnetConfig = WalletTestnetConfig;
```

## API Reference

### Wallet Clients

- `SophonWallet`: Mainnet wallet client
- `SophonTestnetWallet`: Testnet wallet client

### Configuration

- `WalletConfig`: Mainnet configuration
- `WalletTestnetConfig`: Testnet configuration

### Type Guards

- `isEthereumWallet`: Type guard for Ethereum wallets
- `isZKsyncConnector`: Type guard for ZKsync connectors

## Dependencies

- @dynamic-labs/ethereum
- @dynamic-labs/ethereum-aa
- @dynamic-labs/ethereum-aa-zksync
- @dynamic-labs/global-wallet-client
