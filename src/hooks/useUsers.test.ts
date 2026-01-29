import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useUsers } from "./useUsers";

// Mock the API module
vi.mock("../api/users", () => ({
  fetchUsers: vi.fn(),
}));

import { fetchUsers } from "../api/users";
import type { User } from "../types/user";

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    role: "admin",
    jobTitle: "Engineer",
    team: "Engineering",
    email: "john@example.com",
    details: "Details",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "editor",
    jobTitle: "Designer",
    team: "Design",
    email: "jane@example.com",
    details: "Details",
  },
  {
    id: "3",
    name: "Bob Johnson",
    role: "admin",
    jobTitle: "Manager",
    team: "Management",
    email: "bob@example.com",
    details: "Details",
  },
];

describe("useUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchUsers).mockResolvedValue(mockUsers);
  });

  it("fetches users on mount", async () => {
    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    vi.mocked(fetchUsers).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.users).toEqual([]);
  });

  it("filters users by search query", async () => {
    const { result } = renderHook(() => useUsers({ searchQuery: "john" }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toHaveLength(2); // John Doe and Bob Johnson
    expect(result.current.users.map((u) => u.name)).toContain("John Doe");
    expect(result.current.users.map((u) => u.name)).toContain("Bob Johnson");
  });

  it("filters users by search query case insensitively", async () => {
    const { result } = renderHook(() => useUsers({ searchQuery: "JOHN" }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toHaveLength(2);
  });

  it("filters users by role", async () => {
    const { result } = renderHook(() => useUsers({ roleFilters: ["admin"] }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toHaveLength(2);
    expect(result.current.users.every((u) => u.role === "admin")).toBe(true);
  });

  it("filters by multiple roles (OR logic)", async () => {
    const { result } = renderHook(() => useUsers({ roleFilters: ["admin", "editor"] }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toHaveLength(3);
  });

  it("combines search and role filters", async () => {
    const { result } = renderHook(() => useUsers({ searchQuery: "john", roleFilters: ["admin"] }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Only John Doe matches both "john" in name AND "admin" role
    // Bob Johnson has "johnson" which contains "john" and is admin
    expect(result.current.users).toHaveLength(2);
  });

  it("returns empty array when no matches", async () => {
    const { result } = renderHook(() => useUsers({ searchQuery: "xyz" }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toHaveLength(0);
  });

  it("provides allUsers regardless of filters", async () => {
    const { result } = renderHook(() => useUsers({ searchQuery: "john" }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.allUsers).toEqual(mockUsers);
    expect(result.current.users).not.toEqual(mockUsers);
  });

  it("can refetch users", async () => {
    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchUsers).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchUsers).toHaveBeenCalledTimes(2);
  });

  it("trims search query whitespace", async () => {
    const { result } = renderHook(() => useUsers({ searchQuery: "  john  " }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toHaveLength(2);
  });
});
