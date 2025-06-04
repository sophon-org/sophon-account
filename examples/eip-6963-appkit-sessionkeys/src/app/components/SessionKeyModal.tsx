import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useAppKitAccount } from "@reown/appkit/react";

interface SessionKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (config: {
    signer: string;
    expiresAt: string;
    feeLimit: string;
    transferTarget: string;
    transferValue: string;
  }) => void;
  result?: React.ReactNode;
  error?: string;
}

const SessionKeyModal: React.FC<SessionKeyModalProps> = ({
  open,
  onClose,
  onSubmit,
  result,
  error,
}) => {
  const [signer, setSigner] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [feeLimit, setFeeLimit] = useState("");
  const [transferTarget, setTransferTarget] = useState("");
  const [transferValue, setTransferValue] = useState("");

  useEffect(() => {
    setSigner("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049");
    setTransferTarget("0x36615Cf349d7F6344891B1e7CA7C72883F5dc049");
    setTransferValue("10000000000000000000");
    setFeeLimit("10000000000000000000");
    setExpiresAt(new Date(Date.now() + 1000 * 2 * 60 * 60 * 24).toISOString().slice(0, 16)); // 2 days
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-2xl"></div>
      <div className="relative z-10 w-[400px] shadow-[0px_2px_24px_rgba(15,_14,_13,_0.04),_0px_12px_36px_rgba(15,_14,_13,_0.04),_0px_0px_0px_1px_rgba(15,_14,_13,_0.08)_inset,_0px_1px_0px_rgba(15,_14,_13,_0.08)_inset] rounded-3xl bg-white overflow-hidden flex flex-col items-center justify-start p-[2rem] box-border gap-[2rem] text-center text-[1.1rem] text-gray-100 font-inter">
        <button
          className="absolute top-4 right-4 text-dimgray hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <b className="text-lg mb-2">Create Session Key</b>
        <form
          className="gap-4 w-full flex flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-base"
            type="text"
            placeholder="Session Signer Address"
            value={signer}
            onChange={(e) => setSigner(e.target.value)}
            required
          />
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-base"
            type="datetime-local"
            placeholder="Expiration"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required
          />
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-base"
            type="number"
            placeholder="Fee Limit (wei)"
            value={feeLimit}
            onChange={(e) => setFeeLimit(e.target.value)}
            min="0"
            required
          />
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-base"
            type="text"
            placeholder="Transfer Policy Target Address"
            value={transferTarget}
            onChange={(e) => setTransferTarget(e.target.value)}
            required
          />
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-base"
            type="number"
            placeholder="Transfer Value (wei)"
            value={transferValue}
            onChange={(e) => setTransferValue(e.target.value)}
            min="0"
            required
          />
          <Button
            variant="primary"
            onClick={() => onSubmit({ signer, expiresAt, feeLimit, transferTarget, transferValue })}
          >
            Create Session Key
          </Button>
        </form>
        {result && (
          <div className="w-full mt-4 p-2 rounded bg-white text-sophon-blue-400 break-all text-left border border-gray-200">
            <div className="font-semibold mb-1">Result:</div>
            <code className="block">{result}</code>
          </div>
        )}
        {error && (
          <div className="w-full mt-4 p-2 rounded bg-red-50 text-red-700 break-all text-left border border-gray-200">
            <div className="font-semibold mb-1">Error:</div>
            <span>{String(error).slice(0, 100)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionKeyModal;
