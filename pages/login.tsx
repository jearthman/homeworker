import Header from "./components/header";
import { Card } from "@ds/card";
import { Input } from "@ds/input";
import { useState } from "react";
import { FormEvent } from "react";
import { Label } from "@ds/label";
import { Button } from "@ds/button";
import { Checkbox } from "@ds/checkbox";

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
    <div className="flex flex-col h-screen bg-slate-500">
      <Header></Header>
      <div className="flex flex-col items-center">
        <Card className="w-1/3 mt-16" intent="primary">
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
          <Checkbox className="mt-3" label="Remember this device?"></Checkbox>
          <Button onClick={handleLogin} className="text-xl px-5 mt-6">
            Log in
          </Button>
        </Card>
      </div>
    </div>
  );
}
