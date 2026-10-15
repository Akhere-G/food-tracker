"use client";
import FormInput from "@/components/ui/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, registerSchema } from "../schema";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register, formState, handleSubmit } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();
  async function onSubmit(formState: RegisterSchema) {
    if (!agreedToTerms) {
      toast.error(
        "You must agree to the terms and conditions and privacy policy to register",
      );
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email(formState);

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
        label="Name"
        {...register("name")}
        errorMessage={formState.errors.name?.message}
      />
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
      <FormInput
        label="Repeat Password"
        {...register("repeatPassword")}
        errorMessage={formState.errors.repeatPassword?.message}
      />
      <div className="flex gap-2">
        <Checkbox
          checked={agreedToTerms}
          onClick={() => setAgreedToTerms((prev) => !prev)}
        />{" "}
        <p>
          I read and agree to the{" "}
          <Link href="/terms" className="text-primary">
            terms and conditions
          </Link>{" "}
          and the{" "}
          <Link href="/privacy" className="text-primary">
            privacy policy.
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <Link href="/register" className="text-primary">
          Already made an account? login instead
        </Link>
        <Button type="submit" disabled={isLoading}>
          Register
        </Button>
      </div>
    </form>
  );
}
