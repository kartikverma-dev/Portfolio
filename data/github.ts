export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string | null;
  topics: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  stargazers_count?: number;
  forks_count?: number;
}

// Repositories explicitly excluded from display
export const hiddenRepoNames: string[] = [
  "portfolio",
  "personal-portfolio",
  "kartikverma-dev",
  "cce-website",
];
