import type React from "react";
import { useState } from "react";
import Button from "./Button";

interface SendTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (address: string, amount: string) => void;
  ResultComponent: React.ReactNode;
  txHash?: string;
  error?: string;
}

const SendTransactionModal: React.FC<SendTransactionModalProps> = ({
  open,
  onClose,
  onSubmit,
  ResultComponent,
  txHash,
  error,
}) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-2xl"></div>
      <div className="relative z-10 w-[400px] shadow-[0px_2px_24px_rgba(15,_14,_13,_0.04),_0px_12px_36px_rgba(15,_14,_13,_0.04),_0px_0px_0px_1px_rgba(15,_14,_13,_0.08)_inset,_0px_1px_0px_rgba(15,_14,_13,_0.08)_inset] rounded-3xl bg-white overflow-hidden flex flex-col items-center justify-start p-[2rem] box-border gap-[2rem] text-center text-[1.1rem] text-gray-100 font-inter">
        <button
          type="button"
          className="absolute top-4 right-4 text-dimgray hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <b className="text-lg mb-2">Send Transaction</b>
        <form
          className="gap-4 w-full flex flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(address, amount);
          }}
        >
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-base"
            type="text"
            placeholder="Recipient Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-base"
            type="number"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            required
          />
          <Button variant="primary" onClick={() => onSubmit(address, amount)}>
            Send
          </Button>
        </form>
        {txHash && (
          <div className="w-full mt-4 p-2 rounded bg-white text-sophon-blue-400 break-all text-left border border-gray-200">
            <div className="font-semibold mb-1">Transaction Hash:</div>
            <code className="block">{ResultComponent}</code>
          </div>
        )}
        {error && (
          <div className="w-full mt-4 p-2 rounded bg-red-50 text-red-700 break-all text-left border border-gray-200">
            <div className="font-semibold mb-1">Error:</div>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendTransactionModal;
