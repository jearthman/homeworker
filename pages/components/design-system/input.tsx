import { cva, VariantProps } from "cva";

const inputStyles = cva(
  "border-2 border-black text-black text-lg py-3 px-4 bg-white focus:outline-none",
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
