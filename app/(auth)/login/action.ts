"use server";
import { handleError } from "@/lib/handleError";
import { formTypes, LoginSchema } from "../schema";
import { signIn } from "@/auth";
import { usersTable } from "@/db/usersSchema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
export const loginWithCredentials = async (data: formTypes) => {
  const { email, password, token } = data || {};
  // validate the input data on login form..
  const loginUserValidation = LoginSchema.safeParse({
    email,
    password,
    token,
  });

  if (!loginUserValidation.success) {
    return handleError({
      name: "ValidationError",
      message: loginUserValidation.error.issues[0]?.message,
    });
  }

  try {
    await signIn("credentials", {
      email,
      password,
      token,
      redirect: false, // Prevent automatic redirection
    });
    return {
      error: false,
      message: "Logged in successfully",
    };
  } catch (error: unknown) {
    const message = (error as { cause?: { err?: { message?: string } } })?.cause
      ?.err?.message;
    return message
      ? { error: true, message }
      : handleError({ code: "invalid_crads" });
  }
};

export const preLoginCheck = async (data: formTypes) => {
  const { email, password } = data || {};
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email as string));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  } else {
    const passwordCorrect = await compare(password, user.password!);
    if (!passwordCorrect) {
      return {
        error: true,
        message: "Incorrect credentials",
      };
    } else {
      return {
        error: false,
        message: "",
        twoFactorActivated: user.twoFactorActivated,
      };
    }
  }
};
