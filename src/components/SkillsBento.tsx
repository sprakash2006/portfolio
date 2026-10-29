import { skills, type Skill } from "@/data/portfolio";

// Column spans on the 6-column lg grid, in category order: two rows of 2+4 and 3+3, then 2+4
const spans = ["lg:col-span-2", "lg:col-span-4", "lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-4"];

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z+ ]/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

// A skill pill: logo (or initials) in grey that turns the brand colour on hover, with a
// matching border. The logo is the SVG used as a mask, so it can be tinted any colour.
function Pill({ skill }: { skill: Skill }) {
  return (
    <span
      style={{ "--hc": skill.color ?? "var(--foreground)" } as React.CSSProperties}
      className="group/pill flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 py-[7px] pl-2 pr-[11px] text-[13px] font-medium text-foreground/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--hc)] hover:text-foreground"
    >
      {skill.logo ? (
        <span
          aria-hidden
          style={{ maskImage: `url(/skills/${skill.logo}.svg)`, WebkitMaskImage: `url(/skills/${skill.logo}.svg)` }}
          className="size-5 shrink-0 bg-muted-foreground transition-colors duration-200 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover/pill:bg-[var(--hc)]"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-5 shrink-0 items-center justify-center font-display text-[10px] font-black tracking-tighter text-muted-foreground transition-colors duration-200 group-hover/pill:text-[var(--hc)]"
        >
          {initials(skill.name)}
        </span>
      )}
      {skill.name}
    </span>
  );
}

// Skills as a bento grid: one box per category in mixed widths, AI / LLM tinted red.
export default function SkillsBento() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {skills.map((g, i) => (
        <div
          key={g.title}
          className={`relative flex min-h-[170px] flex-col overflow-hidden rounded-[22px] border border-border/60 px-[22px] py-5 transition-colors duration-300 hover:border-red-500/50 ${
            spans[i] ?? "lg:col-span-3"
          } ${g.title.startsWith("AI") ? "bg-[linear-gradient(160deg,rgba(239,68,68,0.16),var(--card)_60%)]" : "bg-card"}`}
        >
          <span aria-hidden className="absolute right-[18px] top-3.5 font-display text-[54px] font-black leading-none text-foreground/[0.04]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-[22px] font-bold tracking-[-0.01em]">{g.title}</h3>
          <p className="mb-4 mt-0.5 text-[13px] text-muted-foreground">{g.blurb}</p>
          <div className="mt-auto flex flex-wrap gap-2.5">
            {g.items.map((s) => (
              <Pill key={s.name} skill={s} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
