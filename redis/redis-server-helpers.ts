import kvChatClient from "./redis-clients";
import { debugLog } from "../utils/server-helpers";
import { ChatCompletionMessageParam } from "openai/resources";

export async function setChat(
  chatId: string,
  chat: ChatCompletionMessageParam[],
) {
  try {
    debugLog(
      `Setting chat ${chatId} in Redis: ${JSON.stringify(kvChatClient)}`,
    );
    kvChatClient.del(chatId);
    return await kvChatClient.set(`chat:${chatId}`, chat);
  } catch (error: any) {
    console.error("Error setting chat:", error.message);
    return null;
  }
}

export async function getChat(
  chatId: string,
): Promise<ChatCompletionMessageParam[] | null> {
  try {
    debugLog(
      `Getting chat ${chatId} from Redis: ${JSON.stringify(kvChatClient)}`,
    );
    return await kvChatClient.get(`chat:${chatId}`);
  } catch (error: any) {
    console.error("Error getting chat:", error.message);
    return null;
  }
}
