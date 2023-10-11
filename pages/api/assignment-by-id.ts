import prisma from "../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const assignmentId = Array.isArray(req.query.assignmentId)
    ? req.query.assignmentId[0]
    : req.query.assignmentId;

  if (!assignmentId) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: parseInt(assignmentId),
      },
      include: {
        problems: true,
      },
    });

    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }

    res.status(200).json(assignment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
