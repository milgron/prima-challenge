import type { Role } from "../../types/user";
import { ROLE_LABELS } from "../../types/user";
import "./Badge.css";

export interface BadgeProps {
  role: Role;
  size?: "small" | "medium";
  className?: string;
}

export function Badge({ role, size = "medium", className = "" }: BadgeProps) {
  const label = ROLE_LABELS[role];

  return (
    <span
      className={`badge badge--${role} badge--${size} ${className}`.trim()}
      aria-label={`Role: ${label}`}
    >
      {label}
    </span>
  );
}
