export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string[];
  spotlight?: {
    title: string;
    description: string;
  };
}

export const experiences: ExperienceItem[] = [
  {
    id: "credgesol",
    role: "AI Intern",
    company: "CredgeSol AI Private Limited",
    period: "June 1, 2026 – Present",
    location: "Remote",
    type: "Six-month remote internship with flexible timings",
    description: [
      "AI tools and workflow development",
      "Prompt engineering",
      "Research and technical documentation",
      "AI-driven business applications",
      "Portfolio and GitHub development",
      "AI-assisted product development",
    ],
    spotlight: {
      title: "Credge Clarity Engine (CCE)",
      description:
        "Enterprise AI decision-assurance and governance initiative associated with my internship. Confidential implementation details are not shared.",
    },
  },
];
