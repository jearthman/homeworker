export async function convertTextFileToMessageString(
  path: string,
): Promise<string> {
  try {
    const fileResponse = await fetch(process.env.BLOB_URL + path);

    if (!fileResponse.ok) {
      throw new Error("Error fetching file from Blob storage");
    }

    const content = await fileResponse.text();

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
