import { cva, VariantProps } from "cva";
import Label from "./label";

const checkboxStyles = cva(
  "h-5 w-5 rounded-lg text-matcha-100 accent-matcha-300 default:border-2 default:border-matcha-300",
  {
    variants: {},
  },
);

export interface Props extends VariantProps<typeof checkboxStyles> {
  className?: string;
  label: string;
}

export default function Checkbox({ className = "", label }: Props) {
  const computedClassNames = `${checkboxStyles({})}`.trim();

  return (
    <div className={`${className} flex items-center`}>
      <input
        id="checkbox"
        type="checkbox"
        className={computedClassNames}
      ></input>
      <Label className="ml-2" htmlFor="checkbox">
        {label}
      </Label>
    </div>
  );
}
