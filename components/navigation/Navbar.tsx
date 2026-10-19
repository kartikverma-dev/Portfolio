"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { useTheme } from "@/components/theme/ThemeProvider";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = [
      "hero",
      "about",
      "work",
      "github",
      "experience",
      "credentials",
      "skills",
      "lab",
      "contact",
    ];
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the entry that has the highest intersection ratio or is currently intersecting
      const visible = entries.find((e) => e.isIntersecting);
      if (visible) {
        setActiveSection(visible.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-nav)] backdrop-blur-md border-b border-[var(--border-color)] shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Main Navigation"
          className="flex items-center justify-between"
        >
          {/* Logo / Monogram */}
          <Link
            href="#hero"
            aria-label="Kartik Verma - Back to top"
            className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1.5 py-0.5"
          >
            <span className="font-headline font-bold text-xl tracking-tight text-[var(--text-main)] group-hover:text-[#2F6BFF] transition-colors">
              KV
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A59] transition-transform group-hover:scale-125" />
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 bg-[var(--border-color)]/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--border-color)]">
            {siteConfig.navItems.map((item) => {
              const targetId = item.href.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors rounded-full ${
                    isActive
                      ? "text-[#2F6BFF] dark:text-[#457DFF] font-semibold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#2F6BFF]/10 dark:bg-[#457DFF]/15 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Actions: Socials + Theme Toggle + Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Social Icons (inline SVGs with aria-labels) */}
            <a
              href={siteConfig.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.socials.github.label}
              className="p-2 text-[var(--text-secondary)] hover:text-[#2F6BFF] dark:hover:text-[#457DFF] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>

            <a
              href={siteConfig.socials.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.socials.linkedin.label}
              className="p-2 text-[var(--text-secondary)] hover:text-[#2F6BFF] dark:hover:text-[#457DFF] transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#2F6BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#FF7A59]" />
              ) : (
                <Moon className="w-4 h-4 text-[#2F6BFF]" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="md:hidden p-2 text-[var(--text-main)] rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-6 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {siteConfig.navItems.map((item) => {
                const targetId = item.href.replace("#", "");
                const isActive = activeSection === targetId;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 text-sm font-mono tracking-wider uppercase transition-colors flex items-center justify-between ${
                      isActive
                        ? "text-[#2F6BFF] dark:text-[#457DFF] font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF] dark:bg-[#457DFF]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
