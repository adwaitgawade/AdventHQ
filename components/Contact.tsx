"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { services } from "@/data/services";
import MagneticButton from "./MagneticButton";

import { CONTACT_EMAIL, GLIDE_CUBIC, INSTAGRAM_URL } from "@/lib/constants";

// TODO: replace remaining placeholder socials with real AdventHQ profiles.
const EMAIL = CONTACT_EMAIL;
const SOCIALS = [
  { label: "Instagram", href: INSTAGRAM_URL },
  { label: "Vimeo", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
];

const BUDGETS = ["$500 - 3 Videos", "$500 to 5k - Monthly 30+ Short Videos", "$5k to 10k - Monthly 60+ Short Videos", "> $10k - Film"];

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = (form: HTMLFormElement): Errors => {
    const data = new FormData(form);
    const next: Errors = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Your name, please";
    const email = String(data.get("email") ?? "").trim();
    if (!email || !isEmail(email)) next.email = "Enter a valid email";
    if (!String(data.get("message") ?? "").trim())
      next.message = "A line or two about the project";
    return next;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-shell px-[var(--gutter)]">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: GLIDE_CUBIC }}
          className="display text-[14vw] leading-[0.9] tracking-tightest md:text-[9vw]"
        >
          Got something
          <br />
          to move?
        </motion.h2>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            noValidate
            className="grid gap-6 md:col-span-7"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Name" name="name" error={errors.name} />
              <Field label="Email" name="email" type="email" error={errors.email} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Company" name="company" optional />
              <Select label="Project type" name="projectType">
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </Select>
            </div>
            <Select label="Budget range" name="budget">
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
            <Field
              label="Tell us about the project"
              name="message"
              textarea
              error={errors.message}
            />

            <div className="flex flex-wrap items-center gap-6">
              <MagneticButton
                type="submit"
                className="rounded-full bg-accent px-8 py-4 font-medium text-accent-ink disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Send enquiry"}
              </MagneticButton>

              {status === "success" && (
                <span className="text-sm text-accent">
                  Got it — we&apos;ll be in touch within a day.
                </span>
              )}
              {status === "error" && (
                <span className="text-sm text-red-400">
                  Something broke. Email us directly below.
                </span>
              )}
            </div>
          </form>

          {/* Direct contact */}
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-xs uppercase tracking-widest text-muted">
              Prefer email?
            </p>
            <a
              href={`mailto:${EMAIL}`}
              data-cursor="link"
              className="group relative mt-3 inline-block overflow-hidden text-2xl md:text-3xl"
            >
              <span className="relative z-10 block px-1 transition-colors duration-300 group-hover:text-accent-ink">
                {EMAIL}
              </span>
              {/* hover wipe */}
              <span className="absolute inset-0 z-0 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-glide group-hover:scale-x-100" />
            </a>

            <div className="mt-12">
              <p className="text-xs uppercase tracking-widest text-muted">
                Elsewhere
              </p>
              <ul className="mt-4 space-y-2">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                      data-cursor="link"
                      className="group inline-flex items-center gap-2 text-ink"
                    >
                      <span className="h-px w-4 bg-muted transition-all duration-300 group-hover:w-8 group-hover:bg-accent" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  error,
  optional,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  error?: string;
  optional?: boolean;
}) {
  const base =
    "w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-accent";
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted">
        {label}
        {optional && <span className="ml-1 lowercase opacity-60">(optional)</span>}
      </span>
      {textarea ? (
        <textarea name={name} rows={4} className={`${base} resize-none`} />
      ) : (
        <input name={name} type={type} className={base} />
      )}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

function Select({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted">{label}</span>
      <select
        name={name}
        className="w-full appearance-none border-b border-line bg-transparent py-3 text-ink outline-none focus:border-accent [&>option]:bg-surface"
      >
        {children}
      </select>
    </label>
  );
}
