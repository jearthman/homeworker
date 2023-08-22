/* eslint-disable import/no-anonymous-default-export */
import { Configuration, OpenAIApi } from "openai";
// import { NextApiRequest, NextApiResponse } from "next";
import { createMessage } from "./add-message";
import { findUniqueChat } from "./get-chat";
import { userMessageIsContextual } from "../../utils/serverHelpers";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req,
  res
) {
  const { chatId, content } = req.body || "";

  if (!content) {
    return res.status(400).json({
      error: "Missing chat message",
    });
  }

  // test
  // if (content === "demo") {
  //   return res.status(200).json({
  //     message:
  //       "The sun slowly sank below the horizon, casting a kaleidoscope of colors across the sky, as a gentle breeze rustled through the verdant leaves of the ancient oak tree. In the distance, the rhythmic sound of waves crashing against the shore filled the air with a sense of serenity. A curious fox cautiously emerged from the underbrush, its amber eyes reflecting the fading light, and began to explore the twilight world. The aroma of a distant campfire mingled with the earthy scent of the forest, creating a symphony of sensations. As the first stars began to twinkle in the ever-darkening sky, the world seemed to hold its breath, waiting for the mysteries of the night to unfold. \n\n The sun slowly sank below the horizon, casting a kaleidoscope of colors across the sky, as a gentle breeze rustled through the verdant leaves of the ancient oak tree. In the distance, the rhythmic sound of waves crashing against the shore filled the air with a sense of serenity. A curious fox cautiously emerged from the underbrush, its amber eyes reflecting the fading light, and began to explore the twilight world. The aroma of a distant campfire mingled with the earthy scent of the forest, creating a symphony of sensations. As the first stars began to twinkle in the ever-darkening sky, the world seemed to hold its breath, waiting for the mysteries of the night to unfold",
  //   });
  // }

  let messages = await parseMessagesFromChat(chatId);

  if (!messages) {
    return res.status(400).json({
      error: "Error parsing messages from chat",
    });
  }

  messages.push({
    role: "user",
    content: content,
  });

  let assistantResContent = "";

  const completion = openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613",
    messages: messages,
    stream: true,
  }, {responseType: "stream"});

  completion.then((comp) => {
    comp.data.on("data", async data => {
      data.toString().split("\n").forEach(async (dataObjString) => {
        if (dataObjString) {
          console.log(dataObjString);
          dataObjString = dataObjString.replace("data: ", "");
          if(dataObjString === "[DONE]"){
            res.end();
            await createMessage(chatId, "user", content);
            await createMessage(chatId, "assistant", assistantResContent);
            return;
          }
          const dataObj = JSON.parse(dataObjString);
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
  });
  

  if (!completion) {
    return res.status(400).json({
      error: "Error getting completion",
    });
  }

  // return res.status(200).json({
  //   message: completion.data,
  // });
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
