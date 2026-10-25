import { profile } from "@/data/portfolio";
import { ArrowUpIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 border-t border-border/40 px-4 py-6 font-mono text-[11px] text-muted-foreground sm:px-6">
      <p>
        © {new Date().getFullYear()} {profile.name} · {profile.location}
      </p>
      <a href="#" className="inline-flex items-center gap-1 hover:text-foreground">
        Back to top <ArrowUpIcon className="h-3 w-3" />
      </a>
    </footer>
  );
}
