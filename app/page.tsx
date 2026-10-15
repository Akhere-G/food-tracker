import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Home() {
  const links = [
    { name: "Login", url: "/login" },
    { name: "Register", url: "/register" },
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
        <div className="container  p-4">
          <section>
            <h1 className="title">FoodTracker</h1>
            <p>Track your calories</p>
          </section>
        </div>
      </main>
      <Footer groupedLinks={groupedLinks} />
    </>
  );
}
