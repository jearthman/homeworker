import { debugLog } from "../../../utils/server-helpers";
import { getChat, setChat } from "../../../redis/redis-server-helpers";
import { findUniqueChat } from "../../../pages/api/get-chat";
import { ChatCompletionMessageParam } from "openai/resources";

export async function getChatMessages(chatId: string) {
  debugLog(`Checking KV Redis for chat`);

  const cachedChat: ChatCompletionMessageParam[] | null = await getChat(chatId);

  debugLog(`cachedChat: ${cachedChat}`);

  if (cachedChat) {
    return cachedChat;
  }

  const chat = await findUniqueChat(parseInt(chatId));

  if (!chat) {
    return [];
  }

  debugLog(`chat: ${chat}`);

  const messages = chat.messages.map((message) => {
    return {
      role: message.role,
      content: message.content,
      name: message.functionName ? message.functionName : undefined,
    };
  });

  return messages;
}
