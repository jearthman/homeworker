import { NextApiRequest, NextApiResponse } from "next";
import { MessageRole, PrismaClient } from "@prisma/client";
import { convertTextFileToMessageString } from "../../utils/serverHelpers";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
  content: string
) {
  try {
    const message = await prisma.message.create({
      data: {
        chatId: chatId,
        role: role,
        content: content,
      },
    });

    return message;
  } catch (error: any) {
    return null;
  }
}
