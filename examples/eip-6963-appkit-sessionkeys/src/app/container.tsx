import type { NextPage } from "next";
import Link from "next/link";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import {
  useSendTransaction,
  useSignMessage,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { parseEther } from "viem";

import {
  BlueLink,
  Button,
  SendTransactionModal,
  SignMessageModal,
  SessionKeyModal,
} from "./components";
import {
  getInstallSessionKeyModuleTxForViem,
  getCreateSessionTxForViem,
  isSessionKeyModuleInstalled,
} from "@sophon-labs/account-core";
import { sophonTestnet } from "viem/chains";
import { SessionConfigWithId, OnChainSessionState, L2_GLOBAL_PAYMASTER, reviveBigInts } from "./util";

const MainCard: NextPage = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showBackendSignModal, setShowBackendSignModal] = useState(false);
  const [signedMessage, setSignedMessage] = useState<string | undefined>();
  const [signError, setSignError] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [sessionError, setSessionError] = useState<string | undefined>();
   const [backendSignError, setBackendSignError] = useState<
    string | undefined
  >();
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<OnChainSessionState | null>(null);
  const [sessionDetailsError, setSessionDetailsError] = useState<string | undefined>();

  const {
    data: signMessageData,
    error: signErrorWagmi,
    signMessage,
  } = useSignMessage();
  const {
    data: transactionData,
    error: txErrorWagmi,
    sendTransaction,
  } = useSendTransaction();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const fetchLatestSession = async () => {
      if (address && !sessionId) {
        const validSession = await fetch(
          `/api/session?smartAccountAddress=${address}`,
        );
        const validSessionData: SessionConfigWithId = await validSession.json();
        setSessionId(validSessionData.sessionId);
      }
    };
    fetchLatestSession();
  }, [address, sessionId]);

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
      account: address as `0x${string}`,
      message,
    });
  };

  const handleBackendSendTransaction = async (to: string, amount: string) => {
    if (!sessionId) throw new Error("Session ID is required");
    setBackendSignError(undefined);
    try {
      const body = {
        from: address,
        to,
        value: parseEther(amount).toString(),
        sessionId,
        chain: sophonTestnet,
      };
      const res = await fetch("/api/session-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      } catch (err: any) {
      setBackendSignError(
        String(err.message).slice(0, 100) || String(err).slice(0, 100),
      );
    }
  };

  const handleCreateSessionKey = async ({
    signer,
    expiresAt,
    feeLimit,
    transferTarget,
    transferValue,
  }: {
    signer: string;
    expiresAt: string;
    feeLimit: string;
    transferTarget: string;
    transferValue: string;
  }) => {
    setSessionId(undefined);
    setSessionError(undefined);
    try {
      if (!address || !walletClient || !publicClient)
        throw new Error("Wallet not connected");

      
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smartAccountAddress: address,
          signer,
          expiresAt,
          feeLimit,
          transferTarget,
          transferValue,
        }),
      });
      const data = await res.json();
      console.log("data", data);
      setSessionId(data.sessionId);
      if (!res.ok) throw new Error(data.error || "Unknown error");
      // check if 500
      if (res.status === 500) {
        throw new Error("Session key creation failed");
      }
      const sessionConfigRes = await fetch(
        `/api/session?smartAccountAddress=${address}&sessionId=${data.sessionId}&checkOnChain=false`,
      );
      const onchainConfig: OnChainSessionState = reviveBigInts(await sessionConfigRes.json());
      console.log("sessionConfig", onchainConfig);
      if (!onchainConfig) throw new Error("Session config not found");

      if (!(await isSessionKeyModuleInstalled(address as `0x${string}`, true))) {
      // 1. Install session key module if needed
      const installTx = getInstallSessionKeyModuleTxForViem({
        accountAddress: address as `0x${string}`,
        paymaster: {
          address: L2_GLOBAL_PAYMASTER,
          paymasterInput: "0x"
        }
      });
      const installHash = await walletClient.sendTransaction(installTx);
      console.log("installHash", installHash);
      await publicClient.waitForTransactionReceipt({ hash: installHash });
    }  else {
      console.log("Session key module already installed");
    }

      // 2. Create session key
      const createSessionTx = getCreateSessionTxForViem({
        sessionConfig: onchainConfig.sessionConfig,
        paymaster: {
          address: L2_GLOBAL_PAYMASTER,
        }
      },
      walletClient.account.address,
    );
      const sessionHash = await walletClient.sendTransaction(createSessionTx);
      console.log("sessionHash", sessionHash);
      await publicClient.waitForTransactionReceipt({ hash: sessionHash });
    } catch (err: any) {
      setSessionError(err.message || String(err));
    }
  };

  const handleShowSessionDetails = async () => {
    setSessionDetails(null);
    setSessionDetailsError(undefined);
    if (!address) {
      setSessionDetailsError("No account connected");
      setShowSessionDetailsModal(true);
      return;
    }
    try {
      const res = await fetch(`/api/session?smartAccountAddress=${address}${sessionId ? `&sessionId=${sessionId}` : ""}&checkOnChain=true`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      console.log("data", data);
      setSessionDetails(data as OnChainSessionState);
    } catch (err: any) {
      setSessionDetailsError(err.message || String(err));
    }
    setShowSessionDetailsModal(true);
  };

  return (
    <div
      className="
      w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl
      mx-auto
      relative
      shadow-[0px_2px_24px_rgba(15,_14,_13,_0.04),_0px_12px_36px_rgba(15,_14,_13,_0.04),_0px_0px_0px_1px_rgba(15,_14,_13,_0.08)_inset,_0px_1px_0px_rgba(15,_14,_13,_0.08)_inset]
      rounded-3xl bg-white overflow-hidden flex flex-col items-start justify-start
      p-4 sm:p-6 md:p-8 lg:p-12
      gap-6 sm:gap-8 md:gap-10 lg:gap-12
      text-center text-base sm:text-lg md:text-xl text-gray-100 font-inter
      min-w-0
    "
    >
      {isConnected && (
        <div className="self-stretch flex flex-col items-center justify-start gap-4 sm:gap-6">
          <div className="self-stretch flex flex-col items-start justify-start gap-1">
            <b className="self-stretch relative leading-tight text-gray-100 text-base sm:text-lg md:text-xl">
              Connected to Sophon Global Wallet
            </b>
          </div>
          <appkit-account-button balance="show" />
          <BlueLink
            href={`https://explorer.testnet.sophon.xyz/address/${address}`}
            LinkComponent={Link}
          >
            View on Explorer
          </BlueLink>
        </div>
      )}
      <div className="self-stretch flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-left text-sm sm:text-base md:text-lg text-darkslateblue">
        {!isConnected && (
          <Button variant="primary" onClick={() => open()}>
            Connect
          </Button>
        )}
        <Button variant="secondary" onClick={() => setShowMessageModal(true)}>
          Sign Message
        </Button>
        <Button variant="secondary" onClick={() => setShowSessionModal(true)}>
          Create Session Key
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowBackendSignModal(true)}
        >
          Send with Session Owner (Backend)
        </Button>
        <Button variant="secondary" onClick={handleShowSessionDetails}>
          Show Current Session Details
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
          <BlueLink
            href={`https://explorer.testnet.sophon.xyz/tx/${txHash}`}
            LinkComponent={Link}
          >
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
      <SendTransactionModal
        open={showBackendSignModal}
        onClose={() => {
          setShowBackendSignModal(false);
          setBackendSignError(undefined);
        }}
        onSubmit={handleBackendSendTransaction}
        txHash={txHash}
        ResultComponent={
          <BlueLink
            href={`https://explorer.testnet.sophon.xyz/tx/${txHash}`}
            LinkComponent={Link}
          >
            {txHash}
          </BlueLink>
        }
        error={backendSignError}
      />
      <SessionKeyModal
        open={showSessionModal}
        onClose={() => {
          setShowSessionModal(false);
          setSessionId(undefined);
          setSessionError(undefined);
        }}
        onSubmit={handleCreateSessionKey}
        result={sessionId}
        error={sessionError}
      />
      <SessionKeyModal
        open={showSessionDetailsModal}
        onClose={() => {
          setShowSessionDetailsModal(false);
          setSessionDetails(null);
          setSessionDetailsError(undefined);
        }}
        onSubmit={() => {}}
        result={sessionDetails?.sessionId}
        error={sessionDetailsError}
        sessionStatus={sessionDetails?.sessionStatus}
        sessionState={sessionDetails?.sessionState}
      />
    </div>
  );
};

export default MainCard;
