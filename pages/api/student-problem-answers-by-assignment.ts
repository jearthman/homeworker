import prisma from "../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { studentId, assignmentId } = req.body;

  if (!studentId || !assignmentId) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  const studentProblemAnswersRes = await getStudentProblemAnswers(
    parseInt(studentId),
    parseInt(assignmentId),
  );

  if (!studentProblemAnswersRes) {
    res.status(404).json({ message: "Student problem answers not found" });
    return;
  }

  res.status(200).json(studentProblemAnswersRes.studentProblemAnswers);
}

export async function getStudentProblemAnswers(
  studentId: number,
  assignmentId: number,
) {
  return await prisma.studentAssignment.findUnique({
    where: {
      studentId_assignmentId: {
        studentId: studentId,
        assignmentId: assignmentId,
      },
    },
    select: {
      studentProblemAnswers: {
        select: {
          id: true,
          studentId: true,
          problemId: true,
          assignmentId: true,
          answer: true,
          feedback: true,
          isCorrect: true,
          timestamp: true,
        },
        orderBy: {
          problemId: "asc",
        },
      },
    },
  });
}
