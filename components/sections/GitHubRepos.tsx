import React from "react";
import { GitHubRepo, hiddenRepoNames } from "@/data/github";
import { projects } from "@/data/projects";
import { GitHubReposClient } from "./GitHubReposClient";

async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "User-Agent": "kartik-verma-portfolio",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      "https://api.github.com/users/kartikverma-dev/repos?per_page=100&sort=pushed",
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const rawData = await response.json();
    if (!Array.isArray(rawData)) {
      return [];
    }

    // Build case-insensitive list of featured project identifiers (only primary home showcase)
    const featuredIdentifiers = new Set<string>();
    projects
      .filter((p) => p.featuredOnHome)
      .forEach((p) => {
        featuredIdentifiers.add(p.id.toLowerCase());
        featuredIdentifiers.add(p.title.toLowerCase());
        p.links.forEach((l) => {
          try {
            const parts = l.url.split("/");
            const lastPart = parts[parts.length - 1]?.toLowerCase();
            if (lastPart) featuredIdentifiers.add(lastPart);
          } catch {
            // ignore invalid URLs
          }
        });
      });

    const hiddenSet = new Set(hiddenRepoNames.map((n) => n.toLowerCase()));

    // Filter according to rules:
    // 1. Not a fork
    // 2. Not archived
    // 3. Has a description
    // 4. Not in hidden list
    // 5. Not already featured in projects.ts
    const filtered = rawData.filter((repo: GitHubRepo) => {
      if (repo.fork) return false;
      if (repo.archived) return false;
      if (!repo.description || !repo.description.trim()) return false;

      const lowerName = repo.name.toLowerCase();
      if (hiddenSet.has(lowerName)) return false;
      if (featuredIdentifiers.has(lowerName)) return false;

      return true;
    });

    // Sort by pushed_at descending and take top 12
    filtered.sort((a, b) => {
      const timeA = new Date(a.pushed_at || 0).getTime();
      const timeB = new Date(b.pushed_at || 0).getTime();
      return timeB - timeA;
    });

    return filtered.slice(0, 12);
  } catch {
    // Return empty list on network or rate limit failure; build must never fail
    return [];
  }
}

export async function GitHubRepos() {
  const repos = await fetchGitHubRepos();

  if (repos.length === 0) {
    return null;
  }

  return <GitHubReposClient repos={repos} />;
}
