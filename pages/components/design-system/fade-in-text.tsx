import { useEffect, useState } from "react";

export interface Props {
  text: string;
  className?: string;
  onFadeInComplete?: () => void;
  isReady: boolean;
}

export function FadeInText({
  text,
  className,
  onFadeInComplete,
  isReady,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isReady) {
      setIsMounted(true);
    }
  }, [isReady]);

  const checkLastLetter = (index: number) => {
    if (index === text.length - 1 && onFadeInComplete) {
      onFadeInComplete();
    }
  };

  return (
    <div className={className + " fade-in-text-container"}>
      {text.split("").map((letter, index) => (
        <span
          key={index}
          className={`transition-opacity duration-1000 ${
            isMounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: `${index / Math.max(text.length, 10)}s` }}
          onTransitionEnd={() => checkLastLetter(index)}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
