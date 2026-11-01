export type AppErrorCode =
  | "unauthorized"
  | "validation"
  | "not_found"
  | "external_api"
  | "unknown";

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(
    message: string,
    code: AppErrorCode = "unknown",
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = new.target.name;
    this.code = code;
  }
}
