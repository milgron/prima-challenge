import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../types/user";
import { UserModal } from "./UserModal";

const mockUser: User = {
  id: "1",
  name: "John Doe",
  role: "admin",
  jobTitle: "Software Engineer",
  team: "Engineering",
  email: "john.doe@example.com",
  details: "Lorem ipsum dolor sit amet consectetur.",
};

describe("UserModal", () => {
  const defaultProps = {
    user: mockUser,
    isOpen: true,
    onClose: vi.fn(),
  };

  it("renders when open", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<UserModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not render when user is null", () => {
    render(<UserModal user={null} isOpen={true} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders user name", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByRole("heading", { name: "John Doe" })).toBeInTheDocument();
  });

  it("renders user role badge", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders user job title", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders user team", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  it("renders user email as link", () => {
    render(<UserModal {...defaultProps} />);
    const emailLink = screen.getByRole("link", { name: "john.doe@example.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:john.doe@example.com");
  });

  it("renders user details", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByText("Lorem ipsum dolor sit amet consectetur.")).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Close modal" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<UserModal {...defaultProps} onClose={handleClose} />);

    await user.click(screen.getByRole("button", { name: "Close modal" }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<UserModal {...defaultProps} onClose={handleClose} />);

    await user.keyboard("{Escape}");

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<UserModal {...defaultProps} onClose={handleClose} />);

    // Click on the backdrop (the outer div)
    const backdrop = screen.getByRole("dialog").parentElement;
    if (backdrop) {
      await user.click(backdrop);
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when modal content is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<UserModal {...defaultProps} onClose={handleClose} />);

    await user.click(screen.getByRole("dialog"));

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("has proper ARIA attributes", () => {
    render(<UserModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
  });

  it("focuses close button when opened", () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Close modal" })).toHaveFocus();
  });
});
