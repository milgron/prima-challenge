import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchUsers } from "../api/users";
import type { Role, User } from "../types/user";

export interface UseUsersOptions {
  searchQuery?: string;
  roleFilters?: Role[];
  enabled?: boolean;
}

export interface UseUsersResult {
  users: User[];
  allUsers: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUsers({
  searchQuery = "",
  roleFilters = [],
  enabled = true,
}: UseUsersOptions = {}): UseUsersResult {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUsers();
      setAllUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      loadUsers();
    }
  }, [enabled, loadUsers]);

  const filteredUsers = useMemo(() => {
    let result = allUsers;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((user) => user.name.toLowerCase().includes(query));
    }

    if (roleFilters.length > 0) {
      result = result.filter((user) => roleFilters.includes(user.role));
    }

    return result;
  }, [allUsers, searchQuery, roleFilters]);

  return {
    users: filteredUsers,
    allUsers,
    loading,
    error,
    refetch: loadUsers,
  };
}
