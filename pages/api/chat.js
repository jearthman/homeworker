/* eslint-disable import/no-anonymous-default-export */
import { Configuration, OpenAIApi } from "openai";
// import { NextApiRequest, NextApiResponse } from "next";
import { createMessage } from "./add-message";
import { findUniqueChat } from "./get-chat";
import {callCompletionFunction} from "../../utils/completion-function-factory"
import { getPromptTemplate } from "../../utils/prompt-templates";
import { getChat, setChat } from "../../redis/redis-server-helpers";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const functions = require("../../public/data/functions.json");

function debugLog(message) {
  if (process.env.DEBUG === 'true') {
    console.log("[DEBUG]:", message);
  }
}

export default async function handler(
  req,
  res
) {
  let { chatId, content, interactionType } = req.body || "";

  if (!chatId) {
    return res.status(400).json({
      error: "Missing chat id",
    });
  }

  if (!content && !interactionType) {
    return res.status(400).json({
      error: "Missing chat message",
    });
  }

  debugLog(`Request is good! chatId: ${chatId}, content: ${content}, interactionType: ${interactionType}`);

  let messages = await getChatMessages(chatId);

  if (!messages) {
    return res.status(400).json({
      error: "Error parsing messages from chat",
    });
  }

  debugLog(`messages: ${messages}`);

  if(interactionType){
    content = await getPromptTemplate(interactionType, content);
  } else {
    content = content[0]
  }

  debugLog(`content: ${content}`);

  messages.push({
    role: "user",
    content: content,
  });

  getCompletion(res, chatId, content, messages, interactionType);
}

async function getCompletion(res, chatId, userContent, messages, interactionType){

  let assistantResContent = "";
  let functionArgumentsString = "";
  let functionNameFromGPT = "";

  debugLog("Starting completion and stream");

  const completion = openai.createChatCompletion({
    model: "gpt-4-0613",
    messages: messages,
    stream: true,
    functions: functions,
    // function_call: functionName ? {'name': functionName} : "auto",
    function_call: "auto",
  }, {responseType: "stream"});

  debugLog(`completion: ${completion}`);

  completion.then((comp) => {
    comp.data.on("data", async data => {
      debugLog(`data: ${data}`);
      data.toString().split("\n").forEach(async (dataObjString) => {
        if (dataObjString) {
          dataObjString = dataObjString.replace("data: ", "");
          if(dataObjString === "[DONE]"){
            if(functionNameFromGPT === "" && functionArgumentsString === ""){
              res.end();
              //write to redis
              messages.push({
                role: "assistant",
                content: assistantResContent,
              });
              setChat(chatId, messages);
              //write to postgres
              await createMessage(chatId, "user", userContent, interactionType ? true : false);
              await createMessage(chatId, "assistant", assistantResContent, interactionType && interactionType !== "greeting" ? true : false);
            }
            debugLog(`Done with stream: ${assistantResContent}`);
            return;
          }
          const dataObj = JSON.parse(dataObjString);
          if(dataObj.choices[0].finish_reason === "function_call"){
            //call completion again with function response
            const functionResponse = await callCompletionFunction(functionNameFromGPT, functionArgumentsString);
            messages.push({
              role: "function",
              name: functionNameFromGPT,
              content: functionResponse,
            });
            await createMessage(chatId, "function", functionResponse, interactionType ? true : false, functionNameFromGPT);
            getCompletion(res, chatId, userContent, messages, interactionType ? true : false);
          }
          if(dataObj.choices[0].delta.function_call){
            if(dataObj.choices[0].delta.function_call.name && functionNameFromGPT === ""){
              functionNameFromGPT = dataObj.choices[0].delta.function_call.name;
            }
            if(dataObj.choices[0].delta.function_call.arguments.length > 0){
              functionArgumentsString += dataObj.choices[0].delta.function_call.arguments;
            }
          }
          if(dataObj.choices[0].delta.role){
            return;
          }
          if(dataObj.choices[0].delta.content?.length > 0){
            assistantResContent += dataObj.choices[0].delta.content;
            res.write(dataObj.choices[0].delta.content);
          }
        }
      });
    });
  }).catch((error) => {
    console.error(error);
    res.status(500).json({ error: 'An error occurred when processing completion' });
    res.end();
  });
  

  if (!completion) {
    res.status(400).json({
      error: "Error getting completion",
    });
    res.end();
  }
}

export async function getChatMessages(chatId) {

  const cachedChat = await getChat(chatId);

  debugLog(`cachedChat: ${cachedChat}`);

  if(cachedChat){
    return cachedChat;
  }

  const chat = await findUniqueChat(chatId);

  if (!chat) {
    return null;
  }

  debugLog(`chat: ${chat}`);

  const messages = chat.messages.map((message) => {
    return {
      role: message.role,
      content: message.content,
    };
  });

  return messages;
}
