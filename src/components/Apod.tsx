"use client";

import { useEffect, useState } from "react";
import { cardClass } from "./Section";

type ApodData = {
  title: string;
  date: string;
  url: string;
  hdurl?: string;
  media_type: string;
  explanation: string;
};

// NASA's public DEMO_KEY is rate-limited; get a free key at api.nasa.gov for production.
const API = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

export default function Apod() {
  const [data, setData] = useState<ApodData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(API)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className="font-mono text-xs text-muted-foreground">&gt; Couldn&apos;t reach NASA right now. Try again later.</p>;
  }

  if (!data) {
    return (
      <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <span className="h-2 w-2 animate-pixel-pulse rounded-[1px] bg-primary" />
        Fetching today&apos;s picture from NASA…
      </p>
    );
  }

  return (
    <figure className={`${cardClass} overflow-hidden`}>
      {data.media_type === "image" ? (
        <a href={data.hdurl ?? data.url} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote image that changes daily */}
          <img src={data.url} alt={data.title} className="max-h-[420px] w-full object-cover" />
        </a>
      ) : (
        <iframe src={data.url} title={data.title} className="aspect-video w-full" allowFullScreen />
      )}
      <figcaption className="space-y-2 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-bold tracking-tight">{data.title}</p>
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{data.date}</span>
        </div>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{data.explanation}</p>
      </figcaption>
    </figure>
  );
}
