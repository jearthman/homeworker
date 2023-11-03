import { cva, VariantProps } from "cva";
import React from "react";

const selectStyles = cva(
  " focus:shadow-outline rounded-lg border border-transparent bg-white leading-tight shadow-lg focus:border-blue-600 focus:outline-none dark:border-white dark:bg-black dark:text-white",
  {
    variants: {
      sizeVariant: {
        small: "px-2 py-1 text-base",
        medium: "px-3 py-1.5 text-lg",
        large: "px-4 py-2 text-xl",
        xlarge: "px-5 py-2.5 text-2xl",
        xxlarge: "px-6 py-3 text-3xl",
      },
    },
    defaultVariants: {
      sizeVariant: "medium",
    },
  },
);

const caretStyles =
  "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700";

export interface SelectProps
  extends VariantProps<typeof selectStyles>,
    React.HTMLProps<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

export default function Select({
  sizeVariant,
  children,
  className = "",
  ...rest
}: SelectProps) {
  const computedClassNames = `${selectStyles({
    sizeVariant,
  })} ${className}`.trim();
  return (
    <select className={computedClassNames} {...rest}>
      {children}
    </select>
  );
}
