import Header from "./components/header";
import Card from "@/pages/components/design-system/card";
import Input from "@/pages/components/design-system/input";
import { useState } from "react";
import { FormEvent } from "react";
import Label from "@/pages/components/design-system/label";
import Button from "@/pages/components/design-system/button";
import Checkbox from "@/pages/components/design-system/checkbox";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleUserNameChange = (event: FormEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };

  const handlePasswordChange = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleLogin = () => {
    // Validate inputs before submitting
    setUsernameError("");
    setPasswordError("");

    if (!username) {
      setUsernameError("Username is required");
    }
    if (!password) {
      setPasswordError("Password is required");
    }

    // Submit form if there are no errors
    if (!usernameError && !passwordError) {
      console.log("Form submitted");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-500">
      <Header></Header>
      <div className="flex flex-col items-center">
        <Card className="mt-16 w-1/3" intent="primary">
          <div className="mb-3 text-center text-5xl">Welcome back.</div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            onChange={handleUserNameChange}
            className=""
            placeholder="Enter your username"
          ></Input>
          {usernameError && <div className="text-red-500">{usernameError}</div>}
          <Label className="mt-3" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            onChange={handlePasswordChange}
            placeholder="Enter your password"
          ></Input>
          {passwordError && (
            <div className="mb-3 text-red-500">{passwordError}</div>
          )}
          <Checkbox className="mt-3" label="Remember this device?"></Checkbox>
          <Button onClick={handleLogin} className="mt-6 px-5 text-xl">
            Log in
          </Button>
        </Card>
      </div>
    </div>
  );
}
