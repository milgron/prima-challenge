import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  const defaultProps = {
    activeFilters: [],
    onFilterChange: vi.fn(),
  };

  it("renders all role filter buttons", () => {
    render(<FilterBar {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editor" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Viewer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Owner" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inactive" })).toBeInTheDocument();
  });

  it("renders filter by label", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("Filter by:")).toBeInTheDocument();
  });

  it("marks active filters with aria-pressed", () => {
    render(<FilterBar {...defaultProps} activeFilters={["admin", "editor"]} />);

    expect(screen.getByRole("button", { name: "Admin" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Editor" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Viewer" })).toHaveAttribute("aria-pressed", "false");
  });

  it("adds filter when clicking inactive filter", async () => {
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();
    render(<FilterBar activeFilters={[]} onFilterChange={handleFilterChange} />);

    await user.click(screen.getByRole("button", { name: "Admin" }));

    expect(handleFilterChange).toHaveBeenCalledWith(["admin"]);
  });

  it("removes filter when clicking active filter", async () => {
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();
    render(<FilterBar activeFilters={["admin", "editor"]} onFilterChange={handleFilterChange} />);

    await user.click(screen.getByRole("button", { name: "Admin" }));

    expect(handleFilterChange).toHaveBeenCalledWith(["editor"]);
  });

  it("allows multiple filters to be active", async () => {
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();
    render(<FilterBar activeFilters={["admin"]} onFilterChange={handleFilterChange} />);

    await user.click(screen.getByRole("button", { name: "Editor" }));

    expect(handleFilterChange).toHaveBeenCalledWith(["admin", "editor"]);
  });

  it("has accessible group role", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByRole("group", { name: "Filter by role" })).toBeInTheDocument();
  });

  it("applies active class to active filters", () => {
    render(<FilterBar {...defaultProps} activeFilters={["admin"]} />);

    expect(screen.getByRole("button", { name: "Admin" })).toHaveClass("filter-bar__button--active");
    expect(screen.getByRole("button", { name: "Editor" })).not.toHaveClass(
      "filter-bar__button--active",
    );
  });
});
