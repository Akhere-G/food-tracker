"use client";

import { usePathname } from "next/navigation";
import AuthSkeleton from "./AuthSkeleton";

export default function AuthSessionSkeleton() {
  return <AuthSkeleton registering={usePathname() === "/register"} />;
}
