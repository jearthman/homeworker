import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ error: "Missing required field" });
  }

  // Parsing and validating chatId
  const parsedChatId = parseInt(chatId);
  if (isNaN(parsedChatId)) {
    return res.status(400).json({ error: "Invalid chatId" });
  }

  const chat = await findUniqueChat(parsedChatId);

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  return res.status(200).json({ chat });
}

export async function findUniqueChat(chatId: number) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });

    return chat;
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error finding unique chat:", error.message);
    return null;
  }
}
