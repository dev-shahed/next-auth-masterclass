"use server";

import { registerFormTypes, RegisterSchema } from "./../schema";

// here receive inputValue as data
export const registerUser = async (data: registerFormTypes) => {
  const newUserValidation = RegisterSchema.safeParse({
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message:
        newUserValidation.error.issues[0]?.message ?? "An Error occurred",
    };
  }

  if (newUserValidation.success) {
    return {
        error: false,
        message: "from submit"
    }
  }
};
