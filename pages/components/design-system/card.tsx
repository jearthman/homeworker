import { cva, VariantProps } from "cva";

const cardStyles = cva("rounded-lg shadow-md flex flex-col", {
  variants: {
    intent: {
      primary: "bg-slate-700 text-white p-8",
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

export function Card({
  intent,
  fullWidth,
  flat,
  children,
  className = "",
}: Props) {
  const computedClassNames = `${cardStyles({
    intent,
    fullWidth,
    flat,
  })} ${className}`.trim();

  return <div className={computedClassNames}>{children}</div>;
}
