"use client";

import React, { useState } from "react";
import { GitHubRepo } from "@/data/github";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { ExternalLink, GitFork, Star, Calendar } from "lucide-react";

interface GitHubReposClientProps {
  repos: GitHubRepo[];
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Color dot by language
function getLanguageColor(language: string | null): string {
  switch (language?.toLowerCase()) {
    case "python":
      return "bg-[#3572A5]";
    case "typescript":
      return "bg-[#3178C6]";
    case "javascript":
      return "bg-[#F1E05A]";
    case "c++":
      return "bg-[#F34B7D]";
    case "c":
      return "bg-[#555555]";
    case "rust":
      return "bg-[#DEA584]";
    case "html":
      return "bg-[#E34C26]";
    case "css":
      return "bg-[#563D7C]";
    default:
      return "bg-[#2F6BFF]";
  }
}

export function GitHubReposClient({ repos }: GitHubReposClientProps) {
  const [activeLang, setActiveLang] = useState<string>("All");

  if (!repos || repos.length === 0) {
    return null;
  }

  // Extract unique languages
  const languages = [
    "All",
    ...Array.from(
      new Set(
        repos
          .map((r) => r.language)
          .filter((lang): lang is string => Boolean(lang))
      )
    ),
  ];

  const filteredRepos =
    activeLang === "All"
      ? repos
      : repos.filter((r) => r.language === activeLang);

  return (
    <section
      id="github"
      aria-label="Active GitHub Repositories"
      className="scroll-mt-24 py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--border-color)]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--border-color)] pb-6 mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2F6BFF] dark:text-[#457DFF] font-semibold">
            <GitHubIcon className="w-4 h-4" />
            <span>Open Source & Version Control</span>
          </div>
          <h2 className="mt-2 font-headline font-black text-4xl sm:text-5xl lg:text-6xl text-[var(--text-main)] tracking-tight uppercase">
            ON GITHUB
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl">
            Live public repositories from GitHub with active development and documented codebases.
          </p>
        </div>

        {/* Language Filter Chips */}
        {languages.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {languages.map((lang) => {
              const isSelected = activeLang === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  type="button"
                  className={`px-3 py-1.5 rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
                    isSelected
                      ? "bg-[#2F6BFF] border-[#2F6BFF] text-white font-semibold shadow-sm"
                      : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[#2F6BFF]/40"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Repos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRepos.map((repo) => (
          <article
            key={repo.id}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm hover:border-[#2F6BFF]/50 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Top Bar: Name & External Link */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-headline font-bold text-lg text-[var(--text-main)] group-hover:text-[#2F6BFF] dark:group-hover:text-[#457DFF] transition-colors inline-flex items-center gap-1.5 line-clamp-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] rounded"
                >
                  <span>{repo.name}</span>
                </a>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${repo.name} repository on GitHub`}
                  className="text-[var(--text-secondary)] hover:text-[#2F6BFF] dark:hover:text-[#457DFF] transition-colors p-1"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
                {repo.description}
              </p>

              {/* Topics */}
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-main)] border border-[var(--border-color)]/60 text-[var(--text-secondary)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div className="pt-4 border-t border-[var(--border-color)]/70 flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
              <div className="flex items-center gap-3">
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`}
                    />
                    <span>{repo.language}</span>
                  </div>
                )}
                {Boolean(repo.stargazers_count && repo.stargazers_count > 0) && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                )}
                {Boolean(repo.forks_count && repo.forks_count > 0) && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <GitFork className="w-3 h-3 opacity-70" />
                    <span>{repo.forks_count}</span>
                  </div>
                )}
              </div>

              {repo.pushed_at && (
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3 opacity-70" />
                  <span>Updated {formatDate(repo.pushed_at)}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* View All on GitHub CTA */}
      <div className="mt-12 flex justify-center">
        <a
          href="https://github.com/kartikverma-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#2F6BFF] text-xs font-mono font-semibold text-[var(--text-main)] hover:text-[#2F6BFF] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
        >
          <GitHubIcon className="w-4 h-4" />
          <span>View all on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
