import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZKsyncSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";

interface Props {
  children: React.ReactNode;
  partnerId: string;
  cssOverrides?: string;
}

export const SophonContextProvider = ({ children, cssOverrides }: Props) => {
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
      theme="auto"
      settings={{
        cssOverrides: sophonOverrides,
        environmentId: "a151466b-a170-4176-9536-b224269b8c00",
        walletConnectors: [
          EthereumWalletConnectors,
          ZKsyncSmartWalletConnectors,
        ],
        termsOfServiceUrl: "https://sophon.xyz/terms",
        privacyPolicyUrl: "https://sophon.xyz/privacy",
        customTermsOfServices: (
          <a
            className="powered-by-dynamic powered-by-dynamic--center"
            href="https://sophon.xyz/terms"
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
      {children}
    </DynamicContextProvider>
  );
};
