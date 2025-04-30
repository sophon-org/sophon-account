# @sophon-labs/account-react

React components and hooks for integrating Sophon Account into React applications.

## Features

- React context provider for Sophon Account
- Custom hooks for wallet and authentication state
- UI components for wallet connection and user profile
- Formatters and utilities for common operations

## Installation

```bash
npm install @sophon-labs/account-react
# or
yarn add @sophon-labs/account-react
```

## Usage

```typescript
import { SophonContextProvider } from '@sophon-labs/account-react';

function App() {
  return (
    <SophonContextProvider partnerId="YOUR_PARTNER_ID">
      <YourApp />
    </SophonContextProvider>
  );
}
```

## Components

### Context Provider

- `SophonContextProvider`: Main provider component for Sophon Account integration

### UI Components

- `SophonConnectButton`: Button component for wallet connection
- `SophonUserProfile`: Component for displaying user profile information
- `SophonWidget`: Embedded wallet widget component

## Hooks

- `useSophonContext`: Access Sophon Account context
- `useRefreshUser`: Refresh user data
- `useReinitialize`: Reinitialize the wallet connection
- `useIsLoggedIn`: Check if user is logged in
- `useSophonEvents`: Access Sophon event handlers

## Utilities

- `shortenAddress`: Format Ethereum addresses for display
- `getStorageAuthToken`: Get authentication token from storage

## Dependencies

- React (>=19.1.0)
- viem (>=2.26.0)
- @sophon-labs/account-core
- @dynamic-labs/sdk-react-core
