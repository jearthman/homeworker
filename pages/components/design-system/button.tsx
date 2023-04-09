import { cva, VariantProps } from "cva";
import React from "react";

const buttonStyles = cva(
  "flex items-center justify-center px-2 py-1 rounded font-medium transition duration-500 ease-in-out",
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
    },
    defaultVariants: {
      intent: "primary",
      fullWidth: false,
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
  children,
  className = "",
  ...rest
}: Props) {
  const computedClassNames = `${buttonStyles({
    intent,
    fullWidth,
  })} ${className}`.trim();
  return (
    <button className={computedClassNames} {...rest}>
      {children}
    </button>
  );
}
