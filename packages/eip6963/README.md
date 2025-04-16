<p align="center">
    <img width="200" src="https://portal.sophon.xyz/img/logo-sophon.svg" alt="Sophon Logo">
</p>

# Sophon Account SDK - EIP6963

Implementation of the EIP-6963 standard (Multi Injected Provider Discovery) for Sophon wallet. This enables applications to discover the Sophon wallet alongside other wallets in a standardized way.

## Motivation

The Sophon SDK addresses several key challenges in blockchain application development:

1. **Seamless Wallet Integration**: Provides a standardized way to integrate with Sophon wallet without complex configuration
2. **EIP Standards Compliance**: Follows Ethereum Improvement Proposals (EIPs) to ensure compatibility with the ecosystem
3. **Multi-Wallet Support**: Implements EIP-6963 for better multi-wallet discovery and interaction
4. **Developer Experience**: Simplifies the wallet connection process to let developers focus on building their applications

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

To integrate the Sophon wallet with EIP-6963 support in your project:

```bash
# Using npm
npm install @sophon-labs/eip6963

# Using yarn
yarn add @sophon-labs/eip6963
```

## Using the EIP-6963 Package

EIP-6963 is a standard that allows multiple Ethereum wallet providers to be discovered on a web page without conflicting with each other, unlike the traditional `window.ethereum` approach.

### Basic Integration

1. Import and initialize the EIP-6963 emitter in your application entry point:

```javascript
import "@sophon-labs/eip6963/testnet";

// The Sophon wallet will now announce itself via the EIP-6963 protocol
// No additional setup is required
```

This will automatically:

- Register the Sophon wallet provider
- Announce it through the EIP-6963 events
- Make it available to EIP-6963 compatible applications

### Working with Wallet Connection Libraries

Most modern wallet connection libraries, like RainbowKit, wagmi, or Reown Appkit, support EIP-6963. Here's how to connect with wagmi:

```javascript
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sophonTestnet, sophon } from "wagmi/chains";
import "@sophon-labs/eip6963/testnet"; // Import to announce the Sophon provider

export const config = getDefaultConfig({
  appName: "Your Application",
  projectId: "YOUR_PROJECT_ID",
  chains: [sophon, sophonTestnet],
  ssr: true,
});
```

With this setup, the Sophon wallet will appear in the wallet selection UI provided by RainbowKit.

## Technical Details

### EIP-1193 Compliance

The Sophon wallet implements the Ethereum Provider JavaScript API (EIP-1193), which defines a standard interface for Ethereum providers. This ensures compatibility with existing tools and libraries in the Ethereum ecosystem.

### EIP-6963 Implementation

The `@sophon/eip6963` package implements the Multi Injected Provider Discovery specification, which:

1. Announces the Sophon wallet provider through window events
2. Provides wallet metadata (name, icon, RDNS identifier)
3. Returns a compliant EIP-1193 provider interface
4. Responds to provider discovery requests

## Examples

See the `examples/eip6963-rainbow-wagmi` and `examples/eip6963-appkit` directories for a complete example of integrating the Sophon wallet with RainbowKit and wagmi or AppKit.
