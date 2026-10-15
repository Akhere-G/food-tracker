import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .email()
    .trim()
    .min(1, "Email required")
    .max(255, "Email must be less than 256 characters"),
  password: z
    .string()
    .trim()
    .min(1, "Password required")
    .max(255, "Password must be less than 256 characters"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name required")
      .max(255, "Name must be less than 256 characters"),
    email: z
      .email()
      .trim()
      .min(1, "Email required")
      .max(255, "Email must be less than 256 characters"),
    password: z
      .string()
      .trim()
      .min(1, "Password required")
      .max(255, "Password must be less than 256 characters")
      .superRefine((val, ctx) => {
        if (!/d+/.test(val)) {
          ctx.addIssue("Password must contain a number.");
        }

        if (!/[a-z]+/.test(val)) {
          ctx.addIssue("Password must contain a lowercase letter.");
        }

        if (!/[A-Z]+/.test(val)) {
          ctx.addIssue("Password must contain an uppercase letter.");
        }
      }),
    repeatPassword: z.string().trim(),
  })
  .superRefine((val, ctx) => {
    if (val.repeatPassword !== val.password) {
      ctx.addIssue({
        code: "custom",
        origin: "repeatPassword",
        message: "Passwords must match",
      });
    }
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
