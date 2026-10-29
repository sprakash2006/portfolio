import Image from "next/image";
import { heroBadge, heroRows, profile, type HeroWord } from "@/data/portfolio";
import { LeetcodeIcon, FileIcon, GithubIcon, LinkedinIcon, MailIcon } from "./icons";

const wordClass: Record<NonNullable<HeroWord["style"]> | "outline", string> = {
  outline: "hero-outline",
  solid: "text-foreground",
  accent: "text-red-500",
};

// One row of giant words, rendered twice so the -50% scroll loops seamlessly.
function Row({ words, reverse }: { words: HeroWord[]; reverse?: boolean }) {
  const items = [...words, ...words];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <div className={`hero-track flex ${reverse ? "hero-track-reverse" : ""}`}>
        {items.map((w, i) => (
          <span key={i} className={`pr-[0.4em] ${wordClass[w.style ?? "outline"]}`}>
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// Top-right links, one array per line
const linkRows = [
  [
    { href: profile.socials.linkedin, label: "LinkedIn", icon: LinkedinIcon, external: true },
    { href: profile.resume, label: "Resume", icon: FileIcon, external: true },
  ],
  [
    { href: profile.socials.github, label: "GitHub", icon: GithubIcon, external: true },
    { href: profile.socials.leetcode, label: "LeetCode", icon: LeetcodeIcon, external: true },
    { href: `mailto:${profile.email}`, label: "Email", icon: MailIcon, external: false },
  ],
];

// Full-bleed hero: three rows of huge words scroll in alternating directions behind a photo
// ringed by rotating text; the signature sits bottom-left and the links top-right.
export default function Hero() {
  const ring = heroBadge.map((t) => `${t.toUpperCase()} ✦ `).join("");

  return (
    // Exactly one screen: the word rows and photo fill the space under the navbar, the name
    // sits bottom-left clear of the rows, and the links sit top-right under the navbar.
    <section id="top" className="relative flex h-svh min-h-[36rem] flex-col overflow-hidden px-4 pt-20">
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div
          aria-hidden
          className="hero-rows [--hero-hole:106px] sm:[--hero-hole:122px] absolute left-1/2 top-1/2 w-screen -translate-x-1/2 -translate-y-1/2 animate-fade-up font-display text-[clamp(3.5rem,11vw,10.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]"
        >
          <Row words={heroRows[0]} />
          <Row words={heroRows[1]} reverse />
          <Row words={heroRows[2]} />
        </div>

        <div className="relative size-52 animate-fade-up sm:size-60">
          <svg id="hero-ring" aria-hidden viewBox="0 0 260 260" className="hero-ring absolute inset-0 size-full text-foreground">
            <defs>
              <path id="hero-ring-path" d="M130,130 m-112,0 a112,112 0 1,1 224,0 a112,112 0 1,1 -224,0" />
            </defs>
            <text className="font-mono" fontSize="13.5" fill="currentColor" textLength="700" lengthAdjust="spacing">
              <textPath href="#hero-ring-path">{ring}</textPath>
            </text>
          </svg>
          {/* ScrollRead flies a copy of this photo down into the About text on scroll */}
          <Image
            id="hero-photo"
            src={profile.photo}
            alt={profile.name}
            width={168}
            height={168}
            loading="eager"
            className="absolute inset-[18.5%] size-[63%] rounded-full object-cover ring-1 ring-border ring-offset-4 ring-offset-background"
          />
        </div>
      </div>

      <div className="relative w-full shrink-0 pb-[98px] pt-2 sm:px-6">
        {/* ScrollRead fades this out as the About section comes up */}
        <h1 id="hero-name">
          <span className="sr-only">{profile.name}</span>
          {/* Signature drawn on load (see .signature in globals.css) */}
          <svg aria-hidden viewBox="0 18 620 104" className="signature h-auto w-full max-w-[20rem] overflow-visible text-foreground">
            <text x="4" y="110" fontSize="108">
              {/* Initials in red */}
              {profile.name.split(" ").map((word, i) => (
                <tspan key={word}>
                  {i > 0 && " "}
                  <tspan className="fill-red-500 stroke-red-500">{word[0]}</tspan>
                  {word.slice(1)}
                </tspan>
              ))}
            </text>
          </svg>
        </h1>
      </div>

      <div className="absolute right-4 top-20 space-y-2 min-[1360px]:top-12 font-mono text-xs text-muted-foreground sm:right-10">
        {linkRows.map((row, i) => (
          <div key={i} className="flex justify-end gap-x-5">
            {row.map(({ href, label, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
