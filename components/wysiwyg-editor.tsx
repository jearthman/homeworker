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
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
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
import ToolbarButton from "./design-system/toolbar-button";

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
        $convertFromMarkdownString(markdownContent, TRANSFORMERS);
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
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex gap-1">
      <ToolbarButton
        size="small"
        intent="primary"
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
      >
        <span className="material-symbols-rounded">format_list_bulleted</span>
      </ToolbarButton>
      <ToolbarButton
        size="small"
        intent="primary"
        onClick={() => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
      >
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

const theme = {
  text: {
    bold: "font-extrabold",
    underline: "underline",
  },
  list: {
    ol: "list-decimal",
    ul: "list-disc",
    listitem: "ml-4",
    nested: {
      listitem: "ml-8",
    },
  },
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
    nodes: [ListNode, ListItemNode],
  };

  const initialClassName = "focus:outline-none h-full";

  const computedClassNames = `${initialClassName} ${className}`.trim();

  function onChange(editorState: EditorState): void {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      onEditorStateChange(markdown);
    });
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <ListPlugin />
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="relative z-0 flex max-h-[500px] min-h-[50px] w-full resize-y overflow-auto rounded-bl-lg rounded-br-lg border-none bg-white p-3 shadow-lg">
              <div className="relative -z-10 flex-auto">
                <ContentEditable
                  className={computedClassNames}
                ></ContentEditable>
              </div>
            </div>
          }
          placeholder={
            <div className="pointer-events-none absolute top-0 cursor-text p-3 opacity-50">
              Begin writing here...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <OnChangePlugin onChange={onChange} />
      <MarkdownParserPlugin markdownContent={markdownContent} />
    </LexicalComposer>
  );
}
