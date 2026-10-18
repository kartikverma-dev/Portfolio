"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { projects, Project } from "@/data/projects";
import { ProjectBlueprintPlaceholder } from "@/components/ui/ProjectBlueprintPlaceholder";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type CategoryFilter = "All" | "AI & Vision" | "Robotics & Hardware" | "Full-Stack & Systems" | "HCI & Mobile";

export function Work() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [archiveExpanded, setArchiveExpanded] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const horizontalTrackRef = useRef<HTMLDivElement | null>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement | null>(null);

  // Register GSAP ScrollTrigger plugin client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  // Split projects into primary featured (top 5) and archive (other 5)
  const primaryProjects = useMemo(
    () => projects.filter((p) => p.featuredOnHome),
    []
  );

  const archiveProjects = useMemo(
    () => projects.filter((p) => !p.featuredOnHome),
    []
  );

  // Filter function
  const filterProject = (project: Project): boolean => {
    if (activeCategory === "All") return true;
    const cat = project.category.toLowerCase();
    if (activeCategory === "AI & Vision") {
      return cat.includes("ai") || cat.includes("vision");
    }
    if (activeCategory === "Robotics & Hardware") {
      return cat.includes("robotics") || cat.includes("embedded") || cat.includes("hardware");
    }
    if (activeCategory === "Full-Stack & Systems") {
      return cat.includes("full-stack") || cat.includes("saas") || cat.includes("rust");
    }
    if (activeCategory === "HCI & Mobile") {
      return cat.includes("hci") || cat.includes("android");
    }
    return true;
  };

  const filteredPrimary = primaryProjects.filter(filterProject);
  const filteredArchive = archiveProjects.filter(filterProject);

  // GSAP Horizontal Pinned Scroll Setup for Desktop
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    // Only apply pinned horizontal scroll when on desktop, motion is allowed, and viewing All primary projects
    if (!isDesktop || prefersReducedMotion || activeCategory !== "All") {
      return;
    }

    const wrapper = horizontalWrapperRef.current;
    const track = horizontalTrackRef.current;

    if (!wrapper || !track) return;

    // Use gsap.context for automatic cleanup and zero leaks
    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        return track.scrollWidth - wrapper.clientWidth;
      };

      const scrollAmount = getScrollAmount();
      if (scrollAmount <= 0) return;

      gsap.to(track, {
        x: () => -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top+=80",
          end: () => `+=${scrollAmount * 1.1}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected Work and Projects"
      className="scroll-mt-24 py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--border-color)]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--border-color)] pb-6 mb-12 gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
            03 / Selected Works & Technical Explorations
          </span>
          <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl lg:text-6xl text-[var(--text-main)] tracking-tight uppercase">
            WORK & PROTOTYPES
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl">
            Real codebases, datasets, and hardware prototypes — documented honestly without fabricated metrics or unconfirmed claims.
          </p>
        </div>

        {/* Category Filters (Owns UI animation with Motion) */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {(["All", "AI & Vision", "Robotics & Hardware", "Full-Stack & Systems", "HCI & Mobile"] as CategoryFilter[]).map(
            (cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  type="button"
                  className={`px-3 py-1.5 rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
                    isSelected
                      ? "bg-[#2F6BFF] border-[#2F6BFF] text-white font-semibold shadow-sm"
                      : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[#2F6BFF]/40"
                  }`}
                >
                  {cat}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* GSAP Pinned Horizontal Showcase (Desktop, All category) with Responsive Fallback */}
      <div
        ref={horizontalWrapperRef}
        className="overflow-hidden w-full"
      >
        <div
          ref={horizontalTrackRef}
          className={`${
            activeCategory === "All"
              ? "lg:flex lg:flex-nowrap lg:gap-8 flex flex-col gap-12"
              : "flex flex-col gap-12"
          }`}
        >
          {filteredPrimary.map((project) => {
            const isFlagship = project.id === "idguard";

            return (
              <article
                key={project.id}
                tabIndex={0}
                onFocus={(e) => {
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className={`rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 md:p-10 transition-all hover:border-[#2F6BFF]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
                  activeCategory === "All"
                    ? "lg:w-[820px] lg:flex-shrink-0"
                    : "w-full"
                } ${
                  isFlagship
                    ? "shadow-sm ring-1 ring-[#2F6BFF]/10 dark:ring-[#457DFF]/15"
                    : ""
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                  {/* Visual / Blueprint Placeholder */}
                  <div className="md:col-span-5 w-full">
                    <ProjectBlueprintPlaceholder
                      number={project.number}
                      title={project.title}
                      category={project.category}
                      technologies={project.technologies}
                    />
                  </div>

                  {/* Content Column */}
                  <div className="md:col-span-7 flex flex-col justify-between h-full space-y-5">
                    <div>
                      {/* Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs pb-3 border-b border-[var(--border-color)]/70">
                        <span className="text-[#2F6BFF] dark:text-[#457DFF] font-semibold tracking-wider">
                          PROJECT // {project.number}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--border-color)]/40 text-[var(--text-main)] text-[11px] uppercase tracking-wide">
                          {project.status}
                        </span>
                      </div>

                      {/* Title & Category */}
                      <h3 className="mt-3 font-headline font-black text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
                        {project.title}
                      </h3>
                      <div className="mt-1 text-xs font-mono text-[#2F6BFF] dark:text-[#457DFF] uppercase tracking-wider">
                        {project.category}
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                        {project.description}
                      </p>

                      {/* Plain Status Label & Limitation */}
                      <div className="mt-4 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--border-color)]/25 text-xs font-mono text-[var(--text-main)]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#2F6BFF] dark:text-[#457DFF]" />
                          <span>{project.statusLabel}</span>
                        </div>

                        {project.limitation && (
                          <p className="text-xs font-mono text-[var(--text-secondary)] pl-1">
                            <span className="text-[var(--text-main)] font-semibold">Note:</span> {project.limitation}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Technologies & Active Links */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded text-xs font-mono bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-secondary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border-color)]/70">
                        {project.links.map((link, lIdx) => {
                          if (!link.verified) {
                            return (
                              <span
                                key={lIdx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-[var(--text-secondary)] bg-[var(--border-color)]/20 border border-[var(--border-color)]/40 cursor-not-allowed"
                                title="URL unconfirmed per MASTER_PROMPT.md — omitted"
                              >
                                <span>{link.label}</span>
                                <span className="text-[10px] text-[#FF7A59] uppercase">(Unconfirmed)</span>
                              </span>
                            );
                          }

                          return (
                            <a
                              key={lIdx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
                                link.type === "live"
                                  ? "bg-[#2F6BFF] text-white hover:bg-[#2558d4] shadow-sm"
                                  : "border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[#2F6BFF] hover:text-[#2F6BFF]"
                              }`}
                            >
                              {link.type === "profile" && <GitHubIcon className="w-3.5 h-3.5" />}
                              <span>{link.label}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Expandable Archive Section */}
      <div className="mt-20 pt-10 border-t border-[var(--border-color)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-headline font-bold text-2xl text-[var(--text-main)]">
              Research & Hardware Archive
            </h3>
            <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
              5 secondary prototypes, hardware suites, and early experiments
            </p>
          </div>

          <button
            onClick={() => setArchiveExpanded(!archiveExpanded)}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-mono text-[var(--text-main)] hover:border-[#2F6BFF] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
            aria-expanded={archiveExpanded}
          >
            <span>{archiveExpanded ? "Collapse Archive" : "Expand 5 Archive Projects"}</span>
            {archiveExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Animated Archive Drawer (Animated solely with Motion) */}
        <AnimatePresence>
          {archiveExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden"
            >
              {filteredArchive.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-2">
                      <span className="text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
                        {project.number}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[var(--border-color)]/30 text-[10px] uppercase">
                        {project.status}
                      </span>
                    </div>

                    <h4 className="font-headline font-bold text-lg text-[var(--text-main)]">
                      {project.title}
                    </h4>
                    <span className="text-[11px] font-mono text-[#2F6BFF] dark:text-[#457DFF] uppercase block mt-0.5 mb-2">
                      {project.category}
                    </span>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {project.limitation && (
                      <div className="mt-3 text-[11px] font-mono text-[var(--text-secondary)]">
                        <span className="text-[var(--text-main)] font-semibold">Note:</span> {project.limitation}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[var(--border-color)]/60">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-main)] text-[var(--text-secondary)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
                      <span>Status: {project.statusLabel}</span>
                      <a
                        href={project.links[0]?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2F6BFF] dark:text-[#457DFF] hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                      >
                        <span>Profile</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
