import type { Metadata } from "next";
import Link from "next/link";
import { ExternalIcon, FileIcon } from "@/components/icons";
import { profile } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `CV — ${profile.name}`,
  description: `Curriculum vitae of ${profile.name}`,
};

const button =
  "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary";

export default function CvPage() {
  return (
    <main className="mx-auto w-full max-w-4xl animate-fade-up space-y-6 px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <span aria-hidden>←</span> Back to Home
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Curriculum Vitae</h1>
        <div className="flex gap-2">
          <a href={profile.resume} target="_blank" rel="noreferrer" className={button}>
            <ExternalIcon className="h-3 w-3" /> Open
          </a>
          <a href={profile.resume} download className={button}>
            <FileIcon className="h-3 w-3" /> Download
          </a>
        </div>
      </header>

      {/* The CV is one A4 page: the frame takes A4 proportions (plus a little room for the viewer's page margin)
          and the PDF toolbar is hidden, so the whole page fits fitted-to-width with no inner scrolling.
          Mobile browsers that can't show PDFs inline fall back to the buttons above. */}
      <iframe
        src={`${profile.resume}#toolbar=0&navpanes=0&view=FitH`}
        title={`${profile.name} — CV`}
        className="aspect-[595/860] w-full overflow-hidden rounded-xl border border-border/60 bg-card/40"
      />
    </main>
  );
}
