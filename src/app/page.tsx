import Image from "next/image";
import Activity from "@/components/Activity";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import PictureOfTheDay from "@/components/PictureOfTheDay";
import ProjectList from "@/components/ProjectList";
import Section, { Tag, cardClass } from "@/components/Section";
import { CodeIcon, ExternalIcon, FileIcon, GithubIcon, LinkedinIcon, MailIcon } from "@/components/icons";
import { about, achievements, certifications, education, profile, skills } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <Loader />

      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        {/* Hero */}
        {/* Fills the first screen (minus the 3.75rem floating navbar) so the next section starts below the fold */}
        <section
          id="top"
          className="flex min-h-[calc(100svh-3.75rem)] animate-fade-up flex-col justify-center space-y-6 py-12"
        >
          {/* Mouse devices: black and white until hovered. Touch devices (no hover): always in colour. */}
          <Image
            src={profile.photo}
            alt={profile.name}
            width={80}
            height={80}
            loading="eager"
            className="h-20 w-20 rounded-full object-cover ring-[0.5px] ring-primary/40 ring-offset-[3px] ring-offset-background transition-[filter] duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:hover:grayscale-0"
          />
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{profile.name}</h1>
            <div className="h-px w-24 bg-primary" />
            <p className="font-mono text-xs text-muted-foreground sm:text-sm">
              {profile.role} <span className="text-primary">•</span> {profile.location}
            </p>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{profile.intro}</p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get in touch
            </a>
            <a
              href="#projects"
              className="rounded-lg border border-border/60 bg-card/40 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40"
            >
              View Projects
            </a>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
            <a href={profile.socials.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <GithubIcon className="h-3.5 w-3.5" /> GitHub
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn
            </a>
            <a href={profile.socials.leetcode} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <CodeIcon className="h-3.5 w-3.5" /> LeetCode
            </a>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
              <MailIcon className="h-3.5 w-3.5" /> Email
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <FileIcon className="h-3.5 w-3.5" /> Resume
            </a>
          </div>
        </section>

        <Section id="about" label="About Me">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>

        <Section id="education" label="Education">
          <div className="space-y-3">
            {education.map((e) => (
              <div key={e.title} className={`${cardClass} flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6`}>
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight sm:text-base">{e.title}</p>
                  <p className="text-xs text-muted-foreground/80">{e.place}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                    <span className="text-primary">&gt;</span> {e.focus}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{e.period}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" label="Career & Experience">
          <Experience />
        </Section>

        <Section id="skills" label="Skills & Toolbox">
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.title} className={`${cardClass} space-y-3 p-4 sm:p-5`}>
                <div>
                  <p className="text-sm font-bold tracking-tight">{g.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/80">{g.blurb}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" label="Featured Projects">
          <ProjectList />
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            See all projects on GitHub <ExternalIcon className="h-3 w-3" />
          </a>
        </Section>

        <Section id="activity" label="Activity">
          <Activity />

          <h3 className="mb-3 mt-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Certifications
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {certifications.map((c, i) => (
              <div key={c.title} className={`${cardClass} flex items-start gap-3 p-4`}>
                <span className="shrink-0 font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold tracking-tight">{c.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/80">{c.issuer}</p>
                </div>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    Verify <ExternalIcon className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
          <h3 className="mb-3 mt-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Achievements
          </h3>
          <ul className="space-y-3">
            {achievements.map((a) => (
              <li key={a} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                <span className="shrink-0 select-none font-mono font-bold text-primary">&gt;</span>
                {a}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="picture" label="Wikipedia Picture of the Day">
          <PictureOfTheDay />
        </Section>
      </main>

      <Footer />
    </>
  );
}
