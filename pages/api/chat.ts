/* eslint-disable import/no-anonymous-default-export */
import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { convertTextFileToMessageString } from "../../utils/completionHelpers";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const message = req.body || "";

  if (!message) {
    return res.status(400).json({
      error: "Missing chat message",
    });
  }

  //get user demographic context
  if (message === "demo") {
    return res.status(200).json({
      message:
        "The sun slowly sank below the horizon, casting a kaleidoscope of colors across the sky, as a gentle breeze rustled through the verdant leaves of the ancient oak tree. In the distance, the rhythmic sound of waves crashing against the shore filled the air with a sense of serenity. A curious fox cautiously emerged from the underbrush, its amber eyes reflecting the fading light, and began to explore the twilight world. The aroma of a distant campfire mingled with the earthy scent of the forest, creating a symphony of sensations. As the first stars began to twinkle in the ever-darkening sky, the world seemed to hold its breath, waiting for the mysteries of the night to unfold. \n\n The sun slowly sank below the horizon, casting a kaleidoscope of colors across the sky, as a gentle breeze rustled through the verdant leaves of the ancient oak tree. In the distance, the rhythmic sound of waves crashing against the shore filled the air with a sense of serenity. A curious fox cautiously emerged from the underbrush, its amber eyes reflecting the fading light, and began to explore the twilight world. The aroma of a distant campfire mingled with the earthy scent of the forest, creating a symphony of sensations. As the first stars began to twinkle in the ever-darkening sky, the world seemed to hold its breath, waiting for the mysteries of the night to unfold",
    });
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: message }],
  });

  return res.status(200).json({
    message: completion.data.choices[0],
  });
}
