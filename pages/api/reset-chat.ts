import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";
import { setChat } from "../../redis/redis-server-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ error: "Missing chatId" });
  }

  //delete messages from chat except for system message
  try {
    setChat(chatId, null);
    await prisma.message.deleteMany({
      where: {
        chatId: chatId,
        role: { not: "system" },
      },
    });
    return res.status(200).json({ message: "Chat reset" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}
