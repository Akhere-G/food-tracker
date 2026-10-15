import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getSession } from "@/lib/auth-session";
import { LogInIcon, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const links = [
    { name: "Login", url: "/login", icon: <LogInIcon /> },
    { name: "Register", url: "/register", icon: <UserPlus /> },
  ];

  const groupedLinks = [
    {
      title: "Account",
      links: [
        { name: "Login in", url: "/login" },
        { name: "Register", url: "/register" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", url: "/" },
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

  return (
    <>
      <Header links={links} />
      <main className="min-h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <ProtectedDashboard>{children}</ProtectedDashboard>
        </Suspense>
      </main>
      <Footer groupedLinks={groupedLinks} />
    </>
  );
}
