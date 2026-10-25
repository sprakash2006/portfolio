import { profile } from "@/data/portfolio";
import ContactForm from "./ContactForm";
import { CodeIcon, GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from "./icons";

const social = "rounded-md border border-border/40 p-2 transition-colors hover:border-primary/30 hover:text-foreground";

// Site footer doubling as the contact section (the navbar's Contact link targets #contact).
export default function Footer() {
  return (
    <footer id="contact" className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="border-t border-border/40 py-12 sm:py-16">
        <div className="mb-6 flex items-center gap-3 sm:mb-8">
          <h2 className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="text-primary">{"// "}</span>
            Contact
          </h2>
          <div className="h-px flex-1 bg-border/40" />
        </div>

        <div className="grid gap-8 sm:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3">
            <h3 className="font-display text-3xl font-bold tracking-tight">Let&apos;s build together.</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I&apos;m looking for web development and software developer internships, and I&apos;m open to freelance gigs
              and interesting collaborations. Have a project in mind? Drop me a message.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 break-all font-mono text-xs text-foreground hover:text-primary"
            >
              <MailIcon className="h-3.5 w-3.5 shrink-0" /> {profile.email}
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 font-mono text-xs text-foreground hover:text-primary"
            >
              <PhoneIcon className="h-3.5 w-3.5 shrink-0" /> {profile.phone}
            </a>
            <div className="flex gap-2 text-muted-foreground">
              <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={social}>
                <GithubIcon className="h-4 w-4" />
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={social}>
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a href={profile.socials.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode" className={social}>
                <CodeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
          <ContactForm />
        </div>

        <p className="mt-12 text-center font-mono text-[11px] text-muted-foreground/70">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
