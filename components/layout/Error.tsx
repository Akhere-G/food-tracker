import { Loader2 } from "lucide-react";

export default function ErrorComponent({
  message = "Something went wrong...",
  height = "auto",
}: {
  message?: string;
  height?: string;
}) {
  return (
    <div
      className="text-center border-2 border-dashed border-destructive text-destructive bg-destructive/10 flex flex-col justify-center items-center gap-4 py-8"
      style={{ height }}
    >
      <h2 className="title">{message}</h2>
    </div>
  );
}
