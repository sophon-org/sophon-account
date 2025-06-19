/* eslint-disable @typescript-eslint/no-explicit-any */

import { SessionConfig, SessionState, SessionStatus } from "@sophon-labs/account-core";


export const L2_GLOBAL_PAYMASTER = '0x98546B226dbbA8230cf620635a1e4ab01F6A99B2' as `0x${string}`

export type SessionStore = {
  [smartAccountAddress: string]: {
    [sessionId: string]: SessionConfig;
  };
};

export type SessionConfigWithId = {
  sessionId: string;
  sessionConfig: SessionConfig;
};

export type OnChainSessionState = SessionConfigWithId & {
  sessionStatus: SessionStatus;
  sessionState: SessionState;
};

export function serializeBigInts(obj: any): any {
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInts);
  if (obj && typeof obj === "object") {
    const res: any = {};
    for (const k in obj) res[k] = serializeBigInts(obj[k]);
    return res;
  }
  return obj;
}

export function reviveBigInts(obj: any): any {
  if (typeof obj === "string" && /^\d+$/.test(obj)) return BigInt(obj);
  if (Array.isArray(obj)) return obj.map(reviveBigInts);
  if (obj && typeof obj === "object") {
    const res: any = {};
    for (const k in obj) res[k] = reviveBigInts(obj[k]);
    return res;
  }
  return obj;
}

export const matchSessionStatus = (status: SessionStatus) => {
  switch (status) {
    case SessionStatus.NotInitialized:
      return "Not Initialized";
    case SessionStatus.Active:
      return "Active";
    case SessionStatus.Closed:
      return "Closed";
  }
}