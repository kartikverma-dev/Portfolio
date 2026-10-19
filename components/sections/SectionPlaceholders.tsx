"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";

export function RemainingPlaceholders() {
  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* 05. SKILLS SECTION PLACEHOLDER (Scheduled for Phase C) */}
      <section
        id="skills"
        aria-label="Technical Skills and Disciplines"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 border-t border-[var(--border-color)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
              05 / Competencies & Domains
            </span>
            <h2 className="mt-2 font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--text-main)] uppercase tracking-tight">
              Skills & Explorations
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Honest grouping • Zero fabricated percentage bars
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.slice(0, 3).map((group) => (
            <div
              key={group.id}
              className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between"
            >
              <div>
                <h3 className="font-headline font-bold text-lg text-[var(--text-main)] mb-4">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)]"
                    >
                      <span>{s.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <span className="inline-block px-4 py-1.5 text-xs font-mono rounded bg-[var(--border-color)]/30 text-[var(--text-secondary)]">
            [Interactive Proficiency Filter, Lab, & Certifications build in Phase C]
          </span>
        </div>
      </section>

      {/* 06. CONTACT SECTION PLACEHOLDER (Scheduled for Phase C) */}
      <section
        id="contact"
        aria-label="Contact and Collaboration"
        className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 border-t border-[var(--border-color)] text-center sm:text-left"
      >
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
            06 / Connect & Collaborate
          </span>
          <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl text-[var(--text-main)] uppercase tracking-tight">
            {siteConfig.contact.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {siteConfig.contact.message}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FF7A59] hover:bg-[#ff8c6e] text-[#0B1220] font-headline font-semibold text-sm tracking-wide transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A59]"
            >
              <Mail className="w-4 h-4" />
              <span>Send Direct Email</span>
            </a>

            <a
              href={siteConfig.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.socials.github.label}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-xs hover:border-[#2F6BFF] transition-all"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>

            <a
              href={siteConfig.socials.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.socials.linkedin.label}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-xs hover:border-[#2F6BFF] transition-all"
            >
              <LinkedInIcon className="w-4 h-4" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border-color)] py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-secondary)]">
        <div>
          <span>© 2026 Kartik Verma. Designed & built with Next.js, Motion & Tailwind CSS.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#hero" className="hover:text-[var(--text-main)] transition-colors">
            Back to Top ↑
          </Link>
        </div>
      </footer>
    </div>
  );
}
