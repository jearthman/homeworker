import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { debugLog } from "../../../utils/server-helpers";
import { getChat, setChat } from "../../../redis/redis-server-helpers";
import { findUniqueChat } from "../../../pages/api/get-chat";
import { ChatCompletionMessageParam } from "openai/resources";
import { functions, runFunction } from "./functions";
import { createMessage } from "../../../pages/api/add-message";
import { getPromptTemplate } from "../../../utils/prompt-templates";
import { getChatMessages } from "./helpers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  let { chatId, content, interactionType } = await req.json();

  if (!chatId) {
    return new Response("Missing chat id", { status: 400 });
  }

  if (!content && !interactionType) {
    return new Response("Missing content or interaction type", { status: 400 });
  }

  debugLog(
    `Request is good! chatId: ${chatId}, content: ${content}, interactionType: ${interactionType}`,
  );

  if (interactionType) {
    content = await getPromptTemplate(interactionType, content);
  } else {
    content = content[0];
  }

  let messages: ChatCompletionMessageParam[] = await getChatMessages(chatId);

  if (!messages) {
    return new Response("Error getting chat messages", { status: 400 });
  }

  messages.push({
    role: "user",
    content: content,
  });

  const initialResponse = await openai.chat.completions.create({
    model: "gpt-4-0613",
    messages,
    stream: true,
    functions,
    function_call: "auto",
  });

  const stream = OpenAIStream(initialResponse, {
    onCompletion: async (completion) => {
      //write to redis
      messages.push({
        role: "assistant",
        content: completion,
      });
      setChat(chatId, messages);
      //write to postgres
      await createMessage(
        parseInt(chatId),
        "user",
        content,
        interactionType ? true : false,
      );
      await createMessage(
        parseInt(chatId),
        "assistant",
        completion,
        interactionType && interactionType !== "greeting" ? true : false,
      );
    },
    experimental_onFunctionCall: async ({ name, arguments: args }) => {
      const result = await runFunction(name, args);
      messages.push({
        role: "function",
        name: name,
        content: result,
      });
      await createMessage(
        chatId,
        "function",
        result,
        interactionType ? true : false,
        name,
      );
      return openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        stream: true,
        messages: messages,
        functions,
        function_call: "auto",
      });
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
