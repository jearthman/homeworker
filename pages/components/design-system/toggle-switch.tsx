import { cva, VariantProps } from "cva";
import React from "react";

const toggleSwitchStyles = cva(
  "relative w-10 h-4 transition duration-300 ease-in-out",
  {
    variants: {
      isChecked: {
        true: "bg-green-400",
        false: "bg-gray-400",
      },
    },
    defaultVariants: {
      isChecked: false,
    },
  }
);

const toggleSwitchDotStyles = cva(
  "absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0 transition-all duration-300 ease-in-out",
  {
    variants: {
      isChecked: {
        true: "transform translate-x-full",
        false: "transform translate-x-0",
      },
    },
    defaultVariants: {
      isChecked: false,
    },
  }
);

export interface Props
  extends VariantProps<typeof toggleSwitchStyles>,
    React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isChecked: boolean;
}

export function ToggleSwitch({ isChecked, className = "", ...rest }: Props) {
  const computedSwitchClassNames = `${toggleSwitchStyles({
    isChecked,
  })} ${className}`.trim();

  const computedDotClassNames = toggleSwitchDotStyles({
    isChecked,
  });

  return (
    <label className="flex items-center cursor-pointer">
      <input type="checkbox" className="hidden" {...rest} />
      <div className={computedSwitchClassNames}>
        <div className={computedDotClassNames}></div>
      </div>
    </label>
  );
}
