import { cva, VariantProps } from "cva";
import React from "react";

const buttonStyles = cva(
  "flex items-center justify-center rounded-lg border font-medium transition duration-300 hover:shadow-md active:shadow-none disabled:cursor-not-allowed disabled:border-none disabled:bg-transparent disabled:text-gray-400 disabled:shadow-none",
  {
    variants: {
      intent: {
        primary:
          "border-sky-600 bg-sky-500 text-sky-100 hover:bg-sky-400  active:bg-sky-600 dark:bg-sky-300 dark:text-sky-800 dark:hover:bg-sky-400",
        secondary:
          "border-matcha-600 bg-matcha-500 text-matcha-100 hover:bg-matcha-400 active:bg-matcha-600 active:shadow-none dark:bg-matcha-300 dark:text-matcha-800 dark:hover:bg-matcha-400",
        danger: "bg-red-400 text-gray-900 hover:bg-red-500 focus:ring-red-500",
        neutral: "bg-gray-400 text-gray-900 hover:bg-gray-400",
        link: "bg-transparent text-matcha-600 shadow-none hover:bg-transparent",
        "primary-outline":
          "bg-transparent text-peach-300 hover:bg-peach-300 hover:bg-opacity-10",
        "secondary-outline":
          " bg-transparent text-matcha-300 hover:bg-matcha-300 hover:bg-opacity-10",
        "neutral-outline":
          "bg-transparent text-white hover:bg-gray-300 hover:bg-opacity-10",
        "inner-form":
          "bg-white text-green-600 hover:text-green-700 dark:border-gray-600 dark:bg-black dark:text-green-400 dark:hover:text-green-500",
      },
      fullWidth: {
        true: "w-full",
      },
      size: {
        small: "px-2 py-1 text-base",
        medium: "px-3 py-1.5 text-lg",
        large: "px-4 py-2 text-xl",
        xlarge: "px-5 py-2.5 text-2xl",
        xxlarge: "px-6 py-3 text-3xl",
      },
    },
    defaultVariants: {
      intent: "primary",
      fullWidth: false,
      size: "medium",
    },
  },
);

export interface Props
  extends VariantProps<typeof buttonStyles>,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export default function Button({
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