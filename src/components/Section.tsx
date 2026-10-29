export default function Section({
  id,
  label,
  padding = "py-12 sm:py-16",
  children,
}: {
  id: string;
  label: string;
  padding?: string; // replaces the default padding, e.g. to sit closer to a neighbouring section
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`w-full border-t border-border/40 ${padding}`}>
      <SectionHeading label={label} />
      {children}
    </section>
  );
}

// "// LABEL ———" heading at the top of each section
export function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 sm:mb-8">
      <h2 className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="text-red-500">{"// "}</span>
        {label}
      </h2>
      <div className="h-px flex-1 bg-border/40" />
    </div>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border/40 bg-card/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </span>
  );
}

export const cardClass =
  "rounded-xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:bg-card/70";
