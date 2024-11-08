import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { debugLog } from "../../../utils/server-helpers";
import { setChat } from "../../../redis/redis-server-helpers";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageParam,
} from "openai/resources";
import { functions, runFunction } from "./functions";
import { createMessage } from "../../../pages/api/add-message";
import { getPromptTemplate } from "../../../utils/prompt-templates";
import { getChatMessages } from "./helpers";
import { APIError } from "openai/error";

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

  let messages: ChatCompletionMessageParam[] = [];

  if (interactionType) {
    content = await getPromptTemplate(interactionType, content);
  } else {
    content = content[0];
  }

  const messageIsOutOfContext =
    interactionType &&
    interactionType !== "checkAnswer" &&
    interactionType !== "greeting";

  if (!messageIsOutOfContext) {
    messages = await getChatMessages(chatId);
  }

  if (!messages) {
    return new Response("Error getting chat messages", { status: 400 });
  }

  messages.push({
    role: "user",
    content: content,
  });

  try {
    const initialResponse = await openai.chat.completions.create({
      model: "gpt-4-0613",
      messages,
      stream: true,
      functions,
      function_call: "auto",
    });

    const stream = OpenAIStream(initialResponse, {
      onStart: async () => {
        //write user message to DB
        if (!messageIsOutOfContext) {
          await createMessage(
            parseInt(chatId),
            "user",
            content,
            interactionType ? true : false,
          );
        }
      },
      onFinal: async (completion) => {
        //write messages to redis
        if (!messageIsOutOfContext) {
          messages.push({
            role: "assistant",
            content: completion,
          });
          setChat(chatId, messages);
          //write assistant message to DB
          await createMessage(
            parseInt(chatId),
            "assistant",
            completion,
            interactionType && interactionType !== "greeting" ? true : false,
          );
        }
      },
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages,
      ) => {
        const result = await runFunction(name, args);

        const newMessages = await createFunctionCallMessages(result);
        const assistantMessage = newMessages[0];

        let functionCall;
        if (
          typeof assistantMessage.function_call === "object" &&
          assistantMessage.function_call.arguments !== undefined
        ) {
          functionCall = {
            name: name,
            arguments: assistantMessage.function_call?.arguments,
          };
        }
        //write assistant message and function call message to redis
        messages.push({
          role: "assistant",
          function_call: functionCall,
          content: "",
        });

        messages.push({
          role: "function",
          name: name,
          content: result,
        });
        //write function message to DB
        if (!messageIsOutOfContext) {
          await createMessage(
            chatId,
            "assistant",
            "",
            true,
            JSON.stringify(functionCall),
          );

          await createMessage(
            chatId,
            "function",
            result,
            interactionType ? true : false,
            undefined,
            name,
          );
        }
        return openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          stream: true,
          messages: messages,
          functions,
          function_call: "auto",
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.log("ERROR WHILE GETTING INITAL RESPONSE: ", error);

    if (error instanceof APIError) {
      return new Response(`Error: ${error.code}`, {
        status: error.status,
        headers: {
          "X-Error-Code": error.code || "unknown",
          "Access-Control-Expose-Headers": "X-Error-Code",
        },
      });
    }
    return new Response("Error creating initial response", { status: 400 });
  }
}
