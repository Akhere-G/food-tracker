import { ZodError } from "zod";
import { AppError, AppErrorCode } from "./errors";

export type ActionError = {
  success: false;
  error: string;
  code: AppErrorCode;
};

export type ActionResult<T> = { success: true; data: T } | ActionError;

export function toError(err: unknown, fallback: string): ActionError {
  if (err instanceof ZodError) {
    return {
      success: false,
      error: err.issues[0]?.message ?? "Invalid input",
      code: "validation",
    };
  }
  if (err instanceof AppError) {
    if (err.cause) console.error(err.cause);
    return { success: false, error: err.message, code: err.code };
  }
  console.error(err);
  return { success: false, error: fallback, code: "unknown" };
}

export async function runAction<T>(
  fn: () => Promise<T>,
  fallback: string,
): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await fn() };
  } catch (err) {
    return toError(err, fallback);
  }
}
