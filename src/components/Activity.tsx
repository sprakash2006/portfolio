import { profile } from "@/data/portfolio";
import { getGithubActivity, getLeetcodeActivity } from "@/lib/activity";
import ActivityTabs from "./ActivityTabs";
import Heatmap from "./Heatmap";
import { CodeIcon, GithubIcon } from "./icons";
import { cardClass } from "./Section";

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <p className="font-display text-lg font-bold leading-none sm:text-xl">{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground sm:text-[11px]">{label}</p>
    </div>
  );
}

function Unavailable({ source }: { source: string }) {
  return <p className="font-mono text-xs text-muted-foreground">&gt; Couldn&apos;t load {source} activity right now.</p>;
}

// LeetCode and GitHub activity over the past year in one card with tabs (first tab shows by default).
// Both are fetched and cached on the server; the tabs only switch which panel shows.
export default async function Activity() {
  const [github, leetcode] = await Promise.all([
    getGithubActivity(profile.handles.github),
    getLeetcodeActivity(profile.handles.leetcode),
  ]);

  const githubPanel = github ? (
    <>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <Stat value={github.total} label="contributions, past year" />
        <Stat value={github.activeDays} label="active days" />
        <Stat value={github.longestStreak} label="longest streak" />
      </div>
      <Heatmap days={github.days} unit="contribution" label={`${github.total} GitHub contributions in the past year`} />
    </>
  ) : (
    <Unavailable source="GitHub" />
  );

  const leetcodePanel = leetcode ? (
    <>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <Stat value={leetcode.solved.all} label="problems solved" />
        <Stat value={leetcode.activeDays} label="active days" />
        <Stat value={leetcode.longestStreak} label="longest streak" />
        <div className="flex items-end gap-1.5 font-mono text-[10px]">
          <span className="rounded-md border border-border/40 px-1.5 py-0.5 text-emerald-500">
            Easy {leetcode.solved.easy}
          </span>
          <span className="rounded-md border border-border/40 px-1.5 py-0.5 text-amber-500">
            Med {leetcode.solved.medium}
          </span>
          <span className="rounded-md border border-border/40 px-1.5 py-0.5 text-rose-500">
            Hard {leetcode.solved.hard}
          </span>
        </div>
      </div>
      <Heatmap
        days={leetcode.days}
        unit="submission"
        label={`${leetcode.submissions} LeetCode submissions in the past year`}
      />
    </>
  ) : (
    <Unavailable source="LeetCode" />
  );

  return (
    <ActivityTabs
      className={`${cardClass} p-4 sm:p-5`}
      tabs={[
        {
          id: "leetcode",
          label: "LeetCode",
          icon: <CodeIcon className="h-3.5 w-3.5" />,
          href: profile.socials.leetcode,
          handle: profile.handles.leetcode,
          content: leetcodePanel,
        },
        {
          id: "github",
          label: "GitHub",
          icon: <GithubIcon className="h-3.5 w-3.5" />,
          href: profile.socials.github,
          handle: profile.handles.github,
          content: githubPanel,
        },
      ]}
    />
  );
}
