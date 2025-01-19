"use server";
import { db } from "@/db/drizzle";

import { passwordResetTokensTable, usersTable } from "@/db/schema";
import { handleError } from "@/lib/handleError";
import { isAuthenticated } from "@/lib/utils";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export const ResetPassword = async (email: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  const authenticated = await isAuthenticated();
  if (authenticated) {
    return handleError({ name: "UnauthorizedError" });
  }

  if (!user) {
    return handleError({ name: "UnauthorizedError" });
  }
  const passwordResetToken = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000);

  await db
    .insert(passwordResetTokensTable)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiry,
    })
    .onConflictDoUpdate({
      target: passwordResetTokensTable.userId,
      set: {
        token: passwordResetToken,
        tokenExpiry,
      },
    });
};
