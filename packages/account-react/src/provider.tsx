import {
  DynamicContextProvider,
  DynamicContextProps,
  DynamicEventsCallbacks,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZKsyncSmartWalletConnectors } from "@dynamic-labs/ethereum-aa-zksync";
import { WalletConfig, WalletTestnetConfig } from "@sophon-labs/account-core";
import { PartnerGate } from "./partner-gate";
import { cssOverrides, hideWalletOperationsStyle } from "./cssOverrides";

export type CustomViewsType =
  DynamicContextProps["settings"]["overrides"]["views"];

interface Props {
  children: React.ReactNode;
  partnerId: string;
  debugError?: boolean;
  events?: DynamicEventsCallbacks;
  logLevel?: "DEBUG" | "INFO" | "WARN" | "ERROR" | "MUTE";
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  redirectUrl?: string;
  onboardingImageUrl?: string;
  sandboxDisabled?: boolean;
  views?: CustomViewsType;
  displayWalletOperations?: boolean;
  customAuthUrl?: string;
}

export const SophonContextProvider = ({
  partnerId,
  children,
  debugError,
  logLevel,
  events,
  privacyPolicyUrl,
  termsOfServiceUrl,
  redirectUrl,
  onboardingImageUrl,
  sandboxDisabled,
  views,
  displayWalletOperations,
  customAuthUrl,
}: Props) => {
  const sophonOverrides = `
  ${cssOverrides} 

  ${!displayWalletOperations ? hideWalletOperationsStyle : ""}
  `;

  return (
    <DynamicContextProvider
      theme={"light"}
      settings={{
        apiBaseUrl: customAuthUrl,
        debugError,
        logLevel,
        events,
        overrides: {
          views: views ?? [],
        },
        redirectUrl,
        onboardingImageUrl,
        cssOverrides: sophonOverrides,
        environmentId: sandboxDisabled
          ? WalletConfig.environmentId
          : WalletTestnetConfig.environmentId,
        initialAuthenticationMode: "connect-and-sign",
        walletConnectors: [
          EthereumWalletConnectors,
          ZKsyncSmartWalletConnectors,
        ],
        termsOfServiceUrl: termsOfServiceUrl ?? "https://sophon.xyz/terms",
        privacyPolicyUrl: privacyPolicyUrl ?? "https://sophon.xyz/privacy",
      }}
    >
      <PartnerGate partnerId={partnerId} sandboxDisabled={!!sandboxDisabled}>
        {children}
      </PartnerGate>
    </DynamicContextProvider>
  );
};
