import { cva, VariantProps } from "cva";

const cardStyles = cva("px-2 py-1 rounded-lg shadow-md", {
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
}

export function Card({ fullWidth, flat, children }: Props) {
  return <div className={cardStyles({ fullWidth, flat })}>{children}</div>;
}
