import { z } from "zod";

// Define a reusable email validation schema
const emailValidation = z.string().email("Invalid email address");

// Define the email schema as an object for specific use cases
export const emailSchema = z.object({
  email: emailValidation,
});

// Define the individual password schema
export const passwordSchema = z
  .string()
  .min(5, "Password must contain at least 5 characters");

// Define password match schema
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
export const RegisterSchema = z.object({
  email: emailValidation,
}).and(passwordMatchSchema);

// Define login schema
export const LoginSchema = z.object({
  email: emailValidation,
  password: passwordSchema,
});

// Define types for form fields
export type formTypes = {
  email: string;
  password: string;
  passwordConfirm?: string;
};

// Define change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordMatchSchema);

// Define types for change password form fields
export type ChangePasswordFormTypes = {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
};
