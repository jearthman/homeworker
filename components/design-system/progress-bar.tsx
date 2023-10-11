export interface Props {
  className?: string;
  percentage?: number;
}

export default function ProgressBar({ className = "", percentage }: Props) {
  return (
    <div className={className + " h-1 w-full bg-matcha-600"}>
      <div
        className="absolute h-1 bg-matcha-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
