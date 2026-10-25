"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import { CloseIcon, FileIcon, GithubIcon, LinkedinIcon, MenuIcon } from "./icons";
import ThemeSwitcher from "./ThemeSwitcher";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Exp" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

// The nav section whose top has passed this fraction of the viewport counts as "current"
const ACTIVE_LINE = 0.35;

// Which linked section is being read: the last one whose top is above the active line,
// or the last link once the page is scrolled to the bottom. Null in the hero or on other pages.
function currentSection(): string | null {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let current: string | null = null;
  for (const { id } of links) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (atBottom || el.getBoundingClientRect().top <= window.innerHeight * ACTIVE_LINE) current = id;
  }
  return current;
}

// Floating pill navbar with the current section highlighted; collapses to a menu on phones.
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Track scroll position and the current section (re-run on navigation between pages)
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        setActive(currentSection());
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
  }, [pathname]);

  // Close the mobile menu on Escape or when the viewport grows past the md breakpoint
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => mq.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4">
      <div className="relative mx-auto max-w-[52rem]">
        <nav
          className={`flex h-12 items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/70 pl-4 pr-2 backdrop-blur-md transition-shadow duration-300 sm:pl-5 ${
            scrolled || menuOpen ? "shadow-lg shadow-black/20" : "shadow-sm"
          }`}
        >
          <Link href="/#top" className="font-pixel text-[11px] text-foreground" aria-label="Home">
            {profile.monogram}
            <span className="text-muted-foreground">_</span>
          </Link>

          <div className="hidden items-center gap-5 text-[13px] md:flex">
            {links.map((l) => {
              const current = l.id === active;
              return (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  aria-current={current ? "location" : undefined}
                  className={`group relative py-1 transition-colors duration-200 hover:text-foreground ${
                    current ? "text-foreground" : "text-muted-foreground/80"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-300 ${
                      current ? "scale-x-100 bg-primary" : "scale-x-0 bg-foreground group-hover:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded p-1.5 transition-colors hover:bg-card/60 hover:text-foreground">
              <GithubIcon className="h-4 w-4" />
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded p-1.5 transition-colors hover:bg-card/60 hover:text-foreground">
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" aria-label="Resume" className="rounded p-1.5 transition-colors hover:bg-card/60 hover:text-foreground">
              <FileIcon className="h-4 w-4" />
            </a>
            <ThemeSwitcher />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="ml-1 rounded-md border border-border/60 p-1.5 transition-colors hover:text-foreground md:hidden"
            >
              {menuOpen ? <CloseIcon className="h-3.5 w-3.5" /> : <MenuIcon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={`absolute inset-x-0 top-full mt-2 grid rounded-2xl bg-background shadow-lg transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
            menuOpen ? "grid-rows-[1fr] border border-border/60" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-1 p-2">
              {links.map((l, i) => {
                const current = l.id === active;
                return (
                  <li key={l.id}>
                    <a
                      href={`/#${l.id}`}
                      onClick={() => setMenuOpen(false)}
                      tabIndex={menuOpen ? 0 : -1}
                      aria-current={current ? "location" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-card/60 hover:text-foreground ${
                        current ? "bg-card/60 text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span className="font-mono text-[11px] font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
