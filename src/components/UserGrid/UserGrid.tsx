import type { User } from "../../types/user";
import { EmptyState } from "../EmptyState/EmptyState";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { UserCard } from "../UserCard/UserCard";
import "./UserGrid.css";

export interface UserGridProps {
  users: User[];
  onViewDetails: (user: User) => void;
  loading?: boolean;
  error?: string | null;
}

export function UserGrid({ users, onViewDetails, loading = false, error = null }: UserGridProps) {
  if (loading) {
    return (
      <div className="user-grid user-grid--loading">
        <LoadingSpinner size="large" label="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-grid user-grid--error">
        <EmptyState icon="error" title="Something went wrong" description={error} />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="user-grid user-grid--empty">
        <EmptyState
          icon="search"
          title="No users found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      </div>
    );
  }

  return (
    <div className="user-grid" role="list" aria-label="Users list">
      {users.map((user) => (
        <div key={user.id} role="listitem">
          <UserCard user={user} onViewDetails={onViewDetails} />
        </div>
      ))}
    </div>
  );
}
