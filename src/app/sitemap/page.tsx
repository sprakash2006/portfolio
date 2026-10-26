import type { Metadata } from "next";
import Link from "next/link";
import { certifications, profile, projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `Sitemap — ${profile.name}`,
  description: `Every page on ${profile.name}'s portfolio`,
};

const heading = "font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const groups: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Home",
    links: [
      { href: "/#top", label: "Home" },
      { href: "/#about", label: "About Me" },
      { href: "/#education", label: "Education" },
      { href: "/#experience", label: "Career & Experience" },
      { href: "/#skills", label: "Skills & Toolbox" },
      { href: "/#projects", label: "Featured Projects" },
      { href: "/#activity", label: "Activity" },
      { href: "/#picture", label: "Wikipedia Picture of the Day" },
      { href: "/#contact", label: "Contact" },
      { href: "/cv", label: "CV" },
    ],
  },
  { title: "Projects", links: projects.map((p) => ({ href: `/projects/${p.slug}`, label: p.title })) },
  {
    title: "Certifications",
    links: certifications.map((c) => ({ href: `/certifications/${c.slug}`, label: c.title })),
  },
];

// Also where unknown URLs land (see not-found.tsx)
export default function SitemapPage() {
  return (
    <main className="mx-auto w-full max-w-3xl animate-fade-up space-y-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Sitemap</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Couldn&apos;t find what you were looking for? Here&apos;s every page on the site.
        </p>
      </header>

      {groups.map((g) => (
        <section key={g.title} className="space-y-4">
          <h2 className={heading}>
            <span className="text-primary">{"// "}</span>
            {g.title}
          </h2>
          <ul className="space-y-2">
            {g.links.map((l) => (
              <li key={l.href} className="flex items-start gap-2 text-sm sm:text-base">
                <span className="shrink-0 select-none font-mono font-bold text-primary">&gt;</span>
                <Link href={l.href} className="text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
