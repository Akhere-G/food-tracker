import type { ReactNode } from "react";

export default function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className} data-loading={label}>
      <span className="sr-only" role="status">{label}</span>
      <div aria-hidden="true" aria-busy="true">{children}</div>
    </div>
  );
}
