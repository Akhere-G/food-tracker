import React from "react";
import { Input } from "./input";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}
export default function FormInput({
  label,
  errorMessage,
  id,
  ...props
}: FormInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId}>{label}</label>
      <Input
        id={inputId}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-invalid={Boolean(errorMessage)}
        {...props}
      />
      <p id={errorId} className="h-5 text-destructive">
        {errorMessage}
      </p>
    </div>
  );
}
