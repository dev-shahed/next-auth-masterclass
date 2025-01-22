'use server'

import { db } from "@/db/drizzle";
import { usersTable } from "@/db/usersSchema";
import { handleError } from "@/lib/handleError";
import { loggedInUser } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";

export const get2faSecret = async () => {
  const user = await loggedInUser();
  if (!user || (!user.email && !user.id)) {
    return handleError({ name: "UnauthorizedError" });
  }

  const [dbUser] = await db
    .select({ twoFactorSecret: usersTable.twoFactorSecret })
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(user.id!)));

  if (!dbUser) {
    return handleError({ name: "NotFound" });
  }

  let twoFactorSecret = dbUser.twoFactorSecret;
  if (!dbUser.twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();
    await db
      .update(usersTable)
      .set({ twoFactorSecret })
      .where(eq(usersTable.id, parseInt(user.id!)));
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      user.email!,
      "My Auth App",
      twoFactorSecret!
    ),
  };
};
