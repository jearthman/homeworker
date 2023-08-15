import { useState, useEffect, useRef, FormEvent } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Input } from "@/pages/components/design-system/input";
import { Button } from "@/pages/components/design-system/button";
import { type } from "os";
import { FadeInText } from "./components/design-system/fade-in-text";
import React from "react";
import { ToggleSwitch } from "./components/design-system/toggle-switch";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { RootState } from "../redux/store";
import styles from "./worker.module.css";
import { Student, Assignment } from "@prisma/client";
import { Noto_Serif } from "next/font/google";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { studentId, assignmentId } = context.query;

  const { req } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["host"];
  const baseUrl = `${protocol}://${host}`;

  // Fetch the student and assignment from the DB using studentId and assignmentId
  const studentRes = await fetch(`${baseUrl}/api/student-by-id/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ studentId }),
  });

  if (studentRes.status !== 200) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const studentResJson = await studentRes.json();
  const student = studentResJson.student;

  const assignmentRes = await fetch(`${baseUrl}/api/assignment-by-id/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assignmentId }),
  });

  if (assignmentRes.status !== 200) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const assignmentResJson = await assignmentRes.json();
  const assignment = assignmentResJson.assignment;

  return {
    props: { student, assignment },
  };
}

type WorkerProps = {
  student: Student;
  assignment: Assignment;
};

