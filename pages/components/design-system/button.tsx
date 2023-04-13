import { cva, VariantProps } from "cva";
import React from "react";

const buttonStyles = cva(
  "flex items-center justify-center rounded font-medium transition duration-500 ease-in-out",
  {
    variants: {
      intent: {
        primary: "bg-slate-600 text-white hover:bg-slate-500",
        secondary: "bg-gray-300 text-black hover:bg-gray-100",
        danger: "bg-red-400 text-gray-900 hover:bg-red-500 focus:ring-red-500",
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
