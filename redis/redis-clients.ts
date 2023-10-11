import { createClient } from "@vercel/kv";

const kvChatClient = createClient({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

export default kvChatClient;
