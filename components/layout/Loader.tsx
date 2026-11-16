import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="text-center flex flex-col justify-center items-center gap-4 py-8">
      <h2 className="title">Loading...</h2>
      <Loader2 size={32} className="animate-spin" />
    </div>
  );
}
