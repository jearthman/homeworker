import { Label } from "@ds/label";
import { Input } from "@ds/input";
import { Select } from "@ds/select";
import { useState } from "react";
import { Button } from "@ds/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("2");
  const [nativeLanguage, setNativeLanguage] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  function registerStudent() {
    return async (event: React.FormEvent<HTMLFormElement>) => {
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
      <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
        <h1 className="text-2xl font-bold mb-8 ">
          Please create a simple mock student.
        </h1>
        <form className="flex flex-col" onSubmit={registerStudent()}>
          <Label className="text-black block">First Name</Label>
          <Input
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          ></Input>

          <Label className="text-black block mt-4">Grade Level</Label>
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

          <Label className="text-black block mt-4">Native Language</Label>
          <Input
            value={nativeLanguage}
            onChange={(event) => setNativeLanguage(event.currentTarget.value)}
          ></Input>
          <Button formAction="submit" className="mt-4">
            Create Student
          </Button>
        </form>
      </div>
    </>
  );
}
