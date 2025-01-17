import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db/drizzle";
import { usersTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email as string));

        if (!user) {
          throw new Error("incorrect Credentials..");
        } else {
          const passwordCorrect = await compare(
            credentials.password as string,
            user.password!
          );
          if (!passwordCorrect) {
            throw new Error("incorrect Credentials..");
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
