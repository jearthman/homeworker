import { cva, VariantProps } from "cva";

const cardStyles = cva("flex flex-col", {
  variants: {
    intent: {
      primary: "bg-slate-700 p-8 text-white",
    },
    fullWidth: {
      true: "w-full",
    },
    flat: {
      true: "shadow-none",
    },
    size: {
      small: "rounded-lg shadow-md",
      medium: "rounded-xl shadow-lg",
      large: "rounded-2xl shadow-xl",
    },
  },
  defaultVariants: {
    flat: false,
    fullWidth: false,
    intent: "primary",
    size: "medium",
  },
});

export interface Props extends VariantProps<typeof cardStyles> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  intent,
  fullWidth,
  flat,
  size,
  children,
  className = "",
}: Props) {
  const computedClassNames = `${cardStyles({
    intent,
    fullWidth,
    flat,
    size,
  })} ${className}`.trim();

  return <div className={computedClassNames}>{children}</div>;
}
