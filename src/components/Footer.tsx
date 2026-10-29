import { profile } from "@/data/portfolio";
import ContactForm from "./ContactForm";
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from "./icons";
import { SectionHeading } from "./Section";

const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// Every way to reach me, one card each (no hover hint; the icon turning red is enough)
const methods = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: MailIcon, external: false },
  {
    label: "LinkedIn",
    value: handle(profile.socials.linkedin).replace("linkedin.com/", ""),
    href: profile.socials.linkedin,
    icon: LinkedinIcon,
    external: true,
  },
  { label: "GitHub", value: `@${profile.handles.github}`, href: profile.socials.github, icon: GithubIcon, external: true },
  { label: "Call", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, icon: PhoneIcon, external: false },
];

const nav = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#activity", label: "Activity" },
];

// Site footer doubling as the contact section (the navbar's Contact link targets #contact):
// a card per contact method, the message form in one wide card, then a slim bottom bar.
export default function Footer() {
  return (
    <footer id="contact" className="mx-auto w-full max-w-[68rem] px-4 sm:px-6">
      <div className="border-t border-border/40 pt-12 sm:pt-16">
        <SectionHeading label="Contact" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {methods.map(({ label, value, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              // Compact: icon on the left, name and value beside it
              className="group relative flex min-h-[85px] items-center gap-3.5 overflow-hidden rounded-[20px] border border-border bg-card px-4 py-3 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-red-500/50"
            >
              <span className="flex size-[42px] shrink-0 items-center justify-center rounded-xl border border-border transition-colors duration-300 group-hover:border-red-500 group-hover:bg-red-500 group-hover:text-[#140404]">
                <Icon className="size-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-bold leading-tight">{label}</span>
                <span className="mt-0.5 block break-all font-mono text-xs text-muted-foreground">{value}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-3.5 grid gap-[26px] rounded-[20px] border border-border bg-card p-[22px] md:grid-cols-[240px_1fr]">
          <div>
            <h3 className="font-display text-[22px] font-bold leading-[1.15]">Or send a message here.</h3>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
              It lands straight in my inbox. I usually reply within a day.
            </p>
          </div>
          <ContactForm />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3.5 border-t border-border py-[22px] font-mono text-xs text-muted-foreground sm:pb-[26px]">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <nav aria-label="Footer" className="flex flex-wrap gap-[18px]">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors hover:text-foreground">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#top" className="transition-colors hover:text-red-500">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
