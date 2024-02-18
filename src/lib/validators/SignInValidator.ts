import { z } from "zod";

export const SignInValidator = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  usn: z
    .string()
    .min(10, {
      message: "USN must be at least 10 characters.",
    })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Invalid USN" })
    .max(10, {
      message: "USN must be at most 10 characters.",
    }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export type SignInRequest = z.infer<typeof SignInValidator>;
