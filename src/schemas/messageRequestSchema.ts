import z from "zod";
import { usernameValidation } from "./signUpSchema";

export const messageRequestSchema = z.object({
  username: usernameValidation,
  content: z
    .string()
    .trim()
    .min(10, { message: "Content must be at least 10 characters" })
    .max(300, {
      message: "Content must be at most 300 characters",
    }),
});
