import React, { useCallback } from "react";
import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
  toHex,
} from "viem";
import { sophonTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { erc7739Actions } from "viem/experimental";
import { getEip712Domain } from "viem/actions";

export function VerifySignature() {
  const [copied, setCopied] = React.useState<
    "address" | "transaction" | "signature" | null
  >(null);
  const [isSignPending, setIsSignPending] = React.useState<boolean>(false);
  const [signError, setSignError] = React.useState<Error | null>(null);
  const [signature, setSignature] = React.useState<string | null>(null);
  const [verificationResult, setVerificationResult] = React.useState<
    boolean | null
  >(null);
  const { address } = useAccount();

  const publicClient = createPublicClient({
    chain: sophonTestnet,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: sophonTestnet,
    transport: custom(window.ethereum!),
  }).extend(erc7739Actions());

  const useSignMessage = useCallback(
    async (message: string) => {
      if (!address) {
        setSignError(new Error("Please connect your wallet"));
        alert("Please connect your wallet");
        return;
      }
      setIsSignPending(true);
      try {
        const signature = await walletClient.signMessage({
          message: message,
          account: address,
        });
        setIsSignPending(false);
        setSignature(signature);
        return signature;
      } catch (error) {
        console.error("Sign error:", error);
        setSignError(error as Error);
        setIsSignPending(false);
        return undefined;
      }
    },
    [address],
  );

  const copyToClipboard = async (
    text: string,
    type: "address" | "transaction" | "signature",
  ) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const verifySignature = async (
    address: string,
    message: string,
    signature: string,
  ) => {
    try {
      const result = await publicClient.verifyMessage({
        address: address as `0x${string}`,
        message: { raw: toHex(message) },
        signature: signature as `0x${string}`,
      });
      console.log("result", result);
      setVerificationResult(result);
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult(false);
    }
  };

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        gap: "20px",
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          const message = formData.get("message") as string;
          if (!address) {
            alert("Please connect your wallet");
            return;
          }
          useSignMessage(message);
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
          width: "45%",
          flex: "1",
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}
        >
          Sign Message
        </h2>
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
            Enter Message to Sign
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter message to sign..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              minHeight: "100px",
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSignPending}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: isSignPending ? "#94a3b8" : "#3b82f6",
            color: "white",
            cursor: isSignPending ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {isSignPending ? "Signing..." : "Sign Message"}
        </button>

        {signError && (
          <div
            style={{
              color: "#dc2626",
              padding: "12px",
              backgroundColor: "#fee2e2",
              borderRadius: "8px",
            }}
          >
            {signError.message}
          </div>
        )}

        {signature && (
          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <strong>Signature</strong>
              <button
                onClick={() => copyToClipboard(signature, "signature")}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                {copied === "signature" ? "Copied! ✓" : "Copy"}
              </button>
            </div>
            <div
              style={{
                padding: "8px",
                backgroundColor: "#f8fafc",
                borderRadius: "4px",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {signature}
            </div>
          </div>
        )}
      </form>
      {/* Verify Message Section */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          const address = formData.get("verify-address") as string;
          const message = formData.get("verify-message") as string;
          const signature = formData.get("verify-signature") as string;
          verifySignature(address, message, signature);
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
          width: "45%",
          flex: "1",
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}
        >
          Verify Message
        </h2>
        <div style={{ marginBottom: "8px" }}>
          <label
            htmlFor="verify-address"
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Signer Address
          </label>
          <input
            id="verify-address"
            name="verify-address"
            type="text"
            placeholder="Enter signer address..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label
            htmlFor="verify-message"
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Original Message
          </label>
          <textarea
            id="verify-message"
            name="verify-message"
            placeholder="Enter original message..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              minHeight: "100px",
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label
            htmlFor="verify-signature"
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Signature
          </label>
          <input
            id="verify-signature"
            name="verify-signature"
            type="text"
            placeholder="Enter signature..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#3b82f6",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Verify Signature
        </button>

        {verificationResult !== null && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: verificationResult ? "#dcfce7" : "#fee2e2",
              color: verificationResult ? "#166534" : "#dc2626",
              marginTop: "16px",
            }}
          >
            {verificationResult
              ? "✓ Signature is valid"
              : "✗ Signature is invalid"}
          </div>
        )}
      </form>
    </div>
  );
}
