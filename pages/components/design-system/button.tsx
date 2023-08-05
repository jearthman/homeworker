import { cva, VariantProps } from "cva";
import React from "react";

const buttonStyles = cva(
  "flex items-center justify-center rounded font-medium transition duration-500 ease-in-out",
  {
    variants: {
      intent: {
        primary:
          "bg-peach-600 dark:bg-peach-300 text-gray-100 dark:text-gray-700 hover:bg-peach-700 dark:hover:bg-peach-400",
        secondary:
          "bg-matcha-600 dark:bg-matcha-300 text-gray-100 dark:text-gray-700 hover:bg-matcha-700 dark:hover:bg-matcha-400",
        danger: "bg-red-400 text-gray-900 hover:bg-red-500 focus:ring-red-500",
        neutral: "bg-gray-300 text-gray-900 hover:bg-gray-400",
        "primary-outline":
          "bg-transparent text-peach-300 border-2 border-peach-300 hover:bg-peach-300 hover:bg-opacity-10",
        "secondary-outline":
          "bg-transparent text-matcha-300 border-2 border-matcha-300 hover:bg-matcha-300 hover:bg-opacity-10",
        "neutral-outline":
          "bg-transparent text-white border-2 border-gray-300 hover:bg-gray-300 hover:bg-opacity-10",
        "inner-form":
          "bg-white dark:bg-black text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500 border-2 border-black dark:border-white",
      },
      fullWidth: {
        true: "w-full",
      },
      size: {
        small: "text-base px-2 py-1",
        medium: "text-lg px-3 py-1.5",
        large: "text-xl px-4 py-2",
        xlarge: "text-2xl px-5 py-2.5",
        xxlarge: "text-3xl px-6 py-3",
      },
    },
    defaultVariants: {
      intent: "primary",
      fullWidth: false,
      size: "medium",
    },
  }
);

export interface Props
  extends VariantProps<typeof buttonStyles>,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export function Button({
  intent,
  fullWidth,
  size,
  children,
  className = "",
  ...rest
}: Props) {
  const computedClassNames = `${buttonStyles({
    intent,
    fullWidth,
    size,
  })} ${className}`.trim();
  return (
    <button className={computedClassNames} {...rest}>
      {children}
    </button>
  );
}
