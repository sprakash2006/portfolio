// Wikipedia's Picture of the Day, from Wikimedia's public featured-content feed (no key needed).
// Fetched on the server and cached; returns null on any failure so the section can show a fallback.

const REVALIDATE = 60 * 60 * 6;

export type PictureOfTheDay = {
  src: string;
  width: number;
  height: number;
  caption: string;
  artist: string;
  license: { name: string; url?: string };
  page: string; // file page on Wikimedia Commons
  date: string; // YYYY-MM-DD the picture is featured for
};

export async function getPictureOfTheDay(): Promise<PictureOfTheDay | null> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const res = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${today.replaceAll("-", "/")}`, {
      // Wikimedia asks API clients to identify themselves
      headers: { "User-Agent": "prakash-swami-portfolio (https://github.com/sprakash2006/portfolio)" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const img = (await res.json())?.image;
    if (!img?.image?.source) return null;

    return {
      src: img.image.source,
      width: img.image.width,
      height: img.image.height,
      // Prefer the short English caption; fall back to the longer description
      caption: img.structured?.captions?.en ?? img.description?.text ?? "",
      artist: img.artist?.text ?? "Unknown",
      license: { name: img.license?.type ?? "See file page", url: img.license?.url },
      page: img.file_page,
      date: today,
    };
  } catch {
    return null;
  }
}
