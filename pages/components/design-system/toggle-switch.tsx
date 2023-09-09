import { cva, VariantProps } from "cva";
import React from "react";

const toggleSwitchStyles = cva(
  "relative h-8 w-14 bg-black transition duration-300 ease-in-out dark:bg-white",
);

const toggleSwitchDotStyles = cva(
  "absolute inset-y-0 left-0 ml-1 mt-1 h-6 w-6 bg-white shadow transition-all duration-300 ease-in-out dark:bg-black dark:text-white",
  {
    variants: {
      isChecked: {
        true: "translate-x-full transform",
        false: "translate-x-0 transform",
      },
    },
    defaultVariants: {
      isChecked: false,
    },
  },
);

export interface Props
  extends VariantProps<typeof toggleSwitchStyles>,
    React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isChecked: boolean;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

export default function ToggleSwitch({
  isChecked,
  className = "",
  checkedIcon,
  uncheckedIcon,
  ...rest
}: Props) {
  const computedSwitchClassNames = `${toggleSwitchStyles(
    {},
  )} ${className}`.trim();

  const computedDotClassNames = toggleSwitchDotStyles({
    isChecked,
  });

  return (
    <label className="flex cursor-pointer items-center">
      <input type="checkbox" className="hidden" {...rest} />
      <div className={computedSwitchClassNames}>
        <div className={computedDotClassNames}>
          {isChecked ? checkedIcon : uncheckedIcon}
        </div>
      </div>
    </label>
  );
}
