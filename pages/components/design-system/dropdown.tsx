import { cva, VariantProps } from "cva";
import React, { useEffect, CSSProperties } from "react";
import styles from "./dropdown.module.css";

const dropdownStyles = cva(
  "flex items-center justify-center font-medium transition duration-500 ease-in-out",
  {
    variants: {
      intent: {
        primary: "bg-peach-300 text-slate-700 hover:bg-peach-400",
        secondary: "bg-matcha-300 text-slate-700 hover:bg-matcha-400",
        danger: "bg-red-400 text-gray-900 hover:bg-red-500 focus:ring-red-500",
        neutral: "bg-white text-black dark:bg-black dark:text-white",
      },
      fullWidth: {
        true: "w-full",
      },
      size: {
        small: "text-base px-2 py-1",
        medium: "text-lg px-3 py-1.5",
        large: "text-xl px-4 py-2",
      },
    },
    defaultVariants: {
      intent: "neutral",
      fullWidth: false,
      size: "medium",
    },
  }
);

export interface Props
  extends VariantProps<typeof dropdownStyles>,
    React.HTMLAttributes<HTMLDivElement> {
  onDismiss?: () => void;
  className?: string;
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
}

export function Dropdown({
  triggerRef,
  intent,
  fullWidth,
  size,
  children,
  className = "",
  onDismiss,
  ...rest
}: Props) {
  const relativeRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current || !relativeRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    relativeRef.current.style.left = `${rect.left}px`;
    relativeRef.current.style.top = `${rect.top + rect.height}px`;
  }, [triggerRef]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      onDismiss?.();
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, [onDismiss]);

  const computedClassNames = `${dropdownStyles({
    intent,
    fullWidth,
    size,
  })} ${className}`.trim();
  return (
    <div className={`${styles.caretUp} ${computedClassNames}`} {...rest}>
      {children}
    </div>
  );
}
