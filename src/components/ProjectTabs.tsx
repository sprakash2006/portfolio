"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { projects, type Project } from "@/data/portfolio";
import { ExternalIcon, GithubIcon, MediumIcon } from "./icons";

const pad = (n: number) => String(n).padStart(2, "0");

// The project's demo video if it has one, otherwise its screenshots crossfading like a muted
// clip. Either only plays while the showcase is on screen.
function Media({ project, onScreen }: { project: Project; onScreen: boolean }) {
  const [frame, setFrame] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const shots = project.screenshots;

  useEffect(() => {
    if (project.video) {
      if (onScreen) video.current?.play().catch(() => {});
      else video.current?.pause();
      return;
    }
    if (
      !onScreen ||
      shots.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = setInterval(() => setFrame((f) => (f + 1) % shots.length), 3000);
    return () => clearInterval(id);
  }, [onScreen, project.video, shots.length]);

  if (project.video) {
    return (
      <video
        ref={video}
        src={project.video}
        poster={shots[0]?.src}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return shots.map((s, i) => (
    <Image
      key={s.src}
      src={s.src}
      alt={i === 0 ? `${project.title} preview` : ""}
      fill
      sizes="(min-width: 768px) 34rem, 100vw"
      className={`object-cover transition-[opacity,scale] duration-700 group-hover/media:scale-[1.04] ${
        i === frame ? "opacity-100" : "opacity-0"
      }`}
    />
  ));
}

// Always shown so every project has the same three links; without an href it's greyed out
// and not clickable
function QuickLink({
  href,
  label,
  missing,
  children,
}: {
  href?: string;
  label: string;
  missing: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        aria-label={missing}
        title={missing}
        className="flex size-10 cursor-not-allowed items-center justify-center rounded-full border border-dashed border-border/60 text-muted-foreground/35"
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="flex size-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-red-500/60 hover:bg-red-500/5 hover:text-foreground"
    >
      {children}
    </a>
  );
}

// On md+ screens the showcase is scroll-driven: the section is tall, the showcase pins to the
// screen, and scrolling through it moves from one project to the next. Phones just use the tabs.
const scrollDriven = () => window.matchMedia("(min-width: 768px)").matches;
// Kept outside the component: the React compiler lint flags performance.now() in its body
const now = () => performance.now();

// One showcase area for all projects: a tab bar with a sliding red pill shows the current
// project, which slides in from the side it came from. Scrolling (or clicking a tab) changes
// the project. Media on the left (it opens the project page), name, description, "More
// detailed info" and quick links on the right.
export default function ProjectTabs() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<"right" | "left">("right");
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null,
  );
  const [onScreen, setOnScreen] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabList = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  // While a tab click is scrolling the page, ignore the projects scrolled past on the way
  const jump = useRef<{ target: number; until: number } | null>(null);
  const p = projects[active];

  const show = useCallback((next: number) => {
    if (next === activeRef.current) return;
    setDir(next > activeRef.current ? "right" : "left");
    activeRef.current = next;
    setActive(next);
  }, []);

  // Where the scroll-driven range starts on the page, and how long it is
  const range = () => {
    const el = track.current!;
    return {
      top: el.getBoundingClientRect().top + window.scrollY,
      total: Math.max(1, el.offsetHeight - window.innerHeight),
    };
  };

  // Tab click or arrow key: show it now and scroll to that project's slot in the range
  const pick = (i: number) => {
    const next = (i + projects.length) % projects.length;
    show(next);
    if (!scrollDriven() || !track.current) return;
    const { top, total } = range();
    const target = top + ((next + 0.5) / projects.length) * total;
    jump.current = { target, until: now() + 1500 };
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = track.current;
        if (!el || !scrollDriven()) return;
        const j = jump.current;
        if (j) {
          if (
            Math.abs(window.scrollY - j.target) > 4 &&
            now() < j.until
          )
            return;
          jump.current = null;
        }
        const top = el.getBoundingClientRect().top + window.scrollY;
        const total = Math.max(1, el.offsetHeight - window.innerHeight);
        const progress = Math.min(
          0.9999,
          Math.max(0, (window.scrollY - top) / total),
        );
        show(Math.floor(progress * projects.length));
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
  }, [show]);

  // Keep the pill under the active tab and scroll that tab into view on narrow screens
  useLayoutEffect(() => {
    const tab = tabRefs.current[active];
    if (!tab) return;
    const measure = () =>
      setPill({ left: tab.offsetLeft, width: tab.offsetWidth });
    measure();
    // Only the tab bar scrolls sideways; scrollIntoView would also jump the page to it on load
    const list = tabList.current;
    list?.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: "smooth",
    });
    const observer = new ResizeObserver(measure);
    observer.observe(tab);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      (active + (e.key === "ArrowRight" ? 1 : -1) + projects.length) %
      projects.length;
    pick(next);
    tabRefs.current[next]?.focus();
  };

  return (
    // Each project gets about half a screen of scrolling while the showcase stays pinned
    <div
      ref={track}
      style={{ "--n": projects.length } as React.CSSProperties}
      className="md:h-[calc(100svh_+_(var(--n)_-_1)_*_55svh)]"
    >
      {/* Pinned roughly in the middle of the screen (the showcase is about 35rem tall) but never
          under the navbar. It's only as tall as its content, so no empty space is left below it
          once it unpins. */}
      <div className="md:sticky md:top-[max(5rem,calc(50svh_-_17.5rem))]">
        <div
          ref={tabList}
          role="tablist"
          aria-label="Projects"
          onKeyDown={onTabKey}
          className="relative mb-6 flex gap-0.5 overflow-x-auto rounded-full border border-border/70 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pill && (
            <span
              aria-hidden
              className="absolute inset-y-1 left-0 rounded-full bg-red-500 transition-[transform,width] duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
              style={{
                width: pill.width,
                transform: `translateX(${pill.left}px)`,
              }}
            />
          )}
          {projects.map((proj, i) => {
            const selected = i === active;
            return (
              <button
                key={proj.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`project-tab-${proj.slug}`}
                aria-selected={selected}
                aria-controls="project-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => pick(i)}
                className={`relative z-10 shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs transition-colors duration-300 ${
                  selected
                    ? "text-[#140404]"
                    : "text-muted-foreground hover:text-foreground"
                } ${selected && !pill ? "bg-red-500" : ""}`}
              >
                {proj.title}
              </button>
            );
          })}
        </div>

        <div
          ref={stage}
          className="overflow-hidden rounded-[24px] border border-border/60 bg-card p-4"
        >
          <div
            key={p.slug}
            id="project-panel"
            role="tabpanel"
            aria-labelledby={`project-tab-${p.slug}`}
            className={`grid gap-6 md:min-h-[26rem] md:grid-cols-[1.2fr_1fr] md:gap-9 ${
              dir === "right" ? "project-from-right" : "project-from-left"
            }`}
          >
            <Link
              href={`/projects/${p.slug}`}
              aria-label={`${p.title}: more details`}
              className="group/media relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-muted/30 md:aspect-auto"
            >
              <Media project={p} onScreen={onScreen} />
            </Link>

            <div className="flex min-w-0 flex-col justify-center px-1 pb-2 md:py-4 md:pr-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="text-red-500">{pad(active + 1)}</span> ·{" "}
                {p.category} · {p.year}
              </p>
              <h3 className="mt-2.5 font-display text-[clamp(2rem,3.8vw,3.125rem)] font-black leading-[0.95] tracking-[-0.03em] first-letter:text-red-500">
                {p.title}
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/projects/${p.slug}`}
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-red-500 px-5 py-3 font-mono text-[13px] font-semibold text-[#140404] shadow-[0_10px_30px_rgba(239,68,68,0.25)] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(239,68,68,0.4)]"
                >
                  {/* Shine that sweeps across on hover */}
                  <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.45)_50%,transparent_70%)] transition-transform duration-700 group-hover/btn:translate-x-full" />
                  More detailed info
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  >
                    →
                  </span>
                </Link>
                <div className="flex gap-2">
                  <QuickLink
                    href={p.code}
                    label={`${p.title} on GitHub`}
                    missing="Source code is private"
                  >
                    <GithubIcon className="size-4" />
                  </QuickLink>
                  <QuickLink
                    href={p.live}
                    label={`${p.title} live project`}
                    missing="No live link yet"
                  >
                    <ExternalIcon className="size-4" />
                  </QuickLink>
                  <QuickLink
                    href={p.medium}
                    label={`${p.title} article on Medium`}
                    missing="No Medium article yet"
                  >
                    <MediumIcon className="size-4" />
                  </QuickLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="shrink-0">
            <span className="text-foreground">{pad(active + 1)}</span> /{" "}
            {pad(projects.length)}
          </span>
          <span
            aria-hidden
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-border/70"
          >
            <span
              className="block h-full rounded-full bg-red-500 transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ width: `${((active + 1) / projects.length) * 100}%` }}
            />
          </span>
          <span className="hidden shrink-0 md:inline">Scroll to browse ↓</span>
        </div>
      </div>
    </div>
  );
}
