import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TiltCard from "@/components/TiltCard";
import { ExternalIcon } from "@/components/icons";
import { certifications, profile } from "@/data/portfolio";

// Every certificate page is built ahead of time; unknown slugs 404
export const dynamicParams = false;

export function generateStaticParams() {
  return certifications.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/certificates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cert = certifications.find((c) => c.slug === slug);
  if (!cert) return {};
  return { title: `${cert.title} — ${profile.name}`, description: `${cert.title} by ${cert.issuer}` };
}

const heading = "font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground";

export default async function CertificationPage({ params }: PageProps<"/certificates/[slug]">) {
  const { slug } = await params;
  const index = certifications.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const cert = certifications[index];
  const next = certifications[(index + 1) % certifications.length];

  return (
    <>
      <main className="mx-auto w-full max-w-[50.625rem] animate-fade-up space-y-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <Link
          href="/#activity"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <span aria-hidden>←</span> Back to Activity
        </Link>

        <header className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            {cert.date}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 py-0.5 pl-0.5 pr-2 uppercase tracking-wider text-primary">
              {cert.logo && (
                <Image
                  src={cert.logo}
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] rounded-full bg-white object-contain"
                />
              )}
              {cert.issuer}
            </span>
          </div>
          {/* Verify flows inline after the title's last word, so it stays beside long, wrapping titles */}
          <div>
            <h1 className="inline font-display text-2xl font-bold tracking-tight sm:text-3xl">{cert.title}</h1>
            {cert.url && (
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="ml-3 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-border/60 bg-card/40 px-2.5 py-1 align-middle font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ExternalIcon className="h-3 w-3" /> Verify
              </a>
            )}
          </div>
        </header>

        {/* Single certificate image that tilts in 3D on hover; A4-shaped placeholder until one is added */}
        {/* Portrait certificates are capped narrower so they don't run very tall */}
        <TiltCard
          className={`rounded-xl ${cert.image && cert.image.height > cert.image.width ? "mx-auto max-w-md" : ""}`}
        >
          {cert.image ? (
            // Frame takes the certificate's own proportions
            <div className="overflow-hidden rounded-xl border border-border/60">
              <Image
                src={cert.image.src}
                alt={cert.image.alt}
                width={cert.image.width}
                height={cert.image.height}
                sizes="(min-width: 768px) 720px, 100vw"
                className="block h-auto w-full"
                loading="eager"
              />
            </div>
          ) : (
            <div className="bg-grid-pattern flex aspect-[1.414] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
              <span className="font-pixel text-sm text-muted-foreground">CERTIFICATE</span>
              <span className="font-mono text-[11px] text-muted-foreground/70">Image coming soon</span>
            </div>
          )}
        </TiltCard>

        <section className="space-y-4">
          <h2 className={heading}>
            <span className="text-red-500">{"// "}</span>What I Learned
          </h2>
          <ul className="space-y-2">
            {cert.learned.map((l) => (
              <li key={l} className="flex items-start gap-2 text-sm text-muted-foreground sm:text-base">
                <span className="shrink-0 select-none font-mono font-bold text-primary">&gt;</span>
                {l}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className={heading}>
            <span className="text-red-500">{"// "}</span>Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {cert.skills.map((s) => (
              <span key={s} className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-sm">
                {s}
              </span>
            ))}
          </div>
        </section>

        {certifications.length > 1 && (
          <nav className="border-t border-border/40 pt-6 text-right">
            <Link href={`/certificates/${next.slug}`} className="group inline-block">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Next →</span>
              <span className="text-sm font-semibold transition-colors group-hover:text-primary sm:text-base">
                {next.title}
              </span>
            </Link>
          </nav>
        )}
      </main>
    </>
  );
}
