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

  const data = await response.json();

  return response.status === 404 ? null : data.student;
}

async function fetchAssignments(studentId: number, baseUrl: string) {
  const response = await fetch(`${baseUrl}/api/assignments-by-student-id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ studentId }),
  });

  return response.status === 404 ? null : await response.json();
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["host"];
  const baseUrl = `${protocol}://${host}`;

  const session = await getSession(context);
  const email = session?.user?.email;

  if (email) {
    const student = await fetchStudent(email, baseUrl);

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
    props: { baseUrl },
  };
}

type PortalProps = {
  baseUrl: string;
};

export default function Portal({ baseUrl }: PortalProps) {
  // const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState([]);

  const { data: session } = useSession();
  // const router = useRouter();

  useEffect(() => {
    if (session && session.user && session.user.email) {
      fetchStudent(session.user.email, baseUrl).then((student) => {
        setStudent(student);
      });
    }
  }, [session, baseUrl]);

  useEffect(() => {
    if (student) {
      fetchAssignments(student.id, baseUrl).then((assignments) => {
        setAssignments(assignments);
      });
    }
  }, [student, baseUrl]);

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-200 px-20">
        {/* <div className=" flex flex-col w-1/5 bg-gray-400"></div> */}
        <h1 className="self-center text-3xl font-bold m-12">
          Welcome {student?.firstName}!
        </h1>

        <div className="mx-20] p-4 bg-matcha-300 border-4 border-matcha-400 rounded-xl">
          <div className="text-2xl mb-4 font-semibold">Assignments</div>
          {/* grid layout of assignments */}
          {assignments && (
            <div className="grid grid-cols-4 gap-4">
              {assignments.map((assignment: Assignment) => (
                <div
                  key={assignment.id}
                  className="bg-gray-100 rounded-lg shadow-lg cursor-pointer hover:bg-white hover:shadow-xl transition-colors ease-in"
                >
                  <div className="flex flex-col p-4">
                    <div className="text-lg font-semibold">
                      {assignment.title}
                    </div>
                    <div className="text-sm font-semibold mt-2">
                      Due: {assignment.subject}
                    </div>

                    <div className="text-sm font-semibold mt-2">
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
