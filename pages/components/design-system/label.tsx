import { cva, VariantProps } from "cva";

const labelStyles = cva("text-sm font-medium text-opacity-70", {
  variants: {},
});

export interface Props
  extends VariantProps<typeof labelStyles>,
    React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: React.ReactNode;
}

export default function Label({ children, className = "", ...rest }: Props) {
  const computedClassNames = `${labelStyles({})} ${className}`.trim();

  return (
    <label className={computedClassNames} {...rest}>
      {children}
    </label>
  );
}
