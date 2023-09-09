/* eslint-disable import/no-anonymous-default-export */
import { Configuration, OpenAIApi } from "openai";
// import { NextApiRequest, NextApiResponse } from "next";
import { createMessage } from "./add-message";
import { findUniqueChat } from "./get-chat";
import { userMessageIsContextual } from "../../utils/serverHelpers";
import {callCompletionFunction} from "../../utils/completion-function-factory"
import { getInteractionContentString } from "../../utils/interaction-content-strings";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const functions = require("../../public/data/functions.json");

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

  if (!content) {
    return res.status(400).json({
      error: "Missing chat message",
    });
  }

  let messages = await parseMessagesFromChat(chatId);

  if (!messages) {
    return res.status(400).json({
      error: "Error parsing messages from chat",
    });
  }

  if(interactionType){
    content = getInteractionContentString(interactionType, content);
  };

  messages.push({
    role: "user",
    content: content,
  });

  await createMessage(chatId, "user", content, interactionType ? true : false);

  getCompletion(res, chatId, content, messages, interactionType ? true : false);
}

async function getCompletion(res, chatId, userContent, messages, isInteraction){

  let assistantResContent = "";
  let functionArgumentsString = "";
  let functionNameFromGPT = "";

  const completion = openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613",
    messages: messages,
    stream: true,
    functions: functions,
    // function_call: functionName ? {'name': functionName} : "auto",
    function_call: "auto",
  }, {responseType: "stream"});

  completion.then((comp) => {
    comp.data.on("data", async data => {
      data.toString().split("\n").forEach(async (dataObjString) => {
        if (dataObjString) {
          dataObjString = dataObjString.replace("data: ", "");
          if(dataObjString === "[DONE]"){
            if(functionNameFromGPT === "" && functionArgumentsString === ""){
              res.end();
              await createMessage(chatId, "assistant", assistantResContent, isInteraction);
            }
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
            await createMessage(chatId, "function", functionResponse, isInteraction, functionNameFromGPT);
            getCompletion(res, chatId, userContent, messages, isInteraction);
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

export async function parseMessagesFromChat(chatId) {
  const chat = await findUniqueChat(chatId);

  if (!chat) {
    return null;
  }

  const messages = chat.messages.map((message) => {
    return {
      role: message.role,
      content: message.content,
    };
  });

  return messages;
}
