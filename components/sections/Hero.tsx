"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Copy, Check, Terminal } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { HeroRover3D } from "@/components/visuals/HeroRover3D";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Architectural Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] -z-10"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Meta Status Row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-4 mb-8"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F6BFF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2F6BFF]" />
          </span>
          <span className="tracking-wide uppercase">
            BCA Student @ IMS Ghaziabad • Class of 2028
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block tracking-wider">
            Ghaziabad, Uttar Pradesh, India
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--border-color)]/40 text-[11px] uppercase tracking-wider text-[var(--text-main)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            AI Intern @ CredgeSol AI
          </span>
        </div>
      </motion.div>

      {/* Main Hero 12-Column Grid: Text on Left 7 Cols, 3D Rover on Right 5 Cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        <div className="lg:col-span-7 text-center lg:text-left">
          {/* Eyebrow / Focus */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-[#2F6BFF] dark:text-[#457DFF] font-semibold mb-4"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>AI • Systems Security • Hardware • Creative Dev</span>
          </motion.div>

          {/* Oversized Name Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-headline font-black tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--text-main)] uppercase select-none leading-[0.94]"
          >
            {siteConfig.hero.headline}
          </motion.h1>

          {/* Core Focus Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-headline font-medium text-xl sm:text-2xl text-[var(--text-main)] max-w-2xl leading-snug"
          >
            {siteConfig.hero.subtitle}
          </motion.p>

          {/* Supporting Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-base text-[var(--text-secondary)] max-w-xl leading-relaxed"
          >
            {siteConfig.hero.statement}
          </motion.p>

          {/* CTAs and Interaction Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start"
          >
            {/* Primary Coral CTA (Text is #0B1220 to strictly satisfy WCAG AA 7.29:1 contrast) */}
            <Link
              href={siteConfig.hero.ctaPrimary.href}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FF7A59] hover:bg-[#ff8c6e] text-[#0B1220] font-headline font-semibold text-sm tracking-wide transition-all shadow-sm hover:shadow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF7A59]"
            >
              <span>{siteConfig.hero.ctaPrimary.label}</span>
              <ArrowDown className="w-4 h-4" />
            </Link>

            {/* Secondary CTA: Get in Touch */}
            <Link
              href={siteConfig.hero.ctaSecondary.href}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border-color)] hover:border-[#2F6BFF] dark:hover:border-[#457DFF] bg-[var(--bg-card)] text-[var(--text-main)] font-headline font-semibold text-sm tracking-wide transition-all hover:text-[#2F6BFF] dark:hover:text-[#457DFF] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <span>{siteConfig.hero.ctaSecondary.label}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {/* Copy Email Button with Toast Feedback */}
            <button
              onClick={handleCopyEmail}
              type="button"
              aria-label="Copy Kartik's email address to clipboard"
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--text-secondary)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">
                    Email Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{siteConfig.email}</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Direct Profiles Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-xs font-mono text-[var(--text-secondary)]"
          >
            <span className="uppercase tracking-wider">Direct profiles:</span>
            <a
              href={siteConfig.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.socials.github.label}
              className="inline-flex items-center gap-1.5 hover:text-[#2F6BFF] dark:hover:text-[#457DFF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span className="text-[var(--border-color)]">•</span>
            <a
              href={siteConfig.socials.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.socials.linkedin.label}
              className="inline-flex items-center gap-1.5 hover:text-[#2F6BFF] dark:hover:text-[#457DFF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
            >
              <LinkedInIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </motion.div>
        </div>

        {/* Right 5 Columns: Procedural 3D Mecanum Rover (Desktop) / Fallback SVG (Mobile & Reduced Motion) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="lg:col-span-5 flex items-center justify-center w-full"
        >
          <HeroRover3D />
        </motion.div>
      </div>

      {/* Bottom Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.65 }}
        className="pt-12 flex items-center justify-between border-t border-[var(--border-color)] text-xs font-mono text-[var(--text-secondary)]"
      >
        <span className="hidden sm:inline-block">
          Explore Projects & Research Lab
        </span>

        <Link
          href="#about"
          aria-label="Scroll down to About section"
          className="flex items-center gap-2 hover:text-[#2F6BFF] dark:hover:text-[#457DFF] transition-colors mx-auto sm:mx-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}
