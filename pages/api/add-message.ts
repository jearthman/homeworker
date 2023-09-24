import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";
import { convertTextFileToMessageString } from "../../utils/serverHelpers";
import { MessageRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { chatId, role, content } = req.body;

  if (!chatId || !role || !content) {
    return res.status(400).json({ error: "Missing required field" });
  }

  const message = await createMessage(chatId, role, content);

  if (!message) {
    return res.status(400).json({ error: "Error creating message" });
  }

  return res.status(200).json({ message });
}

export async function createMessage(
  chatId: number,
  role: MessageRole,
  content: string,
  hiddenFromUser: boolean = false,
  functionName?: string,
) {
  try {
    const message = await prisma.message.create({
      data: {
        chatId: chatId,
        role: role,
        content: content,
        hiddenFromUser: hiddenFromUser,
        functionName: functionName,
      },
    });

    return message;
  } catch (error: any) {
    return null;
  }
}
