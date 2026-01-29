import type { Role } from "../../types/user";
import { ROLE_LABELS, ROLES } from "../../types/user";
import "./FilterBar.css";

export interface FilterBarProps {
  activeFilters: Role[];
  onFilterChange: (filters: Role[]) => void;
}

export function FilterBar({ activeFilters, onFilterChange }: FilterBarProps) {
  const handleFilterToggle = (role: Role) => {
    if (activeFilters.includes(role)) {
      onFilterChange(activeFilters.filter((r) => r !== role));
    } else {
      onFilterChange([...activeFilters, role]);
    }
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="filter-bar" role="group" aria-label="Filter by role">
      <span className="filter-bar__label">Filter by:</span>
      <div className="filter-bar__buttons">
        {ROLES.map((role) => {
          const isActive = activeFilters.includes(role);
          return (
            <button
              key={role}
              type="button"
              className={`filter-bar__button filter-bar__button--${role} ${
                isActive ? "filter-bar__button--active" : ""
              }`}
              onClick={() => handleFilterToggle(role)}
              aria-pressed={isActive}
            >
              {ROLE_LABELS[role]}
            </button>
          );
        })}
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          className="filter-bar__clear"
          onClick={() => onFilterChange([])}
        >
          Remove filters
        </button>
      )}
    </div>
  );
}
