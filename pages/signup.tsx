import axios from "axios";
import Header from "./components/header";
import { FadeInText } from "@ds/fade-in-text";
import { useState } from "react";
import { Card } from "@ds/card";
import surveyOptions from "../public/data/sign-up-survey-options.json";
import { ButtonGroup } from "@ds/button-group";
import { Button } from "@ds/button";

export default function Signup() {
  const [welcomeTextIndex, setWelcomeTextIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const textData = [
    { text: "Hello", className: "text-peach-300 text-6xl drop-shadow-2xl" },
    { text: "Welcome to Thera.", className: "text-white text-4xl" },
    {
      text: "We're going to get you the help you deserve.",
      className: "text-white text-3xl",
    },
  ];

  const selectedSurveyOptions = [];

  function handleWelcomeFadeInComplete() {
    setWelcomeTextIndex((prevIndex) => prevIndex + 1);
  }

  return (
    <div className="flex flex-col h-screen bg-slate-500">
      <Header></Header>
      <div className="flex flex-col items-center pt-16">
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
        <Card className="mt-16 p-0 text-center" intent="primary" size="large">
          {surveyOptions.map((question, index) => (
            <div
              key={index}
              className={`${
                index === currentQuestionIndex ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500`}
            >
              <div className="flex items-center mb-5">
                <span className="material-icons">arrow_back</span>
                <div className="text-2xl text-matcha-300" key={index}>
                  {question.question}
                </div>
              </div>
              <ButtonGroup>
                {question.options.map((option, index) => (
                  <Button fullWidth intent="neutral-outline" key={index}>
                    {option.text}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
