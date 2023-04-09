import { cva, VariantProps } from "cva";

const inputStyles = cva(
  "text-lg py-3 px-4 rounded-md bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500",
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
