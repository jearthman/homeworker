import { useState, FormEvent } from "react";
import { Input } from "@ds/input";
import { Button } from "@ds/button";
import { type } from "os";
import { FadeInText } from "./components/design-system/fade-in-text";
import React from "react";

export default function Worker() {
  interface ChatMessage {
    type: "input" | "response";
    text: string | string[][];
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
    const wordsInParagraphs = paragraphs.map((paragraph: string) => {
      const sentences: string[] = paragraph.split(/(?<=\.|\?|\!)\s/);
      const wordsInSentences = sentences.map((sentence, sentenceIndex) => {
        const words = sentence
          .split(/(?<!\n) +(?!\n)|(\n)/)
          .filter(Boolean)
          .map((text) => ({
            text,
            sentenceIndex,
          }));

        return words;
      });

      return wordsInSentences.flat();
    });

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "response", text: data.message },
    ]);
  }

  return (
    <>
      <div className="flex h-screen bg-slate-500">
        <div className="flex flex-col w-2/5">test1</div>
        <div className="flex flex-col w-3/5">
          <div className="flex flex-col h-4/5 overflow-y-auto px-5 justify-end">
            {chatLog.map((chatMessage, index) => (
              <>
                {chatMessage.type === "input" && (
                  <div key={index} className="mb-3 inline-flex text-matcha-300">
                    {chatMessage.text}
                  </div>
                )}
                {chatMessage.type === "response" && (
                  <div className="flex flex-wrap cursor-pointer text-slate-300">
                    {responseWords.map((word: ResponseWord, j: number) => (
                      <React.Fragment key={`word--${j}`}>
                        {word.text !== "\n" && (
                          <>
                            <span className="hover:underline">{word.text}</span>
                            <span>&nbsp;</span>
                          </>
                        )}
                        {word.text === "\n" && <div className="w-full"></div>}
                      </React.Fragment>
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
