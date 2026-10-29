"use client";

import { useActionState } from "react";
import { profile } from "@/data/portfolio";

type Fields = { name: string; email: string; message: string };
type State = { status: "idle" | "sent" | "error"; message?: string; fields?: Fields };

const initialState: State = { status: "idle" };

const field =
  "w-full rounded-xl border border-border bg-background/60 px-[13px] py-[11px] text-sm placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-red-500/55 disabled:opacity-60";

// Posts the message to Web3Forms, which emails it to you; replying goes straight to the visitor.
async function send(_prev: State, form: FormData): Promise<State> {
  const fields = {
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    message: String(form.get("message") ?? "").trim(),
  };
  const fail = (message: string): State => ({ status: "error", message, fields });

  if (!profile.web3formsKey) return fail(`Sending isn't set up yet. Please email ${profile.email} directly.`);

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: profile.web3formsKey,
        subject: `Portfolio message from ${fields.name}`,
        from_name: "Portfolio contact",
        ...fields,
        // Web3Forms' spam trap: real visitors never tick this hidden box
        botcheck: form.get("botcheck") === "on",
      }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) throw new Error(json?.message ?? `HTTP ${res.status}`);
    return { status: "sent" };
  } catch {
    return fail(`Couldn't send right now. Please email ${profile.email} directly.`);
  }
}

// After an error the fields are refilled with what the visitor typed.
export default function ContactForm() {
  const [state, formAction, pending] = useActionState(send, initialState);
  const values = state.status === "error" ? state.fields : undefined;

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          maxLength={100}
          placeholder="Your name"
          aria-label="Your name"
          defaultValue={values?.name}
          disabled={pending}
          className={field}
        />
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          placeholder="you@email.com"
          aria-label="Your email"
          defaultValue={values?.email}
          disabled={pending}
          className={field}
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        maxLength={5000}
        placeholder="What are we building?"
        aria-label="Message"
        defaultValue={values?.message}
        disabled={pending}
        className={`${field} resize-none`}
      />
      {/* Spam trap: hidden from people, bots tick it */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="flex flex-wrap-reverse items-center justify-end gap-3">
        <p role="status" aria-live="polite" className="mr-auto font-mono text-xs">
          {state.status === "sent" && <span className="text-green-500">&gt; Message sent. I&apos;ll get back to you soon.</span>}
          {state.status === "error" && <span className="text-rose-500">&gt; {state.message}</span>}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-2 rounded-full bg-red-500 px-[18px] py-[11px] font-mono text-[13px] font-semibold text-[#140404] shadow-[0_10px_30px_rgba(239,68,68,0.25)] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(239,68,68,0.4)] disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send"}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
