import { useState, useEffect, useLayoutEffect, useRef, FormEvent } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Button from "@/components/design-system/button";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { RootState } from "../redux/store";
import { userMessageIsContextual } from "../utils/clientHelpers";
import ProblemsProgress from "../components/problems-progress";
import TalkingHead from "@/components/talking-head";
import {
  Prisma,
  Student,
  Assignment,
  StudentAssignment,
  Message,
  Problem,
  StudentProblemAnswer,
} from "@prisma/client"; // import { current } from "@reduxjs/toolkit";
import Markdown from "react-markdown";
import ChatSkeleton from "../components/design-system/chat-skeleton";
import { getWordPronunciationFromMW } from "../utils/clientHelpers";

const chatWithMessages = Prisma.validator<Prisma.ChatDefaultArgs>()({
  include: { messages: true },
});

type ChatWithMessages = Prisma.ChatGetPayload<typeof chatWithMessages>;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { studentId, assignmentId } = context.query;

  return {
    props: { studentId, assignmentId },
  };
}

type WorkerProps = {
  studentId: string;
  assignmentId: string;
};

export default function Worker({ studentId, assignmentId }: WorkerProps) {
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

  type StudentAssignmentExtended = StudentAssignment & {
    chat: ChatWithMessages;
  };

  type AssignmentExtended = Assignment & {
    problems: Problem[];
  };

  type ActiveDiv = {
    name: string;
    ref: HTMLDivElement | null;
  };

  // hooks
  const router = useRouter();

  //useState block
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [student, setStudent] = useState<Student | null>(null);
  const [assignment, setAssignment] = useState<AssignmentExtended>();
  const [userMessage, setUserMessage] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loadingAnswer, setLoadingAnswer] = useState<boolean>(false);
  const [checkingAnswer, setCheckingAnswer] = useState<boolean>(false);
  const [answerReview, setAnswerReview] = useState<string>("");
  const chatId = useRef<number>();
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [darkModeOn, setDarkModeOn] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [displayPopoverAbove, setDisplayPopoverAbove] = useState(false);
  const [clickedSentenceKey, setclickedSentenceKey] = useState<string | null>(
    null,
  );
  const [clickedWordKey, setclickedWordKey] = useState<string | null>(null);
  const [clickedSentence, setClickedSentence] = useState<string | null>(null);
  const [clickedWord, setClickedWord] = useState<string | null>(null);
  const [popoverResponseContent, setPopoverResponseContent] = useState<
    string | null
  >(null);
  const [pronunciationAudioBuffer, setPronunciationAudioBuffer] = useState<
    string | null
  >(null);
  const [loadingPopoverResponseType, setLoadingPopoverResponseType] = useState<
    string | null
  >(null);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [studentProblemAnswers, setStudentProblemAnswers] = useState<
    StudentProblemAnswer[]
  >([]);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const latestChatMessageIconRef = useRef<HTMLDivElement | null>(null);
  const latestChatMessageRef = useRef<HTMLDivElement | null>(null);
  const [latestChatMessageTop, setLatestChatMessageTop] = useState<number>(0);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const [activeDiv, setActiveDiv] = useState<ActiveDiv | null>(null);
  const [talkingIncrement, setTalkingIncrement] = useState<number>(0);
  const [talkingHeadTop, setTalkingHeadTop] = useState<number>(0);
  const [talkingHeadLeft, setTalkingHeadLeft] = useState<number>(0);
  const [initializingChat, setInitializingChat] = useState<boolean>(false);
  const [chatErrorCode, setChatErrorCode] = useState<string | null>(null);
  const pronunciationTextRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // init useEffect block
  useEffect(() => {
    if (!studentId || !assignmentId) {
      console.log("studentId or assignmentId is null", studentId, assignmentId);
      router.push("/404");
      return;
    }

    let baseUrl = "";
    if (typeof window !== "undefined") {
      baseUrl = `${window.location.protocol}//${window.location.host}`;
    }
    setBaseUrl(baseUrl);

    setTalkingHeadLeft(window.innerWidth / 2);
    setTalkingHeadTop(window.innerHeight);

    async function fetchData() {
      const studentEndpoint = `${baseUrl}/api/student-by-id/?studentId=${studentId}`;
      logRequest(studentEndpoint, { studentId });
      const assignmentEndpoint = `${baseUrl}/api/assignment-by-id/?assignmentId=${assignmentId}`;
      logRequest(assignmentEndpoint, { assignmentId });
      const studentAssignmentEndpoint = `${baseUrl}/api/student-assignment-by-id/?studentId=${studentId}&assignmentId=${assignmentId}`;
      logRequest(studentAssignmentEndpoint, { studentId, assignmentId });

      let studentRes = null;
      let assignmentRes = null;
      let studentAssignmentRes = null;

      try {
        [studentRes, assignmentRes, studentAssignmentRes] = await Promise.all([
          fetch(studentEndpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(assignmentEndpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(studentAssignmentEndpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!studentRes.ok || !assignmentRes.ok || !studentAssignmentRes.ok) {
          console.error(
            "One or more fetch requests returned an HTTP error status.",
          );
          router.push("/404");
          return;
        }
      } catch (error) {
        console.error("Failed to fetch data due to network error:", error);
        router.push("/404");
        return;
      }

      const [student, assignment, studentAssignment] = await Promise.all([
        studentRes.json(),
        assignmentRes.json(),
        studentAssignmentRes.json(),
      ]);

      setStudent(student);
      setAssignment(assignment);

      if (assignment.problems.length > 0) {
        setCurrentProblem(assignment.problems[0]);
        setCurrentProblemIndex(0);
        const studentProblemAnswers = await getStudentProblemAnswers(
          studentId,
          assignmentId,
        );
        if (studentProblemAnswers[0].answer) {
          setAnswer(studentProblemAnswers[0].answer);
        } else {
          setAnswer(assignment.problems[0].content);
        }
        setStudentProblemAnswers(studentProblemAnswers);
        setLoadingAnswer(false);
      }

      let chat: ChatWithMessages;

      if (studentAssignment.chat) {
        chatId.current = studentAssignment.chat.id;
        chat = studentAssignment.chat;
        // Add the chat messages to the chat log
        const chatMessages: ChatMessage[] = parseChatMessagesFromMemory(
          chat.messages,
        );

        if (chatMessages.length === 0) {
          sendMessage([student?.firstName] || "", "greeting");
        }

        setChatLog(chatMessages);
        setInitializingChat(false);
      } else {
        chat = await initializeChat(studentId, assignmentId);
        if (chat) {
          sendMessage([student?.firstName] || "", "greeting");
        } else {
          setChatErrorCode("chat-not-initialized");
        }
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Add event listener when the popover is shown
    document.addEventListener("click", handleClickOutside);
    // Cleanup on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showPopover]);

  useEffect(() => {
    if (
      currentProblem &&
      answer &&
      answer !== studentProblemAnswers[currentProblemIndex]?.answer &&
      answer !== currentProblem.content
    ) {
      updateStudentProblemAnswer();
    }
  }, [answer]);

  useEffect(() => {
    if (activeDiv && activeDiv.ref) {
      const rect = activeDiv.ref.getBoundingClientRect();

      let left = 0;
      let top = 0;
      if (activeDiv.name === "chat" && chatRef.current) {
        left = rect.left - 48;
        top = rect.bottom - 32;
      } else if (activeDiv.name === "review") {
        left = rect.left - 48;
        top = rect.top - 32;
      } else if (activeDiv.name === "popover") {
        if (displayPopoverAbove) {
          left = rect.left - 48;
          top = rect.bottom - 32;
        } else {
          left = rect.left - 48;
          top = rect.top - 32;
        }
      }

      setTalkingHeadLeft(left);
      setTalkingHeadTop(top);
    }
  }, [activeDiv]);

  useEffect(() => {
    if (latestChatMessageRef) {
      setActiveDiv({ name: "chat", ref: latestChatMessageRef.current });
    }
  }, [chatLog[0]]);

  // Utility function to log request details
  const logRequest = (endpoint: string, body: any) => {
    if (process.env.DEBUG_LOGGING) {
      console.log(`Sending request to ${endpoint} with body:`, body);
    }
  };

  async function initializeChat(studentId: string, assignmentId: string) {
    setInitializingChat(true);
    const initChatEndpoint = `${baseUrl}/api/init-chat/`;
    logRequest(initChatEndpoint, { studentId, assignmentId });
    const chatRes = await fetch(initChatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, assignmentId }),
    });

    if (!chatRes.ok) {
      console.error("Failed to initialize chat");
      return null;
    }

    const chat = await chatRes.json();
    chatId.current = chat.id;
    return chat;
  }

  function parseChatMessagesFromMemory(chatMessages: Message[]) {
    return chatMessages
      .filter((message: Message) => {
        return (
          (message.role === "user" || message.role === "assistant") &&
          !userMessageIsContextual(message.content)
        );
      })
      .map((message: Message) => {
        if (message.role === "user") {
          return { type: "user" as const, text: message.content };
        } else if (message.role === "assistant") {
          // Split content into segments by newline characters
          const segments = message.content
            .split("\n")
            .map((segment) => segment.trim());

          const allSentences: Sentence[] = [];

          // Process each segment
          segments.forEach((segment) => {
            // Split segment by sentence delimiters while preserving them
            const sentences = segment
              .split(/(?<=[.!?])\s/)
              .filter(Boolean)
              .map((sentence) => {
                // Split sentence into words or newlines, preserving spaces after words
                const words = [];
                let word = "";
                for (let i = 0; i < sentence.length; i++) {
                  const char = sentence[i];
                  if (
                    char === " " ||
                    char === "." ||
                    char === "?" ||
                    char === "!"
                  ) {
                    word += char;
                    words.push(word);
                    word = "";
                  } else {
                    word += char;
                  }
                }
                if (word) words.push(word);
                return {
                  words: words.filter(Boolean),
                  text: sentence,
                };
              });
            allSentences.push(...sentences);
            allSentences.push({ words: ["\n"], text: "\n" });
          });

          return { type: "assistant" as const, text: allSentences };
        } else {
          console.log("Invalid message role", message.role);
          throw new Error("Invalid message role");
        }
      });
  }

  async function updateStudentProblemAnswer() {
    try {
      const updateStudentProblemAnswerEndpoint = `${baseUrl}/api/update-student-problem-answer/`;
      const studentProblemAnswersByAssignmentEndpoint = `${baseUrl}/api/student-problem-answers-by-assignment/`;
      logRequest(updateStudentProblemAnswerEndpoint, {
        studentId,
        problemId: currentProblem?.id,
        answer,
        isCorrect: false,
      });
      const updateStudentProblemAnswerRes = await fetch(
        updateStudentProblemAnswerEndpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            problemId: currentProblem?.id,
            answer,
            isCorrect: checkProblemAnswer(),
          }),
        },
      );

      if (updateStudentProblemAnswerRes.ok) {
        if (studentProblemAnswers.length === 0) {
          const StudentProblemAnswersRes = await fetch(
            studentProblemAnswersByAssignmentEndpoint,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                studentId,
                assignmentId,
              }),
            },
          );

          const studentProblemAnswersResJson =
            await StudentProblemAnswersRes.json();
          setStudentProblemAnswers(studentProblemAnswersResJson);
        } else {
          const updateStudentProblemAnswerJson =
            await updateStudentProblemAnswerRes.json();
          //update single student problem answer from updateStudentProblemAnswerJson
          setStudentProblemAnswers((prevStudentProblemAnswers) => {
            const updatedStudentProblemAnswers = [...prevStudentProblemAnswers];
            updatedStudentProblemAnswers[currentProblemIndex] =
              updateStudentProblemAnswerJson;
            return updatedStudentProblemAnswers;
          });
        }
      }
    } catch (error) {
      console.error("Failed to update student problem answer:", error);
    }
  }

  function checkProblemAnswer() {
    if (currentProblem) {
      return currentProblem.content === answer;
    }

    return false;
  }

  async function getStudentProblemAnswers(
    studentId: string,
    assignmentId: string,
  ) {
    const studentProblemAnswersByAssignmentEndpoint = `${baseUrl}/api/student-problem-answers-by-assignment/`;

    setLoadingAnswer(true);
    logRequest(studentProblemAnswersByAssignmentEndpoint, {
      studentId,
      assignmentId,
    });
    try {
      const StudentProblemAnswersRes = await fetch(
        studentProblemAnswersByAssignmentEndpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            assignmentId,
          }),
        },
      );

      const StudentProblemAnswersResJson =
        await StudentProblemAnswersRes.json();
      return StudentProblemAnswersResJson;
    } catch (error) {
      console.error("Failed to get student problem answers:", error);
      return null;
    }
  }

  // This function will be called when a word is clicked
  function handleWordClick(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    word: string,
    sentence: string,
    messageIndex: number,
    sentenceIndex: number,
    wordIndex: number,
  ) {
    event.stopPropagation(); // stop the event from bubbling up to the document
    // get the position of the clicked word
    setPopoverResponseContent(null);
    setLoadingPopoverResponseType(null);
    setClickedWord(word);
    setClickedSentence(sentence);
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
      setPopoverResponseContent(null);
      setLoadingPopoverResponseType(null);
      setShowPopover(false);
      setclickedSentenceKey(null);
      setclickedWordKey(null);
      setClickedWord(null);
      setActiveDiv({ name: "chat", ref: latestChatMessageRef.current });
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

      sendMessage([userMessage]);
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

  async function sendMessage(message: string[], interactionType?: String) {
    // If there are no previous messages or the last one is from the user, add a new response to trigger loading state
    setChatLog((prevChatLog) => {
      if (
        (prevChatLog.length === 0 ||
          prevChatLog[prevChatLog.length - 1].type === "user") &&
        (interactionType === "greeting" || !interactionType)
      ) {
        return [...prevChatLog, { type: "assistant", text: [] }];
      }
      return prevChatLog;
    });

    const isPopoverInteraction =
      interactionType === "definition" ||
      interactionType === "synonyms" ||
      interactionType === "etymology";

    if (isPopoverInteraction) {
      message[0] = message[0].replace(/[^a-zA-Z0-9]/g, "");
      setActiveDiv({ name: "popover", ref: popoverRef.current });
    } else if (interactionType === "checkAnswer") {
      setActiveDiv({ name: "review", ref: reviewRef.current });
    } else {
      setActiveDiv({ name: "chat", ref: latestChatMessageRef.current });
    }

    // Send the input to the server
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: chatId.current,
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
            const words = currentSentence.match(/\S+|\s|\n+/g) || [];
            currentSentence = words.pop() || ""; // Keep the last unfinished word or space

            words.forEach((word) => {
              if (isPopoverInteraction) {
                setPopoverResponseContent((prevContent) =>
                  prevContent ? prevContent + word : word,
                );
              } else if (interactionType === "checkAnswer") {
                setAnswerReview((prevContent) =>
                  prevContent ? prevContent + word : word,
                );
                setCheckingAnswer(false);
              } else {
                updateLastResponse(word);
              }

              setTalkingIncrement(
                (prevTalkingIncrement) => prevTalkingIncrement + 1,
              );
            });
          } catch (err) {
            console.log("Error reading from stream: ", err);
            break;
          }
        }
        if (currentSentence) {
          if (isPopoverInteraction) {
            setPopoverResponseContent((prevContent) =>
              prevContent ? prevContent + currentSentence : currentSentence,
            );
          } else if (interactionType === "checkAnswer") {
            setAnswerReview((prevContent) =>
              prevContent ? prevContent + currentSentence : currentSentence,
            );
          } else {
            updateLastResponse(currentSentence); // Send any remaining content
          }

          setTalkingIncrement(
            (prevTalkingIncrement) => prevTalkingIncrement + 1,
          );
        }
      };
      if (reader) {
        processStream(reader);
      }
    } else {
      console.error(
        "Response Error Code: ",
        response.headers.get("X-Error-Code"),
      );
      const openAiErrorCode = response.headers.get("X-Error-Code");
      if (openAiErrorCode) {
        setChatErrorCode(response.headers.get("X-Error-Code"));
      } else {
        setChatErrorCode(response.statusText);
      }
      resetLoadingStates();
    }
  }

  function updateLastResponse(word: string) {
    setChatLog((prevChatLog) => {
      let newChatLog = [...prevChatLog];
      let lastMessage = newChatLog[newChatLog.length - 1];

      // Type guard to ensure lastMessage is of type assistant
      if (!lastMessage || lastMessage.type === "assistant") {
        let lastSentence = lastMessage.text[lastMessage.text.length - 1];

        if (!lastSentence) {
          lastSentence = { words: [], text: "" };
          lastMessage.text.push(lastSentence);
        }

        // If the word is just a space or is punctuation and the last word doesn't end with a space, append it to the last word.
        // Otherwise, treat the word as a new word.
        const lastWord = lastSentence.words[lastSentence.words.length - 1];
        if (
          (/^[a-zA-Z]+$/.test(word) &&
            lastWord &&
            /^[a-zA-Z.,!?'"]$/.test(lastWord.slice(-1))) ||
          word === " " ||
          (/[\.\?\!\',;:\-\(\)\[\]{}"]/.test(word) &&
            lastWord &&
            !/[\s\n]/.test(lastWord.slice(-1)))
        ) {
          lastSentence.words[lastSentence.words.length - 1] += word;
          lastSentence.text += word;
        } else {
          lastSentence.words.push(word);
          lastSentence.text += word;
        }

        // If the word is a full stop, question mark, or exclamation mark, create a new sentence
        if (/[\.\?\!\n]/.test(word)) {
          lastMessage.text.push({ words: [], text: "" });
        }

        newChatLog[newChatLog.length - 1] = lastMessage;
      }

      return newChatLog;
    });
  }

  // function toggleDarkMode() {
  //   setDarkModeOn((prevDarkModeOn) => !prevDarkModeOn);
  //   handleThemeChange();
  // }

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

  function getWordDefinition() {
    setLoadingPopoverResponseType("definition");

    if (!clickedWord || !clickedSentence) {
      return;
    }

    sendMessage([clickedWord, clickedSentence], "definition");
  }

  async function getWordPronunciation() {
    setLoadingPopoverResponseType("pronunciation");

    if (!clickedWord) {
      return;
    }

    const response = await fetch(
      `${baseUrl}/api/get-word-pronunciation/?word=${clickedWord}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const wordPronunciation = await response.json();

    if (wordPronunciation) {
      setPopoverResponseContent(wordPronunciation.hw);
      setPronunciationAudioBuffer(
        wordPronunciation.base64Audio ? wordPronunciation.base64Audio : null,
      );
    } else {
      setPopoverResponseContent("Pronunciation not found...");
    }

    setActiveDiv({ name: "popover", ref: popoverRef.current });
  }

  function playPronunciationAudio() {
    if (pronunciationAudioBuffer) {
      const audioBuffer = Uint8Array.from(atob(pronunciationAudioBuffer), (c) =>
        c.charCodeAt(0),
      );
      const audioBlob = new Blob([audioBuffer], {
        type: "audio/mpeg",
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      const syllableCount = popoverResponseContent?.split("*").length || 1;
      // Wait for audio metadata to load
      audio.onloadedmetadata = () => {
        startTextTransition(audio.duration);

        audio
          .play()
          .then(() => {
            audio.addEventListener("ended", resetColorTransition);
          })
          .catch((e) => console.error("Error playing pronunciation sound:", e));

        //increment talking head based on syllable count and audio duration
        const syllableDuration = (audio.duration * 1000) / syllableCount; // Duration per syllable in milliseconds

        setTalkingIncrement((prevTalkingIncrement) => prevTalkingIncrement + 1);
        for (let i = 1; i < syllableCount; i++) {
          setTimeout(() => {
            setTalkingIncrement(
              (prevTalkingIncrement) => prevTalkingIncrement + 1,
            );
          }, i * syllableDuration);
          console.log("Talking increment:", talkingIncrement);
        }
      };

      // Fallback in case metadata does not load
      setTimeout(() => {
        if (isNaN(audio.duration)) {
          console.error("Audio duration is not available.");
          audio.play().catch((e) => {
            console.error("Error playing pronunciation sound:", e);
          });
        }
      }, 3000);
    }
  }

  function startTextTransition(duration: number) {
    if (pronunciationTextRef.current) {
      pronunciationTextRef.current.style.animationDuration = `${duration}s`;
      pronunciationTextRef.current.classList.add("animated-text");
    }
  }

  function resetColorTransition() {
    if (pronunciationTextRef.current) {
      pronunciationTextRef.current.classList.remove("animated-text");
    }
  }

  function getWordSynonyms() {
    setLoadingPopoverResponseType("synonyms");

    if (!clickedWord) {
      return;
    }

    sendMessage([clickedWord], "synonyms");
  }

  function getWordEtymology() {
    setLoadingPopoverResponseType("etymology");

    if (!clickedWord) {
      return;
    }

    sendMessage([clickedWord], "etymology");
  }

  function checkAnswer() {
    setAnswerReview("");
    setCheckingAnswer(true);
    sendMessage([answer], "checkAnswer");
  }

  function changeProblem(direction: "prev" | "next") {
    let newIndex = currentProblemIndex;

    if (direction === "prev" && currentProblemIndex > 0) {
      newIndex--;
    } else if (
      direction === "next" &&
      assignment &&
      currentProblemIndex < assignment?.problems.length - 1
    ) {
      newIndex++;
    } else {
      return; // Exit if there's no valid next or previous problem
    }

    setCurrentProblemIndex(newIndex);
    setCurrentProblem(assignment?.problems[newIndex] || null);
    if (studentProblemAnswers[newIndex]?.answer !== "") {
      setAnswer(studentProblemAnswers[newIndex]?.answer);
    } else {
      setAnswer(assignment?.problems[newIndex]?.content || "");
    }
  }

  function resetLoadingStates() {
    setCheckingAnswer(false);
    setLoadingAnswer(false);
    setShowPopover(false);
    setLoadingPopoverResponseType(null);
    setPopoverResponseContent(null);
    setActiveDiv({ name: "chat", ref: latestChatMessageRef.current });
  }

  async function resetChat() {
    const resetChatEndpoint = `${baseUrl}/api/reset-chat/`;
    logRequest(resetChatEndpoint, { chatId: chatId.current });
    const resetResponse = await fetch(resetChatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        assignmentId,
      }),
    });

    if (resetResponse.ok) {
      setChatLog([]);
    } else {
      console.error("Failed to reset chat", resetResponse.statusText);
    }
  }

  return (
    <>
      <div
        className="h-screen w-screen"
        style={{
          background: `radial-gradient(circle at 30% 70%, rgba(174, 216, 141, 0.7), rgba(174, 216, 141, 0) 50%),
                    radial-gradient(circle at 70% 30%, rgba(186, 230, 253, 0.7), rgba(186, 230, 253, 0) 50%),
                    rgb(229, 231, 235)`,
        }}
      >
        <div
          className={`shadow-sides flex h-full bg-gray-200 md:max-w-7xl lg:mx-auto`}
        >
          <div className="flex flex-col border-r-2 border-gray-300 p-5 md:w-5/12">
            <div className="mb-8 flex w-full">
              <Button
                size="small"
                intent="secondary"
                className="inline"
                onClick={() => router.back()}
              >
                <span className="material-symbols-rounded pr-1">
                  arrow_back
                </span>
                Back to Assignments
              </Button>
              {/* <ToggleSwitch
                className="ml-auto"
                isChecked={darkModeOn}
                onChange={toggleDarkMode}
                checkedIcon={<span className="material-icons">dark_mode</span>}
                uncheckedIcon={
                  <span className="material-icons">light_mode</span>
                }
              /> */}
            </div>

            <div className="mb-8 rounded-lg bg-sky-100 p-3 text-sky-900 shadow-lg">
              {assignment ? (
                <>
                  <div className="text-lg font-extrabold underline">
                    {assignment?.title}
                  </div>
                  <div className="mt-2 opacity-90">
                    {assignment?.description}
                  </div>
                </>
              ) : (
                <>
                  <div className="h-4 w-1/3 animate-pulse rounded-full bg-gray-300"></div>
                  <div className="mt-4 h-2 animate-pulse rounded bg-gray-300"></div>
                  <div className="mt-3 h-2 animate-pulse rounded bg-gray-300"></div>
                  <div className="mt-3 h-2 animate-pulse rounded bg-gray-300"></div>
                </>
              )}
              {studentProblemAnswers.length > 0 && (
                <ProblemsProgress
                  studentProblemAnswers={studentProblemAnswers}
                  className="mt-4"
                ></ProblemsProgress>
              )}
            </div>
            {currentProblem && <div>Problem {currentProblemIndex + 1}</div>}
            {loadingAnswer ? (
              <div className="mb-2 block min-h-[1rem] w-full rounded-lg bg-white p-3 shadow-lg">
                <span className="material-symbols-rounded mr-1 animate-spin">
                  progress_activity
                </span>
              </div>
            ) : (
              <textarea
                className={`mb-2 block ${
                  currentProblem ? "min-h-[1rem]" : "min-h-[16rem]"
                } w-full rounded-lg border border-transparent bg-white p-3 shadow-lg focus-within:border-sky-400 focus:outline-none`}
                value={answer}
                placeholder="Write your answer here!"
                onChange={(event) => setAnswer(event.currentTarget.value)}
              />
            )}
            <div className="mb-8 flex justify-between">
              <Button
                size="small"
                intent="secondary"
                onClick={checkAnswer}
                className="text-center"
                disabled={answer.length === 0 || checkingAnswer}
                title="Let the homerworker review your answer"
              >
                <span className="material-symbols-rounded pr-1">
                  plagiarism
                </span>
                Review
              </Button>
              {currentProblem && (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    intent="secondary"
                    onClick={() => changeProblem("prev")}
                    disabled={currentProblemIndex === 0}
                  >
                    <span className="material-symbols-rounded">arrow_back</span>
                  </Button>
                  <Button
                    size="small"
                    intent="secondary"
                    onClick={() => changeProblem("next")}
                    disabled={
                      currentProblemIndex ===
                      (assignment?.problems?.length || 0) - 1
                    }
                  >
                    <span className="material-symbols-rounded">
                      arrow_forward
                    </span>
                  </Button>
                </div>
              )}
              <Button size="small" className="" disabled={answer.length === 0}>
                <span className="material-symbols-rounded pr-1">task</span>
                Submit
              </Button>
            </div>
            <div
              ref={reviewRef}
              className="rounded-lg border border-matcha-300 bg-matcha-100 px-3 py-2 text-matcha-900 shadow-lg"
            >
              {!answerReview && !checkingAnswer && (
                <span className="opacity-50">
                  Use the &apos;Review&apos; button above to get feedback!
                </span>
              )}
              {checkingAnswer ? (
                <div className="flex justify-center text-center">
                  <span className="material-symbols-rounded mr-1 animate-spin">
                    progress_activity
                  </span>
                  Checking your answer...
                </div>
              ) : (
                <span>{answerReview}</span>
              )}
            </div>
          </div>
          {/* desktop worker col */}
          <div className="flex h-full flex-grow flex-col justify-end md:w-7/12">
            {/* chat */}
            <div
              ref={chatRef}
              className="mb-6 flex flex-col-reverse gap-6 overflow-y-auto px-5 pb-5"
            >
              {chatLog.length === 0 &&
                (initializingChat ? (
                  <div className="w-80 self-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-center shadow-lg dark:border-white dark:bg-black">
                    <div className="material-symbols-rounded mr-1 animate-spin align-middle">
                      progress_activity
                    </div>
                    Starting up a new Homeworker...
                  </div>
                ) : (
                  <ChatSkeleton className="animate-pulse"></ChatSkeleton>
                ))}
              {[...chatLog].reverse().map((chatMessage, messageIndex) => (
                <div key={messageIndex} className="flex gap-4">
                  <div
                    role="img"
                    aria-label={chatMessage.type}
                    className={`mt-1 text-2xl ${
                      chatMessage.type === "assistant" && messageIndex === 0
                        ? "opacity-0"
                        : ""
                    }`}
                    ref={
                      chatMessage.type === "assistant" && messageIndex === 0
                        ? latestChatMessageIconRef
                        : null
                    }
                  >
                    {chatMessage.type === "user" ? "👤" : "🤖"}
                  </div>
                  {chatMessage.type === "user" && (
                    <div className="inline-flex rounded-lg bg-sky-100 px-3 py-2 text-sky-900 shadow-md dark:text-white">
                      {chatMessage.text}
                    </div>
                  )}
                  {chatMessage.type === "assistant" && (
                    <div
                      ref={messageIndex === 0 ? latestChatMessageRef : null}
                      className="cursor-pointer rounded-lg border border-matcha-300 bg-matcha-100 px-3 py-2 align-middle text-matcha-900 shadow-lg dark:text-sky-100"
                    >
                      {chatMessage.text.length === 0 && (
                        <div className="material-symbols-rounded animate-spin align-middle">
                          progress_activity
                        </div>
                      )}
                      {chatMessage.text.map(
                        (sentence: Sentence, sentenceIndex: number) => (
                          <span
                            key={`sentence-${sentenceIndex}`}
                            className={`border border-transparent ${
                              parseSentenceIndex(
                                messageIndex,
                                sentenceIndex,
                              ) === clickedSentenceKey
                                ? "border-b-matcha-600 dark:border-b-matcha-400"
                                : "hover:border-b-matcha-600 dark:hover:border-b-matcha-400"
                            }`}
                          >
                            {sentence.words.map(
                              (word: string, wordIndex: number) =>
                                word === "\n" ? (
                                  // Render a line break for each newline character in the word
                                  Array.from({ length: word.length }).map(
                                    (_, index) => (
                                      <br
                                        key={`br-${sentenceIndex}-${wordIndex}-${index}`}
                                      />
                                    ),
                                  )
                                ) : (
                                  <span
                                    key={`word-${sentenceIndex}-${wordIndex}`}
                                    className={`mr-1 inline-block ${
                                      parseWordIndex(
                                        messageIndex,
                                        sentenceIndex,
                                        wordIndex,
                                      ) === clickedWordKey
                                        ? "text-matcha-600 dark:text-matcha-400"
                                        : "hover:text-matcha-600 dark:hover:text-matcha-400"
                                    }`}
                                    onClick={(event) =>
                                      handleWordClick(
                                        event,
                                        word,
                                        sentence.text,
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
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              {chatErrorCode ? (
                <div className="m-5 flex items-center rounded-lg border border-red-500 bg-red-300 p-2 text-red-700 shadow-md">
                  {chatErrorCode === "context_length_exceeded" ? (
                    <>
                      <span>
                        Context length for the chat has been exceeded!
                      </span>
                      <Button
                        size="small"
                        intent="danger"
                        className="ml-2"
                        onClick={resetChat}
                      >
                        Reset Chat
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>
                        Oops, looks like something went wrong on our end!
                      </span>
                      <Button size="small" intent="danger" className="ml-2">
                        Reload Chat
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <form
                  className="relative m-5 flex w-full items-center rounded-lg border border-transparent bg-white shadow-lg focus-within:border-sky-400"
                  onSubmit={handleChatSubmit}
                >
                  <textarea
                    name="userInput"
                    value={userMessage}
                    onChange={(event) =>
                      setUserMessage(event.currentTarget.value)
                    }
                    className="h-14 max-h-48 w-full resize-none overflow-y-hidden bg-transparent py-4 pl-4 pr-12 focus:outline-none"
                    autoComplete="off"
                    onKeyDown={(event) => handleEnterKeyPress(event)}
                    placeholder="Message your Homeworker..."
                  ></textarea>
                  <Button
                    type="submit"
                    intent="primary"
                    disabled={userMessage === ""}
                    size="small-icon"
                    className="absolute right-3"
                  >
                    <span className="material-symbols-rounded">send</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <TalkingHead
        talkingIncrement={talkingIncrement}
        left={talkingHeadLeft}
        top={talkingHeadTop}
        hidden={chatLog.length === 0}
      />
      {/* popover */}
      {showPopover && (
        <div
          ref={popoverRef}
          className="absolute left-1/2 z-10 -translate-x-1/2 transform cursor-pointer rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-white dark:bg-black"
          style={{
            ...(displayPopoverAbove
              ? { bottom: window.innerHeight - popoverPosition.y }
              : { top: popoverPosition.y }),
            left: popoverPosition.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {loadingPopoverResponseType ? (
            popoverResponseContent ? (
              <>
                {(loadingPopoverResponseType === "definition" ||
                  loadingPopoverResponseType === "synonyms" ||
                  loadingPopoverResponseType === "etymology") && (
                  <div className="w-56 px-3 py-2">
                    <div className="mb-1 text-xs opacity-50">
                      {loadingPopoverResponseType.charAt(0).toUpperCase() +
                        loadingPopoverResponseType.slice(1)}
                    </div>
                    <div>{popoverResponseContent}</div>
                  </div>
                )}
                {loadingPopoverResponseType === "pronunciation" && (
                  <div className="px-2 py-1.5">
                    <div className="mb-1 text-xs opacity-50">
                      {loadingPopoverResponseType.charAt(0).toUpperCase() +
                        loadingPopoverResponseType.slice(1)}
                    </div>
                    <div className="flex items-center ">
                      <span className="text-lg" ref={pronunciationTextRef}>
                        {popoverResponseContent}
                      </span>
                      <Button
                        size="medium-icon"
                        onClick={playPronunciationAudio}
                        className="ml-2"
                        disabled={!pronunciationAudioBuffer}
                        title={
                          pronunciationAudioBuffer
                            ? "Play pronunciation audio"
                            : "No pronunciation audio available"
                        }
                      >
                        {pronunciationAudioBuffer ? (
                          <span className="material-symbols-rounded">
                            volume_up
                          </span>
                        ) : (
                          <span className="material-symbols-rounded">
                            volume_off
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex w-56 justify-center text-center">
                <span className="material-symbols-rounded mr-1 animate-spin">
                  progress_activity
                </span>
                Getting {loadingPopoverResponseType}...
              </div>
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
                onClick={getWordDefinition}
              >
                Define
              </span>
              <span
                className=" p-2 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900"
                onClick={getWordPronunciation}
              >
                Pronunciation
              </span>
              <span
                className=" p-2 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-900"
                onClick={getWordSynonyms}
              >
                Synonym
              </span>
              <span
                className="p-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900"
                onClick={getWordEtymology}
              >
                Etymology
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
