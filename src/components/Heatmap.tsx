import type { Day } from "@/lib/activity";
import HeatmapTooltip from "./HeatmapTooltip";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVELS = [0, 1, 2, 3, 4] as const;

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

// Calendar heatmap: one column per week (Sun-Sat), shaded in `color` (see .heat-* in globals.css).
// `days` must start on a Sunday, as heatmapRange() guarantees.
export default function Heatmap({
  days,
  unit,
  label,
  color = "#ef4444",
}: {
  days: Day[];
  unit: string;
  label: string;
  color?: string;
}) {
  const weeks = Math.ceil(days.length / 7);

  // Label a column with its month when that week contains the 1st (skipping a cramped first column)
  const months = Array.from({ length: weeks }, (_, w) => {
    const first = days.slice(w * 7, w * 7 + 7).find((d) => d.date.endsWith("-01"));
    return first && w < weeks - 1 ? MONTHS[Number(first.date.slice(5, 7)) - 1] : "";
  });

  return (
    // Cells are 10px on small screens and 12px on wide ones, so the year fills the 870px card
    <div style={{ "--heat": color } as React.CSSProperties} className="[--cell:10px] [--gap:3px] lg:[--cell:12px] lg:[--gap:3.5px]">
      <HeatmapTooltip>
        {/* rtl scroller so phones open on the most recent weeks; scrollbar hidden but still swipeable */}
        <div className="no-scrollbar overflow-x-auto [direction:rtl]">
          <div className="inline-block [direction:ltr]">
            <div
              className="mb-[5px] grid h-[11px] gap-[var(--gap)] font-mono text-[9px] leading-[11px] text-muted-foreground lg:text-[10px]"
              style={{ gridTemplateColumns: `repeat(${weeks}, var(--cell))` }}
            >
              {months.map((m, i) => (
                <span key={i} className="overflow-visible whitespace-nowrap">
                  {m}
                </span>
              ))}
            </div>
            <div role="img" aria-label={label} className="grid auto-cols-[var(--cell)] grid-flow-col grid-rows-[repeat(7,var(--cell))] gap-[var(--gap)]">
              {days.map((d) => (
                <span
                  key={d.date}
                  data-count={`${d.count} ${unit}${d.count === 1 ? "" : "s"}`}
                  data-date={fmt.format(new Date(d.date))}
                  className={`heat-${d.level} rounded-[2px] hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-foreground`}
                />
              ))}
            </div>
          </div>
        </div>
      </HeatmapTooltip>
      <div className="mt-2 flex items-center justify-end gap-[var(--gap)] font-mono text-[10px] text-muted-foreground">
        <span className="mr-0.5">Less</span>
        {LEVELS.map((l) => (
          <span key={l} className={`heat-${l} size-[var(--cell)] rounded-[2px]`} />
        ))}
        <span className="ml-0.5">More</span>
      </div>
    </div>
  );
}
