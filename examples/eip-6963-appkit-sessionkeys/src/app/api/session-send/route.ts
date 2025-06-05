import { NextRequest } from "next/server";
import { getViemSessionClient } from "@sophon-labs/account-core";
import { getSessionConfig } from "../sessionStore";
import { reviveBigInts } from "../../util";

// Demo private key for 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049 (DO NOT use in production)
const PRIVATE_KEY =
  "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

export async function POST(req: NextRequest) {
  try {
    const { from, to, value, sessionId, chain } = await req.json();
    if (!from || !to || !value || !sessionId) {
      return new Response(
        JSON.stringify({
          error: "from, to, value, and sessionId are required",
        }),
        {
          status: 400,
        },
      );
    }
    const sessionConfig = getSessionConfig(from as `0x${string}`, sessionId);
    if (!sessionConfig) {
      return new Response(
        JSON.stringify({ error: "Session config not found" }),
        { status: 404 },
      );
    }
    const revivedConfig = reviveBigInts(sessionConfig.sessionConfig);
    const sessionClient = getViemSessionClient(
      revivedConfig,
      from,
      PRIVATE_KEY,
      chain,
    );

    const tx = await sessionClient.sendTransaction({
      to,
      value: typeof value === "string" ? BigInt(value) : value,
    });
    return new Response(
      JSON.stringify({
        txHash: tx,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
    });
  }
}
