import {
  hasSessionConfig,
  getSessionConfig,
  setSessionConfig,
} from "../sessionStore";
import { serializeBigInts } from "@/util";
import { NextRequest } from "next/server";
import { LimitType } from "../../../../../../packages/account-core/dist/types/session";
import { getSessionStatus, getSessionState } from "@sophon-labs/account-core";

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
    // Build session config
    const sessionConfig = {
      signer: signer as `0x${string}`,
      expiresAt: BigInt(Math.floor(new Date(expiresAt).getTime() / 1000)),
      feeLimit: LimitType.Unlimited,
      callPolicies: [],
      transferPolicies: [
        {
          target: transferTarget as `0x${string}`,
          maxValuePerUse: BigInt(transferValue),
          valueLimit: {
            limitType: LimitType.Lifetime,
            limit: BigInt(transferValue),
            period: 604800n,
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
  if (!smartAccountAddress) {
    return new Response(
      JSON.stringify({ error: "Smart account address is required" }),
      {
        status: 400,
      },
    );
  }
  const sessionData = getSessionConfig(
    smartAccountAddress as `0x${string}`,
    sessionId || undefined,
  );

  if (!sessionData) {
    return new Response(JSON.stringify({ error: "Session not found" }), {
      status: 404,
    });
  }

  let sessionStatus = null;
  let sessionState = null;
  try {
    sessionStatus = await getSessionStatus({
      accountAddress: smartAccountAddress as `0x${string}`,
      sessionConfig: sessionData.sessionConfig,
    });
    sessionState = await getSessionState({
      accountAddress: smartAccountAddress as `0x${string}`,
      sessionConfig: sessionData.sessionConfig,
    });
  } catch (err) {
    sessionStatus = null;
    sessionState = null;
  }

  return new Response(
    JSON.stringify({
      ...serializeBigInts(sessionData),
      sessionStatus,
      sessionState,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
