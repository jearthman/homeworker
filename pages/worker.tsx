import { useState, FormEvent } from "react";
import { Input } from "@/pages/components/design-system/input";
import { Button } from "@/pages/components/design-system/button";
import { type } from "os";
import { FadeInText } from "./components/design-system/fade-in-text";
import React from "react";
import { ToggleSwitch } from "./components/design-system/toggle-switch";
import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "../redux/slices/themeSlice";
import { RootState } from "../redux/store";

export default function Worker() {
  interface ChatMessage {
    type: "input" | "response";
    text: string | string[][];
  }

  interface Sentence {
    words: string[];
    text: string;
  }

  interface ResponseWord {
    text: string;
    sentenceIndex: number;
  }

  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [responseWords, setResponseWords] = useState<ResponseWord[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [responseSentences, setResponseSentences] = useState<Sentence[]>([]);
  const [darkModeOn, setDarkModeOn] = useState<boolean>(false);

  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.value);

  const handleThemeChange = () => {
    // Add a class to disable transitions
    document.documentElement.classList.add("transition-none");

    dispatch(switchTheme());

    // After a short delay, remove the class to re-enable transitions
    setTimeout(() => {
      document.documentElement.classList.remove("transition-none");
    }, 100);
  };

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "input", text: input },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: input,
    });

    setInput("");

    const data = await response.json();

    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }

    const paragraphs = data.message.split(/\n+/);

    const sentencesInParagraphs = paragraphs.map((paragraph: string) => {
      const sentences: string[] = paragraph.split(/(?<=\.|\?|\!)\s/);
      return sentences.map((sentence) => {
        const words = sentence.split(/(?<!\n) +(?!\n)|(\n)/).filter(Boolean);
        return {
          words,
          text: sentence,
        };
      });
    });

    setResponseSentences(sentencesInParagraphs.flat());

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "response", text: data.message },
    ]);
  }

  function toggleDarkMode() {
    setDarkModeOn((prevDarkModeOn) => !prevDarkModeOn);
    handleThemeChange();
  }

  return (
    <>
      <div className="flex justify-center w-screen h-screen bg-white dark:bg-black">
        <div className="flex flex-col xl:w-1/5">
          <ToggleSwitch
            className="mt-5"
            isChecked={darkModeOn}
            onChange={toggleDarkMode}
            checkedIcon={<span className="material-icons">dark_mode</span>}
            uncheckedIcon={<span className="material-icons">light_mode</span>}
          />
        </div>
        {/* desktop worker col */}
        <div className="flex flex-col max-w-3xl w-full">
          {/* chat */}
          <div className="flex flex-col h-4/5 overflow-y-auto px-5 justify-end">
            {chatLog.map((chatMessage, index) => (
              <>
                {chatMessage.type === "input" && (
                  <div
                    key={index}
                    className="mb-3 inline-flex text-blue-600 dark:text-blue-400"
                  >
                    {chatMessage.text}
                  </div>
                )}
                {chatMessage.type === "response" && (
                  <div className="cursor-pointer text-black dark:text-white">
                    {responseSentences.map((sentence: Sentence, i: number) => (
                      <span
                        key={`sentence-${i}`}
                        className="border border-transparent hover:border-b-green-600 dark:hover:border-b-green-400"
                      >
                        {sentence.words.map((word: string, j: number) => (
                          <span
                            key={`word-${j}`}
                            className="mr-1 hover:text-green-600 dark:hover:text-green-400 inline-block"
                          >
                            {word}
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ))}
          </div>
          <div className="flex flex-col h-1/5 justify-center">
            <form className="flex px-5" onSubmit={sendMessage}>
              <Input
                type="text"
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                className="border-r-0 rounded-r-none w-full"
              ></Input>
              <Button
                type="submit"
                intent="inner-form"
                className="border-l-0 rounded-l-none"
              >
                <span className="material-icons">send</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
