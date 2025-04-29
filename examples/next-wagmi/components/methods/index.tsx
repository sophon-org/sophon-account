import { useState, useEffect } from "react";
import "./index.module.css";
import { useSophonContext, useIsLoggedIn } from "@sophon-labs/account-react";
import { isEthereumWallet, isZKsyncConnector } from "@sophon-labs/account-core";
import styles from "./index.module.css";
import { parseEther, formatEther } from "viem";
import { eip712WalletActions, getGeneralPaymasterInput } from "viem/zksync";

export default function ExampleMethods({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet, user } = useSophonContext();

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState("");
  const [balance, setBalance] = useState<string>("0");

  const safeStringify = (obj: unknown) => {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]";
          }
          seen.add(value);
        }
        return value;
      },
      2,
    );
  };

  useEffect(() => {
    async function getBalance() {
      if (primaryWallet && isEthereumWallet(primaryWallet)) {
        try {
          const publicClient = await primaryWallet.getPublicClient();
          const address = primaryWallet.address as `0x${string}`;
          const balance = await publicClient.getBalance({ address });
          setBalance(formatEther(balance));
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance("0");
        }
      }
    }
    getBalance();
  }, [primaryWallet]);

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
      setResult(signature!);
    } else {
      const ecdsaClient =
        primaryWallet.connector.getAccountAbstractionProvider();
      const signature = await ecdsaClient.signMessage({
        message: "Hello World!",
      });
      setResult(signature);
    }
  }

  async function sendSoph(to: string, amount: number) {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    try {
      const publicClient = await primaryWallet.getPublicClient();
      const walletClient = await primaryWallet.getWalletClient();

      const chain = await primaryWallet.getNetwork();

      const transaction = {
        to: to as `0x${string}`,
        value: parseEther(amount.toString()),
        paymaster: `0x98546B226dbbA8230cf620635a1e4ab01F6A99B2`,
        paymasterInput: getGeneralPaymasterInput({
          innerInput: `0x`,
        }),
        data: `0x` as `0x${string}`,
      };

      const hash = await walletClient
        .extend(eip712WalletActions())
        .sendTransaction(transaction);

      console.log(hash);

      const receipt = await publicClient.getTransactionReceipt({
        hash,
      });

      console.log(receipt);
      setResult(`Transaction sent: ${hash}`);
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult(`Error: ${String(error)}`);
      }
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    <div
      className={styles.methodsContainer}
      data-theme={isDarkMode ? "dark" : "light"}
    >
      <div className={styles.methodsGrid}>
        <button className={styles.methodButton} onClick={showUser}>
          Fetch User
        </button>

        {primaryWallet && isEthereumWallet(primaryWallet) && (
          <>
            <div className={styles.balanceDisplay}>
              Your Balance: {balance} SOPH
            </div>
            <button className={styles.methodButton} onClick={fetchPublicClient}>
              Fetch Public Client
            </button>
            <button className={styles.methodButton} onClick={fetchWalletClient}>
              Fetch Wallet Client
            </button>
            <button
              className={styles.methodButton}
              onClick={signEthereumMessage}
            >
              Sign "Hello World" on Ethereum
            </button>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

                const formData = new FormData(e.target as HTMLFormElement);
                const toAddress = formData.get("toAddress") as string;
                const amount = parseFloat(formData.get("amount") as string);

                if (!toAddress || isNaN(amount) || amount <= 0) {
                  alert("Please enter a valid address and amount.");
                  return;
                }

                await sendSoph(toAddress, amount);
              }}
            >
              <div
                className={styles.inputGroup}
                style={{ minWidth: "inherit", width: "100%" }}
              >
                <input
                  type="text"
                  name="toAddress"
                  placeholder="Destination Address"
                  required
                  className={styles.methodInput}
                />
              </div>
              <div
                className={styles.inputGroup}
                style={{ minWidth: "inherit", width: "100%" }}
              >
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount in ETH"
                  step="0.01"
                  min="0"
                  required
                  className={styles.methodInput}
                />
              </div>
              <button type="submit" className={styles.methodButton}>
                Send ETH
              </button>
            </form>
          </>
        )}
      </div>

      {result && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <h3>Result</h3>
            <button className={styles.clearButton} onClick={clearResult}>
              Clear
            </button>
          </div>
          <pre className={styles.resultContent}>
            {typeof result === "string" && result.startsWith("{")
              ? JSON.stringify(JSON.parse(result), null, 2)
              : result}
          </pre>
        </div>
      )}
    </div>
  );
}
