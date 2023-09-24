import prisma from "../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { studentId, problemId, answer, isCorrect } = req.body;

  if (!studentId || !problemId || !answer || isCorrect === null) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    const updateStudentProblemAnswerRes =
      await prisma.studentProblemAnswer.update({
        where: {
          studentId_problemId: {
            studentId: parseInt(studentId),
            problemId: parseInt(problemId),
          },
        },
        data: {
          answer,
          isCorrect,
        },
      });

    return res.status(200).json(updateStudentProblemAnswerRes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
