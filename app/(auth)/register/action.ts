"use server";

import { db } from "@/db/drizzle";

import { registerFormTypes, RegisterSchema } from "../schema";
import { usersTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

// This function registers the user
export const registerUser = async (data: registerFormTypes) => {
  // Validate the input data using the RegisterSchema
  const newUserValidation = RegisterSchema.safeParse({
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message: newUserValidation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  // Insert the validated data into the database
  try {
    await db
      .insert(usersTable)
      .values({
        email: data.email,
        password: data.password,
        createdAt: new Date(),
        twoFactorSecret: "", 
        twoFactorActivated: false,
      });
    // Trigger revalidation after the user is successfully registered
    revalidatePath("/");
    return {
      error: false,
      message: "Registered successfully",
    };
  } catch (error) {
    return {
      error: true,
      message: error || "An error occurred during registration",
    };
  }
};
