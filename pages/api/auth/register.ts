import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email, firstName, gradeLevel, nativeLanguage } = req.body;

  if (!email || !firstName || !gradeLevel || !nativeLanguage) {
    res.status(400).json({ message: "Invalid request data" });
    return;
  }

  try {
    let existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          email, // Your user creation data here
        },
      });
    }

    const existingLanguage = await prisma.language.findUnique({
      where: { name: nativeLanguage },
    });

    let nativeLanguageObject;

    // If the language exists, use its ID to connect it
    if (existingLanguage) {
      nativeLanguageObject = {
        connect: { id: existingLanguage.id },
      };
    } else {
      // If the language doesn't exist, create a new record
      nativeLanguageObject = {
        create: { name: nativeLanguage },
      };
    }

    const createdStudent = await prisma.student.create({
      data: {
        firstName,
        gradeLevel,
        nativeLanguage: nativeLanguageObject,
        user: {
          connect: {
            id: existingUser.id,
          },
        },
      },
    });

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        studentId: createdStudent.id,
      },
    });

    // create StudentAssignment records for each assignment of the student's grade level
    const assignments = await prisma.assignment.findMany({
      where: {
        gradeLevel,
      },
      include: {
        problems: true,
      },
    });

    const studentAssignments = assignments.map((assignment) => {
      return {
        studentId: createdStudent.id,
        assignmentId: assignment.id,
        status: "NOT STARTED",
      };
    });

    const studentProblemAnswers = assignments.flatMap((assignment) => {
      return assignment.problems.map((problem) => {
        return {
          studentId: createdStudent.id,
          problemId: problem.id,
          assignmentId: assignment.id,
          answer: "",
        };
      });
    });

    await prisma.studentAssignment.createMany({
      data: studentAssignments,
    });

    await prisma.studentProblemAnswer.createMany({
      data: studentProblemAnswers,
    });

    res.status(200).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
