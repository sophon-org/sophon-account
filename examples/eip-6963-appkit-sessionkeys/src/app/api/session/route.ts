import {
  hasSessionConfig,
  getSessionConfig,
  setSessionConfig,
  deleteSessionConfig,
  readSessionData,
} from "../sessionStore";
import { serializeBigInts, LimitType, SessionStatus } from "@/util-server";
import { NextRequest } from "next/server";

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
      if (!sessionData) return null;
      
      // Note: On-chain checking is disabled in API routes due to server-side limitations
      // Client-side code should handle session status validation
      const sessionStatus = checkOnChain === "true" ? null : null;
      const sessionState = checkOnChain === "true" ? null : null;

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
