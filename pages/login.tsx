import Header from "./components/header";
import { Card } from "@ds/card";
import { Input } from "@ds/input";
import { useState } from "react";
import { FormEvent } from "react";
import { Label } from "@ds/label";
import { Button } from "@ds/button";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleUserNameChange = (event: FormEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };

  const handlePasswordChange = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <>
      <Header></Header>
      <div className="bg-slate-500 h-screen flex flex-col items-center">
        <Card className="bg-slate-700 w-1/3 text-white mt-16 p-8">
          <div className="text-5xl text-center mb-3">Welcome back.</div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            onChange={handleUserNameChange}
            className="mb-3"
            placeholder="Enter your username"
          ></Input>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            onChange={handlePasswordChange}
            className="mb-6"
            placeholder="Enter your password"
          ></Input>
          <Button className="text-xl px-5">Log in</Button>
        </Card>
      </div>
    </>
  );
}
