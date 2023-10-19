import React, { useState, useEffect } from "react";
import Image from "next/image";

interface TalkingHeadProps {
  isTalking: boolean;
  left?: number;
  top?: number;
}

export default function TalkingHead({
  isTalking,
  left = 0,
  top = 0,
}: TalkingHeadProps) {
  const [frame, setFrame] = useState(0);
  const frames = [
    "/img/sprite/homeworker_closed.svg",
    "/img/sprite/homeworker_open_1.svg",
    "/img/sprite/homeworker_open_2.svg",
    "/img/sprite/homeworker_open_1.svg",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTalking) {
      interval = setInterval(() => {
        setFrame((prevFrame) => (prevFrame + 1) % frames.length);
      }, 100); // Adjust this time for animation speed
    } else {
      setFrame(0); // Reset to first frame
    }

    return () => clearInterval(interval);
  }, [isTalking]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 1000,
        transition: "top 0.6s ease-in-out, left 0.6s ease-in-out",
      }}
    >
      <Image src={frames[frame]} alt="Talking Head" width={64} height={64} />
    </div>
  );
}
