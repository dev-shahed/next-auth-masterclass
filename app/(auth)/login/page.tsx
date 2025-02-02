"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/components/common/showtoast";
import { loginWithCredentials, preLoginCheck } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OtpForm from "@/components/common/otp-form";

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const inputValue = {
      email: data.email,
      password: data.password,
    };

    // verify two factor auth is activated or not..
    const responsePreLogin = await preLoginCheck(inputValue);
    if (responsePreLogin?.error) {
      form.setError("root", {
        message: responsePreLogin.message,
      });
      return;
    }

    // Check if two factor auth is activated
    if (responsePreLogin?.twoFactorActivated) {
      setStep(2);
    } else {
      const response = await loginWithCredentials(inputValue);
      console.log(response);
      if (!response.error) {
        showToast(toast, response);
        router.push("/my-account");
      } else {
        form.setError("root", {
          message: response.message,
        });
      }
    }
  };

  //pass email address to reset password..
  const email = form.getValues("email");

  //handle otp submit..
  const handleOTPSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const response = await loginWithCredentials({
      email: form.getValues("email"),
      password: form.getValues("password"),
      token: otp,
    });
    showToast(toast, response);
    if (response?.error) return;
    if (!response?.error) {
      router.push("/my-account");
      setOtp("");
    }
  };

  // handle back to login page..
  const handleBack = () => {
    setStep(1);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login to your account to get access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-2"
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
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
                  <Button type="submit">Login</Button>
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
              Forget your password?{" "}
              <Link
                href={`/password-reset${
                  email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
                className="underline"
              >
                Reset Password
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
      {step === 2 && (
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>One Time Passcode</CardTitle>
            <CardDescription>
              Login to your account via Authentication code from Google
              Authenticator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OtpForm
              handleOTPSubmit={handleOTPSubmit}
              setOtp={setOtp}
              otp={otp}
              handleBack={handleBack}
              isSubmitting={form.formState.isSubmitting ?? false}
            />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
