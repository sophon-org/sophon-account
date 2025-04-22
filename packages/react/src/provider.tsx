import {
  DynamicContextProvider,
  DynamicEventsCallbacks,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZKsyncSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { JSX } from "react";
import { WalletConfig, WalletTestnetConfig } from "@sophon-labs/wallet";
import { PartnerGate } from "./partner-gate";

interface Props {
  children: React.ReactNode;
  partnerId: string;
  cssOverrides?: string | JSX.Element;
  debugError?: boolean;
  events?: DynamicEventsCallbacks;
  logLevel?: "DEBUG" | "INFO" | "WARN" | "ERROR" | "MUTE";
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  redirectUrl?: string;
  onboardingImageUrl?: string;
  sandboxDisabled?: boolean;
  theme?: "light" | "dark" | "auto";
}

export const SophonContextProvider = ({
  partnerId,
  children,
  cssOverrides,
  debugError,
  logLevel,
  events,
  privacyPolicyUrl,
  termsOfServiceUrl,
  redirectUrl,
  onboardingImageUrl,
  sandboxDisabled,
  theme,
}: Props) => {
  const sophonOverrides = `
  ${cssOverrides ?? ""} 

  .dynamic-footer {
    display: none;
  } 

  .dynamic-widget-wallet-header__wallet-info {
    padding-bottom: 0px !important;
  }
  .dynamic-widget-wallet-header__wallet-actions {
    display: none;
  }

  .account-and-security-settings-view__delete-account-container, .settings-view__delete-account-container {
    display: none !important;
  }
  `;

  return (
    <DynamicContextProvider
      theme={theme ?? "auto"}
      settings={{
        debugError,
        logLevel,
        events,
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
        customTermsOfServices: (
          <a
            className="powered-by-dynamic powered-by-dynamic--center"
            href="https://sophon.xyz"
            style={{
              marginTop: "8px",
            }}
          >
            <span className="typography typography--body-mini typography--regular typography--tertiary  powered-by-dynamic__text">
              Powered by <b>Sophon</b>
            </span>
          </a>
        ),
      }}
    >
      <PartnerGate partnerId={partnerId} sandboxDisabled={!!sandboxDisabled}>
        {children}
      </PartnerGate>
    </DynamicContextProvider>
  );
};
