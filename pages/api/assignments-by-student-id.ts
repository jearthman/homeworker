import prisma from "../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { studentId } = req.body;

  if (!studentId) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    const studentAssignments = await prisma.studentAssignment.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        assignment: true,
        studentProblemAnswers: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!studentAssignments) {
      res.status(404).json({ message: "Assignments not found" });
      return;
    }

    // const assignments = studentAssignments.map(
    //   (studentAssignment) => studentAssignment.assignment,
    // );

    res.json(studentAssignments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching assignments" });
  }
}
