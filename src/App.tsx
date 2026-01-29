import { useCallback, useState } from "react";
import "./App.css";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { SearchInput } from "./components/SearchInput/SearchInput";
import { UserGrid } from "./components/UserGrid/UserGrid";
import { UserModal } from "./components/UserModal/UserModal";
import { useUsers } from "./hooks/useUsers";
import type { Role, User } from "./types/user";

export function App() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasSearched = searchQuery.trim().length > 0;

  const { users, loading, error } = useUsers({
    searchQuery,
    roleFilters: activeFilters,
    enabled: hasSearched,
  });

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
  }, [searchInput]);

  const handleViewDetails = useCallback((user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  return (
    <div className={`app ${hasSearched ? "app--searched" : ""}`}>
      <header className="app__header">
        <h1 className="app__title">
          <span className="app__title-highlight">User</span> Dashboard
        </h1>
        <SearchInput value={searchInput} onChange={setSearchInput} onSearch={handleSearch} />
      </header>

      <main className="app__main">
        <section className="app__controls" aria-label="Search and filter controls">
          <FilterBar activeFilters={activeFilters} onFilterChange={setActiveFilters} />
        </section>

        <section className="app__results" aria-label="Search results">
          <UserGrid
            users={users}
            onViewDetails={handleViewDetails}
            loading={loading}
            error={error}
          />
        </section>
      </main>

      <UserModal user={selectedUser} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
