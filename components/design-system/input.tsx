import { cva, VariantProps } from "cva";

const inputStyles = cva(
  "rounded-lg border border-transparent bg-white text-black shadow-lg focus:border-blue-600 focus:outline-none dark:border-white dark:bg-black dark:text-white",
  {
    variants: {
      sizeVariant: {
        small: "px-2 py-1 text-sm",
        medium: "px-3 py-1.5 text-base",
        large: "px-4 py-2 text-lg",
        xlarge: "px-5 py-2.5 text-xl",
      },
    },
    defaultVariants: {
      sizeVariant: "medium",
    },
  },
);

export interface Props
  extends VariantProps<typeof inputStyles>,
    React.HTMLProps<HTMLInputElement> {
  className?: string;
}

export default function Input({ sizeVariant, className = "", ...rest }: Props) {
  const computedClassNames = `${inputStyles({})} ${className}`.trim();

  return <input className={computedClassNames} {...rest}></input>;
}
