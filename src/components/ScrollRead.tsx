"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeading } from "./Section";

type Word = { text: string; highlight: boolean };

// The token in the text where the photo goes
const PHOTO = "{photo}";

// Split each paragraph into words, marking the ones inside a highlight phrase.
function toWords(paragraphs: string[], highlights: string[]): Word[][] {
  return paragraphs.map((p) => {
    const ranges: [number, number][] = [];
    for (const h of highlights) {
      for (let i = p.indexOf(h); i !== -1; i = p.indexOf(h, i + h.length))
        ranges.push([i, i + h.length]);
    }
    return Array.from(p.matchAll(/\S+/g), (m) => ({
      text: m[0],
      highlight: ranges.some(([s, e]) => m.index >= s && m.index < e),
    }));
  });
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// The About text in large type whose words light up one by one as you scroll, like reading
// along. On md+ screens the section scrolls up normally until it fills the screen, then pins
// with its content centred and further scrolling lights the words while the page holds
// still. On phones (where it wouldn't fit one screen) it scrolls normally and lights up as
// it rises.
//
// If the text contains {photo} and the page has the hero photo (#hero-photo), a copy of that
// photo flies from the hero down into the text as you scroll, shrinking to fit the line, and
// the hero's rotating ring (#hero-ring) fades out as it leaves.
export default function ScrollRead({
  id,
  label,
  paragraphs,
  highlights,
  photo,
}: {
  id: string;
  label: string;
  paragraphs: string[];
  highlights: string[];
  photo: string;
}) {
  const words = useMemo(
    () => toWords(paragraphs, highlights),
    [paragraphs, highlights],
  );
  const total = words.reduce((n, p) => n + p.length, 0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const flyerRef = useRef<HTMLImageElement>(null);
  const [lit, setLit] = useState(0);
  const [flying, setFlying] = useState(false);

  // Hand the photo over from the hero to the flying copy once it's mounted
  useEffect(() => {
    const hero = document.getElementById("hero-photo");
    if (!hero || !slotRef.current) return;
    hero.style.opacity = "0";
    setFlying(true);
    return () => {
      hero.style.opacity = "";
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const wrap = wrapRef.current,
          text = textRef.current;
        if (!wrap || !text) return;
        const rect = wrap.getBoundingClientRect();
        const textRect = text.getBoundingClientRect();
        const vh = window.innerHeight;

        let progress: number;
        if (getComputedStyle(text).position === "sticky") {
          // Nothing lights until the section fills the screen and pins (content centred);
          // then scrolling drives the reading while the page holds still, and the last words
          // light a little before it unpins
          progress = (-rect.top / Math.max(1, rect.height - vh)) * 1.15;
        } else {
          // Too tall for one screen (phones): words light as they pass 70% down the screen
          progress = ((vh * 0.7 - rect.top) / rect.height) * 1.1;
        }
        setLit(Math.round(clamp01(progress) * total));

        // The hero's signature (#hero-name) fades out and drifts up as this section rises
        // through the bottom quarter of the screen
        const name = document.getElementById("hero-name");
        if (name) {
          const fade = clamp01((vh - rect.top) / (vh * 0.25));
          name.style.opacity = String(1 - fade);
          name.style.transform = `translateY(${-fade * 16}px)`;
        }

        // Photo flight: from the hero photo at the top of the page to its slot in the text,
        // arriving when the slot has risen to 35% of the screen height
        const hero = document.getElementById("hero-photo");
        const ring = document.getElementById("hero-ring");
        const slot = slotRef.current,
          flyer = flyerRef.current;
        if (!hero || !slot || !flyer) return;
        const from = hero.getBoundingClientRect();
        const to = slot.getBoundingClientRect();
        const slotPageTop = rect.top + window.scrollY + (to.top - textRect.top);
        const t = easeInOut(
          clamp01(window.scrollY / Math.max(1, slotPageTop - vh * 0.35)),
        );
        const size = lerp(from.width, to.width, t);
        flyer.style.width = flyer.style.height = `${size}px`;
        flyer.style.transform = `translate(${lerp(from.left, to.left, t)}px, ${lerp(from.top, to.top, t)}px)`;
        if (ring) ring.style.opacity = String(1 - clamp01(t * 3));
      });
    };
    update();
    // Re-place the photo once the hero's fade-up entrance has finished moving it
    const settle = setTimeout(update, 800);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [total, flying]);

  let index = 0;
  return (
    <section
      id={id}
      className="w-full border-t border-border/40 pb-12 pt-12 sm:pb-16 sm:pt-16"
    >
      {/* md+: a tall track with a full-screen box pinned inside it, content centred in the box
          (below the navbar). The extra track height is the scroll spent reading. */}
      <div ref={wrapRef} className="md:h-[260svh]">
        <div ref={textRef} className="md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:pt-16">
          <SectionHeading label={label} />
          <div className="space-y-5 font-display text-[clamp(1.25rem,2.4vw,1.875rem)] font-semibold leading-snug tracking-[-0.01em]">
            {words.map((paragraph, p) => (
              <p key={p}>
                {paragraph.map((w) => {
                  const i = index++;
                  if (w.text === PHOTO) {
                    // Space the flying photo lands in
                    return (
                      <span
                        key={i}
                        ref={slotRef}
                        aria-hidden
                        className="mr-[0.3em] inline-block size-[1.4em] align-middle"
                      />
                    );
                  }
                  return (
                    <span
                      key={i}
                      className={`transition-colors duration-200 ${
                        i < lit
                          ? w.highlight
                            ? "text-red-500"
                            : "text-foreground"
                          : "text-foreground/15"
                      }`}
                    >
                      {w.text}{" "}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </div>

        {flying && (
          <Image
            ref={flyerRef}
            src={photo}
            alt=""
            width={168}
            height={168}
            loading="eager"
            className="pointer-events-none fixed left-0 top-0 z-40 rounded-full object-cover ring-1 ring-border"
          />
        )}
      </div>
    </section>
  );
}
