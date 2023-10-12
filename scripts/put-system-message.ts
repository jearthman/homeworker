const { put } = require("@vercel/blob");
const fs = require("fs/promises");

async function main() {
  try {
    const content = await fs.readFile(
      "private/data/system_prompt.txt",
      "utf-8",
    );
    put("system_prompt.txt", content, { access: "public" }).then(
      (url: string) => {
        console.log(url);
      },
    );
  } catch (error) {
    console.log(error);
  }
}

main();
