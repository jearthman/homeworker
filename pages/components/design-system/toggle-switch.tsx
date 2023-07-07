import { cva, VariantProps } from "cva";
import React from "react";

const toggleSwitchStyles = cva(
  "relative w-14 h-8 transition duration-300 ease-in-out bg-black dark:bg-white"
);

const toggleSwitchDotStyles = cva(
  "absolute ml-1 mt-1 w-6 h-6 bg-white dark:bg-black dark:text-white shadow inset-y-0 left-0 transition-all duration-300 ease-in-out",
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
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

export function ToggleSwitch({
  isChecked,
  className = "",
  checkedIcon,
  uncheckedIcon,
  ...rest
}: Props) {
  const computedSwitchClassNames = `${toggleSwitchStyles(
    {}
  )} ${className}`.trim();

  const computedDotClassNames = toggleSwitchDotStyles({
    isChecked,
  });

  return (
    <label className="flex items-center cursor-pointer">
      <input type="checkbox" className="hidden" {...rest} />
      <div className={computedSwitchClassNames}>
        <div className={computedDotClassNames}>
          {isChecked ? checkedIcon : uncheckedIcon}
        </div>
      </div>
    </label>
  );
}
