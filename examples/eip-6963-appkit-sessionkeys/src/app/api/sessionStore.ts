import fs from "node:fs";
import path from "node:path";
import type { SessionConfig } from "@sophon-labs/account-core";
import {
  reviveBigInts,
  type SessionConfigWithId,
  type SessionStore,
  serializeBigInts,
} from "../util";

export const sessionFilePath = path.resolve(
  process.cwd(),
  ".sessionStore.json",
);

export function readSessionData(): SessionStore {
  if (!fs.existsSync(sessionFilePath)) {
    return {};
  }
  const data = fs.readFileSync(sessionFilePath, "utf-8");
  return reviveBigInts(JSON.parse(data)) as SessionStore;
}

export function writeSessionData(data: SessionStore) {
  const serializedBigints = serializeBigInts(data);
  fs.writeFileSync(sessionFilePath, JSON.stringify(serializedBigints, null, 2));
}

export function deleteSessionConfig(
  smartAccountAddress: `0x${string}`,
  sessionId: string,
): void {
  const sessionData = readSessionData();
  delete sessionData[smartAccountAddress][sessionId];
  writeSessionData(sessionData);
}

export function setSessionConfig(
  smartAccountAddress: `0x${string}`,
  sessionId: string,
  config: SessionConfig,
): void {
  const sessionData = readSessionData();
  sessionData[smartAccountAddress] = sessionData[smartAccountAddress] || {};
  sessionData[smartAccountAddress][sessionId] = config;
  writeSessionData(sessionData);
}

export function getSessionConfig(
  smartAccountAddress: `0x${string}`,
  sessionId?: string,
): SessionConfigWithId | undefined {
  const sessionData = readSessionData();
  const accountSessions = sessionData[smartAccountAddress];
  if (!accountSessions) return undefined;
  if (!sessionId) {
    const now = Math.floor(Date.now() / 1000);
    const sessionEntry = Object.entries(accountSessions).find(
      ([_, session]) => {
        const expiresAt =
          typeof session.expiresAt === "string"
            ? parseInt(session.expiresAt, 10)
            : Number(session.expiresAt);
        return expiresAt > now;
      },
    );
    if (sessionEntry) {
      sessionId = sessionEntry[0];
    } else {
      return undefined;
    }
  }
  if (!accountSessions[sessionId]) return undefined;
  return {
    sessionId,
    sessionConfig: reviveBigInts(accountSessions[sessionId]) as SessionConfig,
  };
}

export function hasSessionConfig(
  smartAccountAddress: `0x${string}`,
  sessionId: string,
): boolean {
  const sessionData = readSessionData();
  return (
    sessionData[smartAccountAddress] &&
    sessionId in sessionData[smartAccountAddress]
  );
}
