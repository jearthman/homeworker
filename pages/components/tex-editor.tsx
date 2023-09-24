import React, { useState, useRef, useEffect } from "react";
import { InlineMath } from "react-katex";

const TeXEditor = () => {
  const [latex, setLatex] = useState("");
  const [renderedLatex, setRenderedLatex] = useState<JSX.Element | null>(null);
  const contentEditableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (latex && contentEditableRef?.current) {
      setRenderedLatex(<InlineMath math={latex} />);
      setLatex("");
    }
  }, [latex]);

  const handleInput = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const content = (e.target as HTMLDivElement).textContent;
    if (content && content.endsWith("$$")) {
      const latexMatch = content.match(/\$\$(.*?)\$\$/);
      if (latexMatch) {
        setLatex(latexMatch[1]);
      }
    }
  };

  return (
    <div
      contentEditable={true}
      ref={contentEditableRef}
      onInput={(event) => handleInput(event)}
      style={{ border: "1px solid black", minHeight: "100px" }}
    >
      {renderedLatex}
    </div>
  );
};

export default TeXEditor;
