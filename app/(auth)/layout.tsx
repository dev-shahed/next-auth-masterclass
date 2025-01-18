import { isAuthenticated } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

export default async function LogOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect("/my-account");
  }
  return <>{children}</>;
}
