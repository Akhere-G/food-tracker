"use client";

import { useEffect } from "react";
import { ChartNoAxesCombined, Home, Settings, Soup, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Meals", href: "/meals", icon: Utensils },
  { label: "Nutrition", href: "/nutrition", icon: ChartNoAxesCombined },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return navigation.map(({ label, href, icon: Icon }) => {
    const selected =
      pathname === href ||
      (href !== "/dashboard" && pathname.startsWith(href));
    return (
      <Link
        key={label}
        href={href}
        aria-current={selected ? "page" : undefined}
        className={cn(
          mobile
            ? "flex min-h-14 min-w-16 flex-col items-center justify-center gap-1 text-xs"
            : "flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium",
          selected
            ? "bg-accent text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
        <span>{label}</span>
      </Link>
    );
  });
}

export default function DashboardShell({
  children,
  appearance,
}: {
  children: React.ReactNode;
  appearance: { themeMode: string; colorTheme: string };
}) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(appearance.themeMode);
    document.documentElement.dataset.colorTheme = appearance.colorTheme;
  }, [appearance.colorTheme, appearance.themeMode, setTheme]);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="border-border bg-sidebar sticky top-0 hidden h-dvh border-r px-4 py-7 md:flex md:flex-col">
        <Logo className="px-2" />
        <nav aria-label="Primary" className="mt-12 flex flex-col gap-2">
          <NavigationLinks />
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t pt-5 text-sm text-muted-foreground">
          <Soup aria-hidden="true" className="size-5 text-primary" />
          <span>One meal at a time.</span>
        </div>
      </aside>
      <main className="min-w-0 pb-20 md:pb-0">{children}</main>
      <nav
        aria-label="Primary"
        className="bg-background/95 fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <NavigationLinks mobile />
      </nav>
    </div>
  );
}
