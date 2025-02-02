"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";
import speakeasy from "speakeasy";

export const get2faSecret = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const [user] = await db
    .select({
      twoFactorSecret: usersTable.twoFactorSecret,
    })
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  let twoFactorSecret = user.twoFactorSecret;

  const token1Test = authenticator.generateSecret();
  // if authenticator.generateSecret doesn't work, try this line instead:
  // note you'll need to `npm i speakeasy && npm i -D @types/speakeasy`
  const generatedSecret = speakeasy.generateSecret({ length: 10 });
  const token2Test = generatedSecret.base32;

  console.log({ token1Test });
  console.log({ token2Test });

  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();
    await db
      .update(usersTable)
      .set({
        twoFactorSecret,
      })
      .where(eq(usersTable.id, parseInt(session.user.id)));
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      session.user.email ?? "",
      "WebDevEducation",
      twoFactorSecret
    ),
  };
};

export const activate2fa = async (token: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const [user] = await db
    .select({
      twoFactorSecret: usersTable.twoFactorSecret,
    })
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  if (user.twoFactorSecret) {
    const tokenValid = authenticator.check(token, user.twoFactorSecret);

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
      .where(eq(usersTable.id, parseInt(session.user.id)));
  }
};

export const disable2fa = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  await db
    .update(usersTable)
    .set({
      twoFactorActivated: false,
    })
    .where(eq(usersTable.id, parseInt(session.user.id)));
};
