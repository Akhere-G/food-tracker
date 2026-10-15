import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

async function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Meals", url: "/meals" },
  ];

  const groupedLinks = [
    {
      title: "Account",
      links: [
        { name: "Dashboard", url: "/dashboard" },
        { name: "Meals", url: "/meals" },
        { name: "Settings", url: "/settings" },
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
      <Header links={links} isAuthenticated />
      <main className="min-h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <ProtectedDashboard>{children}</ProtectedDashboard>
        </Suspense>
      </main>
      <Footer groupedLinks={groupedLinks} />
    </>
  );
}
