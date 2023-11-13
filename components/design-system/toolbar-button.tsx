import { cva, VariantProps } from "cva";
import { useState, useCallback } from "react";

const buttonStyles = cva(
  "flex items-center justify-center rounded-lg border font-medium transition duration-100 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      intent: {
        primary:
          "border-none bg-transparent text-sky-500 shadow-none enabled:hover:bg-sky-50",
        secondary:
          "bg-transparent text-matcha-300 enabled:hover:bg-matcha-300 enabled:hover:bg-opacity-10",
        neutral:
          "bg-transparent text-white enabled:hover:bg-gray-300 enabled:hover:bg-opacity-10",
      },
      fullWidth: {
        true: "w-full",
      },
      size: {
        small: "px-1 py-1 text-base ",
        medium: "px-1.5 py-1.5 text-lg ",
        large: "px-2 py-2 text-xl ",
        xlarge: "px-2.5 py-2.5 text-2xl ",
        xxlarge: "px-3 py-3 text-3xl",
      },
      pressed: {
        true: "shadow-inner enabled:bg-sky-100",
        false: "",
      },
      toggleable: {
        true: "",
        false: "enabled:active:bg-sky-100",
      },
    },
    defaultVariants: {
      intent: "primary",
      fullWidth: false,
      size: "medium",
      pressed: false,
    },
  },
);

export interface Props
  extends VariantProps<typeof buttonStyles>,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  isToggleable?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  isPressed?: boolean;
}

export default function ToolbarButton({
  intent,
  fullWidth,
  size,
  children,
  className = "",
  isToggleable = false,
  onEnabledChange,
  isPressed,
  ...rest
}: Props) {
  // const [enabled, setEnabled] = useState(false);

  // const toggleButton = useCallback(() => {
  //   setEnabled((prevEnabled) => {
  //     const newEnabled = !prevEnabled;
  //     if (onEnabledChange) {
  //       onEnabledChange(newEnabled);
  //     }
  //     return newEnabled;
  //   });
  // }, [onEnabledChange]);

  const computedClassNames = `${buttonStyles({
    intent,
    fullWidth,
    size,
    pressed: isPressed,
    toggleable: isToggleable,
  })} ${className}`.trim();
  return (
    <button
      className={`${computedClassNames} `}
      {...rest}
      // onClick={() => (toggleable ? toggleButton() : undefined)}
      aria-pressed={isPressed}
    >
      {children}
    </button>
  );
}
