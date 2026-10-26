import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScreenshotViewer from "@/components/ScreenshotViewer";
import { ExternalIcon, GithubIcon } from "@/components/icons";
import { profile, projects } from "@/data/portfolio";

// Every project page is built ahead of time; unknown slugs 404
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} — ${profile.name}`, description: project.description };
}

const heading = "font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const button =
  "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary";

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <main className="mx-auto w-full max-w-3xl animate-fade-up space-y-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <span aria-hidden>←</span> Back to projects
        </Link>

        <header className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            {project.year}
            <span className="rounded-full border border-border/60 px-2 py-0.5 uppercase tracking-wider text-primary">
              {project.category}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{project.description}</p>
        </header>

        {project.screenshots.length > 0 && (
          <ScreenshotViewer shots={project.screenshots} label={`${project.title} screenshots`} />
        )}

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {project.overview.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className={heading}>
            <span className="text-red-500">{"// "}</span>Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-sm">
                {t}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={heading}>
            <span className="text-red-500">{"// "}</span>Key Features
          </h2>
          <ul className="space-y-2">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground sm:text-base">
                <span className="shrink-0 select-none font-mono font-bold text-primary">&gt;</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        {(project.code || project.live) && (
          <div className="flex flex-wrap gap-3">
            {project.code && (
              <a href={project.code} target="_blank" rel="noreferrer" className={button}>
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className={button}>
                <ExternalIcon className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>
        )}

        <nav className="border-t border-border/40 pt-6 text-right">
          <Link href={`/projects/${next.slug}`} className="group inline-block">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Next →</span>
            <span className="text-sm font-semibold transition-colors group-hover:text-primary sm:text-base">{next.title}</span>
          </Link>
        </nav>
      </main>
    </>
  );
}
