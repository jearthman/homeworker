import { join } from "path";
import fs from "fs/promises";

export async function convertTextFileToMessageString(
  relativePath: string
): Promise<string> {
  // Get the absolute path to the file
  const filePath = join(process.cwd(), relativePath);

  try {
    // Read the file's contents
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
