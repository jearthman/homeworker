import { cva, VariantProps } from "cva";

const inputStyles = cva(
  "border-2 border-black dark:border-white text-black dark:text-white text-lg py-3 px-4 bg-white dark:bg-black focus:outline-none",
  {
    variants: {},
  }
);

export interface Props
  extends VariantProps<typeof inputStyles>,
    React.HTMLProps<HTMLInputElement> {
  className?: string;
}

export function Input({ className = "", ...rest }: Props) {
  const computedClassNames = `${inputStyles({})} ${className}`.trim();

  return <input className={computedClassNames} {...rest}></input>;
}
