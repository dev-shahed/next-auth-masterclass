import { auth } from "@/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check user is authenticated or not..
export async function isAuthenticated() {
  const session = await auth();
  const { user } = session || {};
  try {
    if (user !== null && user?.email) return true;
  } catch {
    return false;
  }
}
