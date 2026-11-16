import { ArrowRight, BarChart3, HeartHandshake, Soup, Utensils } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  { icon: Utensils, title: "Meals without judgement", copy: "Log what you actually ate and see calorie, protein, carbohydrate and fat totals immediately." },
  { icon: BarChart3, title: "Progress in context", copy: "Move between weekly, monthly and yearly views, with Monday-first weeks in your own timezone." },
  { icon: HeartHandshake, title: "A plan that listens", copy: "Build a realistic target around your body, routine and what previous attempts have felt like." },
] as const;

export default function Home() {
  return (
    <main>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-8" aria-label="Public navigation">
        <Logo />
        <div className="flex items-center gap-2"><Link className={buttonVariants({ variant: "ghost" })} href="/login">Sign in</Link><Link className={buttonVariants()} href="/onboarding">Build my plan</Link></div>
      </nav>
      <section className="mx-auto grid min-h-[70dvh] max-w-7xl items-center gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">A calmer way to make progress</p><h1 className="mt-4 max-w-3xl font-heading text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">Food tracking that feels like support, not another test.</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">FoodTracker turns everyday meals into a steady, personal plan—especially when you are tired of starting over.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className={cn(buttonVariants({ size: "lg" }))} href="/onboarding">Start as a guest <ArrowRight className="size-4" /></Link><Link className={buttonVariants({ size: "lg", variant: "outline" })} href="/login">I already have an account</Link></div><p className="mt-4 text-xs text-muted-foreground">Guest answers stay in this browser until you choose to register.</p></div>
        <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] border bg-accent p-6 sm:p-10"><Soup className="absolute -right-10 -top-8 size-56 text-primary/10" /><p className="font-heading text-3xl font-semibold">A week that tells the whole story.</p><div className="mt-10 grid grid-cols-7 items-end gap-2 border-b pb-2">{[62, 83, 70, 76, 88, 28, 18].map((height, index) => <div key={index} className="flex flex-col items-center gap-2"><span className="w-full rounded-t bg-primary" style={{ height: `${height * 2.4}px`, opacity: index > 4 ? 0.2 : 0.65 + index * 0.06 }} /><span className="text-xs">{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>)}</div><div className="mt-8 border-l-4 border-primary pl-5"><p className="font-heading text-3xl font-semibold italic">Five logged days — consistency is building.</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">No streak pressure. No moral score. Just useful information for the next choice.</p></div></div>
      </section>
      <section className="border-y bg-card"><div className="mx-auto grid max-w-7xl divide-y px-4 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-8">{features.map(({ icon: Icon, title, copy }) => <article key={title} className="py-10 md:px-8 md:first:pl-0 md:last:pr-0"><Icon className="size-7 text-primary" /><h2 className="mt-5 font-heading text-2xl font-semibold">{title}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{copy}</p></article>)}</div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8"><Logo /><p>© 2026 FoodTracker. Progress, one meal at a time.</p></footer>
    </main>
  );
}
