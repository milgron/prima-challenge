import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders with role label", () => {
    render(<Badge role="admin" />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("applies correct role class for admin", () => {
    render(<Badge role="admin" />);
    expect(screen.getByText("Admin")).toHaveClass("badge--admin");
  });

  it("applies correct role class for editor", () => {
    render(<Badge role="editor" />);
    expect(screen.getByText("Editor")).toHaveClass("badge--editor");
  });

  it("applies correct role class for viewer", () => {
    render(<Badge role="viewer" />);
    expect(screen.getByText("Viewer")).toHaveClass("badge--viewer");
  });

  it("applies correct role class for guest", () => {
    render(<Badge role="guest" />);
    expect(screen.getByText("Guest")).toHaveClass("badge--guest");
  });

  it("applies correct role class for owner", () => {
    render(<Badge role="owner" />);
    expect(screen.getByText("Owner")).toHaveClass("badge--owner");
  });

  it("applies correct role class for inactive", () => {
    render(<Badge role="inactive" />);
    expect(screen.getByText("Inactive")).toHaveClass("badge--inactive");
  });

  it("has medium size by default", () => {
    render(<Badge role="admin" />);
    expect(screen.getByText("Admin")).toHaveClass("badge--medium");
  });

  it("applies small size when specified", () => {
    render(<Badge role="admin" size="small" />);
    expect(screen.getByText("Admin")).toHaveClass("badge--small");
  });

  it("has accessible aria-label", () => {
    render(<Badge role="admin" />);
    expect(screen.getByLabelText("Role: Admin")).toBeInTheDocument();
  });

  it("does not use role=status for static badge", () => {
    render(<Badge role="admin" />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("accepts additional className", () => {
    render(<Badge role="admin" className="custom-class" />);
    expect(screen.getByText("Admin")).toHaveClass("custom-class");
  });
});
