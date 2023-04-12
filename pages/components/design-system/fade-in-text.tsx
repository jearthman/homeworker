import { useEffect, useState } from "react";

export interface Props {
  text: string;
  className?: string;
}

export function FadeInText({ text, className }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={className + " fade-in-text-container"}>
      {text.split("").map((letter, index) => (
        <span
          key={index}
          className={`transition-opacity duration-1000 ${
            isMounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: `${index / 10}s` }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
