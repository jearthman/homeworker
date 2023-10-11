import Label from "@/components/design-system/label";
import Input from "@/components/design-system/input";
import Select from "@/components/design-system/select";
import { useState } from "react";
import Button from "@/components/design-system/button";
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
      <div className="flex h-screen flex-col items-center justify-center bg-gray-200">
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
          <Button formAction="submit" className="mt-4">
            Create Student
          </Button>
        </form>
      </div>
    </>
  );
}
