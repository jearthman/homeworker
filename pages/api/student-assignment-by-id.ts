import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { studentId, assignmentId } = req.body;

  if (!studentId || !assignmentId) {
    return res.status(400).json({ error: "Missing required field" });
  }

  try {
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: parseInt(studentId),
          assignmentId: parseInt(assignmentId),
        },
      },
      include: {
        chat: {
          include: {
            messages: true,
          },
        },
      },
    });

    if (!studentAssignment) {
      return res.status(404).json({ error: "Student assignment not found" });
    }

    return res.status(200).json({ studentAssignment });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
