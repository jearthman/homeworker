import kvChatClient from "./redis-clients";
import { Chat } from "@prisma/client";
import { debugLog } from "../utils/server-helpers";

export async function setChat(chatId: string, chat: Chat) {
  try {
    debugLog(`Setting chat ${chatId} in Redis: ${kvChatClient}`);
    return await kvChatClient.set(chatId, chat);
  } catch (error: any) {
    console.error("Error setting chat:", error.message);
    return null;
  }
}

export async function getChat(chatId: string) {
  try {
    debugLog(
      `Getting chat ${chatId} from Redis: ${JSON.stringify(kvChatClient)}`,
    );
    return await kvChatClient.get(chatId);
  } catch (error: any) {
    console.error("Error getting chat:", error.message);
    return null;
  }
}
