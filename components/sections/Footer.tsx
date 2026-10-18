"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now);
        setCurrentTime(formatted);
      } catch {
        setCurrentTime("");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      aria-label="Site Footer"
      className="border-t border-[var(--border-color)] bg-[var(--bg-main)] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-colors"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between pb-12 border-b border-[var(--border-color)]">
        {/* Brand / Name Column (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-headline font-black text-2xl text-[var(--text-main)] tracking-tight">
              KARTIK VERMA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A59]" />
          </div>
          <p className="text-xs font-mono text-[var(--text-secondary)] max-w-sm leading-relaxed">
            BCA student at IMS Ghaziabad exploring applied AI, security engineering, and creative technology.
          </p>

          {/* Client-only live time indicator to prevent hydration mismatch */}
          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>
              Ghaziabad, UP, India
              {isClient && currentTime ? ` • ${currentTime} IST` : " • IST (UTC+5:30)"}
            </span>
          </div>
        </div>

        {/* Navigation Column (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2F6BFF] dark:text-[#457DFF] font-semibold block mb-3">
            Navigation Index
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:underline transition-colors py-0.5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Direct Connect & Top (3 cols) */}
        <div className="md:col-span-3 space-y-3 md:text-right">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2F6BFF] dark:text-[#457DFF] font-semibold block mb-3">
            Direct Presence
          </span>
          <div className="flex md:justify-end items-center gap-4">
            <a
              href={siteConfig.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.socials.github.label}
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[#2F6BFF] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>

            <a
              href={siteConfig.socials.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.socials.linkedin.label}
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[#2F6BFF] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>

            <Link
              href="#hero"
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1.5 p-2 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[#2F6BFF] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Subtitle */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-secondary)]">
        <div>
          <span>© 2026 Kartik Verma. Designed & built with Next.js, Motion & Tailwind CSS.</span>
        </div>
        <div className="text-[11px] text-[var(--text-secondary)]">
          <span>Truthful documentation • Zero fabricated metrics or awards</span>
        </div>
      </div>
    </footer>
  );
}
