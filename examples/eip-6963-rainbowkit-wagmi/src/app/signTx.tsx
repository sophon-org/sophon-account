import * as React from "react";
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";

export function SignTransaction() {
  const [copied, setCopied] = React.useState<"address" | "transaction" | null>(
    null,
  );
  const {
    data: transactionData,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  const copyToClipboard = async (
    text: string,
    type: "address" | "transaction",
  ) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          const amount = formData.get("amount") as string;
          const destination = formData.get("destination") as string;

          if (
            !destination ||
            isNaN(parseFloat(amount)) ||
            parseFloat(amount) <= 0
          ) {
            alert("Please enter a valid address and amount.");
            return;
          }

          sendTransaction({
            to: destination as `0x${string}`,
            value: parseEther(amount),
            data: "0x",
          });
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "24px",
          border: "1px solid #e1e1e1",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: transactionData ? "20px" : "0",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <label
            htmlFor="amount"
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Enter Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            placeholder="Enter amount..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              transition: "border-color 0.2s",
            }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label
            htmlFor="destination"
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Enter Destination Address
          </label>
          <input
            id="destination"
            name="destination"
            type="text"
            placeholder="Enter destination address..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              transition: "border-color 0.2s",
            }}
          />
        </div>

        <button
          disabled={isPending}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: isPending ? "#94a3b8" : "#3b82f6",
            color: "white",
            cursor: isPending ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "16px",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {isPending ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                }}
              >
                ⚡
              </span>
              Waiting for wallet...
            </>
          ) : (
            "Send Transaction"
          )}
        </button>

        {error && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              marginTop: "16px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span>
            {error.message}
          </div>
        )}
      </form>

      {transactionData && (
        <div
          style={{
            padding: "24px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: "#334155" }}>Transaction Hash</strong>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(transactionData, "transaction");
                }}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {copied === "transaction" ? "Copied! ✓" : "Copy"}
              </button>
            </div>
            <div
              style={{
                padding: "8px",
                backgroundColor: "white",
                borderRadius: "4px",
                fontSize: "14px",
                wordBreak: "break-all",
                fontFamily: "monospace",
              }}
            >
              {transactionData}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
