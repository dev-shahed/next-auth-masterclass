import LogoutBtn from "@/app/(auth)/logout";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";


export default async function MyAccount() {
  const session = await auth();
  const { user } = session || {};

  if (!user) {
    return (
      <div className="mt-6 text-center">
        <h3>No User found...</h3>
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <LogoutBtn />
        </CardContent>
      </Card>
    </main>
  );
}
