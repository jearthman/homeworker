import path from "path";
import fs from "fs/promises";

export async function convertTextFileToMessageString(
  rootPath: string,
): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), rootPath);

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
