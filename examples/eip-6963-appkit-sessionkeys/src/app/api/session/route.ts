import {
  hasSessionConfig,
  getSessionConfig,
  setSessionConfig,
  deleteSessionConfig,
  readSessionData,
} from "../sessionStore";
import { serializeBigInts } from "@/util";
import { NextRequest } from "next/server";
import { LimitType, SessionState, SessionStatus } from "@sophon-labs/account-core";
import { getSessionStatus, getSessionState } from "@sophon-labs/account-core";

export async function DELETE(req: NextRequest) {
  const { smartAccountAddress, sessionId } = await req.json();
  try {
    if (!hasSessionConfig(smartAccountAddress, sessionId)) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
      });
    }

    deleteSessionConfig(smartAccountAddress, sessionId);

    return new Response(JSON.stringify({ message: "Session deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest) {
  const {
    smartAccountAddress,
    signer,
    expiresAt,
    feeLimit,
    transferTarget,
    transferValue,
  } = await req.json();
  try {
    const sessionConfig = {
      signer: signer as `0x${string}`,
      expiresAt: BigInt(Math.floor(new Date(expiresAt).getTime() / 1000)),
      feeLimit: {
        limitType: LimitType.Lifetime, 
        limit: BigInt(feeLimit),
        period: 604800n, // 1 week
      },
      callPolicies: [],
      transferPolicies: [
        {
          target: transferTarget as `0x${string}`, // limits the session key to only send to this address
          maxValuePerUse: BigInt(transferValue),
          valueLimit: {
            limitType: LimitType.Lifetime,
            limit: BigInt(transferValue),
            period: 604800n, // 1 week
          },
        },
      ],
    };
    const sessionId = Math.random().toString(36).slice(2);
    
    const serializedConfig = serializeBigInts(sessionConfig);

    if (hasSessionConfig(smartAccountAddress, sessionId)) {
      return new Response(JSON.stringify({ error: "Session already exists" }), {
        status: 400,
      });
    }

    setSessionConfig(smartAccountAddress, sessionId, serializedConfig);

    return new Response(JSON.stringify({ sessionId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const smartAccountAddress = searchParams.get("smartAccountAddress");
  const sessionId = searchParams.get("sessionId");
  const checkOnChain = searchParams.get("checkOnChain");
  if (!smartAccountAddress) {
    return new Response(
      JSON.stringify({ error: "Smart account address is required" }),
      {
        status: 400,
      },
    );
  }

  const sessions = sessionId
    ? [getSessionConfig(smartAccountAddress as `0x${string}`, sessionId)]
    : Object.entries(readSessionData()[smartAccountAddress as `0x${string}`] || {}).map(
        ([id, config]) => ({
          sessionId: id,
          sessionConfig: config,
        })
      );

  if (!sessions.length || (sessionId && !sessions[0])) {
    return new Response(JSON.stringify({ error: "Session not found" }), {
      status: 404,
    });
  }

  const results = await Promise.all(
    sessions.map(async (sessionData) => {
      let sessionStatus: SessionStatus | null = null;
      let sessionState: SessionState | null = null;
      if (!sessionData) return null;
      if (checkOnChain === "true") {
        try {
          const sessionParams = {
            accountAddress: smartAccountAddress as `0x${string}`,
            sessionConfig: sessionData.sessionConfig,
            testnet: true,
          };

          sessionStatus = await getSessionStatus(sessionParams);
          sessionState = await getSessionState(sessionParams);
        } catch (error) {
          console.error("Error fetching session data:", error);
        }
      }

      return {
        ...serializeBigInts(sessionData),
        sessionStatus,
        sessionState: serializeBigInts(sessionState),
      };
    })
  );


  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
