import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";
import { convertTextFileToMessageString } from "../../utils/server-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { studentId, assignmentId } = req.body;

  if (!studentId || !assignmentId) {
    return res.status(400).json({ error: "Missing required field" });
  }

  const parsedStudentId = parseInt(studentId);
  const parsedAssignmentId = parseInt(assignmentId);

  if (isNaN(parsedStudentId) || isNaN(parsedAssignmentId)) {
    return res.status(400).json({ error: "Invalid studentId or assignmentId" });
  }

  //Create Chat and system Message
  let chat = await prisma.chat.create({});

  try {
    // Add Chat to StudentAssignment
    await prisma.studentAssignment.update({
      where: {
        studentId_assignmentId: {
          studentId: parsedStudentId,
          assignmentId: parsedAssignmentId,
        },
      },
      data: {
        chat: {
          connect: {
            id: chat.id,
          },
        },
      },
    });

    // Create system message
    const systemMessageString = await constructSystemMessage(
      parsedStudentId,
      parsedAssignmentId,
    );

    if (!systemMessageString) {
      return res.status(400).json({ error: "Error creating system message" });
    }

    const systemMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        role: "system",
        content: systemMessageString,
      },
    });

    // Add system message to chat
    chat = await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        messages: {
          connect: {
            id: systemMessage.id,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return res.status(200).json({ chat: chat });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function constructSystemMessage(studentId: number, assignmentId: number) {
  let systemMessageString =
    await convertTextFileToMessageString("system_prompt.txt");

  // Get Student from DB
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
    include: {
      nativeLanguage: true, // Include native language
      studentDisabilities: {
        include: {
          disability: true,
        },
      },
    },
  });

  // Get Assignment from DB
  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
  });

  if (!student || !assignment) {
    console.log("Student or Assignment not found");
    return;
  }

  // Build system message using Student and Assignment data
  systemMessageString += "\n\nHere is information about this student:\n\n";
  systemMessageString += "First Name: " + student.firstName + "\n";
  systemMessageString += "Grade Level: " + student.gradeLevel + "\n";
  systemMessageString +=
    "Native Language: " + student.nativeLanguage?.name + "\n";

  const disabilityNames = student.studentDisabilities.map(
    (sd) => sd.disability.name,
  );
  systemMessageString += "Disabilities: " + disabilityNames.join(", ") + "\n";

  systemMessageString += "\n\nHere is information about this assignment:\n\n";
  systemMessageString += "Title: " + assignment.title + "\n";
  systemMessageString += "Description: " + assignment.description + "\n";
  systemMessageString += "Subject: " + assignment.subject + "\n";
  systemMessageString += "Grading Criteria: " + assignment.gradingCriteria;

  return systemMessageString;
}
