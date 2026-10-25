import Image from "next/image";
import { getPictureOfTheDay } from "@/lib/picture";
import { ExternalIcon } from "./icons";
import { cardClass } from "./Section";

const fmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

// Wikipedia's Picture of the Day with its caption and the credit its licence requires.
export default async function PictureOfTheDay() {
  const pic = await getPictureOfTheDay();

  if (!pic) {
    return <p className="font-mono text-xs text-muted-foreground">&gt; Couldn&apos;t load today&apos;s picture. Try again later.</p>;
  }

  return (
    <figure className={`${cardClass} overflow-hidden`}>
      <a href={pic.page} target="_blank" rel="noreferrer" className="block">
        <Image
          src={pic.src}
          alt={pic.caption || "Wikipedia Picture of the Day"}
          width={pic.width}
          height={pic.height}
          sizes="(min-width: 768px) 720px, 100vw"
          className="max-h-[440px] w-full object-cover"
        />
      </a>
      <figcaption className="space-y-2 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold leading-snug">{pic.caption}</p>
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{fmt.format(new Date(pic.date))}</span>
        </div>
        <p className="flex flex-wrap items-center gap-x-1.5 font-mono text-[11px] text-muted-foreground">
          <span>Photo: {pic.artist}</span>
          <span aria-hidden>·</span>
          {pic.license.url ? (
            <a href={pic.license.url} target="_blank" rel="noreferrer" className="hover:text-foreground">
              {pic.license.name}
            </a>
          ) : (
            <span>{pic.license.name}</span>
          )}
          <span aria-hidden>·</span>
          <a href={pic.page} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
            Wikimedia Commons <ExternalIcon className="h-3 w-3" />
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
