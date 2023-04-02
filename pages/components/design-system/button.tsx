import { cva, VariantProps } from "cva";

const buttonStyles = cva(
  "flex items-center justify-center px-2 py-1 rounded font-medium transition duration-500 ease-in-out",
  {
    variants: {
      intent: {
        primary: "bg-slate-600 text-white hover:bg-slate-700",
        secondary: "bg-gray-100 text-black hover:bg-gray-300",
        danger: "bg-red-400 text-gray-900 hover:bg-red-500 focus:ring-red-500",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "primary",
      fullWidth: false,
    },
  }
);

export interface Props extends VariantProps<typeof buttonStyles> {
  children: React.ReactNode;
}

export function Button({ intent, fullWidth, children }: Props) {
  return (
    <button className={buttonStyles({ intent, fullWidth })}>{children}</button>
  );
}
