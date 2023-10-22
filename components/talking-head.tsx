import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface TalkingHeadProps {
  talkingIncrement: number;
  left?: number;
  top?: number;
  useAbsolutePositioning?: boolean;
}

const TalkingHead: React.FC<TalkingHeadProps> = ({
  talkingIncrement = 0,
  left = 0,
  top = 0,
  useAbsolutePositioning = true,
}) => {
  const positioningStyle = useAbsolutePositioning
    ? {
        position: "absolute" as "absolute",
        left: `${left}px`,
        top: `${top}px`,
      }
    : {};

  const [frame, setFrame] = useState(0);
  const frames = [
    "/img/sprite/homeworker_closed.svg",
    "/img/sprite/homeworker_open_1.svg",
    "/img/sprite/homeworker_open_2.svg",
    "/img/sprite/homeworker_open_1.svg",
    "/img/sprite/homeworker_closed.svg",
  ];

  const localFrameRef = useRef(0);
  const currentIncrementRef = useRef(talkingIncrement);

  useEffect(() => {
    if (talkingIncrement !== currentIncrementRef.current) {
      let interval: NodeJS.Timeout;
      interval = setInterval(() => {
        localFrameRef.current = (localFrameRef.current + 1) % frames.length;
        setFrame(localFrameRef.current);
        if (localFrameRef.current === frames.length - 1) {
          clearInterval(interval);
          currentIncrementRef.current = talkingIncrement;
        }
      }, 30); // Adjust this time for animation speed

      return () => clearInterval(interval);
    }
  }, [talkingIncrement]);

  return (
    <div
      style={{
        ...positioningStyle,
        zIndex: 1000,
        transition: "top 0.5s ease-in-out, left 0.5s ease-in-out",
      }}
    >
      <Image src={frames[frame]} alt="Talking Head" width={64} height={64} />
    </div>
  );
};

export default React.memo(TalkingHead);
