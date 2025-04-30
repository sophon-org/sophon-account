# @sophon-labs/account-wagmi

Wagmi integration for Sophon Account, providing a connector for seamless wallet integration with wagmi.

## Features

- Wagmi connector for Sophon Account
- Seamless integration with wagmi and RainbowKit
- Support for both mainnet and testnet

## Installation

```bash
npm install @sophon-labs/account-wagmi
# or
yarn add @sophon-labs/account-wagmi
```

## Usage

```typescript
import { SophonWagmiConnector } from '@sophon-labs/account-wagmi';
import { WagmiProvider } from 'wagmi';

function App() {
  return (
    <WagmiProvider config={config}>
      <SophonWagmiConnector>
        <YourApp />
      </SophonWagmiConnector>
    </WagmiProvider>
  );
}
```

## Components

- `SophonWagmiConnector`: Wagmi connector component for Sophon Account

## Dependencies

- React (>=19.1.0)
- wagmi
- @dynamic-labs/wagmi-connector
