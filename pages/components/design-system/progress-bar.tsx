export interface Props {
  className?: string;
  percentage?: number;
}

export function ProgressBar({ className = "", percentage }: Props) {
  return (
    <div className={className + " bg-matcha-600 h-1 w-full"}>
      <div
        className="absolute bg-matcha-300 h-1"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
