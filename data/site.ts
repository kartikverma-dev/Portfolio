export interface SocialLink {
  name: string;
  url: string;
  label: string;
  verified: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  education: {
    degree: string;
    institution: string;
    campus: string;
    affiliation: string;
    batch: string;
    semester: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  email: string;
  socials: {
    github: SocialLink;
    linkedin: SocialLink;
  };
  navItems: NavItem[];
  hero: {
    badge: string;
    headline: string;
    subtitle: string;
    statement: string;
    ctaPrimary: {
      label: string;
      href: string;
    };
    ctaSecondary: {
      label: string;
      href: string;
    };
  };
  contact: {
    heading: string;
    message: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Kartik Verma",
  role: "BCA student, aspiring AI and cybersecurity engineer, creative developer, technology enthusiast",
  education: {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "IMS Ghaziabad",
    campus: "University Courses Campus",
    affiliation: "Chaudhary Charan Singh University",
    batch: "2025–2028",
    semester: "Second semester as of October 2026",
  },
  location: {
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    country: "India",
  },
  email: "kartikverma0804@gmail.com",
  socials: {
    github: {
      name: "GitHub",
      url: "https://github.com/kartikverma-dev",
      label: "Visit Kartik's GitHub profile (opens in new tab)",
      verified: true,
    },
    linkedin: {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/kartik-verma-5459a5378/",
      label: "Connect with Kartik on LinkedIn (opens in new tab)",
      verified: true,
    },
  },
  navItems: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Lab", href: "#lab" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    badge: "BCA Student @ IMS Ghaziabad • Ghaziabad, UP, India",
    headline: "KARTIK VERMA",
    subtitle: "Building at the intersection of AI, security, and creative technology.",
    statement:
      "I explore ideas through code, AI experiments, interactive interfaces, and hardware prototypes - turning curiosity into things you can see, test, and build upon.",
    ctaPrimary: {
      label: "Explore Work",
      href: "#work",
    },
    ctaSecondary: {
      label: "Get in Touch",
      href: "#contact",
    },
  },
  contact: {
    heading: "HAVE AN IDEA WORTH BUILDING?",
    message:
      "I'm always interested in exploring challenging ideas, building useful technology, and collaborating with people who enjoy experimenting.",
  },
};
