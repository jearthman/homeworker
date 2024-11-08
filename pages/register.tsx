import Label from "@/components/design-system/label";
import Input from "@/components/design-system/input";
import Select from "@/components/design-system/select";
import { useState } from "react";
import Button from "@/components/design-system/button";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

type RegisterProps = {
  session: ReturnType<typeof useSession>["data"];
};

export default function Register({ session }: RegisterProps) {
  const [firstName, setFirstName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("2");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [registering, setRegistering] = useState(false);

  const router = useRouter();

  function registerStudent() {
    return async (event: React.FormEvent<HTMLFormElement>) => {
      setRegistering(true);
      event.preventDefault();
      console.log(firstName, gradeLevel, nativeLanguage);

      const email = session?.user?.email;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          gradeLevel,
          nativeLanguage,
        }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      router.push("/portal");
    };
  }

  return (
    <>
      {/* student account registreation form */}
      <div
        className="flex h-screen flex-col items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 70%, rgba(174, 216, 141, 0.7), rgba(174, 216, 141, 0) 50%),
                    radial-gradient(circle at 70% 30%, rgba(186, 230, 253, 0.7), rgba(186, 230, 253, 0) 50%),
                    rgb(229, 231, 235)`,
        }}
      >
        <h1 className="mb-8 text-2xl font-bold ">
          Please create a simple mock student.
        </h1>
        <form className="flex flex-col" onSubmit={registerStudent()}>
          <Label className="block text-black">First Name</Label>
          <Input
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          ></Input>

          <Label className="mt-4 block text-black">Grade Level</Label>
          <Select
            value={gradeLevel}
            onChange={(event) =>
              setGradeLevel((event.target as HTMLSelectElement).value)
            }
          >
            <option value="2">2nd</option>
            <option value="4">4th</option>
            <option value="6">6th</option>
          </Select>

          <Label className="mt-4 block text-black">Native Language</Label>
          <Input
            value={nativeLanguage}
            onChange={(event) => setNativeLanguage(event.currentTarget.value)}
          ></Input>
          <Button formAction="submit" className="mt-4" disabled={registering}>
            Create Student
            {registering && (
              <span className="ml-1 animate-spin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
                </svg>
              </span>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
