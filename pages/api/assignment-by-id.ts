import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { assignmentId } = req.body;

  if (!assignmentId) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: parseInt(assignmentId),
      },
    });

    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }

    res.status(200).json({ assignment });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
