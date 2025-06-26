// Server-safe utility functions (no wallet client dependencies)

export const L2_GLOBAL_PAYMASTER = '0x98546B226dbbA8230cf620635a1e4ab01F6A99B2' as `0x${string}`

// Define types locally to avoid importing from @sophon-labs/account-core
export interface SessionConfig {
  signer: `0x${string}`;
  expiresAt: bigint;
  feeLimit: {
    limitType: number;
    limit: bigint;
    period: bigint;
  };
  callPolicies: any[];
  transferPolicies: {
    target: `0x${string}`;
    maxValuePerUse: bigint;
    valueLimit: {
      limitType: number;
      limit: bigint;
      period: bigint;
    };
  }[];
}

// Define enums locally to avoid importing from @sophon-labs/account-core
export enum SessionStatus {
  NotInitialized = 0,
  Active = 1,
  Closed = 2,
}

export enum LimitType {
  Lifetime = 0,
  Allowance = 1,
}

export type SessionStore = {
  [smartAccountAddress: string]: {
    [sessionId: string]: any; // Use any for server-side to avoid complex typing
  };
};

export type SessionConfigWithId = {
  sessionId: string;
  sessionConfig: any;
};

export type OnChainSessionState = SessionConfigWithId & {
  sessionStatus: any;
  sessionState: any;
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

export const matchSessionStatus = (status: any) => {
  switch (status) {
    case 0: // SessionStatus.NotInitialized
      return "Not Initialized";
    case 1: // SessionStatus.Active
      return "Active";
    case 2: // SessionStatus.Closed
      return "Closed";
    default:
      return "Unknown";
  }
} 