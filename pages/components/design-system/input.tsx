import { cva, VariantProps } from "cva";

const inputStyles = cva(
  "border-2 border-black rounded-lg dark:border-white text-black dark:text-white bg-white dark:bg-black focus:outline-none",
  {
    variants: {
      sizeVariant: {
        small: "text-base px-2 py-1",
        medium: "text-lg px-3 py-1.5",
        large: "text-xl px-4 py-2",
        xlarge: "text-2xl px-5 py-2.5",
      },
    },
    defaultVariants: {
      sizeVariant: "medium",
    },
  }
);

export interface Props
  extends VariantProps<typeof inputStyles>,
    React.HTMLProps<HTMLInputElement> {
  className?: string;
}

export function Input({ sizeVariant, className = "", ...rest }: Props) {
  const computedClassNames = `${inputStyles({})} ${className}`.trim();

  return <input className={computedClassNames} {...rest}></input>;
}
