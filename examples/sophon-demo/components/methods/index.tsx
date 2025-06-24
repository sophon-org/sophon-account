import { useEffect, useState } from "react";
import "./index.module.css";
import { isEthereumWallet } from "@sophon-labs/account-core";
import {
  isZKsyncConnector,
  useIsLoggedIn,
  useSophonContext,
} from "@sophon-labs/account-react";

export default function ExampleMethods({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet, user } = useSophonContext();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState("");

  const safeStringify = (obj: unknown) => {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (_key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]";
          }
          seen.add(value);
        }
        return value;
      },
      2
    );
  };

  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [sdkHasLoaded, isLoggedIn, primaryWallet]);

  function clearResult() {
    setResult("");
  }

  function showUser() {
    setResult(safeStringify(user));
  }

  async function fetchPublicClient() {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    const publicClient = await primaryWallet.getPublicClient();
    setResult(safeStringify(publicClient));
  }

  async function fetchWalletClient() {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    const walletClient = await primaryWallet.getWalletClient();
    setResult(safeStringify(walletClient));
  }

  async function signEthereumMessage() {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    if (!isZKsyncConnector(primaryWallet.connector)) {
      const signature = await primaryWallet.signMessage("Hello World");
      if (signature) setResult(signature);
    } else {
      const ecdsaClient =
        primaryWallet.connector.getAccountAbstractionProvider();
      const signature = await ecdsaClient.signMessage({
        message: "Hello World!",
      });
      // ecdsaClient.sendTransaction({
      //   to: "0xe5b06bfd663C94005B8b159Cd320Fd7976549f9b",
      //   // data: "0x",
      //   value: 10,
      //   // data: signature,
      //   // paymasterActions: {
      //   //   type: "paymaster",
      //   //   paymaster: "0x0000000000000000000000000000000000000000",
      //   //   paymasterParams: {
      //   //     gasPrice: 1000000000,
      //   //   },
      //   // },
      // });
      setResult(signature);
    }
  }

  return (
    <>
      {!isLoading && (
        <div
          className="dynamic-methods"
          data-theme={isDarkMode ? "dark" : "light"}
        >
          <div className="methods-container">
            <button
              type="button"
              className="btn btn-primary"
              onClick={showUser}
            >
              Fetch User
            </button>
            {primaryWallet && isEthereumWallet(primaryWallet) && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={fetchPublicClient}
                >
                  Fetch Public Client
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={fetchWalletClient}
                >
                  Fetch Wallet Client
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={signEthereumMessage}
                >
                  Sign &quot;Hello World&quot; on Ethereum
                </button>
              </>
            )}
          </div>
          {result && (
            <div className="results-container">
              <pre className="results-text">
                {result &&
                  (typeof result === "string" && result.startsWith("{")
                    ? JSON.stringify(JSON.parse(result), null, 2)
                    : result)}
              </pre>
            </div>
          )}
          {result && (
            <div className="clear-container">
              <button
                type="button"
                className="btn btn-primary"
                onClick={clearResult}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
