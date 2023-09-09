import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { Student, Assignment } from "@prisma/client";

async function fetchStudent(email: string, baseUrl: string) {
  const response = await fetch(`${baseUrl}/api/student-by-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  try {
    const data = await response.json();
    return response.status === 404 ? null : data.student;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Response:", response);
  }
}

async function fetchAssignments(studentId: number, baseUrl: string) {
  const response = await fetch(`${baseUrl}/api/assignments-by-student-id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ studentId }),
  });

  try {
    return response.status === 404 ? null : await response.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Response:", response);
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["host"];
  const baseUrl = `${protocol}://${host}`;

  const session = await getSession(context);
  const email = session?.user?.email;
  let student = null;

  if (email) {
    try {
      student = await fetchStudent(email, baseUrl);
    } catch (error) {
      throw new Error(String(error));
    }

    if (!student) {
      return {
        redirect: {
          destination: "/register",
          permanent: false,
        },
      };
    }
  }

  return {
    props: { baseUrl, student },
  };
}

type PortalProps = {
  baseUrl: string;
  student: Student;
};

export default function Portal({ baseUrl, student }: PortalProps) {
  // const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);

  const { data: session } = useSession();
  // const router = useRouter();

  useEffect(() => {
    if (student) {
      fetchAssignments(student.id, baseUrl).then((assignments) => {
        setAssignments(assignments);
      });
    }
  }, [student, baseUrl]);

  function selectAssignment(assignment: Assignment) {
    router.push(
      `/worker?studentId=${student?.id}&assignmentId=${assignment.id}`,
    );
  }

  return (
    <>
      <div className="flex h-screen flex-col bg-gray-200 px-20">
        {/* <div className=" flex flex-col w-1/5 bg-gray-400"></div> */}
        <h1 className="m-12 self-center text-3xl font-bold">
          Welcome {student?.firstName}!
        </h1>

        <div className="mx-20] rounded-xl border-4 border-matcha-400 bg-matcha-300 p-4">
          <div className="mb-4 text-2xl font-semibold">Assignments</div>
          {/* grid layout of assignments */}
          {assignments && (
            <div className="grid grid-cols-4 gap-4">
              {assignments.map((assignment: Assignment) => (
                <div
                  key={assignment.id}
                  className="cursor-pointer rounded-lg bg-gray-100 shadow-lg transition ease-in hover:bg-white hover:shadow-xl"
                  onClick={() => selectAssignment(assignment)}
                >
                  <div className="flex flex-col p-4">
                    <div className="text-lg font-semibold">
                      {assignment.title}
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                      Subject: {assignment.subject}
                    </div>

                    <div className="mt-2 text-sm font-semibold">
                      {" "}
                      {assignment.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <div className="flex justify-around mx-20 mt-20">
            <div className="bg-sky-200 rounded-xl p-4 border-4 border-sky-400">
              <div className="text-2xl font-semibold mb-4">Schedule</div>
              <div className="text-sm font-semibold">Monday</div>
              <div className="text-sm font-semibold">Tuesday</div>
              <div className="text-sm font-semibold">Wednesday</div>
              <div className="text-sm font-semibold">Thursday</div>
              <div className="text-sm font-semibold">Friday</div>
            </div>
            <div className="bg-yellow-200 rounded-xl p-4 border-4 border-yellow-400">
              <div className="text-2xl font-semibold mb-4">Courses</div>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-200 transition-colors ease-in">
                    <div className="flex flex-col p-4">
                      <div className="text-lg font-semibold">
                        Introduction to Psychology
                      </div>
                      <div className="text-sm font-semibold">
                        Instructor: Dr. John Doe
                      </div>
                      <div className="text-sm font-semibold">
                        Time: 10:00 - 11:00 AM
                      </div>
                      <div className="text-sm font-semibold">
                        Location: Zoom
                      </div>
                      <div className="text-sm font-semibold">
                        Days: Monday, Wednesday, Friday
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-pink-200 rounded-xl p-4 border-4 border-pink-400">
              <div className="text-2xl font-semibold mb-4">Resources</div>
              <div className="text-sm font-semibold">Syllabus</div>
              <div className="text-sm font-semibold">Zoom Link</div>
              <div className="text-sm font-semibold">Office Hours</div>
              <div className="text-sm font-semibold">Tutoring</div>
            </div>
          </div> */}
      </div>
    </>
  );
}
