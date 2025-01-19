"use client";

import { passwordMatchSchema } from "@/app/(auth)/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast } from "@/components/ui/showtoast";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "./action";

type Props = {
  token: string;
};
const formSchema = passwordMatchSchema;

export default function FormElement({ token }: Props) {
  const toast = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    const inputValue = {
      token,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    };
    const response = await updatePassword(inputValue);

    console.log(response);
    if ("tokenInvalid" in response && response.tokenInvalid) {
      window.location.reload();
    }
    if (!response.error) {
      showToast(
        toast,
        { ...response, message: String(response.message) },
        "success"
      );
    } else {
      form.setError("root", {
        message: response.message as string,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!form.formState.errors.root?.message && (
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          )}
          <Button type="submit">Submit</Button>
        </fieldset>
      </form>
    </Form>
  );
}
