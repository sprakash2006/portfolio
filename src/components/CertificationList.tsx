import Link from "next/link";
import { certifications } from "@/data/portfolio";
import { ExternalIcon } from "./icons";
import { cardClass } from "./Section";

// Certificate cards; the whole card opens its detail page, the Verify link sits above it.
export default function CertificationList() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {certifications.map((c, i) => (
        // The title link stretches over the whole card (after:inset-0); the Verify link sits above it
        <div key={c.slug} className={`${cardClass} group relative flex cursor-pointer items-start gap-3 p-4`}>
          <span className="shrink-0 font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
          <div className="min-w-0 flex-1">
            <Link
              href={`/certifications/${c.slug}`}
              className="block text-sm font-bold tracking-tight transition-colors after:absolute after:inset-0 after:rounded-xl group-hover:text-primary"
            >
              {c.title}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground/80">{c.issuer}</p>
          </div>
          {c.url && (
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="relative z-10 inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
            >
              Verify <ExternalIcon className="h-3 w-3" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
