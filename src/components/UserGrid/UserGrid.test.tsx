import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../types/user";
import { UserGrid } from "./UserGrid";

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    role: "admin",
    jobTitle: "Software Engineer",
    team: "Engineering",
    email: "john@example.com",
    details: "Details 1",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "editor",
    jobTitle: "Product Designer",
    team: "Design",
    email: "jane@example.com",
    details: "Details 2",
  },
];

describe("UserGrid", () => {
  const defaultProps = {
    users: mockUsers,
    onViewDetails: vi.fn(),
  };

  it("renders users list", () => {
    render(<UserGrid {...defaultProps} />);
    expect(screen.getByRole("list", { name: "Users list" })).toBeInTheDocument();
  });

  it("renders user cards for each user", () => {
    render(<UserGrid {...defaultProps} />);
    expect(screen.getByRole("heading", { name: "John Doe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Jane Smith" })).toBeInTheDocument();
  });

  it("renders list items for each user", () => {
    render(<UserGrid {...defaultProps} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("passes onViewDetails to user cards", async () => {
    const user = userEvent.setup();
    const handleViewDetails = vi.fn();
    render(<UserGrid users={mockUsers} onViewDetails={handleViewDetails} />);

    await user.click(screen.getByRole("button", { name: /view details for john doe/i }));

    expect(handleViewDetails).toHaveBeenCalledWith(mockUsers[0]);
  });

  describe("loading state", () => {
    it("shows loading spinner when loading", () => {
      render(<UserGrid {...defaultProps} loading={true} />);
      expect(screen.getByRole("status", { name: "Loading users..." })).toBeInTheDocument();
    });

    it("does not show users when loading", () => {
      render(<UserGrid {...defaultProps} loading={true} />);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("shows error message when there is an error", () => {
      render(<UserGrid {...defaultProps} error="Failed to load users" />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Failed to load users")).toBeInTheDocument();
    });

    it("does not show users when there is an error", () => {
      render(<UserGrid {...defaultProps} error="Error" />);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows empty state when no users", () => {
      render(<UserGrid users={[]} onViewDetails={vi.fn()} />);
      expect(screen.getByText("No users found")).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting your search or filters to find what you're looking for."),
      ).toBeInTheDocument();
    });

    it("does not show list when empty", () => {
      render(<UserGrid users={[]} onViewDetails={vi.fn()} />);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  it("prioritizes loading over other states", () => {
    render(<UserGrid users={[]} onViewDetails={vi.fn()} loading={true} error="Error" />);
    expect(screen.getByRole("status", { name: "Loading users..." })).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    expect(screen.queryByText("No users found")).not.toBeInTheDocument();
  });

  it("prioritizes error over empty state", () => {
    render(<UserGrid users={[]} onViewDetails={vi.fn()} error="Error message" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText("No users found")).not.toBeInTheDocument();
  });
});
