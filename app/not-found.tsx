import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container p-4">
      <h2 className="title">Page not found</h2>
      <p>
        Return <Link href="/">Home?</Link>
      </p>
    </div>
  );
}
