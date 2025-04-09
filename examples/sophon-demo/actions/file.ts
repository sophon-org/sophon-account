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

export async function getFileContent(fileName: string): Promise<string> {
  fileSchema.parse({ fileName });

  const filePath = path.join(process.cwd(), "examples", fileName);

  const content = await fs.readFile(filePath, "utf8");

  return content;
}
