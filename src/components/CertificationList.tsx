"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { certificationTopics, certifications } from "@/data/portfolio";

const pad = (n: number) => String(n).padStart(2, "0");

// "July 18, 2025" or "January 2026" -> "Jul 2025"
const shortDate = (d: string) => {
  const parts = d.split(" ");
  return `${parts[0].slice(0, 3)} ${parts[parts.length - 1]}`;
};

const groups = certificationTopics
  .map((topic) => ({ topic, items: certifications.filter((c) => c.topic === topic) }))
  .filter((g) => g.items.length > 0);

// Certifications grouped by topic as an accordion: big topic names with their issuers' logos;
// clicking one opens its certificates (the first is open to begin with). Each certificate
// card opens its detail page at /certificates/<slug>.
export default function CertificationList() {
  const [open, setOpen] = useState<string | null>(groups[0]?.topic ?? null);

  return (
    <div className="border-t border-border">
      {groups.map((g, i) => {
        const isOpen = open === g.topic;
        const logos = [...new Set(g.items.map((c) => c.logo).filter((l): l is string => !!l))];
        return (
          <div key={g.topic} className="group/topic border-b border-border">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`cert-topic-${i}`}
              onClick={() => setOpen(isOpen ? null : g.topic)}
              className="grid w-full grid-cols-[2rem_1fr_1.75rem] items-center gap-4 px-1.5 py-[22px] text-left sm:grid-cols-[3.125rem_1fr_auto_1.875rem] sm:gap-[18px]"
            >
              <span className={`font-mono text-xs transition-colors duration-300 ${isOpen ? "text-red-500" : "text-muted-foreground"}`}>
                {pad(i + 1)}
              </span>
              <span
                className={`font-display text-[clamp(1.625rem,3.4vw,2.625rem)] font-black leading-none tracking-[-0.03em] transition-colors duration-300 ${
                  isOpen ? "text-red-500" : "text-foreground/55 group-hover/topic:text-foreground"
                }`}
              >
                {g.topic}
              </span>
              <span className="hidden shrink-0 items-center pl-2 sm:flex">
                {logos.map((l) => (
                  // A fixed-size round frame with the logo fitted inside, so the circle can't be
                  // squeezed into an oval however wide or narrow the logo image is
                  <span
                    key={l}
                    className="relative -ml-2 block size-[30px] min-w-[30px] shrink-0 overflow-hidden rounded-full border-2 border-background bg-white first:ml-0"
                  >
                    <Image src={l} alt="" fill sizes="30px" className="object-contain" />
                  </span>
                ))}
              </span>
              {/* Plus that turns into a minus when open */}
              <span aria-hidden className="relative size-3.5 justify-self-end">
                <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-red-500" />
                <span
                  className={`absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-red-500 transition-transform duration-[400ms] ${
                    isOpen ? "rotate-0" : "rotate-90"
                  }`}
                />
              </span>
            </button>

            <div
              id={`cert-topic-${i}`}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid gap-3.5 px-1.5 pb-[26px] sm:grid-cols-2 sm:pl-[74px]">
                  {g.items.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/certificates/${c.slug}`}
                      className="group/cert flex items-center gap-3.5 rounded-[14px] border border-border bg-card p-2.5 transition-colors duration-300 hover:border-red-500/45"
                    >
                      <div className="relative aspect-[4/3] w-[120px] shrink-0 overflow-hidden rounded-lg bg-[#f4f1ea]">
                        {c.image ? (
                          <Image
                            src={c.image.src}
                            alt=""
                            fill
                            sizes="120px"
                            className="object-cover object-top transition-transform duration-500 group-hover/cert:scale-105"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center font-display text-2xl font-bold text-stone-500">
                            {c.issuer.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-[15.5px] font-bold leading-[1.3] tracking-[-0.01em] transition-colors group-hover/cert:text-red-500">
                          {c.title}
                        </p>
                        <p className="mt-[3px] text-xs text-muted-foreground">{c.issuer}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {c.date && <span className="font-mono text-[11px] text-muted-foreground">{shortDate(c.date)}</span>}
                          {c.url && (
                            <span className="whitespace-nowrap rounded-full border border-green-500/35 bg-green-500/[0.08] px-[7px] py-0.5 font-mono text-[10px] font-semibold text-green-500">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
