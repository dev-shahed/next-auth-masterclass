import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import FormElement from ".";

export default function ChangePassword() {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Set New Password</CardTitle>
          <CardDescription>
            Please enter a strong and secure password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormElement />
        </CardContent>
      </Card>
    </main>
  );
}
