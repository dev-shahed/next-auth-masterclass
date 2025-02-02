import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { passwordResetTokensTable } from "@/db/passwordResetTokens";
import { usersTable } from "@/db/usersSchema";
import { clsx, type ClassValue } from "clsx";
import { eq } from "drizzle-orm";
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

// Retrieve a user by ID
export const getUserByEmail = async (userEmail: string) => {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        password: usersTable.password,
        twoFactorSecret: usersTable.twoFactorSecret,
      })
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    return {
      user: user || null,
      error: !user,
      message: user ? "" : "User not found",
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return {
      user: null,
      error: true,
      message: "An error occurred while retrieving the user",
    };
  }
};


// Check if the password reset token is valid
export const isTokenValid = async (token: string): Promise<boolean> => {
  if (!token) return false;

  const passwordResetToken = await db
    .select()
    .from(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.token, token))
    .then(([token]) => token || null);

  return Boolean(passwordResetToken?.tokenExpiry && Date.now() < passwordResetToken.tokenExpiry.getTime());
};
