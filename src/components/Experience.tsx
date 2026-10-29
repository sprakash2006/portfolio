"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { experience } from "@/data/portfolio";

// Card colours, in order: red, the theme's card colour, then off-white sand
const themes = [
  { card: "bg-red-500 text-[#140404]", muted: "text-[#3b0a0a]", chip: "border-[#3b0a0a]/40" },
  { card: "bg-card text-foreground", muted: "text-muted-foreground", chip: "border-border" },
  { card: "bg-stone-300 text-stone-900", muted: "text-stone-600", chip: "border-stone-500/50" },
];

// One full-width card per role. On md+ screens each card sticks under the navbar and the next
// one slides up over it, while the card underneath shrinks slightly and darkens.
export default function Experience() {
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sticky = window.matchMedia("(min-width: 768px)").matches;
        cards.current.forEach((card, i) => {
          const next = cards.current[i + 1];
          if (!card) return;
          // How far the next card has covered this one: 0 → 1 over 70% of the screen height
          const p =
            sticky && next
              ? Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - card.getBoundingClientRect().top) / (window.innerHeight * 0.7)))
              : 0;
          card.style.transform = `scale(${1 - p * 0.07})`;
          card.style.filter = p ? `brightness(${1 - p * 0.5})` : "";
        });
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="md:pb-[10vh]">
      {experience.map((job, i) => {
        const t = themes[i % themes.length];
        return (
          <div
            key={job.role + job.org}
            ref={(el) => {
              cards.current[i] = el;
            }}
            // Each card pins a little lower than the last so the stacked edges peek out
            style={{ top: `calc(6rem + ${i * 14}px)` }}
            className={`${t.card} mb-6 flex origin-top flex-col rounded-[26px] border border-white/10 p-6 shadow-[0_-24px_60px_rgba(0,0,0,0.55)] light:border-black/5 light:shadow-[0_-16px_40px_rgba(41,28,20,0.14)] sm:p-9 md:sticky md:mb-[8vh] md:min-h-[70vh]`}
          >
            <div className={`flex items-center justify-between gap-4 font-mono text-[13px] ${t.muted}`}>
              <span>
                {String(i + 1).padStart(2, "0")} / {String(experience.length).padStart(2, "0")}
                {job.period && ` · ${job.period}`}
              </span>
              {job.logo ? (
                <Image
                  src={job.logo}
                  alt={`${job.org} logo`}
                  width={80}
                  height={80}
                  className="h-14 w-14 shrink-0 rounded-2xl border border-black/10 bg-white object-contain sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-current/20 font-display text-2xl font-bold sm:h-20 sm:w-20">
                  {job.org.charAt(0)}
                </div>
              )}
            </div>

            <h3 className="mb-2 mt-7 font-display text-[clamp(2.75rem,7.5vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]">
              {job.short ?? job.org}
            </h3>
            <p className="mb-6 font-display text-[22px] font-bold">{job.role}</p>

            <div className="mt-auto grid gap-x-8 gap-y-4 md:grid-cols-[1fr_240px]">
              <ul className="space-y-2.5">
                {job.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[15px] leading-relaxed opacity-80">
                    <span className="shrink-0 select-none font-mono">&gt;</span>
                    {p}
                  </li>
                ))}
              </ul>
              {job.tech && (
                <div className="flex flex-wrap content-start gap-1.5">
                  {job.tech.map((tech) => (
                    <span key={tech} className={`rounded-md border ${t.chip} px-[9px] py-[3px] font-mono text-[11px]`}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
