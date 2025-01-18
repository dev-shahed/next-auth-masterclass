"use server";

import { db } from "@/db/drizzle";
import { formTypes, RegisterSchema } from "../schema";
import { usersTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { handleError } from "@/lib/handleError";

export const registerUser = async (data: formTypes) => {
  const { email, password, passwordConfirm } = data || {};

  // Validate the input data..
  const newUserValidation = RegisterSchema.safeParse({
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
  });

  if (!newUserValidation.success) {
    return handleError({
      name: "ValidationError",
      message: newUserValidation.error.issues[0]?.message,
    });
  }

  // Hash the password
  const hashedPassword = await hash(data.password, 10);

  // Attempt to insert data into the database
  try {
    await db.insert(usersTable).values({
      email: email,
      password: hashedPassword,
    });

    // Trigger revalidation after successful registration
    revalidatePath("/");
    return {
      error: false,
      message: "Registered successfully",
    };
  } catch (error) {
    return handleError(error!);
  }
};
