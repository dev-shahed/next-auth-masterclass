"use server";

import { db } from "@/db/drizzle";
import { registerFormTypes, RegisterSchema } from "../schema";
import { usersTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

// This function registers the user
export const registerUser = async (data: registerFormTypes) => {
  // Validate the input data using the RegisterSchema
  const { email, password, passwordConfirm } = data || {};
  const newUserValidation = RegisterSchema.safeParse({
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message:
        newUserValidation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  // hash the password...
  const hashedPassword = await hash(data.password, 10);
  // Insert the validated data into the database
  try {
    await db.insert(usersTable).values({
      email: email,
      password: hashedPassword,
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
