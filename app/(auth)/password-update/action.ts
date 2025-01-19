"use server";

import { handleError } from "@/lib/handleError";
import { passwordMatchSchema } from "../schema";
import { isAuthenticated } from "@/lib/utils";
import { passwordResetTokensTable } from "@/db/passwordResetTokens";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { hash } from "bcryptjs";
import { usersTable } from "@/db/usersSchema";

type UpdateFormTypes = {
  token: string;
  password: string;
  passwordConfirm: string;
};

export const updatePassword = async (formData: UpdateFormTypes) => {
  const { password, passwordConfirm, token } = formData || {};
  // validate the input data on change password form..
  const formValidation = passwordMatchSchema.safeParse({
    password,
    passwordConfirm,
  });

  if (!formValidation.success) {
    return handleError({
      name: "ValidationError",
      message: formValidation.error.issues[0]?.message,
    });
  }

  const authenticated = await isAuthenticated();
  if (authenticated) {
    return {
      error: true,
      message: "Please Logged out first, to update password",
    };
  }

  try {
    let tokenIsValid = false;
    if (token) {
      const [passwordResetToken] = await db
        .select()
        .from(passwordResetTokensTable)
        .where(eq(passwordResetTokensTable.token, token));
      const now = Date.now();
      if (
        passwordResetToken?.tokenExpiry &&
        now < passwordResetToken.tokenExpiry.getTime()
      ) {
        tokenIsValid = true;
      }

      if (!tokenIsValid) {
        return {
          error: true,
          message: "Your token is invalid or has been expired!",
          tokenInvalid: true,
        };
      }

      //save new password to db..
      const hashPassword = await hash(password, 10);
      await db
        .update(usersTable)
        .set({ password: hashPassword })
        .where(eq(usersTable.id, passwordResetToken.userId!));

      // delete the row from password reset token table once the password is updated..
      await db
        .delete(passwordResetTokensTable)
        .where(eq(passwordResetTokensTable.id, passwordResetToken.id));
    }
    return {
      error: false,
      message: "Password Updated Successfully!!",
    };
  } catch (error) {
    return handleError({ message: error as string });
  }
};
