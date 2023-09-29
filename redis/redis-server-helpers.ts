import kvChatClient from "./redis-clients";
import { Chat } from "@prisma/client";
import { debugLog } from "../utils/server-helpers";
import { debuglog } from "util";

export async function setChat(chatId: string, chat: Chat) {
  try {
    debuglog(`Setting chat ${chatId} in Redis: ${kvChatClient}`);
    return await kvChatClient.set(chatId, chat);
  } catch (error: any) {
    console.error("Error setting chat:", error.message);
    return null;
  }
}

export async function getChat(chatId: string) {
  try {
    debuglog(`Getting chat ${chatId} from Redis: ${kvChatClient}`);
    return await kvChatClient.get(chatId);
  } catch (error: any) {
    console.error("Error getting chat:", error.message);
    return null;
  }
}
