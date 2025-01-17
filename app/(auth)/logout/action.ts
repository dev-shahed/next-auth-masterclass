"use server";

import { signOut } from "@/auth";

export const userLogout = async () => {
  try {
    await signOut({ redirect: false });
    return {
      error: false,
      message: "Logged Out Successfully",
    };
  } catch (error) {
    return {
      error: true,
      message: error || "An error occurred during logout.",
    };
  }
};
