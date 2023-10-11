import { useEffect, useState, useRef } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import {
  Student,
  Assignment,
  StudentAssignment,
  StudentProblemAnswer,
} from "@prisma/client";
import AssignmentSkeleton from "./components/design-system/assignment-skeleton";

async function fetchStudent(email: string, baseUrl: string) {
  try {
    const response = await fetch(
      `${baseUrl}/api/student-by-email?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return response.status !== 200 ? null : data.student;
  } catch (error) {
    console.error("Error getting student by email:", error);
  }
}

async function fetchAssignments(studentId: number, baseUrl: string) {
  const response = await fetch(
    `${baseUrl}/api/assignments-by-student-id?studentId=${studentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  try {
    return response.status === 404 ? null : await response.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Response:", response);
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const email = session?.user?.email;
  if (!email) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const student = await fetchStudent(email, baseUrl);

  if (!student) {
    return {
      redirect: {
        destination: "/register",
        permanent: false,
      },
    };
  }

  return {
    props: { student },
  };
}

type PortalProps = {
  student: Student;
};

export default function Portal({ student }: PortalProps) {
  // const [loading, setLoading] = useState(true);
  type StudentAssignmentExtended = StudentAssignment & {
    assignment: Assignment;
    studentProblemAnswers: StudentProblemAnswer[];
  };

  const router = useRouter();
  const [studentAssignments, setStudentAssignments] = useState<
    StudentAssignmentExtended[]
  >([]);

  useEffect(() => {
    let baseUrl = "";
    if (typeof window !== "undefined") {
      baseUrl = `${window.location.protocol}//${window.location.host}`;
    }

    async function loadAssignments() {
      if (student) {
        // try {
        //   student = await fetchStudent(email, baseUrl);
        // } catch (error) {
        //   throw new Error(String(error));
        // }

        // if (!student.current) {
        //   router.push("/register");
        //   return;
        // }

        fetchAssignments(student.id, baseUrl).then((studentAssignments) => {
          setStudentAssignments(studentAssignments);
        });
      }
    }

    loadAssignments();
  }, [student]);

  function selectAssignment(assignment: Assignment) {
    router.push(
      `/worker?studentId=${student?.id}&assignmentId=${assignment.id}`,
    );
  }

  function numberOfCorrectProblems(
    studentAssignment: StudentAssignmentExtended,
  ) {
    return studentAssignment.studentProblemAnswers.filter(
      (studentProblemAnswer) => studentProblemAnswer.isCorrect,
    ).length;
  }

  return (
    <>
      <div className="h-screen w-screen bg-gray-300">
        {/* <div className=" flex flex-col w-1/5 bg-gray-400"></div> */}
        <div className="flex h-full flex-col bg-gray-200 md:max-w-6xl lg:mx-auto ">
          <>
            <div className="my-12 self-center text-5xl font-bold">Welcome!</div>

            <div className="mx-4 rounded-xl bg-matcha-300 p-4 shadow-lg">
              <div className="mb-4 text-center text-2xl font-semibold text-matcha-900">
                Here are your current Assignments
              </div>
              {/* grid layout of assignments */}
              <div className="grid grid-cols-3 gap-4">
                {studentAssignments.length === 0 ? (
                  <>
                    <AssignmentSkeleton />
                    <AssignmentSkeleton />
                    <AssignmentSkeleton />
                  </>
                ) : (
                  studentAssignments.map((studentAssignment) => (
                    <div
                      key={studentAssignment.assignment.id}
                      className="cursor-pointer rounded-lg border border-gray-400 bg-gray-50 shadow-lg transition ease-in hover:bg-white hover:shadow-xl"
                      onClick={() =>
                        selectAssignment(studentAssignment.assignment)
                      }
                    >
                      <div className="flex h-full flex-col p-4">
                        <div className="flex items-baseline">
                          <div className="text-lg font-semibold underline">
                            {studentAssignment.assignment.title}
                          </div>
                          <div className="ml-auto text-sm text-gray-500">
                            {studentAssignment.assignment.subject}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          {studentAssignment.assignment.description}
                        </div>
                        {studentAssignment.studentProblemAnswers.length > 0 && (
                          <div className="mt-auto text-xs text-gray-500">
                            {numberOfCorrectProblems(studentAssignment)} of{" "}
                            {studentAssignment.studentProblemAnswers.length}{" "}
                            problems are complete
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
}
