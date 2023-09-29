import { join } from "path";
import fs from "fs/promises";

export async function convertTextFileToMessageString(
  relativePath: string,
): Promise<string> {
  try {
    const filePath = join(__dirname, "..", relativePath);

    const content = await fs.readFile(filePath, "utf-8");

    // Replace consecutive newline characters with '\n\n' and other necessary replacements
    const formattedContent = content
      .replace(/\n\s*\n/g, "\\n\\n")
      .replace(/"/g, '\\"');

    return formattedContent;
  } catch (err) {
    console.error("An error occurred while reading the file:", err);
    throw err;
  }
}

export function debugLog(message: string) {
  if (process.env.DEBUG === "true") {
    console.log("[DEBUG]:", message);
  }
}
