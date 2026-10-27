import Image from "next/image";
import Activity from "@/components/Activity";
import CertificationList from "@/components/CertificationList";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import PictureOfTheDay from "@/components/PictureOfTheDay";
import ProjectList from "@/components/ProjectList";
import Section, { Tag, cardClass } from "@/components/Section";
import { LeetcodeIcon, ExternalIcon, FileIcon, GithubIcon, LinkedinIcon, MailIcon } from "@/components/icons";
import { about, education, profile, skills } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <Loader />

      <main className="mx-auto w-full max-w-[50.625rem] px-4 sm:px-6">
        {/* Hero */}
        {/* Fills the first screen (minus the 3.75rem floating navbar) so the next section starts below the fold */}
        <section
          id="top"
          className="flex min-h-[calc(100svh-3.75rem)] animate-fade-up flex-col justify-center space-y-6 pb-8 pt-28"
        >
          <Image
            src={profile.photo}
            alt={profile.name}
            width={80}
            height={80}
            loading="eager"
            className="h-20 w-20 rounded-full object-cover ring-[0.5px] ring-primary/40 ring-offset-[3px] ring-offset-background"
          />
          <div className="space-y-3">
            <h1>
              <span className="sr-only">{profile.name}</span>
              {/* Signature drawn on load (see .signature in globals.css) */}
              <svg aria-hidden viewBox="0 18 620 104" className="signature h-auto w-full max-w-[22rem] overflow-visible text-foreground">
                <text x="4" y="110" fontSize="108">
                  {profile.name}
                </text>
              </svg>
            </h1>
            {/* Underline: a line trailing off into three dots, the last one red */}
            <div aria-hidden className="flex items-center gap-1.5">
              <span className="h-px w-24 bg-primary" />
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="h-1 w-1 rounded-full bg-red-500" />
            </div>
            <p className="font-mono text-xs text-muted-foreground sm:text-sm">
              {profile.role} <span className="text-primary">•</span> {profile.location}
            </p>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{profile.intro}</p>
          <div className="flex flex-wrap items-center gap-3 pt-4">
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
              <LeetcodeIcon className="h-3.5 w-3.5" /> LeetCode
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
          <CertificationList />
        </Section>

        <Section id="picture" label="Wikipedia Picture of the Day">
          <PictureOfTheDay />
        </Section>
      </main>

      <Footer />
    </>
  );
}
