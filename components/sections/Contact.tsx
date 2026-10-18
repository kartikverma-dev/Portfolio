"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/site";
import { motion } from "motion/react";
import { Mail, Copy, Check, ArrowUpRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
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
      id="contact"
      aria-label="Contact and Collaboration"
      className="scroll-mt-24 py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--border-color)]"
    >
      <div className="max-w-4xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
          08 / Direct Contact & Inquiries
        </span>

        {/* Exact Prompt Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-4 font-headline font-black text-4xl sm:text-6xl md:text-7xl text-[var(--text-main)] tracking-tight uppercase leading-[0.95]"
        >
          {siteConfig.contact.heading}
        </motion.h2>

        {/* Exact Prompt Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg sm:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-2xl font-light"
        >
          {siteConfig.contact.message}
        </motion.p>

        {/* Interaction Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          {/* Primary Mailto Action */}
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-[#FF7A59] hover:bg-[#ff8c6e] text-[#0B1220] font-headline font-semibold text-sm tracking-wide transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A59]"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {/* Copy Email Button with Visual Toast Feedback */}
          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy Kartik's email to clipboard"
            className="inline-flex items-center gap-2 px-5 py-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[#2F6BFF] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied to Clipboard!</span>
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
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-wrap items-center gap-6 font-mono text-xs text-[var(--text-secondary)]"
        >
          <span className="uppercase tracking-wider">Direct profiles:</span>

          <a
            href={siteConfig.socials.github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={siteConfig.socials.github.label}
            className="inline-flex items-center gap-2 hover:text-[#2F6BFF] dark:hover:text-[#457DFF] transition-colors"
          >
            <GitHubIcon className="w-4 h-4" />
            <span>GitHub Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <span className="text-[var(--border-color)]">•</span>

          <a
            href={siteConfig.socials.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={siteConfig.socials.linkedin.label}
            className="inline-flex items-center gap-2 hover:text-[#2F6BFF] dark:hover:text-[#457DFF] transition-colors"
          >
            <LinkedInIcon className="w-4 h-4" />
            <span>LinkedIn Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
