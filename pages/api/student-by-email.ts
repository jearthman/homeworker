import prisma from "../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import {
  getStudent,
  setStudent,
  getUser,
  setUser,
} from "../../redis/redis-server-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const email = Array.isArray(req.query.email)
    ? req.query.email[0]
    : req.query.email;

  if (!email) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    let user = await getUser(email);

    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      setUser(email, user);
    }

    let student = user?.studentId
      ? await getStudent(user.studentId.toString())
      : null;

    if (!student) {
      student = await prisma.student.findUnique({
        where: {
          userId: user?.id,
        },
      });

      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      setStudent(student.id.toString(), student);
    }

    res.status(200).json({ student });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
