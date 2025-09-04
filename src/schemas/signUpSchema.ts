import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username must not contain special character"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .transform((s) => s.toLowerCase()),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 characters" })
    .max(72, { message: "Password must be at most 72 characters" }),
});
