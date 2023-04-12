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
            <div className="text-red-500 mb-3">{passwordError}</div>
          )}
          <Button onClick={handleLogin} className="text-xl px-5 mt-6">
            Log in
          </Button>
        </Card>
      </div>
    </>
  );
}
