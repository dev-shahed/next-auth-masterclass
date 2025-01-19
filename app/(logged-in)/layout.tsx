import Link from "next/link";
import React from "react";
import LogoutBtn from "../(auth)/logout";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/utils";

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <nav className="bg-gray-200 flex justify-between p-4 items-center">
        <ul className="flex gap-4">
          <li>
            <Link href={"/my-account"}>My Account</Link>
          </li>
          <li>
            <Link href={"/change-password"}>Change Password</Link>
          </li>
        </ul>
        <div>
          <LogoutBtn />
        </div>
      </nav>
      <div className="flex-1 flex justify-center items-center">{children}</div>
    </div>
  );
}
