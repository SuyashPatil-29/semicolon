import { z } from "zod";

export const SignUpValidator = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Invalid email address" }),
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
    confirmPassword: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpRequest = z.infer<typeof SignUpValidator>;
