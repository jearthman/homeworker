import { cva, VariantProps } from "cva";
import React, {
  useState,
  useEffect,
  CSSProperties,
  useContext,
  createContext,
  useCallback,
} from "react";
import styles from "./dropdown.module.css";

const dropdownStyles = cva(" transition duration-500 ease-in-out", {
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
});

interface Position {
  x: number;
  y: number;
}

export interface Props
  extends VariantProps<typeof dropdownStyles>,
    React.HTMLAttributes<HTMLDivElement> {
  onDismiss?: () => void;
  className?: string;
  children: React.ReactNode;
  position?: Position;
}

export interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownContext = createContext<
  { toggleDropdown: () => void; isOpen: boolean } | undefined
>(undefined);

// Dropdown
export function Dropdown({
  intent,
  fullWidth,
  size,
  children,
  className = "",
  onDismiss,
  ...rest
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!isOpen) {
        onDismiss?.();
      }
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, [isOpen, onDismiss]);

  const computedClassNames = `${dropdownStyles({
    intent,
    fullWidth,
    size,
  })} ${className}`.trim();

  return (
    <div className="relative">
      <DropdownContext.Provider value={{ toggleDropdown, isOpen }}>
        {children}
      </DropdownContext.Provider>
    </div>
  );
}

// DropdownTrigger
export function DropdownTrigger({
  children,
  className = "",
  ...rest
}: DropdownTriggerProps) {
  const { toggleDropdown } = useContext(DropdownContext)!;

  if (!toggleDropdown)
    throw new Error("DropdownTrigger must be used within a Dropdown");

  const computedClassNames = className.trim();

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement | HTMLSpanElement>
  ) => {
    event.stopPropagation();
    toggleDropdown();
  };

  return (
    <div className={computedClassNames} {...rest} onClick={handleClick}>
      {children}
    </div>
  );
}

// DropdownItems
export function DropdownItems({
  children,
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useContext(DropdownContext)!;
  const computedClassNames = `${styles.items} ${className}`.trim();
  if (!isOpen) {
    return null;
  }
  return (
    <div
      className={`flex flex-col bg-white dark:bg-black border-2 border-black dark:border-white absolute z-10 ${computedClassNames}`}
      {...rest}
    >
      {React.Children.map(children, (child, index) => (
        <div
          className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
          key={index}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
