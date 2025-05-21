import type { NextPage } from "next";
import Link from "next/link";
import { ConnectKitButton, useModal } from "connectkit";
import { useEffect, useState } from "react";
import { useAccount, useSendTransaction, useSignMessage } from "wagmi";
import { parseEther } from "viem";

import { BlueLink, Button, SendTransactionModal, SignMessageModal } from "./components";

const MainCard: NextPage = () => {
  const { setOpen } = useModal();
  const { address, isConnected } = useAccount();
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [signedMessage, setSignedMessage] = useState<string | undefined>();
  const [signError, setSignError] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const { data: signMessageData, error: signErrorWagmi, signMessage } = useSignMessage();
  const { data: transactionData, error: txErrorWagmi, sendTransaction } = useSendTransaction();

  useEffect(() => {
    if (signMessageData) {
      setSignedMessage(signMessageData as string);
    }
    if (signErrorWagmi) {
      setSignError(signErrorWagmi.message);
    }
  }, [signMessageData, signErrorWagmi]);

  useEffect(() => {
    if (transactionData) {
      setTxHash(transactionData as string);
    }
    if (txErrorWagmi) {
      setTxError(txErrorWagmi.message);
    }
  }, [transactionData, txErrorWagmi]);

  const handleSendTransaction = (to: string, amount: string) => {
    setTxHash(undefined);
    setTxError(undefined);
    sendTransaction({
      to: to as `0x${string}`,
      value: parseEther(amount),
      data: "0x",
    });
  };

  const handleSignMessage = (message: string) => {
    setSignedMessage(undefined);
    setSignError(undefined);
    signMessage({
      message,
    });
  };

  return (
    <div className="w-1/3 relative shadow-[0px_2px_24px_rgba(15,_14,_13,_0.04),_0px_12px_36px_rgba(15,_14,_13,_0.04),_0px_0px_0px_1px_rgba(15,_14,_13,_0.08)_inset,_0px_1px_0px_rgba(15,_14,_13,_0.08)_inset] rounded-3xl bg-white overflow-hidden flex flex-col items-start justify-start p-[3rem] box-border gap-[3rem] text-center text-[1.25rem] text-gray-100 font-inter">
      {isConnected && (
        <div className="self-stretch flex flex-col items-center justify-start gap-[1.5rem]">
          <div className="self-stretch flex flex-col items-start justify-start gap-[0.25rem]">
            <b className="self-stretch relative leading-[1.75rem] text-gray-100">
              Connected to Sophon Global Wallet
            </b>
          </div>
          <ConnectKitButton />
          <BlueLink
            href={`https://explorer.testnet.sophon.xyz/address/${address}`}
            LinkComponent={Link}
          >
            View on Explorer
          </BlueLink>
        </div>
      )}
      <div className="self-stretch flex flex-row items-center justify-center gap-[1.5rem] text-left text-[1rem] text-darkslateblue">
        <Button variant="primary" onClick={() => setOpen(true)}>
          {isConnected ? "Open Wallet" : "Connect"}
        </Button>
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          Send Transaction
        </Button>
        <Button variant="secondary" onClick={() => setShowMessageModal(true)}>
          Sign Message
        </Button>
      </div>
      <SendTransactionModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setTxHash(undefined);
          setTxError(undefined);
        }}
        onSubmit={handleSendTransaction}
        txHash={txHash}
        error={txError}
        ResultComponent={
          <BlueLink href={`https://explorer.testnet.sophon.xyz/tx/${txHash}`} LinkComponent={Link}>
            {txHash}
          </BlueLink>
        }
      />
      <SignMessageModal
        open={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setSignedMessage(undefined);
          setSignError(undefined);
        }}
        onSubmit={handleSignMessage}
        signature={signedMessage}
        error={signError}
      />
    </div>
  );
};

export default MainCard;
