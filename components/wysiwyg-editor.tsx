"use client";

import React, { useState, useEffect } from "react";
import {
  EditorState,
  $getRoot,
  $isRangeSelection,
  $getSelection,
  type TextFormatType,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import Button from "./design-system/button";
import ToolbarButton from "./design-system/toolbar-button";

const theme = {
  text: {
    bold: "font-extrabold",
  },
};

function onError(error: Error) {
  console.error(error);
}

type MarkdownParserPluginProps = {
  markdownContent?: string;
};

function MarkdownParserPlugin({ markdownContent }: MarkdownParserPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editor && markdownContent) {
      editor.update(() => {
        const nodes = $convertFromMarkdownString(markdownContent, TRANSFORMERS);

        const root = $getRoot();
        root.clear();

        if (Array.isArray(nodes)) {
          nodes.forEach((node) => {
            root.append(node);
          });
        }
      });
    }
  }, [markdownContent, editor]);

  return null;
}

function UndoRedoButtonsPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex gap-1">
      <ToolbarButton
        size="small"
        intent="primary"
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <span className="material-symbols-rounded">undo</span>
      </ToolbarButton>
      <ToolbarButton
        size="small"
        intent="primary"
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <span className="material-symbols-rounded">redo</span>
      </ToolbarButton>
    </div>
  );
}

function FormattingButtonsPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const [activeButtons, setActiveButtons] = useState(new Set());

  function toggleFormat(format: TextFormatType) {
    setActiveButtons((prevActiveButtons) => {
      const newActiveButtons = new Set(prevActiveButtons);
      if (newActiveButtons.has(format)) {
        newActiveButtons.delete(format);
      } else {
        newActiveButtons.add(format);
      }
      return newActiveButtons;
    });

    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  }

  return (
    <div className="flex gap-1">
      <ToolbarButton
        size="small"
        intent="primary"
        isToggleable
        isPressed={activeButtons.has("bold")}
        onClick={() => toggleFormat("bold")}
      >
        <span className="material-symbols-rounded">format_bold</span>
      </ToolbarButton>
      <ToolbarButton
        size="small"
        intent="primary"
        isToggleable
        isPressed={activeButtons.has("italic")}
        onClick={() => toggleFormat("italic")}
      >
        <span className="material-symbols-rounded">format_italic</span>
      </ToolbarButton>
      <ToolbarButton
        size="small"
        intent="primary"
        isToggleable
        isPressed={activeButtons.has("underline")}
        onClick={() => toggleFormat("underline")}
      >
        <span className="material-symbols-rounded">format_underlined</span>
      </ToolbarButton>
    </div>
  );
}

function ListButtonsPlugin(): JSX.Element {
  return (
    <div className="flex gap-1">
      <ToolbarButton size="small" intent="primary">
        <span className="material-symbols-rounded">format_list_bulleted</span>
      </ToolbarButton>
      <ToolbarButton size="small" intent="primary">
        <span className="material-symbols-rounded">format_list_numbered</span>
      </ToolbarButton>
    </div>
  );
}

function ToolbarPlugin() {
  return (
    <div className="flex justify-center rounded-tl-lg rounded-tr-lg bg-white p-1">
      <UndoRedoButtonsPlugin />
      <div className="mx-1 w-[2px] rounded-full bg-gray-200"></div>
      <FormattingButtonsPlugin />
      <div className="mx-1 w-[2px] rounded-full bg-gray-200"></div>
      <ListButtonsPlugin />
    </div>
  );
}

export type WYSIWYGProps = {
  className?: string;
  onEditorStateChange: (markdown: string) => void;
  markdownContent?: string;
};

export default function WYSIWYGEditor({
  className,
  onEditorStateChange,
  markdownContent,
}: WYSIWYGProps) {
  const initialConfig = {
    namespace: "WYSIWYGEditor",
    theme,
    onError,
  };

  const initialClassName =
    "w-full rounded-bl-lg rounded-br-lg border border-transparent bg-white p-3 shadow-lg focus:outline-none";

  const computedClassNames = `${initialClassName} ${className}`.trim();

  function onChange(editorState: EditorState): void {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      onEditorStateChange(markdown);
    });
  }

  return (
    <div className="relative">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className={computedClassNames}></ContentEditable>
          }
          placeholder={
            <div className="pointer-events-none absolute bottom-2 cursor-text p-3 opacity-50">
              Begin writing here...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
        <MarkdownParserPlugin markdownContent={markdownContent} />
      </LexicalComposer>
    </div>
  );
}
