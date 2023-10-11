import React, { useState, useEffect } from "react";
import Image from "next/image";

interface TalkingHeadProps {
  isTalking: boolean;
}

function TalkingHead({ isTalking }: TalkingHeadProps) {
  const [frame, setFrame] = useState(0);
  const frames = [
    "../private/img/sprite/homeworker_closed.png",
    "../private/img/sprite/homeworker_open_1.png",
    "../private/img/sprite/homeworker_open_2.png",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTalking) {
      interval = setInterval(() => {
        setFrame((prevFrame) => (prevFrame + 1) % frames.length);
      }, 200); // Adjust this time for animation speed
    } else {
      setFrame(0); // Reset to default frame (mouth closed)
    }

    return () => clearInterval(interval);
  }, [isTalking]);

  return <Image src={frames[frame]} alt="Talking Head" />;
}

export default TalkingHead;
