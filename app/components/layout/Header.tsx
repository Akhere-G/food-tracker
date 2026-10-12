"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function Header({
  links,
  logout,
}: {
  links: { url: string; name: string }[];
  logout: () => void;
}) {
  const pathname = usePathname();
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container p-4 flex items-baseline justify-between gap-4">
        <h2 className="font-bold text-2xl">
          <Link href="/">FoodTracker</Link>
        </h2>
        <nav>
          <ul className="flex gap-2 items-center">
            {links.map(({ url, name }) => {
              const selected =
                pathname === url || (url !== "/" && pathname.startsWith(url));
              return (
                <li key={url}>
                  <Link href={url} className={selected ? "underline" : ""}>
                    {name}
                  </Link>
                </li>
              );
            })}
            <li className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button className="ml-4 p-0 bg-primary-foreground text-primary w-10 h-10 hover:bg-primary-foreground/90">
                      <User />
                    </Button>
                  }
                />
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
