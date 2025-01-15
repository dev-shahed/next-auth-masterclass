import { z } from "zod";

export const RegisterSchema = {
  email: z.string().email(),
  password: z.string().min(5),
  passwordConfirm: z.string(),
};
