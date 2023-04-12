import axios from "axios";
import Header from "./components/header";
import { FadeInText } from "./components/design-system/fade-in-text";
import { useState } from "react";

export default function Signup() {
  const [activeIndex, setActiveIndex] = useState(0);
  const textData = [
    { text: "Hello", className: "text-white text-3xl" },
    { text: "World", className: "text-gray-500 text-6xl" },
    { text: "!", className: "text-blue-500 text-2xl" },
  ];

  function handleFadeInComplete() {
    setActiveIndex((prevIndex) => prevIndex + 1);
  }

  return (
    <>
      <Header></Header>
      <div className="bg-slate-500 h-screen flex flex-col items-center pt-24">
        <FadeInText text="Hello" className="text-7xl text-center text-white" />
      </div>
    </>
  );
}
