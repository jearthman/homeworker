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
import {
  Prisma,
  Student,
  Assignment,
  StudentAssignment,
  Message,
} from "@prisma/client";

import { userMessageIsContextual } from "../utils/clientHelpers";
import getDefinition from "./api/get-definition";

const chatWithMessages = Prisma.validator<Prisma.ChatDefaultArgs>()({
  include: { messages: true },
});

type ChatWithMessages = Prisma.ChatGetPayload<typeof chatWithMessages>;

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

  // Get StudentAssignment from DB
  const studentAssignmentRes = await fetch(
    `${baseUrl}/api/student-assignment-by-id/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, assignmentId }),
    },
  );

  const studentAssignmentResJson = await studentAssignmentRes.json();
  const studentAssignment: StudentAssignment =
    studentAssignmentResJson.studentAssignment;

  const chatId = studentAssignment.chatId;

  // If the chat does not exist, create a new chat
  let chat: ChatWithMessages;

  if (!chatId) {
    const chatRes = await fetch(`${baseUrl}/api/init-chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, assignmentId }),
    });

    const chatResJson = await chatRes.json();
    chat = chatResJson.chat;
  } else {
    const chatRes = await fetch(`${baseUrl}/api/get-chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, hiddenfromUser: true }),
    });

    const chatResJson = await chatRes.json();
    chat = chatResJson.chat;
  }

  return {
    props: { student, assignment, chat },
  };
}

type WorkerProps = {
  student: Student;
  assignment: Assignment;
  chat: ChatWithMessages;
};

export default function Worker({ student, assignment, chat }: WorkerProps) {
  // types
  type ChatMessage =
    | {
        type: "user";
        text: string;
      }
    | {
        type: "assistant";
        text: Sentence[];
      };

  type Sentence = {
    words: string[];
    text: string;
  };

  // type ResponseWord = {
  //   text: string;
  //   sentenceIndex: number;
  // };

  // hooks
  const router = useRouter();
  const [userMessage, setUserMessage] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [darkModeOn, setDarkModeOn] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [displayPopoverAbove, setDisplayPopoverAbove] = useState(false);
  const [clickedSentenceKey, setclickedSentenceKey] = useState<string | null>(
    null,
  );
  const [clickedWordKey, setclickedWordKey] = useState<string | null>(null);
  const [clickedWord, setClickedWord] = useState<string | null>(null);

  const [popoverResponseContent, setPopoverResponseContent] = useState<
    string | null
  >(null);
  const [loadingPopoverResponseType, setLoadingPopoverResponseType] = useState<
    string | null
  >(null);

  const popoverRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!chat.messages) {
      console.log("chat is null");
      return;
    }
    // Add the chat messages to the chat log
    const chatMessages: ChatMessage[] = chat.messages
      .filter((message: Message) => {
        return (
          (message.role === "user" || message.role === "assistant") &&
          !userMessageIsContextual(message.content)
        );
      })
      .map((message: Message) => {
        if (message.role === "user") {
          return { type: "user", text: message.content };
        } else if (message.role === "assistant") {
          const paragraphs = message.content.split(/\n+/);

          const sentencesInParagraphs = paragraphs.map((paragraph: string) => {
            const sentences: string[] = paragraph.split(/(?<=\.|\?|\!)\s/);
            return sentences.map((sentence) => {
              const words = sentence
                .split(/(?<!\n) +(?!\n)|(\n)/)
                .filter(Boolean);
              return {
                words,
                text: sentence,
              };
            });
          });

          const parsedResponse = sentencesInParagraphs.flat();

          return { type: "assistant", text: parsedResponse };
        } else {
          console.log("Invalid message role", message.role);
          throw new Error("Invalid message role");
        }
      });

    setChatLog(chatMessages);

    // If the chat is empty, prompt LLM with a greeting
    if (chatMessages.length === 0) {
      sendMessage("<GREETING>Hello");
    }
  }, []);

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

  // This function will be called when a word is clicked
  function handleWordClick(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    messageIndex: number,
    sentenceIndex: number,
    wordIndex: number,
  ) {
    event.stopPropagation(); // stop the event from bubbling up to the document
    // get the position of the clicked word
    setPopoverResponseContent(null);
    setClickedWord(event.currentTarget.textContent);
    const wordPosition = event.currentTarget.getBoundingClientRect();
    const wordPositionX = wordPosition.x;
    const wordPositionY = wordPosition.y;
    const wordPositionWidth = wordPosition.width;
    const wordPositionHeight = wordPosition.height;
    const popoverPositionX = wordPositionX + wordPositionWidth / 2;
    let popoverPositionY = wordPositionY + wordPositionHeight;
    if (popoverPositionY > window.innerHeight / 2) {
      setDisplayPopoverAbove(true);
      popoverPositionY -= 29;
    } else {
      setDisplayPopoverAbove(false);
      popoverPositionY += 5;
    }
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
      setClickedWord(null);
    }
  }

  // Redux
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

  async function handleChatSubmit(event?: FormEvent<HTMLFormElement>) {
    // Prevent the form from refreshing the page
    event?.preventDefault();

    if (userMessage.length > 0) {
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { type: "user", text: userMessage },
      ]);
      setUserMessage("");

      sendMessage(userMessage);
    }
  }

  function handleEnterKeyPress(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleChatSubmit();
    }
  }

  async function sendMessage(message: string, interactionType?: String) {
    // If there are no previous messages or the last one is from the user, add a new response to trigger loading state
    setChatLog((prevChatLog) => {
      if (
        prevChatLog.length === 0 ||
        prevChatLog[prevChatLog.length - 1].type === "user"
      ) {
        return [...prevChatLog, { type: "assistant", text: [] }];
      }

      return prevChatLog;
    });
    // Send the input to the server
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: chat.id,
        content: message,
        interactionType: interactionType,
      }),
    });

    if (response.ok) {
      const reader = response.body?.getReader();

      const processStream = async (reader: ReadableStreamDefaultReader) => {
        let currentSentence = "";

        while (true) {
          try {
            const { done, value } = await reader.read();
            const readString = new TextDecoder("utf-8").decode(value);

            if (done) {
              break;
            }

            currentSentence += readString;

            // Splitting by words while keeping punctuation
            const words = currentSentence.match(/\S+|\s/g) || [];
            currentSentence = words.pop() || ""; // Keep the last unfinished word or space

            words.forEach((word) => {
              if (clickedWord) {
                setLoadingPopoverResponseType(null);

                setPopoverResponseContent((prevContent) =>
                  prevContent ? prevContent + word : word,
                );
              } else {
                updateLastResponse(word);
              }
            });
          } catch (err) {
            console.log("Error reading from stream: ", err);
            break;
          }
        }

        if (currentSentence) {
          if (clickedWord) {
            setPopoverResponseContent((prevContent) =>
              prevContent ? prevContent + currentSentence : currentSentence,
            );
          } else {
            updateLastResponse(currentSentence); // Send any remaining content
          }
        }
      };

      if (reader) {
        processStream(reader);
      }
    }
  }

  function parseResponse(message: string) {
    const paragraphs = message.split(/\n+/);

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

    return sentencesInParagraphs.flat();
  }

  // function addResponse(message: string) {
  //   const parsedResponse = parseResponse(message);
  //   setChatLog((prevChatLog) => [
  //     ...prevChatLog,
  //     { type: "assistant", text: parsedResponse },
  //   ]);
  // }

  function updateLastResponse(word: string) {
    setChatLog((prevChatLog) => {
      let newChatLog = [...prevChatLog];
      let lastMessage = newChatLog[newChatLog.length - 1];

      // Type guard to ensure lastMessage is of type assistant
      if (lastMessage.type === "assistant") {
        let lastSentence = lastMessage.text[lastMessage.text.length - 1];

        if (!lastSentence) {
          lastSentence = { words: [], text: "" };
          lastMessage.text.push(lastSentence);
        }

        // If the word is a space, add it to the last word; otherwise, create a new word
        if (/\s/.test(word)) {
          lastSentence.words[lastSentence.words.length - 1] += word;
          lastSentence.text += word;
        } else {
          lastSentence.words.push(word);
          lastSentence.text += word;
        }

        // If the word is a full stop, question mark, or exclamation mark, create a new sentence
        if (/[\.\?\!]/.test(word)) {
          lastMessage.text.push({ words: [], text: "" });
        }

        newChatLog[newChatLog.length - 1] = lastMessage;
      }

      return newChatLog;
    });
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
    wordIndex: number,
  ) {
    return (
      messageIndex.toString() +
      "-" +
      sentenceIndex.toString() +
      "-" +
      wordIndex.toString()
    );
  }

  function isLastChatFromAssistant() {
    if (chatLog.length === 0) {
      return false; // Return false if chatLog is empty
    }

    const lastMessage = chatLog[chatLog.length - 1];
    return lastMessage.type === "assistant";
  }

  function getWordsDefinition() {
    setLoadingPopoverResponseType("definition");

    if (!clickedWord) {
      return;
    }

    sendMessage(clickedWord, "definition");
  }

  function checkAnswer() {
    sendMessage(answer, "checkAnswer");
  }

  return (
    <>
      <div className="h-screen w-screen bg-gray-300 dark:bg-gray-800">
        <div
          className={`${styles.shadowSides} flex h-full bg-gray-200 md:max-w-6xl lg:mx-auto`}
        >
          <div className="flex flex-col justify-center border-r-2 border-gray-300 p-5 md:w-5/12">
            <ToggleSwitch
              className="mb-5"
              isChecked={darkModeOn}
              onChange={toggleDarkMode}
              checkedIcon={<span className="material-icons">dark_mode</span>}
              uncheckedIcon={<span className="material-icons">light_mode</span>}
            />
            <div className="my-auto w-full">
              <div className="mb-4 rounded-lg bg-sky-100 p-3 shadow-lg">
                <div className="text-lg font-extrabold">{assignment.title}</div>
                <div className="mt-2">{assignment.description}</div>
              </div>
              <textarea
                className="mb-2 block w-full rounded-lg bg-white p-3 shadow-lg focus:outline-none"
                placeholder="Write your answer here!"
                value={answer}
                onChange={(event) => setAnswer(event.currentTarget.value)}
              ></textarea>
              <div className="mb-4 flex gap-2">
                <Button size="small" intent="secondary" onClick={checkAnswer}>
                  Check
                </Button>
                <Button size="small">Submit</Button>
              </div>
              <div className="rounded-lg bg-matcha-100 p-3 shadow-lg">
                Review goes here
              </div>
            </div>
          </div>
          {/* desktop worker col */}
          <div className="flex h-full flex-grow flex-col justify-end md:w-7/12">
            {/* popover */}
            {showPopover && (
              <div
                ref={popoverRef}
                className={`${
                  displayPopoverAbove ? styles.caretDown : styles.caretUp
                } absolute left-1/2 z-10 -translate-x-1/2 transform cursor-pointer rounded-lg bg-white py-1 shadow-lg dark:border-white dark:bg-black`}
                style={{
                  ...(displayPopoverAbove
                    ? { bottom: window.innerHeight - popoverPosition.y }
                    : { top: popoverPosition.y }),
                  left: popoverPosition.x,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {loadingPopoverResponseType || popoverResponseContent ? (
                  loadingPopoverResponseType ? (
                    <div className="m-2 flex justify-center text-center">
                      <span className="material-symbols-outlined mr-2 animate-spin">
                        progress_activity
                      </span>
                      Getting {loadingPopoverResponseType}...
                    </div>
                  ) : (
                    <div className="m-2 max-w-md">{popoverResponseContent}</div>
                  )
                ) : (
                  <div className="flex flex-col">
                    {/* <div
                  className="cursor-pointer text-black dark:text-white margin-auto"
                  onClick={() => setShowPopover(false)}
                >
                  <span className="material-icons">close</span>
                </div> */}
                    <span
                      className=" p-2 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900"
                      onClick={getWordsDefinition}
                    >
                      Define
                    </span>
                    <span className=" p-2 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900">
                      Pronunciation
                    </span>
                    <span className=" p-2 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900">
                      Synonym
                    </span>
                    <span className="p-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900">
                      Etymology
                    </span>
                  </div>
                )}
              </div>
            )}
            {/* chat */}
            <div className="mb-6 flex flex-col-reverse gap-6 overflow-y-auto px-5">
              {[...chatLog].reverse().map((chatMessage, messageIndex) => (
                <div key={messageIndex} className="flex gap-4">
                  {chatMessage.type === "user" && (
                    <div role="img" aria-label="user" className="text-2xl">
                      👤
                    </div>
                  )}
                  {chatMessage.type === "assistant" && (
                    <div role="img" aria-label="assistant" className="text-2xl">
                      🤖
                    </div>
                  )}
                  {chatMessage.type === "user" && (
                    <div className="mt-1 inline-flex text-sky-900 dark:text-white">
                      {chatMessage.text}
                    </div>
                  )}
                  {chatMessage.type === "assistant" &&
                    (chatMessage.text.length === 0 ? (
                      <div className="material-symbols-outlined h-6 animate-spin">
                        progress_activity
                      </div>
                    ) : (
                      <div className="mt-1 cursor-pointer text-black dark:text-sky-100">
                        {chatMessage.text.map(
                          (sentence: Sentence, sentenceIndex: number) => (
                            <span
                              key={`sentence-${sentenceIndex}`}
                              className={`border border-transparent ${
                                parseSentenceIndex(
                                  messageIndex,
                                  sentenceIndex,
                                ) === clickedSentenceKey
                                  ? "border-b-green-600 dark:border-b-green-400"
                                  : "hover:border-b-green-600 dark:hover:border-b-green-400"
                              }`}
                            >
                              {sentence.words.map(
                                (word: string, wordIndex: number) => (
                                  <span
                                    key={`word-${sentenceIndex}-${wordIndex}`}
                                    className={`mr-1 inline-block ${
                                      parseWordIndex(
                                        messageIndex,
                                        sentenceIndex,
                                        wordIndex,
                                      ) === clickedWordKey
                                        ? "text-green-600 dark:text-green-400"
                                        : "hover:text-green-600 dark:hover:text-green-400"
                                    }`}
                                    onClick={(event) =>
                                      handleWordClick(
                                        event,
                                        messageIndex,
                                        sentenceIndex,
                                        wordIndex,
                                      )
                                    }
                                  >
                                    {word}
                                  </span>
                                ),
                              )}
                            </span>
                          ),
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <form
                className="m-6 flex items-center rounded-lg bg-white p-3 shadow-lg"
                onSubmit={handleChatSubmit}
              >
                <textarea
                  name="userInput"
                  value={userMessage}
                  onChange={(event) =>
                    setUserMessage(event.currentTarget.value)
                  }
                  className="h-6 max-h-24 w-full resize-none overflow-y-hidden bg-transparent focus:outline-none"
                  autoComplete="off"
                  onKeyDown={(event) => handleEnterKeyPress(event)}
                ></textarea>
                <Button type="submit" intent="link" className="h-6 w-6">
                  <span className="material-icons text-base">send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
