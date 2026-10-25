import type { Day } from "@/lib/activity";
import HeatmapTooltip from "./HeatmapTooltip";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVELS = [0, 1, 2, 3, 4] as const;

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

// Calendar heatmap: one column per week (Sun-Sat), shaded by the theme's accent colour.
// `days` must start on a Sunday, as heatmapRange() guarantees.
export default function Heatmap({ days, unit, label }: { days: Day[]; unit: string; label: string }) {
  const weeks = Math.ceil(days.length / 7);

  // Label a column with its month when that week contains the 1st (skipping a cramped first column)
  const months = Array.from({ length: weeks }, (_, w) => {
    const first = days.slice(w * 7, w * 7 + 7).find((d) => d.date.endsWith("-01"));
    return first && w < weeks - 1 ? MONTHS[Number(first.date.slice(5, 7)) - 1] : "";
  });

  return (
    <div>
      <HeatmapTooltip>
        {/* rtl scroller so phones open on the most recent weeks; scrollbar hidden but still swipeable */}
        <div className="no-scrollbar overflow-x-auto [direction:rtl]">
          <div className="inline-flex gap-2 [direction:ltr]">
            <div className="grid grid-rows-[12px_repeat(7,10px)] gap-[4px] pt-px font-mono text-[9px] leading-[10px] text-muted-foreground">
              <span />
              {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div>
              <div
                className="mb-[4px] grid h-3 gap-[4px] font-mono text-[9px] leading-3 text-muted-foreground"
                style={{ gridTemplateColumns: `repeat(${weeks}, 10px)` }}
              >
                {months.map((m, i) => (
                  <span key={i} className="overflow-visible whitespace-nowrap">
                    {m}
                  </span>
                ))}
              </div>
              <div role="img" aria-label={label} className="grid grid-flow-col grid-rows-7 gap-[4px]">
                {days.map((d) => (
                  <span
                    key={d.date}
                    data-count={`${d.count} ${unit}${d.count === 1 ? "" : "s"}`}
                    data-date={fmt.format(new Date(d.date))}
                    className={`heat-${d.level} h-2.5 w-2.5 rounded-[2px]`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </HeatmapTooltip>
      <div className="mt-2 flex items-center justify-end gap-1 font-mono text-[10px] text-muted-foreground">
        Less
        {LEVELS.map((l) => (
          <span key={l} className={`heat-${l} h-2.5 w-2.5 rounded-[2px]`} />
        ))}
        More
      </div>
    </div>
  );
}
