import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

// Mock the API module
vi.mock("./api/users", () => ({
  fetchUsers: vi.fn(),
}));

import { fetchUsers } from "./api/users";
import type { User } from "./types/user";

const mockUsers: User[] = [
  {
    id: "1",
    name: "George Harris",
    role: "admin",
    jobTitle: "Software Engineer",
    team: "Security",
    email: "george.harris@example.com",
    details: "Lorem ipsum dolor sit amet",
  },
  {
    id: "2",
    name: "Arianna Russo",
    role: "editor",
    jobTitle: "Product Designer",
    team: "Rebates",
    email: "arianna.russo@example.com",
    details: "Lorem ipsum dolor sit amet",
  },
  {
    id: "3",
    name: "Sarah Williams",
    role: "guest",
    jobTitle: "Product Designer",
    team: "Security",
    email: "sarah.williams@example.com",
    details: "Lorem ipsum dolor sit amet",
  },
];

// Helper to type a search query, click Search, and wait for results to appear
async function searchAndWaitForResults(user: ReturnType<typeof userEvent.setup>, query: string) {
  const searchInput = screen.getByRole("textbox");
  await user.type(searchInput, query);
  await user.click(screen.getByRole("button", { name: "Search" }));

  await waitFor(() => {
    expect(screen.queryByText("George Harris")).toBeInTheDocument();
  });
}

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchUsers).mockResolvedValue(mockUsers);
  });

  it("renders the dashboard title", async () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /user dashboard/i })).toBeInTheDocument();
  });

  it("shows initial state with title and search visible", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /user dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("displays users after searching", async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "a");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("George Harris")).toBeInTheDocument();
    });

    expect(screen.getByText("Arianna Russo")).toBeInTheDocument();
    expect(screen.getByText("Sarah Williams")).toBeInTheDocument();
  });

  it("filters users by search input", async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "george");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("George Harris")).toBeInTheDocument();
      expect(screen.queryByText("Arianna Russo")).not.toBeInTheDocument();
    });
  });

  it("filters users by role", async () => {
    const user = userEvent.setup();
    render(<App />);

    await searchAndWaitForResults(user, "a");

    await user.click(screen.getByRole("button", { name: "Admin" }));

    await waitFor(() => {
      expect(screen.getByText("George Harris")).toBeInTheDocument();
      expect(screen.queryByText("Arianna Russo")).not.toBeInTheDocument();
      expect(screen.queryByText("Sarah Williams")).not.toBeInTheDocument();
    });
  });

  it("opens modal when clicking view details", async () => {
    const user = userEvent.setup();
    render(<App />);

    await searchAndWaitForResults(user, "a");

    await user.click(screen.getByRole("button", { name: /view details for george harris/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Modal should show the user details with "Other details" section
    expect(screen.getByText("Other details:")).toBeInTheDocument();
  });

  it("closes modal when clicking close button", async () => {
    const user = userEvent.setup();
    render(<App />);

    await searchAndWaitForResults(user, "a");

    await user.click(screen.getByRole("button", { name: /view details for george harris/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /close modal/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes modal when pressing Escape", async () => {
    const user = userEvent.setup();
    render(<App />);

    await searchAndWaitForResults(user, "a");

    await user.click(screen.getByRole("button", { name: /view details for george harris/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("shows empty state when no users match filters", async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "xyz nonexistent");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("No users found")).toBeInTheDocument();
    });
  });

  it("shows error state when fetch fails", async () => {
    vi.mocked(fetchUsers).mockRejectedValue(new Error("Network error"));

    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "a");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("combines search and role filters", async () => {
    const user = userEvent.setup();
    render(<App />);

    await searchAndWaitForResults(user, "a");

    // Filter by guest role
    await user.click(screen.getByRole("button", { name: "Guest" }));

    await waitFor(() => {
      expect(screen.queryByText("George Harris")).not.toBeInTheDocument();
      expect(screen.getByText("Sarah Williams")).toBeInTheDocument();
    });

    // Clear and search for "sarah"
    const searchInput = screen.getByRole("textbox");
    await user.clear(searchInput);
    await user.type(searchInput, "sarah");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Sarah Williams")).toBeInTheDocument();
    });
  });
});
