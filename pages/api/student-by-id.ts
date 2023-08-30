import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { studentId } = req.body;

  if (!studentId) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(studentId),
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
