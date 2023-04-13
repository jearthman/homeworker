import axios from "axios";
import Header from "./components/header";
import { FadeInText } from "./components/design-system/fade-in-text";
import { useState } from "react";
import { Card } from "@ds/card";

export default function Signup() {
  const [welcomeTextIndex, setWelcomeTextIndex] = useState(0);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const textData = [
    { text: "Hello", className: "text-white text-6xl drop-shadow-2xl" },
    { text: "Welcome to Thera.", className: "text-white text-4xl" },
    {
      text: "We're going to get you the help you deserve.",
      className: "text-white text-3xl",
    },
  ];

  function handleWelcomeFadeInComplete() {
    setWelcomeTextIndex((prevIndex) => prevIndex + 1);
  }

  return (
    <div className="flex flex-col h-screen bg-slate-500">
      <Header></Header>
      <div className="flex flex-col items-center pt-24">
        <div className="flex flex-col gap-4 items-center w-1/2">
          {textData.map((data, index) => (
            <FadeInText
              key={index}
              text={data.text}
              className={data.className}
              onFadeInComplete={handleWelcomeFadeInComplete}
              isReady={index === welcomeTextIndex}
            />
          ))}
        </div>
        <Card>
          <div></div>
        </Card>
      </div>
    </div>
  );
}
