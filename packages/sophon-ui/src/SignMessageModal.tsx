import React, { useState } from "react";
import Button from "./Button";

interface SignMessageModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  title?: string;
  buttonLabel?: string;
  signature?: string;
  error?: string;
}

const SignMessageModal: React.FC<SignMessageModalProps> = ({
  open,
  onClose,
  onSubmit,
  title = "Sign Message",
  buttonLabel = "Sign",
  signature,
  error,
}) => {
  const [message, setMessage] = useState("");

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
        <b className="text-lg mb-2">{title}</b>
        <form
          className="gap-4 w-full flex flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(message);
          }}
        >
          <textarea
            className="w-full rounded-lg border border-gray-200 p-2 text-base min-h-[100px]"
            placeholder="Enter message to sign"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button variant="primary" onClick={() => onSubmit(message)}>
            {buttonLabel}
          </Button>
        </form>
        {signature && (
          <div className="w-full mt-4 p-2 rounded bg-white text-sophon-blue-400 break-all text-left border border-gray-200">
            <div className="font-semibold mb-1">Signature:</div>
            <code className="block">{signature}</code>
          </div>
        )}
        {error && (
          <div className="w-full mt-4 p-2 rounded bg-red-50 text-red-700 break-all text-left">
            <div className="font-semibold mb-1">Error:</div>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignMessageModal;
