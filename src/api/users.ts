import { users } from "../data/users";
import type { User } from "../types/user";

const SIMULATED_DELAY_MS = 800;

export async function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, SIMULATED_DELAY_MS);
  });
}

let shouldSimulateError = false;

export function setSimulateError(value: boolean): void {
  shouldSimulateError = value;
}

export async function fetchUsersWithError(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSimulateError) {
        reject(new Error("Failed to fetch users. Please try again."));
      } else {
        resolve(users);
      }
    }, SIMULATED_DELAY_MS);
  });
}
