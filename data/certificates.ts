export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  category: "AI & Security" | "IoT" | "Community" | "Professional skills" | "Honours" | "Program";
  description?: string;
  image?: string;
  extraImage?: string;
  credentialUrl?: string;
  featured?: boolean;
  verified: boolean;
}

export const certificates: CertificateItem[] = [
  {
    id: "invent-core",
    title: "Core Committee – InvenT 2026",
    issuer: "IMS Ghaziabad (University Courses Campus)",
    date: "7 Oct 2026",
    category: "Honours",
    description:
      "Certificate of Appreciation and medal for serving on the core committee for InvenT-2026, hosted by the Department of Computer Science.",
    image: "/certificates/invent-core-committee.jpg",
    extraImage: "/certificates/core-committee-medal.jpg",
    featured: true,
    verified: true,
  },
  {
    id: "tcs-ion",
    title: "AI and Cybersecurity Awareness",
    issuer: "TCS iON",
    date: "May 2026",
    category: "AI & Security",
    description:
      "Offered under the AI for All program by MPIT – CoE in partnership with the TCS Foundation. Course held April 2026.",
    image: "/certificates/tcs-ion-ai-cyber.jpg",
    verified: true,
  },
  {
    id: "iit-kanpur-iot",
    title: "Internet of Things (IoT) – Student Development Program",
    issuer: "E&ICT Academy, IIT Kanpur (MeitY & IIT Kanpur)",
    date: "18–25 Sep 2025",
    category: "IoT",
    image: "/certificates/iit-kanpur-iot.jpg",
    verified: true,
  },
  {
    id: "gift-a-smile",
    title: "Community Connect Internship – Certificate of Appreciation",
    issuer: "Gift a Smile Foundation",
    category: "Community",
    description:
      "Recognised for community service, including sharing practical photography skills with children.",
    image: "/certificates/gift-a-smile.jpg",
    verified: true,
  },
  {
    id: "harvard-hbi",
    title: "Time Management",
    issuer: "Harvard Business Impact (with HBI Education)",
    date: "September 2026",
    category: "Professional skills",
    image: "/certificates/harvard-time-management.jpg",
    verified: true,
  },
  {
    id: "invent-robo",
    title: "Robo Velocity – Volunteer Appreciation",
    issuer: "IMS Ghaziabad (University Courses Campus)",
    date: "7 Oct 2026",
    category: "Community",
    description:
      "Volunteered for the Robo Velocity event, part of InvenT-2026, hosted by the Department of Computer Science.",
    image: "/certificates/invent-robo-velocity.jpg",
    verified: true,
  },
  {
    id: "gemini-ambassador",
    title: "Gemini Student Ambassador Program",
    category: "Program",
    issuer: "Gemini Student Ambassador Program",
    verified: true,
  },
];
