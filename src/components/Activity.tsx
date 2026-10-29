import { profile } from "@/data/portfolio";
import { getGithubActivity, getLeetcodeActivity, type GithubActivity, type LeetcodeActivity } from "@/lib/activity";
import ActivityTabs from "./ActivityTabs";
import Heatmap from "./Heatmap";
import { LeetcodeIcon, GithubIcon } from "./icons";

const plural = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

function Unavailable({ source }: { source: string }) {
  return <p className="font-mono text-xs text-muted-foreground">&gt; Couldn&apos;t load {source} activity right now.</p>;
}

// A plain-English summary built from the live numbers; whatever failed to load is left out.
function Summary({ github, leetcode }: { github: GithubActivity | null; leetcode: LeetcodeActivity | null }) {
  if (!github && !leetcode) return null;
  const made = github && (
    <>
      In the past year I made <b className="font-bold text-red-500">{plural(github.total, "contribution")}</b> on GitHub
    </>
  );
  const days = github && (
    <>
      across <b className="font-bold text-foreground">{plural(github.activeDays, "day")}</b>
    </>
  );
  const lc = leetcode && (
    <>
      solved <b className="font-bold text-amber-500">{plural(leetcode.solved.all, "problem")}</b> on LeetCode
    </>
  );
  return (
    <p className="mb-[22px] font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.4] tracking-[-0.015em] text-foreground/75">
      {made && lc ? (
        <>
          {/* Two balanced lines on wider screens; the break comes after "on GitHub" so both fit */}
          {made}
          <br className="hidden sm:block" /> {days}, and {lc}.
        </>
      ) : made ? (
        <>
          {made} {days}.
        </>
      ) : (
        <>I&apos;ve {lc}.</>
      )}
    </p>
  );
}

// GitHub and LeetCode activity: a one-sentence summary of the live numbers, then one card whose
// switch picks which heatmap shows. Both are fetched and cached on the server.
export default async function Activity() {
  const [github, leetcode] = await Promise.all([
    getGithubActivity(profile.handles.github),
    getLeetcodeActivity(profile.handles.leetcode),
  ]);

  return (
    // Summary and card share one centred 870px column so their left edges line up
    <div className="mx-auto max-w-[870px]">
      <Summary github={github} leetcode={leetcode} />
      <ActivityTabs
        className="rounded-[18px] border border-border bg-card p-5"
        // The first tab shows by default
        tabs={[
          {
            id: "leetcode",
            label: "LeetCode",
            icon: <LeetcodeIcon className="size-[13px]" />,
            href: profile.socials.leetcode,
            handle: profile.handles.leetcode,
            content: leetcode ? (
              <Heatmap
                days={leetcode.days}
                unit="submission"
                color="#ef4444"
                label={`${leetcode.submissions} LeetCode submissions in the past year`}
              />
            ) : (
              <Unavailable source="LeetCode" />
            ),
          },
          {
            id: "github",
            label: "GitHub",
            icon: <GithubIcon className="size-[13px]" />,
            href: profile.socials.github,
            handle: profile.handles.github,
            content: github ? (
              <Heatmap
                days={github.days}
                unit="contribution"
                color="#22c55e"
                label={`${github.total} GitHub contributions in the past year`}
              />
            ) : (
              <Unavailable source="GitHub" />
            ),
          },
        ]}
      />
    </div>
  );
}
