import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/errors";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireUserId() {
  const session = await getSession();
  if (!session) throw new AppError("You need to be signed in.", "unauthorized");
  return session.user.id;
}
