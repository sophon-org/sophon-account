"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useSendTransaction, usePublicClient, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { sophonTestnet } from "viem/chains";
import {
  getInstallSessionKeyModuleTxForViem,
  getCreateSessionTxForViem,
  isSessionKeyModuleInstalled,
  getRevokeSessionTxForViem,
  getSessionHash,
} from "@sophon-labs/account-core";
import { BlueLink, Button, SessionKeyModal } from "./components";
import { SessionConfigWithId, L2_GLOBAL_PAYMASTER, reviveBigInts, OnChainSessionState, matchSessionStatus } from "./util";
import { SessionStatus } from "@sophon-labs/account-core";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Link from "next/link";

type GameMode = "manual" | "session";

interface GameStats {
  totalMoves: number;
  successfulMoves: number;
  failedMoves: number;
  avgResponseTime: number;
  gameWins: number;
  gameDraws: number;
}

interface Move {
  id: number;
  from: string;
  to: string;
  piece: string;
  san: string;
  hash?: string;
  error?: string;
  time: number;
}

const GAME_WALLET_ADDRESS = "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049"; 
const MOVE_VALUE = "0.0001"; // 0.0001 ETH per move

export default function GameContainer() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  
  // Chess game state
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [gameStatus, setGameStatus] = useState<"playing" | "checkmate" | "draw" | "stalemate">("playing");
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white");
  
  // Session Keys demo state
  const [gameMode, setGameMode] = useState<GameMode>("manual");
  const [gameStats, setGameStats] = useState<GameStats>({
    totalMoves: 0,
    successfulMoves: 0,
    failedMoves: 0,
    avgResponseTime: 0,
    gameWins: 0,
    gameDraws: 0,
  });
  
  // Session state
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [sessions, setSessions] = useState<SessionConfigWithId[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | undefined>();
  
  // Modal state
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<OnChainSessionState | null>(null);
  const [sessionDetailsError, setSessionDetailsError] = useState<string | undefined>();
  const [revokeTxHash, setRevokeTxHash] = useState<string | undefined>();
  
  // Session validation state
  const [sessionStatuses, setSessionStatuses] = useState<Record<string, OnChainSessionState>>({});
  const [validatingSession, setValidatingSession] = useState<string | undefined>();
  
  // Transaction state
  const [pendingMoves, setPendingMoves] = useState<Set<number>>(new Set());
  const [recentMoves, setRecentMoves] = useState<Move[]>([]);
  const [pendingManualMove, setPendingManualMove] = useState<{
    moveId: number;
    moveData: Move;
    startTime: number;
    previousFen: string;
  } | null>(null);
  
  const {
    data: transactionData,
    error: txErrorWagmi,
    sendTransaction,
    isPending: isTxPending,
  } = useSendTransaction();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Load existing sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      if (address) {
        try {
          const response = await fetch(`/api/session?smartAccountAddress=${address}`);
          const sessionsData: SessionConfigWithId[] = await response.json();
          setSessions(sessionsData);
          // Don't auto-select first session, let user choose after validation
        } catch (error) {
          console.error("Failed to fetch sessions:", error);
        }
      } else {
        setSessions([]);
        setSessionId(undefined);
        setSessionStatuses({});
      }
    };
    fetchSessions();
  }, [address]);

  // Validate all sessions when sessions list changes
  useEffect(() => {
    if (sessions.length > 0) {
      validateAllSessions();
    } else {
      setSessionStatuses({});
    }
  }, [sessions]);

  // Update game status based on chess.js game state
  useEffect(() => {
    if (game.isCheckmate()) {
      setGameStatus("checkmate");
      setGameStats(prev => ({
        ...prev,
        gameWins: prev.gameWins + 1
      }));
    } else if (game.isDraw() || game.isStalemate()) {
      setGameStatus(game.isDraw() ? "draw" : "stalemate");
      setGameStats(prev => ({
        ...prev,
        gameDraws: prev.gameDraws + 1
      }));
    } else {
      setGameStatus("playing");
    }
    
    setCurrentPlayer(game.turn() === "w" ? "white" : "black");
  }, [gamePosition, game]);

  // Handle manual transaction results
  useEffect(() => {
    if (pendingManualMove && (transactionData || txErrorWagmi)) {
      const endTime = Date.now();
      const responseTime = endTime - pendingManualMove.startTime;
      
      setPendingMoves(prev => {
        const newSet = new Set(prev);
        newSet.delete(pendingManualMove.moveId);
        return newSet;
      });

      if (transactionData) {
        // Transaction succeeded
        const completedMove = {
          ...pendingManualMove.moveData,
          hash: transactionData,
          time: responseTime
        };
        
        setRecentMoves(prev => [completedMove, ...prev.slice(0, 9)]);
        
        setGameStats(prev => ({
          ...prev,
          successfulMoves: prev.successfulMoves + 1,
          avgResponseTime: prev.avgResponseTime === 0 ? responseTime : (prev.avgResponseTime + responseTime) / 2
        }));
      } else if (txErrorWagmi) {
        // Transaction failed - revert the move
        const revertedGame = new Chess(pendingManualMove.previousFen);
        setGame(revertedGame);
        setGamePosition(revertedGame.fen());
        
        const failedMove = {
          ...pendingManualMove.moveData,
          error: txErrorWagmi.message,
          time: responseTime
        };
        
        setRecentMoves(prev => [failedMove, ...prev.slice(0, 9)]);
        
        setGameStats(prev => ({
          ...prev,
          failedMoves: prev.failedMoves + 1,
          avgResponseTime: prev.avgResponseTime === 0 ? responseTime : (prev.avgResponseTime + responseTime) / 2
        }));
      }

      setPendingManualMove(null);
    }
  }, [transactionData, txErrorWagmi, pendingManualMove]);

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
      setSessionId(data.sessionId);
      if (!res.ok) throw new Error(data.error || "Unknown error");

      const sessionConfigRes = await fetch(
        `/api/session?smartAccountAddress=${address}&sessionId=${data.sessionId}&checkOnChain=false`,
      );
      const config = await sessionConfigRes.json();
      const onchainConfig: OnChainSessionState = reviveBigInts(config[0]);
      if (!onchainConfig) throw new Error("Session config not found");

      if (!(await isSessionKeyModuleInstalled(address as `0x${string}`, true))) {
        // Install session key module if needed
        const installTx = getInstallSessionKeyModuleTxForViem({
          accountAddress: address as `0x${string}`,
          paymaster: {
            address: L2_GLOBAL_PAYMASTER,
            paymasterInput: "0x"
          }
        });
        const installHash = await walletClient.sendTransaction(installTx);
        await publicClient.waitForTransactionReceipt({ hash: installHash });
      }

      // Register session on-chain
      const sessionTx = getCreateSessionTxForViem({
        sessionConfig: onchainConfig.sessionConfig,
      }, address as `0x${string}`);

      
      const sessionHash = await walletClient.sendTransaction(sessionTx);

      await publicClient.waitForTransactionReceipt({ hash: sessionHash });

      // Refresh sessions
      const updatedSessions = await fetch(`/api/session?smartAccountAddress=${address}`);
      const updatedSessionsData = await updatedSessions.json();
      setSessions(updatedSessionsData);

    } catch (err: any) {
      console.error("err", err);
      setSessionError(err.message || String(err));
    }
  };

  const handleRevokeSessionKey = async () => {
    try {
      if (!sessionDetails?.sessionConfig) throw new Error("Session config not found");
      const sessionHash = getSessionHash(sessionDetails?.sessionConfig);
      const revokeSessionTx = getRevokeSessionTxForViem({
        sessionHash,
        paymaster: {
          address: L2_GLOBAL_PAYMASTER,
          paymasterInput: "0x"
        }
      }, walletClient?.account.address as `0x${string}`);
      const revokeHash = await walletClient?.sendTransaction(revokeSessionTx);
      setRevokeTxHash(revokeHash as `0x${string}`);
      await fetch("/api/session", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smartAccountAddress: address,
          sessionId,
        }),
      });
      setSessions(sessions.filter(session => session.sessionId !== sessionId));
      setSessionId(undefined);
      setSessionDetails(null);
      await publicClient?.waitForTransactionReceipt({ hash: revokeHash as `0x${string}` });
    } catch (err: any) {
      setSessionError(err.message || String(err));
    }
  };

  const handleRevokeCurrentSession = async () => {
    if (!sessionId || !sessionStatuses[sessionId]) {
      alert("No active session to revoke");
      return;
    }

    const confirmRevoke = confirm(
      "⚠️ Are you sure you want to revoke this session?\n\n" +
      "This will:\n" +
      "• Immediately disable instant chess moves\n" +
      "• Require wallet approval for each move\n" +
      "• Cannot be undone (you'll need to create a new session)\n\n" +
      "Click OK to revoke session access."
    );

    if (!confirmRevoke) return;

    try {
      const currentSessionState = sessionStatuses[sessionId];
      if (!currentSessionState?.sessionConfig) {
        throw new Error("Session config not found");
      }

      const sessionHash = getSessionHash(currentSessionState.sessionConfig);
      const revokeSessionTx = getRevokeSessionTxForViem({
        sessionHash }, walletClient?.account.address as `0x${string}`);
      
      const revokeHash = await walletClient?.sendTransaction(revokeSessionTx);
      setRevokeTxHash(revokeHash as `0x${string}`);
      
      // Remove session from backend
      await fetch("/api/session", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smartAccountAddress: address,
          sessionId,
        }),
      });

      // Update local state
      setSessions(sessions.filter(session => session.sessionId !== sessionId));
      setSessionId(undefined);
      
      // Update session statuses
      setSessionStatuses(prev => {
        const updated = { ...prev };
        delete updated[sessionId];
        return updated;
      });

      // Wait for transaction confirmation
      await publicClient?.waitForTransactionReceipt({ hash: revokeHash as `0x${string}` });
      
      alert("✅ Session successfully revoked! You're now back to manual mode.");
      
    } catch (err: any) {
      console.error("Revoke error:", err);
      setSessionError(err.message || String(err));
      alert("❌ Failed to revoke session: " + (err.message || String(err)));
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    setSessionId(sessionId);
    try {
      const res = await fetch(`/api/session?smartAccountAddress=${address}${sessionId ? `&sessionId=${sessionId}` : ""}&checkOnChain=true`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setSessionDetails(reviveBigInts(data[0]) as OnChainSessionState);
    } catch (err: any) {
      console.log("err", err);
      setSessionDetailsError(err.message || String(err));
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
      setSessionDetails(data[0] as OnChainSessionState);
    } catch (err: any) {
      setSessionDetailsError(err.message || String(err));
    }
    setShowSessionDetailsModal(true);
  };

  const validateSessionStatus = async (sessionId: string): Promise<OnChainSessionState | null> => {
    if (!address) return null;
    
    try {
      const res = await fetch(`/api/session?smartAccountAddress=${address}&sessionId=${sessionId}&checkOnChain=true`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      
      const sessionState = reviveBigInts(data[0]) as OnChainSessionState;
      return sessionState;
    } catch (err: any) {
      console.error(`Failed to validate session ${sessionId}:`, err);
      return null;
    }
  };

  const validateAllSessions = async () => {
    if (!address || sessions.length === 0) return;
    
    const statusMap: Record<string, OnChainSessionState> = {};
    
    for (const session of sessions) {
      const status = await validateSessionStatus(session.sessionId);
      if (status) {
        statusMap[session.sessionId] = status;
      }
    }
    
    setSessionStatuses(statusMap);
  };

  const handleSessionSelection = async (selectedSessionId: string) => {
    if (!selectedSessionId) {
      setSessionId(undefined);
      return;
    }

    setValidatingSession(selectedSessionId);
    
    try {
      const sessionState = await validateSessionStatus(selectedSessionId);
      
      if (!sessionState) {
        alert("Failed to validate session status. Please try again.");
        return;
      }

      if (sessionState.sessionStatus !== SessionStatus.Active) {
        alert(`Cannot use this session. Status: ${matchSessionStatus(sessionState.sessionStatus)}. Only active sessions can be used for transactions.`);
        return;
      }

      // Update session statuses
      setSessionStatuses(prev => ({
        ...prev,
        [selectedSessionId]: sessionState
      }));
      
      setSessionId(selectedSessionId);
    } catch (err: any) {
      console.error("Session validation failed:", err);
      alert("Failed to validate session. Please try again.");
    } finally {
      setValidatingSession(undefined);
    }
  };

  const handleMove = useCallback((sourceSquare: string, targetSquare: string) => {
    if (!isConnected || !address || gameStatus !== "playing") return false;

    // Make the move in chess.js to validate it
    const gameCopy = new Chess(game.fen());
    let move;
    
    try {
      move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    } catch (error) {
      return false; // Invalid move
    }

    if (move === null) return false;

    // Store the previous game state for potential reversion
    const previousFen = game.fen();

    // Update the board optimistically
    setGame(gameCopy);
    setGamePosition(gameCopy.fen());

    // Process the transaction asynchronously
    processMove(sourceSquare, targetSquare, move, previousFen);

    return true;
  }, [game, gameMode, sessionId, address, isConnected, gameStatus]);

  const processMove = async (sourceSquare: string, targetSquare: string, move: any, previousFen: string) => {
    const moveId = Date.now();
    const startTime = Date.now();
    
    setGameStats(prev => ({ ...prev, totalMoves: prev.totalMoves + 1 }));
    setPendingMoves(prev => new Set([...prev, moveId]));

    const moveData: Move = {
      id: moveId,
      from: sourceSquare,
      to: targetSquare,
      piece: move.piece,
      san: move.san,
      time: 0
    };

    const revertMove = () => {
      const revertedGame = new Chess(previousFen);
      setGame(revertedGame);
      setGamePosition(revertedGame.fen());
    };

    try {
      if (gameMode === "manual") {
        // Manual transaction - will trigger wallet popup
        setPendingManualMove({
          moveId,
          moveData,
          startTime,
          previousFen
        });
        
        sendTransaction({
          to: GAME_WALLET_ADDRESS as `0x${string}`,
          value: parseEther(MOVE_VALUE),
          data: '0x',
        });
        
        // Transaction result will be handled by useEffect

      } else {
        // Session-based transaction - should be fast
        if (!sessionId) throw new Error("No session available");

        const response = await fetch("/api/session-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: address,
            to: GAME_WALLET_ADDRESS,
            value: parseEther(MOVE_VALUE).toString(),
            sessionId,
            chain: sophonTestnet,
          }),
        });

        const data = await response.json();
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        setPendingMoves(prev => {
          const newSet = new Set(prev);
          newSet.delete(moveId);
          return newSet;
        });

        if (response.ok) {
          const completedMove = {
            ...moveData,
            hash: data.txHash,
            time: responseTime
          };
          
          setRecentMoves(prev => [completedMove, ...prev.slice(0, 9)]);
          
          setGameStats(prev => ({
            ...prev,
            successfulMoves: prev.successfulMoves + 1,
            avgResponseTime: prev.avgResponseTime === 0 ? responseTime : (prev.avgResponseTime + responseTime) / 2
          }));
        } else {
          throw new Error(data.error);
        }
      }
    } catch (error: any) {
      // Only handle errors for session mode here
      // Manual mode errors are handled by the useEffect
      if (gameMode === "session") {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Revert the move on failure
        revertMove();
        
        setPendingMoves(prev => {
          const newSet = new Set(prev);
          newSet.delete(moveId);
          return newSet;
        });
        
        const failedMove = {
          ...moveData,
          error: error.message,
          time: responseTime
        };
        
        setRecentMoves(prev => [failedMove, ...prev.slice(0, 9)]);
        
        setGameStats(prev => ({
          ...prev,
          failedMoves: prev.failedMoves + 1,
          avgResponseTime: prev.avgResponseTime === 0 ? responseTime : (prev.avgResponseTime + responseTime) / 2
        }));
      } else {
        // For manual mode, revert move and clear pending state
        revertMove();
        setPendingManualMove(null);
        setPendingMoves(prev => {
          const newSet = new Set(prev);
          newSet.delete(moveId);
          return newSet;
        });
      }
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setGameStatus("playing");
    setCurrentPlayer("white");
    setGameStats(prev => ({
      ...prev,
      totalMoves: 0,
      successfulMoves: 0,
      failedMoves: 0,
      avgResponseTime: 0,
    }));
    setRecentMoves([]);
    setPendingMoves(new Set());
    setPendingManualMove(null);
  };

  if (!isConnected) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Connect your Sophon Global Wallet to start playing chess and experience session keys!</p>
          <Button onClick={open} className="bg-blue-600 hover:bg-blue-700">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl space-y-6">
      {/* Header with Sophon Global Wallet */}
      <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Connected to Sophon Global Wallet</h2>
            <appkit-account-button balance="show" />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Game Status</div>
            <div className={`text-lg font-bold ${
              gameStatus === "playing" ? "text-blue-400" : 
              gameStatus === "checkmate" ? "text-blue-400" : "text-blue-400"
            }`}>
              {gameStatus === "playing" ? `${currentPlayer}'s turn` : 
               gameStatus === "checkmate" ? `Checkmate! ${currentPlayer === "white" ? "Black" : "White"} wins!` :
               gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Game Mode Toggle */}
      <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Chess Session Keys Demo</h2>
          <Button onClick={resetGame} className="bg-white/10 hover:bg-white/20 border border-white/20 text-sm px-4 py-2 transition-all duration-200">
            New Game
          </Button>
        </div>
        
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => setGameMode("manual")}
            className={`${
              gameMode === "manual" 
                ? "bg-gradient-to-r from-blue-200 to-blue-400 shadow-lg shadow-blue-500/25" 
                : "bg-white/10 hover:bg-white/20 border border-white/20"
            } transition-all duration-200 px-6 py-3`}
            disabled={!isConnected}
          >
            🐌 Manual Mode
          </Button>
          <Button
            onClick={() => setGameMode("session")}
            disabled={!isConnected}
            className={`${
              gameMode === "session" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25" 
                : "bg-white/10 hover:bg-white/20 border border-white/20"
            } transition-all duration-200 px-6 py-3 ${!sessionId ? "opacity-75" : ""}`}
          >
            ⚡ Session Mode {sessionId ? "" : "(Setup Required)"}
          </Button>
        </div>

                {/* Session Key Management - Only show in session mode */}
        {gameMode === "session" && (
          <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Session Key Management</h3>
              <div className="flex gap-3">
                <Button
                  onClick={() => {setSessionId(undefined); setRevokeTxHash(undefined); setShowSessionModal(true)}}
                  className="bg-blue-600 hover:bg-blue-700  border-0 text-sm px-4 py-2 transition-all duration-200"
                  disabled={!isConnected}
                >
                  Create Session Key
                </Button>
                <Button
                  onClick={handleShowSessionDetails}
                  className="bg-blue-600 hover:bg-blue-700  border-0 text-sm px-4 py-2 transition-all duration-200"
                  disabled={!isConnected}
                >
                  View All Sessions
                </Button>
                {sessionId && sessionStatuses[sessionId]?.sessionStatus === SessionStatus.Active && (
                  <Button
                    onClick={handleRevokeCurrentSession}
                    className="bg-red-600 hover:bg-red-700 border-0 text-sm px-4 py-2 transition-all duration-200"
                    disabled={!isConnected}
                  >
                    🚫 Revoke Session
                  </Button>
                )}
              </div>
            </div>

            {/* Session Selection */}
            {sessions.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <label className="text-white font-medium">Active Session:</label>
                  <select
                    value={sessionId || ""}
                    onChange={(e) => {
                      const selectedSessionId = e.target.value;
                      handleSessionSelection(selectedSessionId);
                    }}
                    className="bg-slate-800/70 backdrop-blur-sm text-white rounded-lg px-3 py-2 border border-white/30 focus:border-blue-400 focus:outline-none"
                    disabled={validatingSession !== undefined}
                  >
                    <option value="" className="bg-slate-800 text-white">Select a session...</option>
                    {sessions.map((session) => {
                      const status = sessionStatuses[session.sessionId];
                      const isActive = status?.sessionStatus === SessionStatus.Active;
                      const statusText = status ? matchSessionStatus(status.sessionStatus) : "Checking...";
                      
                      return (
                        <option 
                          key={session.sessionId} 
                          value={session.sessionId}
                          disabled={!isActive}
                          className="bg-slate-800 text-white"
                        >
                          {session.sessionId.slice(0, 8)}...{session.sessionId.slice(-8)} 
                          ({statusText})
                          {session.sessionId === sessionId ? " - Active" : ""}
                        </option>
                      );
                    })}
                  </select>
                  
                  {validatingSession && (
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                      Validating...
                    </div>
                  )}
                  {sessionId && !validatingSession && (
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Active
                    </div>
                  )}
                </div>
                
                {/* Current Session Info */}
                {sessionId && (
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                                              <div className="flex justify-between items-center">
                          <span className="text-gray-300">Session ID:</span>
                          <code className="text-blue-300 text-xs bg-blue-500/20 px-2 py-1 rounded border border-white/20">{sessionId}</code>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">On-chain Status:</span>
                          {sessionStatuses[sessionId] ? (
                            <span className={`font-medium px-2 py-1 rounded text-xs border ${
                              sessionStatuses[sessionId].sessionStatus === SessionStatus.Active 
                                ? "text-blue-300 bg-blue-500/20 border-white/20" 
                                : "text-blue-300 bg-blue-500/20 border-white/20"
                            }`}>
                              {matchSessionStatus(sessionStatuses[sessionId].sessionStatus)}
                            </span>
                          ) : (
                            <span className="text-blue-300 bg-blue-500/20 px-2 py-1 rounded text-xs border border-white/20">Validating...</span>
                          )}
                        </div>
                        {sessionStatuses[sessionId]?.sessionStatus === SessionStatus.Active && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Status:</span>
                            <span className="text-blue-300 text-xs">✅ Ready for instant moves</span>
                          </div>
                        )}
                        {sessionStatuses[sessionId]?.sessionStatus === SessionStatus.Active && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Access:</span>
                            <span className="text-red-300 text-xs">🚫 Can be revoked anytime</span>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!sessionId && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔑</div>
                  <div>
                    <p className="text-white font-medium mb-1">
                      {sessions.length > 0 
                        ? "Select an active session to enable instant moves"
                        : "Create a session key for lightning-fast chess moves"
                      }
                    </p>
                    <p className="text-gray-300 text-sm">
                      {sessions.length > 0 
                        ? "Only sessions with 'Active' status can be used for transactions. Active sessions can be revoked instantly to demonstrate live access control."
                        : "Session keys eliminate wallet popups for each move, creating seamless gameplay. Once created, sessions can be revoked anytime to instantly remove access."
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            gameMode === "manual" 
              ? "bg-blue-500/10 text-blue-300 border border-white/30" 
              : "bg-blue-500/10 text-blue-300 border border-white/30"
          }`}>
            {gameMode === "manual" 
              ? "🐌 Each move requires wallet signature (3-7s delay)" 
              : sessionId 
                ? "⚡ Session key enables instant moves (<1s)"
                : "⚡ Session mode requires active session key"
            }
          </div>
        </div>

        {/* Manual Mode Info */}
        {gameMode === "manual" && (
          <div className="bg-slate-900/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🐌</div>
              <div>
                <p className="text-white font-medium mb-1">
                  Manual Mode: Experience Traditional Web3 UX
                </p>
                <p className="text-gray-300 text-sm">
                  Each chess move triggers a wallet popup requiring your signature. This simulates the traditional Web3 experience with confirmation delays that can interrupt gameplay flow.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chess Board - Reset Transform Context */}
      <div className="w-full mb-8">
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-6 mx-auto max-w-fit">
          <div 
            className="chessboard-container"
            style={{
              position: 'relative',
              transform: 'none',
              transformOrigin: 'unset',
              width: '600px',
              height: '600px',
              margin: '0 auto',
              isolation: 'isolate'
            }}
          >
            <div style={{ position: 'static', transform: 'none', width: '100%', height: '100%' }}>
              <Chessboard
                position={gamePosition}
                onPieceDrop={handleMove}
                boardWidth={600}
                animationDuration={200}
                customBoardStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
                customDarkSquareStyle={{ backgroundColor: "#374151" }}
                customLightSquareStyle={{ backgroundColor: "#E5E7EB" }}
                id="main-chessboard"
              />
            </div>
          </div>
          
          {/* Overlays positioned outside the board container */}
          {pendingMoves.size > 0 && (
            <div className="relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse shadow-lg z-20">
                {pendingMoves.size} pending move{pendingMoves.size !== 1 ? 's' : ''}
              </div>
            </div>
          )}
          
          {pendingManualMove && (
            <div className="relative">
              <div className="absolute top-0 left-0 transform -translate-x-2 -translate-y-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium animate-pulse shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  Wallet approval required
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-center text-gray-300">
            <p className="text-sm">
              Each move costs {MOVE_VALUE} ETH • 
              {gameMode === "manual" ? " Manual signing required" : " Session key enabled"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats and Move History - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Game Stats */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Game Stats</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{gameStats.totalMoves}</div>
              <div className="text-gray-400 text-sm">Total Moves</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{gameStats.successfulMoves}</div>
              <div className="text-gray-400 text-sm">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{gameStats.failedMoves}</div>
              <div className="text-gray-400 text-sm">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {gameStats.avgResponseTime > 0 ? `${Math.round(gameStats.avgResponseTime)}ms` : "—"}
              </div>
              <div className="text-gray-400 text-sm">Avg Response</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{gameStats.gameWins}</div>
              <div className="text-gray-400 text-sm">Games Won</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{gameStats.gameDraws}</div>
              <div className="text-gray-400 text-sm">Draws</div>
            </div>
          </div>
        </div>

        {/* Recent Moves */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
          <h4 className="text-white font-medium mb-3">Recent Moves</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentMoves.map((move) => (
              <div
                key={move.id}
                className={`text-xs p-3 rounded border-l-4 ${
                  move.error
                    ? "bg-blue-900/30 border-blue-500"
                    : "bg-blue-900/30 border-blue-500"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold ${move.error ? "text-blue-400" : "text-blue-400"}`}>
                    {move.san}
                  </span>
                  <span className="text-gray-400">{move.time}ms</span>
                </div>
                <div className="text-gray-400 text-xs">
                  {move.from} → {move.to}
                </div>
                {move.hash && (
                  <BlueLink href={`https://explorer.testnet.sophon.xyz/tx/${move.hash}`} LinkComponent={Link}>
                    {move.hash.slice(0, 20)}...
                  </BlueLink>
                )}
                {move.error && (
                  <div className="text-blue-400 text-xs mt-1">{move.error}</div>
                )}
              </div>
            ))}
            {recentMoves.length === 0 && (
              <div className="text-gray-500 text-center py-6">
                No moves yet. Make your first move!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Key Modal */}
      <SessionKeyModal
        open={showSessionModal}
        mode="create"
        onClose={() => {setShowSessionModal(false); setSessionError(undefined)}}
        onSubmit={handleCreateSessionKey}
        onRevoke={handleRevokeSessionKey}
        onSelectSession={handleSelectSession}
        result={sessionId}
        error={sessionError}
      />
      
      <SessionKeyModal
        open={showSessionDetailsModal}
        mode="details"
        onClose={() => {setShowSessionDetailsModal(false); setSessionDetailsError(undefined)}}
        onSubmit={handleCreateSessionKey}
        onRevoke={handleRevokeSessionKey}
        onSelectSession={handleSelectSession}
        sessionDetails={sessionDetails}
        sessions={sessions}
        error={sessionDetailsError}
        revokeTxHash={revokeTxHash}
      />
    </div>
  );
} 