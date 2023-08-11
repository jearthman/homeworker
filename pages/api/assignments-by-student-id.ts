import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

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
    const studentAssignments = await prisma.studentAssignment.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        assignment: true, // Include the related assignment details
      },
    });

    if (!studentAssignments) {
      res.status(404).json({ message: "Assignments not found" });
      return;
    }

    const assignments = studentAssignments.map(
      (studentAssignment) => studentAssignment.assignment
    );

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching assignments" });
  }
}
