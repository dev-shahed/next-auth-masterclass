"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { emailSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ResetPassword } from "./action";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PasswordReset() {
  const SearchParams = useSearchParams();
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: decodeURIComponent(SearchParams.get("email") ?? ""),
    },
  });

  const handleFormSubmit = async (data: z.infer<typeof emailSchema>) => {
    const { email } = data;
    const response = await ResetPassword(email);
    console.log(response);

    if (response?.error) {
      form.setError("root", {
        message: response.message,
      });
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Email Sent</CardTitle>
          </CardHeader>
          <CardContent>
            If you have an account with us you will receive a password reset
            email at: <br />
            <span className="underline font-semibold">
              {form.getValues("email")}
            </span>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>
              Enter you email address to rest password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-3"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!!form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root.message}
                    </FormMessage>
                  )}
                  <Button type="submit">Submit</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/register"} className="underline">
                Register
              </Link>
            </div>
            <div className="text-muted-foreground text-sm">
              Remamber your password?{" "}
              <Link href={"/login"} className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
