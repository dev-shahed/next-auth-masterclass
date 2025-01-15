import { z } from "zod";

// Define the individual password schema
export const passwordSchema = z
  .string()
  .min(5, "Password must contain at least 5 characters");

// Define password match schema..
export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "Passwords do not match",
      });
    }
  });

// Define the register schema
export const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })
  .and(passwordMatchSchema);

// types of login form fields..
export type registerFormTypes = {
  email: string;
  password: string;
  passwordConfirm: string;
};
