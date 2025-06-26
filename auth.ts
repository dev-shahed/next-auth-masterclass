import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db/drizzle";
import { usersTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { authenticator } from "otplib";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour in seconds
  },
  jwt: {
    maxAge: 3600, // 1 hour in seconds
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email as string));

        if (!user) {
          throw new Error("Incorrect credentials");
        } else {
          const passwordCorrect = await compare(
            credentials.password as string,
            user.password!
          );
          if (!passwordCorrect) {
            throw new Error("Incorrect credentials");
          }
          if (user.twoFactorActivated) {
            const isValid = authenticator.check(
              credentials.token as string,
              user.twoFactorSecret!
            );
            if (!isValid) {
              throw new Error("Incorrect OTP!");
            }
          }
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
