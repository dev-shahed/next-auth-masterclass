"use server";

import { db } from "@/db/drizzle";
import { usersTable } from "@/db/usersSchema";
import { handleError } from "@/lib/handleError";
import { loggedInUser } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";
import speakeasy from "speakeasy";

export const get2faSecret = async () => {
  const loggedUser = await loggedInUser();
  const [user] = await db
    .select({
      twoFactorSecret: usersTable.twoFactorSecret,
    })
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(loggedUser?.id as string)));
  if (!loggedUser) {
    return handleError({ name: "NotFound" });
  }
  let twoFactorSecret = user.twoFactorSecret;
  const token1Test = authenticator.generateSecret();
  const generatedSecret = speakeasy.generateSecret({ length: 10 });
  const token2Test = generatedSecret.base32;

  // console.log({ token1Test });
  // console.log({ token2Test });

  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();
    await db
      .update(usersTable)
      .set({
        twoFactorSecret,
      })
      .where(eq(usersTable.id, parseInt(loggedUser?.id as string)));
  }

  if (token1Test === token2Test) {
    return {
      error: true,
      message: "Token is not valid",
    };
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      loggedUser?.email ?? "",
      "auth-app",
      twoFactorSecret ?? ""
    ),
  };
};

export const activate2fa = async (token: string) => {
  const loggedUser = await loggedInUser();
  const [user] = await db
    .select({
      twoFactorSecret: usersTable.twoFactorSecret,
    })
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(loggedUser?.id as string)));
  if (!loggedUser) {
    return handleError({ name: "NotFound" });
  }
  if (user.twoFactorSecret as string) {
    const tokenValid = authenticator.check(
      token,
      user.twoFactorSecret as string
    );
    if (!tokenValid) {
      return {
        error: true,
        message: "Invalid OTP",
      };
    }

    await db
      .update(usersTable)
      .set({
        twoFactorActivated: true,
      })
      .where(eq(usersTable.id, parseInt(loggedUser?.id as string)));
  }
};

export const disable2fa = async () => {
  const loggedUser = await loggedInUser();
  if (!loggedUser) {
    return handleError({ name: "NotFound" });
  }
  await db
    .update(usersTable)
    .set({
      twoFactorActivated: false,
    })
    .where(eq(usersTable.id, parseInt(loggedUser?.id as string)));
};