export default function Worker({ student, assignment }: WorkerProps) {
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

  const router = useRouter();
  const studentId = router.query.studentId;
  const assignmentId = router.query.assignmentId;

  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [responseWords, setResponseWords] = useState<ResponseWord[]>([]);
  const [responseSentences, setResponseSentences] = useState<Sentence[]>([]);
  const [darkModeOn, setDarkModeOn] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [clickedSentenceKey, setclickedSentenceKey] = useState<string | null>(
    null
  );
  const [clickedWordKey, setclickedWordKey] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  // }, [responseSentences]);

  // This function will be called when a word is clicked
  function handleWordClick(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    messageIndex: number,
    sentenceIndex: number,
    wordIndex: number
  ) {
    event.stopPropagation(); // stop the event from bubbling up to the document
    // get the position of the clicked word
    const wordPosition = event.currentTarget.getBoundingClientRect();
    const wordPositionX = wordPosition.x;
    const wordPositionY = wordPosition.y;
    const wordPositionWidth = wordPosition.width;
    const wordPositionHeight = wordPosition.height;
    const popoverPositionX = wordPositionX + wordPositionWidth / 2;
    const popoverPositionY = wordPositionY + wordPositionHeight + 5;
    setPopoverPosition({ x: popoverPositionX, y: popoverPositionY }); // set the popover position
    setShowPopover(true); // show the popover

    // set the clicked sentence key
    setclickedSentenceKey(parseSentenceIndex(messageIndex, sentenceIndex));
    // set the clicked word key
    setclickedWordKey(parseWordIndex(messageIndex, sentenceIndex, wordIndex));
  }

  function handleClickOutside(event: MouseEvent) {
    // If the click is outside the popover, hide the popover
    if (
      showPopover &&
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setShowPopover(false);
      // reset the clicked sentence key and clicked word key
      setclickedSentenceKey(null);
      setclickedWordKey(null);
    }
  }

  useEffect(() => {
    // Add event listener when the popover is shown
    if (showPopover) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showPopover]);

  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.value);
  useEffect(() => {
    setDarkModeOn(currentTheme === "dark");
  }, [currentTheme]);

  function handleThemeChange() {
    // Add a class to disable transitions
    document.documentElement.classList.add("transition-none");

    dispatch(toggleTheme());

    // After a short delay, remove the class to re-enable transitions
    setTimeout(() => {
      document.documentElement.classList.remove("transition-none");
    }, 100);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // Add the input to the chat log
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "input", text: input },
    ]);

    // Send the input to the server
    const response = await fetch("/api/chat", {
      method: "POST",
      body: input,
    });

    // Clear the input
    setInput("");

    // Throw an error if the response status is not 200
    const data = await response.json();

    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }

    // Add the response to the chat log
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

  function parseSentenceIndex(messageIndex: number, sentenceIndex: number) {
    return messageIndex.toString() + "-" + sentenceIndex.toString();
  }

  function parseWordIndex(
    messageIndex: number,
    sentenceIndex: number,
    wordIndex: number
  ) {
    return (
      messageIndex.toString() +
      "-" +
      sentenceIndex.toString() +
      "-" +
      wordIndex.toString()
    );
  }

  return (
    <>
      <div className="flex justify-center w-screen h-screen bg-gray-200 dark:bg-black">
        <div className="flex flex-col w-1/3 p-5">
          <ToggleSwitch
            className="mt-5"
            isChecked={darkModeOn}
            onChange={toggleDarkMode}
            checkedIcon={<span className="material-icons">dark_mode</span>}
            uncheckedIcon={<span className="material-icons">light_mode</span>}
          />
          <div className="my-auto w-full">
            <div className="border-2 border-black rounded-lg bg-white p-3">
              <div className="font-lg font-bold">{assignment.title}</div>
              <div className="mt-2">{assignment.description}</div>
            </div>
            <textarea
              className={`${notoSerif.className} mt-4 w-full border-2 border-black rounded-lg bg-white p-3 focus:outline-none focus:border-blue-500`}
            ></textarea>
            <div className="flex gap-2">
              <Button size="small" intent="secondary">
                Check
              </Button>
              <Button size="small">Submit</Button>
            </div>
          </div>
        </div>
        {/* desktop worker col */}
        <div className="flex flex-col w-1/3">
          {/* popover */}
          {showPopover && (
            <div
              ref={popoverRef}
              className={`${styles.caretUp} absolute z-10 bg-white dark:bg-black shadow-lg border-2 border-black dark:border-white left-1/2 transform -translate-x-1/2 cursor-pointer`}
              style={{
                top: popoverPosition.y,
                left: popoverPosition.x,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {/* <div
                  className="cursor-pointer text-black dark:text-white margin-auto"
                  onClick={() => setShowPopover(false)}
                >
                  <span className="material-icons">close</span>
                </div> */}
                <span className="dark:text-white border-b border-black dark:border-white p-1 hover:bg-gray-200 dark:hover:bg-gray-800">
                  Define
                </span>
                <span className="dark:text-white border-b border-black dark:border-white p-1 hover:bg-gray-200 dark:hover:bg-gray-800">
                  Pronunciation
                </span>
                <span className="dark:text-white border-b border-black dark:border-white p-1 hover:bg-gray-200 dark:hover:bg-gray-800">
                  Synonym
                </span>
                <span className="dark:text-white border-b border-black dark:border-white p-1 hover:bg-gray-200 dark:hover:bg-gray-800">
                  Etymology
                </span>
              </div>
            </div>
          )}
          {/* chat */}
          <div className="flex flex-col h-5/6 overflow-y-auto px-5 justify-end">
            {chatLog.map((chatMessage, messageIndex) => (
              <div key={messageIndex}>
                {chatMessage.type === "input" && (
                  <div
                    className={`${notoSerif.className} mb-3 inline-flex text-blue-600 dark:text-blue-400`}
                  >
                    {chatMessage.text}
                  </div>
                )}
                {chatMessage.type === "response" && (
                  <div className="cursor-pointer text-black dark:text-white">
                    {responseSentences.map(
                      (sentence: Sentence, sentenceIndex: number) => (
                        <span
                          key={`sentence-${sentenceIndex}`}
                          className={`border border-transparent ${
                            parseSentenceIndex(messageIndex, sentenceIndex) ===
                            clickedSentenceKey
                              ? "border-b-green-600 dark:border-b-green-400"
                              : "hover:border-b-green-600 dark:hover:border-b-green-400"
                          }`}
                        >
                          {sentence.words.map(
                            (word: string, wordIndex: number) => (
                              <span
                                key={`word-${sentenceIndex}-${wordIndex}`}
                                className={`${
                                  notoSerif.className
                                } mr-1 inline-block ${
                                  parseWordIndex(
                                    messageIndex,
                                    sentenceIndex,
                                    wordIndex
                                  ) === clickedWordKey
                                    ? "text-green-600 dark:text-green-400"
                                    : "hover:text-green-600 dark:hover:text-green-400"
                                }`}
                                onClick={(event) =>
                                  handleWordClick(
                                    event,
                                    messageIndex,
                                    sentenceIndex,
                                    wordIndex
                                  )
                                }
                              >
                                {word}
                              </span>
                            )
                          )}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col h-1/6 justify-center">
            <form className="flex px-5" onSubmit={sendMessage}>
              <Input
                type="text"
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                className={`${notoSerif.className} border-r-0 rounded-r-none w-full`}
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
