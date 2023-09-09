import axios from "axios";
import Header from "./components/header";
import FadeInText from "@/pages/components/design-system/fade-in-text";
import { useState } from "react";
import Card from "@/pages/components/design-system/card";

import ButtonGroup from "@/pages/components/design-system/button-group";
import Button from "@/pages/components/design-system/button";

export default function Signup() {
  const [welcomeTextIndex, setWelcomeTextIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

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
    if (welcomeTextIndex === textData.length) {
      setWelcomeTextIndex(0);
    }
  }

  function getQuestionClass(index: number, currentQuestionIndex: number) {
    if (index === currentQuestionIndex) {
      if (fadeOut) {
        return "opacity-0";
      } else {
        return "opacity-100";
      }
    } else {
      return "opacity-0 invisible";
    }
  }

  function pushOptions(options: string[]) {
    changeQuestion(1);

    if (options.length === 1) {
      selectedSurveyOptions.push(options[0]);
      return;
    }

    selectedSurveyOptions.push(options);
  }

  function changeQuestion(direction: number) {
    setFadeOut(true);
    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => prevIndex + direction);
      setFadeOut(false);
    }, 500);
  }

  return (
    <div className="flex h-screen flex-col bg-slate-500">
      <Header></Header>
      <div className="flex flex-col items-center pt-16">
        <div className="flex w-1/2 flex-col items-center gap-4">
          {/* {textData.map((data, index) => (
            <FadeInText
              key={index}
              text={data.text}
              className={data.className}
              onFadeInComplete={handleWelcomeFadeInComplete}
              isReady={index === welcomeTextIndex}
            />
          ))} */}
        </div>
        <Card
          className={`relative mt-16 transition-opacity duration-[2000ms] ease-in-out ${
            welcomeTextIndex === textData.length ? "opacity-100" : "opacity-0"
          }`}
          intent="primary"
          size="large"
        >
          {/* {surveyOptions.map((question, index) => (
            <div
              key={index}
              className={`${getQuestionClass(
                index,
                currentQuestionIndex
              )} transition-opacity duration-500 absolute`}
            >
              <div
                className={`${
                  index === currentQuestionIndex ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500`}
              >
                {index > 0 && (
                  <div
                    title="Go Back"
                    className="material-icons cursor-default hover:text-peach-300 hover:cursor-pointer transition-colors duration-500 ease-in-out"
                    onClick={() => changeQuestion(-1)}
                  >
                    arrow_back
                  </div>
                )}
                <div className="flex items-center relative mb-5">
                  <div
                    className="text-2xl text-matcha-300 flex-grow text-center"
                    key={index}
                  >
                    {question.question}
                  </div>
                </div>
                {question.type === "button" && (
                  <ButtonGroup>
                    {question.options.map((option, index) => (
                      <Button
                        fullWidth
                        intent="neutral-outline"
                        key={index}
                        onClick={() => pushOptions([option.value])}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </ButtonGroup>
                )}
              </div>
            </div>
          ))} */}
        </Card>
      </div>
    </div>
  );
}
