"use client";

import { useEffect, useRef, useState } from "react";
import { education } from "@/data/portfolio";

// One entry: a huge outlined score that fills red from the bottom when it scrolls into view,
// with the qualification, school and coursework beside it. Rendered as a row of the parent's
// subgrid.
function Entry({ entry, delay }: { entry: (typeof education)[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setFilled(true);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const unit = "unit" in entry && entry.unit ? <span className="text-[0.45em]">{entry.unit}</span> : null;

  return (
    <div
      ref={ref}
      className="grid items-center gap-x-14 gap-y-4 border-b border-border/40 py-8 sm:col-span-2 sm:grid-cols-subgrid"
    >
      {/* Padding gives the red fill room past the tight letter-spacing so glyph edges aren't cut */}
      <div
        aria-hidden
        className={`edu-num pb-[0.04em] pr-[0.12em] pt-[0.04em] font-display text-[clamp(5.625rem,15vw,11.875rem)] font-black leading-[0.85] tracking-[-0.02em] sm:justify-self-end ${
          filled ? "edu-num-filled" : ""
        }`}
        style={{ transitionDelay: `${delay}ms, ${delay + 1000}ms` }}
      >
        {entry.score}
        {unit}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          {entry.period} · {entry.result}
        </p>
        <h3 className="mt-2 font-display text-[30px] font-bold leading-[1.15] tracking-[-0.01em]">{entry.title}</h3>
        <p className="mt-2 text-muted-foreground sm:text-lg">{entry.place}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {entry.focus.split(", ").map((f) => (
            <span key={f} className="rounded-md border border-border/60 px-[9px] py-[3px] font-mono text-[11px] text-muted-foreground">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Entries share one centred two-column grid (via subgrid), so the scores line up on the right
// edge of their column and the text columns line up with each other.
export default function EducationList() {
  return (
    <div className="sm:grid sm:grid-cols-[auto_auto] sm:justify-center">
      {education.map((e, i) => (
        <Entry key={e.title} entry={e} delay={i * 250} />
      ))}
    </div>
  );
}
