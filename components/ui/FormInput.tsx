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
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <Input id={id} {...props} />
      <p className="h-5 text-destructive">{errorMessage}</p>
    </div>
  );
}
