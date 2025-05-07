import * as React from "react";
import { useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";

export function SignMessage() {
  const [recoveredAddress, setRecoveredAddress] = React.useState<string>();
  const [copied, setCopied] = React.useState<"address" | "signature" | null>(
    null,
  );
  const {
    data: signMessageData,
    error,
    isPending,
    signMessage,
    variables,
  } = useSignMessage();

  React.useEffect(() => {
    (async () => {
      if (variables?.message && signMessageData) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData,
        });
        setRecoveredAddress(recoveredAddress);
      }
    })();
  }, [signMessageData, variables?.message]);

  const copyToClipboard = async (
    text: string,
    type: "address" | "signature",
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
          const message = formData.get("message") as string;
          signMessage({ message });
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
          marginBottom: signMessageData ? "20px" : "0",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <label
            htmlFor="message"
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Enter a message to sign
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Type your message here..."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              resize: "vertical",
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
            "Sign Message"
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

      {signMessageData && (
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
              <strong style={{ color: "#334155" }}>Recovered Address</strong>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(recoveredAddress || "", "address");
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
                {copied === "address" ? "Copied! ✓" : "Copy"}
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
              {recoveredAddress}
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: "#334155" }}>Signature</strong>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(signMessageData, "signature");
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
                {copied === "signature" ? "Copied! ✓" : "Copy"}
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
              {signMessageData}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
