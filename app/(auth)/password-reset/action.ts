"use server";
import { db } from "@/db/drizzle";
import { passwordResetTokensTable, usersTable } from "@/db/schema";
import { handleError } from "@/lib/handleError";
import { mailer } from "@/lib/mail";
import { isAuthenticated } from "@/lib/utils";
import { randomBytes } from "crypto";
import { render } from "@react-email/render";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";
import { eq } from "drizzle-orm";


export const ResetPassword = async (email: string) => {

 const getUserByEmail = async (userEmail: string) => {
    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
        })
        .from(usersTable)
        .where(eq(usersTable.email, userEmail));
  
      return {
        user: user || null,
        error: !user,
        message: user ? "" : "User not found",
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return {
        user: null,
        error: true,
        message: "An error occurred while retrieving the user",
      };
    }
  };

  // Check if the user exists
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
Task Tracker Team
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
