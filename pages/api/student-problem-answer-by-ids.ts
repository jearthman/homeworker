import prisma from "../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { studentId, problemId } = req.body;

  if (!studentId || !problemId) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    const studentProblemAnswer = await prisma.studentProblemAnswer.findUnique({
      where: {
        studentId_problemId: {
          studentId: parseInt(studentId),
          problemId: parseInt(problemId),
        },
      },
    });

    if (!studentProblemAnswer) {
      res.status(404).json({ message: "Student problem answer not found" });
      return;
    }

    res.status(200).json({ studentProblemAnswer });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
