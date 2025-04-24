"use server";

import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

// Define the response type
type CodeResponse = {
  content?: string;
  error?: string;
  details?: string;
};

// Validation schema
const fileSchema = z.object({
  fileName: z.string().min(1),
});

/**
 * Gets the base URL for the application, with the appropriate protocol.
 * Priority: VERCEL_URL > NEXT_PUBLIC_BASE_URL > default fallback
 */
function getBaseUrl(fallback = "http://localhost:3000"): string {
  const vercelUrl =
    process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;
  // Check for VERCEL_URL first
  if (vercelUrl) {
    const url = vercelUrl;
    // Use http for localhost, https for everything else
    const protocol = url.includes("localhost") ? "http://" : "https://";
    return `${protocol}${url}`;
  }

  // Fall back to NEXT_PUBLIC_BASE_URL if available
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Use default fallback
  return fallback;
}

export async function getFileContent(fileName: string): Promise<string> {
  fileSchema.parse({ fileName });
  const baseUrl = `${getBaseUrl()}/examples/${fileName}`;
  console.log("baseUrl", baseUrl);
  const response = await fetch(baseUrl);
  const remoteFileContent = await response.text();
  return remoteFileContent;
}
