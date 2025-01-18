"use server";

import {
  ChangePasswordFormTypes,
  changePasswordSchema,
} from "@/app/(auth)/schema";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { handleError } from "@/lib/handleError";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export const changePassword = async (data: ChangePasswordFormTypes) => {
  const { currentPassword, password, passwordConfirm } = data || {};
  const session = await auth();
  const loggedInUser = session?.user || {};
  // validate the input data on change password form..
  const formValidation = changePasswordSchema.safeParse({
    currentPassword,
    password,
    passwordConfirm,
  });

  if (!formValidation.success) {
    return handleError({
      name: "ValidationError",
      message: formValidation.error.issues[0]?.message,
    });
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(loggedInUser.id!)));

  if (!user) {
    return {
      error: true,
      message: "user not found",
    };
  }

  const passwordMatch = await compare(currentPassword, user.password!);

  if (!passwordMatch) {
    return {
      error: true,
      message: "Current password is incorrect",
    };
  }

  // save new password with hashed
  const hashNewPassword = await hash(password, 10);

  try {
    await db
      .update(usersTable)
      .set({ password: hashNewPassword })
      .where(eq(usersTable.id, parseInt(loggedInUser.id!)));
    return {
      error: false,
      message: "Password updated successfully!",
    };
  } catch (error) {
    return {
      error: true,
      message: error,
    };
  }
};
