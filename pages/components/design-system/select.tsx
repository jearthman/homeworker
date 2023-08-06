import { cva, VariantProps } from "cva";
import React from "react";

const selectStyles = cva(
  " bg-white border-2 border-black hover:border-gray-500 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline",
  {
    variants: {
      sizeVariant: {
        small: "text-base px-2 py-1",
        medium: "text-lg px-3 py-1.5",
        large: "text-xl px-4 py-2",
        xlarge: "text-2xl px-5 py-2.5",
        xxlarge: "text-3xl px-6 py-3",
      },
    },
    defaultVariants: {
      sizeVariant: "medium",
    },
  }
);

const caretStyles =
  "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700";

export interface SelectProps
  extends VariantProps<typeof selectStyles>,
    React.HTMLProps<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

export function Select({
  sizeVariant,
  children,
  className = "",
  ...rest
}: SelectProps) {
  const computedClassNames = `${selectStyles({
    sizeVariant,
  })} ${className}`.trim();
  return <select className={computedClassNames}>{children}</select>;
}
