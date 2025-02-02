"use server";
import { db } from "@/db/drizzle";

import { passwordResetTokensTable } from "@/db/schema";
import { handleError } from "@/lib/handleError";
import { mailer } from "@/lib/mail";
import { getUserByEmail, isAuthenticated } from "@/lib/utils";
import { randomBytes } from "crypto";

export const ResetPassword = async (email: string) => {
  const findUser = await getUserByEmail(email);
  const { user } = findUser;
  const authenticated = await isAuthenticated();
  if (authenticated) {
    return handleError({ name: "UnauthorizedError" });
  }

  if (!user) {
    return handleError({ name: "UnauthorizedError" });
  }
  const passwordResetToken = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000);

  await db
    .insert(passwordResetTokensTable)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiry,
    })
    .onConflictDoUpdate({
      target: passwordResetTokensTable.userId,
      set: {
        token: passwordResetToken,
        tokenExpiry,
      },
    });

  const resetLink = `${process.env.SITE_BASE_URL}/password-update?token=${passwordResetToken}`;

  await mailer.sendMail({
    from: "test@resend.dev",
    to: email, // Recipient's email address
    subject: "Password Reset Request", // Subject line
    text: `Dear User,
  
  You have requested to reset your password. Please click the link below to reset it:
  
   ${resetLink}
  
  If you did not make this request, you can safely ignore this email.
  
  Thank you,
  The YourDomain Team
  `,
    html: `
      <p>Dear User,</p>
      <p>You have requested to reset your password. Please click the link below to reset it:</p>
      <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
      <p>If you did not make this request, you can safely ignore this email.</p>
      <p>Thank you,<br />The YourDomain Team</p>
    `,
  });
};
