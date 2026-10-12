"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterProps {
  groupedLinks: { title: string; links: { url: string; name: string }[] }[];
}
export default function Footer({ groupedLinks }: FooterProps) {
  const pathname = usePathname();
  return (
    <footer className="bg-card border-2 p-4">
      <h2 className="text-2xl mb-4">FoodTracker</h2>
      <div className="flex justify-between">
        {groupedLinks.map(({ title, links }) => (
          <div key={title}>
            <h3 className="text-xl mb-2">{title}</h3>
            <div className="flex flex-col gap-2">
              {links.map(({ name, url }) => {
                const selected =
                  pathname === url || (url !== "/" && pathname.startsWith(url));

                return (
                  <Link
                    key={url}
                    href={url}
                    className={
                      selected ? "text-primary" : "text-secondary-foreground"
                    }
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <hr className="my-4" />
      <p>© 2026 FoodTracker. All rights reserved.</p>
    </footer>
  );
}
