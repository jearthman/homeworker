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

  async function sendMessage() {
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "input", text: input },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ input }),
    });

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
      <div className="flex h-screen bg-slate-500">
        <div className="flex flex-col w-2/5">test1</div>
        <div className="flex flex-col w-3/5">
          <div className="flex flex-col h-4/5 overflow-y-auto px-5">
            {chatLog.map((chatMessage, index) => (
              <>
                {chatMessage.type === "input" && (
                  <FadeInText key={index} text="" isReady />
                )}
              </>
            ))}
          </div>
          <div className="flex flex-col h-1/5 justify-center">
            <div className="flex w-4/5">
              <Input
                type="text"
                onChange={(event) => setInput(event.currentTarget.value)}
                className="border-r-0 rounded-r-none w-full"
              ></Input>
              <Button
                intent="inner-form"
                onClick={sendMessage}
                className="border-l-0 rounded-l-none"
              >
                <span className="material-icons">send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
