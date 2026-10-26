"use client";

import { useState } from "react";
import Image from "next/image";
import { experience } from "@/data/portfolio";
import { CalendarIcon, ChevronDownIcon } from "./icons";
import { Tag, cardClass } from "./Section";

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {experience.map((job, i) => {
        const isOpen = open === i;
        return (
          <div key={job.role + job.org} className={`${cardClass} overflow-hidden`}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-3 p-3.5 text-left sm:p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 font-mono text-xs font-bold text-primary">
                  {String(i).padStart(2, "0")}
                </span>
                {job.logo ? (
                  <Image
                    src={job.logo}
                    alt={`${job.org} logo`}
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded-lg border border-border/40 bg-white object-contain"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-muted/40 font-display text-sm font-bold">
                    {job.org.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-jakarta text-sm font-bold tracking-tight transition-colors group-hover:text-primary sm:text-base">
                    {job.role}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground/80">{job.org}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {job.period && (
                  <span className="hidden items-center gap-1.5 font-mono text-[11px] text-muted-foreground sm:flex">
                    <CalendarIcon className="h-3 w-3 text-primary/70" />
                    {job.period}
                  </span>
                )}
                <span
                  className={`rounded-md border border-border/40 p-1 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-foreground ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 px-3.5 pb-4 sm:px-4">
                  {job.period && (
                    <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground sm:hidden">
                      <CalendarIcon className="h-3 w-3 text-primary/70" />
                      {job.period}
                    </p>
                  )}
                  {job.metrics && (
                    <div className="grid grid-cols-3 gap-2">
                      {job.metrics.map((m) => (
                        <div key={m.label} className="rounded-lg border border-border/40 bg-muted/20 p-2.5 text-center">
                          <p className="font-display text-lg font-bold sm:text-2xl">{m.value}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-[11px]">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <ul className="space-y-1.5">
                    {job.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 font-jakarta text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        <span className="shrink-0 select-none font-mono font-bold text-primary">&gt;</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {job.tech && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="mr-1 font-mono text-[10px] font-bold text-primary">TECH:</span>
                      {job.tech.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
