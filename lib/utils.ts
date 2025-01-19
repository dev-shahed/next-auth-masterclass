import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { passwordResetTokensTable } from "@/db/passwordResetTokens";
import { clsx, type ClassValue } from "clsx";
import { eq } from "drizzle-orm";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check user is authenticated or not..
export async function isAuthenticated() {
  const session = await auth();
  const { user } = session || {};
  try {
    if (user !== null && user?.email && user?.id) return true;
  } catch {
    return false;
  }
}

//check update password token is valid or not..

export const IsTokenIsValid = async (token: string) => {
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.token, token));
    const now = Date.now();
    if (
      passwordResetToken?.tokenExpiry &&
      now < passwordResetToken.tokenExpiry.getTime()
    ) {
      return true;
    }
  }
};
