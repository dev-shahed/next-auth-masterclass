"use server";
import { db } from "@/db/drizzle";
import { passwordResetTokensTable } from "@/db/schema";
import { handleError } from "@/lib/handleError";
import { mailer } from "@/lib/mail";
import { getUserByEmail, isAuthenticated } from "@/lib/utils";
import { randomBytes } from "crypto";
import { render } from "@react-email/render";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";


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

  // Render React Email component to HTML
  const html = await render(PasswordResetEmail({ resetLink }));


  // Fallback plain-text version
  const text = `
Dear User,

We received a request to reset your password. Please use the link below to reset it:

${resetLink}

If you did not request this, you can safely ignore this email.

Thank you,  
My app Team
`;

  // Send email
  await mailer.sendMail({
    from: "test@resend.dev",
    to: email,
    subject: "Password Reset Request",
    text,
    html,
  });
};
