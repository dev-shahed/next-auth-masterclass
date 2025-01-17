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

// Define register schema
export const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })
  .and(passwordMatchSchema);

// Define login schema..
export const LoginSchema = z.object({
  email: z.string().email("Invalid email Address"),
  password: passwordSchema,
});

// types of form fields...
export type formTypes = {
  email: string;
  password: string;
  passwordConfirm?: string;
};
