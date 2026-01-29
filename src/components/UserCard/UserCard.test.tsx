import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../types/user";
import { UserCard } from "./UserCard";

const mockUser: User = {
  id: "1",
  name: "John Doe",
  role: "admin",
  jobTitle: "Software Engineer",
  team: "Engineering",
  email: "john.doe@example.com",
  details: "Lorem ipsum dolor sit amet",
};

describe("UserCard", () => {
  const defaultProps = {
    user: mockUser,
    onViewDetails: vi.fn(),
  };

  it("renders user name", () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByRole("heading", { name: "John Doe" })).toBeInTheDocument();
  });

  it("renders user role badge", () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders user job title", () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders user team", () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText("Team:")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  it("renders user email as link", () => {
    render(<UserCard {...defaultProps} />);
    const emailLink = screen.getByRole("link", { name: "john.doe@example.com" });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:john.doe@example.com");
  });

  it("renders view details button", () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByRole("button", { name: "View details for John Doe" })).toBeInTheDocument();
  });

  it("calls onViewDetails when button is clicked", async () => {
    const user = userEvent.setup();
    const handleViewDetails = vi.fn();
    render(<UserCard user={mockUser} onViewDetails={handleViewDetails} />);

    await user.click(screen.getByRole("button", { name: /view details/i }));

    expect(handleViewDetails).toHaveBeenCalledTimes(1);
    expect(handleViewDetails).toHaveBeenCalledWith(mockUser);
  });

  it("has accessible article element", () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("article is labelled by user name", () => {
    render(<UserCard {...defaultProps} />);
    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("aria-labelledby", "user-name-1");
  });

  it("renders different roles correctly", () => {
    const editorUser: User = { ...mockUser, role: "editor" };
    render(<UserCard user={editorUser} onViewDetails={vi.fn()} />);
    expect(screen.getByText("Editor")).toBeInTheDocument();
  });
});
