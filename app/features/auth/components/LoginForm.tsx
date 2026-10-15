"use client";
import FormInput from "@/components/ui/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "../schema";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, formState, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  async function onSubmit(formState: LoginSchema) {
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email(formState);

      if (error) {
        setErrorMessage(error.message ?? "Sorry, something went wrong...");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && <p className="text-destructive">{errorMessage}</p>}
      <FormInput
        label="Email"
        {...register("email")}
        errorMessage={formState.errors.email?.message}
      />
      <FormInput
        type="password"
        label="Password"
        {...register("password")}
        errorMessage={formState.errors.password?.message}
      />
      <div className="flex flex-col gap-1">
        <Link href="/register" className="text-primary">
          New? Create an account instead
        </Link>
        <Button type="submit" disabled={isLoading}>
          Login
        </Button>
      </div>
    </form>
  );
}
