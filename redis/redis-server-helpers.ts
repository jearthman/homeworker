import kvChatClient from "./redis-clients";
import { Chat } from "@prisma/client";

export async function setChat(chatId: string, chat: Chat) {
  try {
    return await kvChatClient.set(chatId, chat);
  } catch (error: any) {
    console.error("Error setting chat:", error.message);
    return null;
  }
}

export async function getChat(chatId: string) {
  try {
    return await kvChatClient.get(chatId);
  } catch (error: any) {
    console.error("Error getting chat:", error.message);
    return null;
  }
}
