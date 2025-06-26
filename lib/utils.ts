import { auth } from "@/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check user is authenticated or not..
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user?.email && session.user.id);
}

export async function loggedInUser() {
  const session = await auth();
  return session?.user?.email && session.user.id ? session.user : null;
}
