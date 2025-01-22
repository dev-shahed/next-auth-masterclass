import LogoutBtn from "@/app/(auth)/logout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import TwoFactorAuth from "../two-factor-auth";
import { loggedInUser } from "@/lib/utils";
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/usersSchema";
import { eq } from "drizzle-orm";

export default async function MyAccount() {
  const user = await loggedInUser();

  if (!user) {
    return (
      <div className="mt-6 text-center">
        <h3>No User found...</h3>
      </div>
    );
  }

  const [dbUser] = await db
    .select({ twoFactorActivated: usersTable.twoFactorActivated })
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(user.id!)));

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <LogoutBtn />
        </CardContent>
        <CardContent>
          <TwoFactorAuth twoFactorAuth={dbUser.twoFactorActivated ?? false} />
        </CardContent>
      </Card>
    </main>
  );
}
