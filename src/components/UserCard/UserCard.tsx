import type { User } from "../../types/user";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import "./UserCard.css";

export interface UserCardProps {
  user: User;
  onViewDetails: (user: User) => void;
}

export function UserCard({ user, onViewDetails }: UserCardProps) {
  return (
    <article className="user-card" aria-labelledby={`user-name-${user.id}`}>
      <Badge role={user.role} />

      <h3 id={`user-name-${user.id}`} className="user-card__name">
        {user.name}
      </h3>

      <p className="user-card__job-title">{user.jobTitle}</p>

      <div className="user-card__info">
        <span className="user-card__label">Team:</span>
        <span className="user-card__value">{user.team}</span>
      </div>

      <div className="user-card__info">
        <span className="user-card__label">Contact information:</span>
        <a href={`mailto:${user.email}`} className="user-card__email">
          {user.email}
        </a>
      </div>

      <Button onClick={() => onViewDetails(user)} aria-label={`View details for ${user.name}`}>
        View details
      </Button>
    </article>
  );
}
