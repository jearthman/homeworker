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

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const student = await prisma.student.findUnique({
      where: {
        userId: user?.id,
      },
    });

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({ student });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
