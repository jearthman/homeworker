import { cva, VariantProps } from "cva";

const cardStyles = cva("rounded-lg shadow-md flex flex-col", {
  variants: {
    intent: {
      primary: "bg-slate",
    },
    fullWidth: {
      true: "w-full",
    },
    flat: {
      true: "shadow-none",
    },
  },
  defaultVariants: {
    flat: false,
    fullWidth: false,
  },
});

export interface Props extends VariantProps<typeof cardStyles> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ fullWidth, flat, children, className = "" }: Props) {
  const computedClassNames = `${cardStyles({
    fullWidth,
    flat,
  })} ${className}`.trim();

  return <div className={computedClassNames}>{children}</div>;
}
