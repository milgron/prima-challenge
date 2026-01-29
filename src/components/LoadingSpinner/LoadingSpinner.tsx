import "./LoadingSpinner.css";

export interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  label?: string;
}

export function LoadingSpinner({ size = "medium", label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`} role="status" aria-label={label}>
      <div className="loading-spinner__circle" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
