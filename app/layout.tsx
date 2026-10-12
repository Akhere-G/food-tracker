import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food Tracker",
  description: "A Food tracking app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const links = [
    { name: "Dashboard", url: "/" },
    { name: "Meals", url: "/meals" },
  ];

  const groupedLinks = [
    {
      title: "Account",
      links: [
        { name: "Dashboard", url: "/" },
        { name: "Meals", url: "/meals" },
        { name: "Settings", url: "/settings" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", url: "/about" },
        { name: "Contact", url: "/contact" },
        { name: "FAQ", url: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms", url: "/terms" },
        { name: "Privacy", url: "/privacy" },
      ],
    },
  ];

  async function logout() {
    "use server";
    console.log("logout");
  }
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Header links={links} logout={logout} />
        <main className="min-h-screen">{children}</main>
        <Footer groupedLinks={groupedLinks} />
      </body>
    </html>
  );
}
