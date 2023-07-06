import { useState, FormEvent } from "react";
import { Input } from "@/pages/components/design-system/input";
import { Button } from "@/pages/components/design-system/button";
import { type } from "os";
import { FadeInText } from "./components/design-system/fade-in-text";
import React from "react";
import { ToggleSwitch } from "./components/design-system/toggle-switch";

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
  }

  return (
    <>
      <div className="flex justify-center w-screen h-screen bg-white">
        <div className="flex flex-col xl:w-1/5">
          <ToggleSwitch isChecked={darkModeOn} onChange={toggleDarkMode} />
        </div>
        {/* desktop worker col */}
        <div className="flex flex-col max-w-3xl w-full">
          {/* chat */}
          <div className="flex flex-col h-4/5 overflow-y-auto px-5 justify-end">
            {chatLog.map((chatMessage, index) => (
              <>
                {chatMessage.type === "input" && (
                  <div key={index} className="mb-3 inline-flex text-blue-600">
                    {chatMessage.text}
                  </div>
                )}
                {chatMessage.type === "response" && (
                  <div className="cursor-pointer text-black leading-tight">
                    {responseSentences.map((sentence: Sentence, i: number) => (
                      <span key={`sentence-${i}`} className="hover:bg-red-200">
                        {sentence.words.map((word: string, j: number) => (
                          <span
                            key={`word-${j}`}
                            className="mr-1 hover:underline decoration-red-500 inline-block leading-tight"
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
