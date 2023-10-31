import prisma from "../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getStudent, setStudent } from "../../redis/redis-server-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const studentId = Array.isArray(req.query.studentId)
    ? req.query.studentId[0]
    : req.query.studentId;

  if (!studentId) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    let student = await getStudent(studentId);

    if (!student) {
      student = await prisma.student.findUnique({
        where: {
          id: parseInt(studentId),
        },
      });

      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      setStudent(student.id.toString(), student);
    }

    return res.status(200).json(student);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
