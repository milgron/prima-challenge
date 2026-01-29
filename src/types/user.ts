export type Role = "admin" | "editor" | "viewer" | "guest" | "owner" | "inactive";

export interface User {
  id: string;
  name: string;
  role: Role;
  jobTitle: string;
  team: string;
  email: string;
  details: string;
}

export const ROLES: Role[] = ["admin", "editor", "viewer", "guest", "owner", "inactive"];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
  guest: "Guest",
  owner: "Owner",
  inactive: "Inactive",
};
