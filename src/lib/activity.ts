// Server-side fetchers for the activity heatmaps. Both sources are public and need no token.
// Results are cached by Next's fetch cache and refreshed at most every REVALIDATE seconds.
// Each returns null on any failure so the section can show a fallback instead of breaking.

const REVALIDATE = 60 * 60 * 12;
const WEEKS = 53;

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GithubActivity = { days: Day[]; total: number; activeDays: number; longestStreak: number };

export type LeetcodeActivity = {
  days: Day[];
  submissions: number;
  activeDays: number;
  longestStreak: number;
  solved: { all: number; easy: number; medium: number; hard: number };
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

// The heatmap window: 53 full weeks (Sunday to Saturday) ending with the current week, in UTC.
export function heatmapRange(today = new Date()) {
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - end.getUTCDay() - (WEEKS - 1) * 7);
  return { start, end };
}

// Lays counts onto every day of the window; future days in the last week are left out.
function buildDays(counts: Map<string, number>, levelOf: (count: number, date: string) => Day["level"]): Day[] {
  const { start, end } = heatmapRange();
  const days: Day[] = [];
  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const date = iso(d);
    const count = counts.get(date) ?? 0;
    days.push({ date, count, level: levelOf(count, date) });
  }
  return days;
}

function summarize(days: Day[]) {
  let longestStreak = 0;
  let run = 0;
  let activeDays = 0;
  let total = 0;
  for (const d of days) {
    total += d.count;
    if (d.count > 0) {
      activeDays++;
      longestStreak = Math.max(longestStreak, ++run);
    } else run = 0;
  }
  return { total, activeDays, longestStreak };
}

// LeetCode has no levels, so bucket active days into quartiles like GitHub does
function quartileLevels(counts: number[]) {
  const active = counts.filter((n) => n > 0).sort((a, b) => a - b);
  const q = (p: number) => active[Math.floor((active.length - 1) * p)] ?? 0;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  return (n: number): Day["level"] => (n === 0 ? 0 : n <= q1 ? 1 : n <= q2 ? 2 : n <= q3 ? 3 : 4);
}

export async function getGithubActivity(user: string): Promise<GithubActivity | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { contributions: { date: string; count: number; level: Day["level"] }[] };
    const counts = new Map(json.contributions.map((c) => [c.date, c.count]));
    const levels = new Map(json.contributions.map((c) => [c.date, c.level]));
    // GitHub already assigns each day a 0-4 level; reuse it so the map matches github.com
    const days = buildDays(counts, (_, date) => levels.get(date) ?? 0);
    const { total, activeDays, longestStreak } = summarize(days);
    return { days, total, activeDays, longestStreak };
  } catch {
    return null;
  }
}

const LEETCODE_QUERY = `query($u: String!, $prev: Int!, $cur: Int!) {
  matchedUser(username: $u) {
    prev: userCalendar(year: $prev) { submissionCalendar }
    cur: userCalendar(year: $cur) { submissionCalendar }
    submitStats { acSubmissionNum { difficulty count } }
  }
}`;

// LeetCode's public GraphQL endpoint is unofficial, so every field is checked before use.
export async function getLeetcodeActivity(user: string): Promise<LeetcodeActivity | null> {
  try {
    const year = new Date().getUTCFullYear();
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query: LEETCODE_QUERY, variables: { u: user, prev: year - 1, cur: year } }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const u = json?.data?.matchedUser;
    if (!u) return null;

    // submissionCalendar is a JSON string of { unixSecondsAtUtcMidnight: count }
    const counts = new Map<string, number>();
    for (const cal of [u.prev, u.cur]) {
      const parsed: Record<string, number> = JSON.parse(cal?.submissionCalendar ?? "{}");
      for (const [ts, n] of Object.entries(parsed)) {
        const date = iso(new Date(Number(ts) * 1000));
        counts.set(date, (counts.get(date) ?? 0) + n);
      }
    }

    const days = buildDays(counts, quartileLevels([...counts.values()]));

    const stat = (k: string) =>
      (u.submitStats?.acSubmissionNum as { difficulty: string; count: number }[] | undefined)?.find((s) => s.difficulty === k)
        ?.count ?? 0;
    const { total, activeDays, longestStreak } = summarize(days);
    return {
      days,
      submissions: total,
      activeDays,
      longestStreak,
      solved: { all: stat("All"), easy: stat("Easy"), medium: stat("Medium"), hard: stat("Hard") },
    };
  } catch {
    return null;
  }
}
