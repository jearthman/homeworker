import { useState, FormEvent } from "react";
import { Input } from "@ds/input";
import { Button } from "@ds/button";
import { type } from "os";
import { FadeInText } from "./components/design-system/fade-in-text";

export default function Worker() {
  interface ChatMessage {
    type: "input" | "response";
    text: string;
  }

  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

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

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "response", text: data.message },
    ]);
  }

  return (
    <>
      <div className="flex h-screen bg-slate-400">
        <div className="flex flex-col w-2/5">test1</div>
        <div className="flex flex-col w-3/5">
          <div className="flex flex-col h-4/5 overflow-y-scroll px-5 justify-end">
            {chatLog.map((chatMessage, index) => (
              <>
                {chatMessage.type === "input" && (
                  <div
                    key={index}
                    className="mb-3 inline-flex whitespace-nowrap self-end border-2 bg-slate-600 border-slate-700 text-white p-3 rounded "
                  >
                    {chatMessage.text}
                  </div>
                )}
                {chatMessage.type === "response" && (
                  <div
                    key={index}
                    className="mb-3 inline-flex self-end bg-slate-500 border-2 border-slate-600 text-white p-3 rounded "
                  >
                    {chatMessage.text}
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
