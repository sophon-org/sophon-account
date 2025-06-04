import { SessionConfig } from "../../../../packages/account-core/dist/types/session";

export type SessionStore = {
  [smartAccountAddress: string]: {
    [sessionId: string]: SessionConfig;
  };
};

export type SessionConfigWithId = {
  sessionId: string;
  sessionConfig: SessionConfig;
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
