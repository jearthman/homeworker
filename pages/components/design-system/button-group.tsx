import React from "react";
import { cva, VariantProps } from "cva";
import { Props as ButtonProps } from "@ds/button";

const buttonGroupStyles = cva("flex items-center justify-center", {
  variants: {
    // intent: {
    //   primary: "bg-peach-300 text-slate-700",
    //   secondary: "bg-matcha-300 text-slate-700",
    // },
    fullWidth: {
      true: "w-full",
    },
    size: {
      small: "text-base",
      medium: "text-lg",
      large: "text-xl",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    // intent: "primary",
    fullWidth: false,
    size: "medium",
    orientation: "vertical",
  },
});

interface Props extends VariantProps<typeof buttonGroupStyles> {
  className?: string;
  children: React.ReactElement<ButtonProps>[];
  orientation?: "horizontal" | "vertical";
}

export function ButtonGroup({
  // intent,
  fullWidth,
  size,
  orientation = "vertical",
  children,
  className = "",
}: Props) {
  const childCount = React.Children.count(children);
  const computedClassNames = `${buttonGroupStyles({
    // intent,
    fullWidth,
    size,
    orientation,
  })} ${className}`.trim();
  return (
    <div className={computedClassNames}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        const isFirst = index === 0;
        const isLast = index === childCount - 1;

        let additionalClassNames = "rounded-none";

        if (orientation === "horizontal") {
          if (isFirst) {
            additionalClassNames += " rounded-l-lg";
          } else if (isLast) {
            additionalClassNames += " rounded-r-lg";
          }
        }

        if (orientation === "vertical") {
          if (isFirst) {
            additionalClassNames += " rounded-t-lg";
          } else if (isLast) {
            additionalClassNames += " rounded-b-lg";
          } else {
            additionalClassNames += " rounded-none";
          }
        }

        if (index !== childCount - 1) {
          additionalClassNames += " border-b-0";
        }

        return React.cloneElement(child, {
          ...child.props,
          className: `${child.props.className || ""} ${additionalClassNames}`,
        });
      })}
    </div>
  );
}
