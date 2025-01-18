"use server";
import { handleError } from "@/lib/handleError";
import { formTypes, LoginSchema } from "../schema";
import { signIn } from "@/auth";
export const loginWithCredentials = async (data: formTypes) => {
  const { email, password } = data || {};
  // validate the input data on login form..
  const loginUserValidation = LoginSchema.safeParse({
    email,
    password,
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
      redirect: false, // Prevent automatic redirection
    });

    return {
      error: false,
      message: "Logged in successfully",
    };
  } catch {
    return handleError({ code: "invalid_crads" });
  }
};
