import prisma from "../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
