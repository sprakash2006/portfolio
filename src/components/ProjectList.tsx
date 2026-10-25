"use client";

import Link from "next/link";
import { useState } from "react";
import { projects } from "@/data/portfolio";
import { ExternalIcon, GithubIcon } from "./icons";
import { Tag, cardClass } from "./Section";

const VISIBLE = 4;
const ALL = "All";

// Categories in the order they first appear in the data
const CATEGORIES = [ALL, ...new Set(projects.map((p) => p.category))];

const count = (category: string) =>
  category === ALL ? projects.length : projects.filter((p) => p.category === category).length;

// Featured projects with category filter chips; shows the first few and a button for the rest.
export default function ProjectList() {
  const [category, setCategory] = useState(ALL);
  const [expanded, setExpanded] = useState(false);

  const filtered = category === ALL ? projects : projects.filter((p) => p.category === category);
  const shown = expanded ? filtered : filtered.slice(0, VISIBLE);
  const hidden = filtered.length - shown.length;

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setExpanded(false);
              }}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
                active
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {c} <span className="opacity-60">{count(c)}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {shown.map((p, i) => (
          // The title link stretches over the whole card (after:inset-0); the icon links sit above it
          <div key={p.slug} className={`${cardClass} group relative flex cursor-pointer items-center gap-3 p-3 sm:gap-4 sm:p-4`}>
            <span className="shrink-0 font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
            <div className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/40 bg-muted/30 transition-colors group-hover:border-primary/20 sm:h-14 sm:w-24">
              <span className="font-pixel text-[10px] text-muted-foreground transition-transform duration-300 group-hover:scale-110">
                {p.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <Link
                href={`/projects/${p.slug}`}
                className="block truncate text-sm font-bold tracking-tight transition-colors after:absolute after:inset-0 after:rounded-xl group-hover:text-primary"
              >
                {p.title}
              </Link>
              <p className="line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
            <div className="relative z-10 flex shrink-0 flex-col gap-1 text-muted-foreground sm:flex-row">
              {p.code && (
                <a
                  href={p.code}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} source code`}
                  className="rounded p-1 transition-colors hover:bg-card/60 hover:text-foreground"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                </a>
              )}
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} live demo`}
                  className="rounded p-1 transition-colors hover:bg-card/60 hover:text-foreground"
                >
                  <ExternalIcon className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length > VISIBLE && (
        <button
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="w-full py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          {expanded ? "Show less" : `Show all ${filtered.length} projects (+${hidden})`}
        </button>
      )}
    </div>
  );
}
