import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chatId } = req.body;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: parseInt(chatId),
      },
      include: {
        messages: true,
      },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    res.status(200).json({ chat });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
