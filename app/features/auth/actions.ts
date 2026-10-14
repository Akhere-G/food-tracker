import { authClient } from "@/lib/auth-client";

export async function signUp(
  name: string,
  email: string,
  password: string,
  repeatPassword: string,
) {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/dashboard",
  });
}
