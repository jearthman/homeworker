import { debugLog } from "../../../utils/server-helpers";
import { getChat, setChat } from "../../../redis/redis-server-helpers";
import { findUniqueChat } from "../../../pages/api/get-chat";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionSystemMessageParam,
} from "openai/resources";

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

  const messages = chat.messages.reduce((acc, message) => {
    switch (message.role) {
      case "user":
        acc.push({
          role: message.role,
          content: message.content,
        } as ChatCompletionUserMessageParam);
        break;
      case "assistant":
        acc.push({
          role: message.role,
          content: message.content,
        } as ChatCompletionAssistantMessageParam);
        break;
      case "system":
        acc.push({
          role: message.role,
          content: message.content,
        } as ChatCompletionSystemMessageParam);
        break;
      default:
        throw new Error(`Unhandled message role: ${message.role}`);
    }
    return acc;
  }, [] as ChatCompletionMessageParam[]);

  return messages;
}
