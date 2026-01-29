import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    onSearch: vi.fn(),
  };

  it("renders with label", () => {
    render(<SearchInput {...defaultProps} />);
    expect(screen.getByText("What are you looking for?")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<SearchInput {...defaultProps} label="Custom label" />);
    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });

  it("renders input with placeholder", () => {
    render(<SearchInput {...defaultProps} />);
    expect(screen.getByPlaceholderText("Search by name...")).toBeInTheDocument();
  });

  it("renders input with custom placeholder", () => {
    render(<SearchInput {...defaultProps} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText("Custom placeholder")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SearchInput {...defaultProps} onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    expect(handleChange).toHaveBeenCalledTimes(4); // Once for each character
    expect(handleChange).toHaveBeenLastCalledWith("t");
  });

  it("calls onSearch when clicking search button", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(<SearchInput {...defaultProps} onSearch={handleSearch} />);

    const button = screen.getByRole("button", { name: /search/i });
    await user.click(button);

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("calls onSearch when pressing Enter", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(<SearchInput {...defaultProps} onSearch={handleSearch} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "{enter}");

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("displays the current value", () => {
    render(<SearchInput {...defaultProps} value="test value" />);
    expect(screen.getByRole("textbox")).toHaveValue("test value");
  });

  it("has accessible search role", () => {
    render(<SearchInput {...defaultProps} />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("has proper label association", () => {
    render(<SearchInput {...defaultProps} id="custom-id" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "custom-id");
    expect(screen.getByLabelText("What are you looking for?")).toBe(input);
  });
});
