export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  category: "Certification" | "Course" | "Program" | "Campus Role";
  verified: boolean;
  notes?: string;
}

export const certifications: CertificationItem[] = [
  {
    id: "tcs-ion",
    title: "AI and Cybersecurity Awareness",
    issuer: "TCS iON",
    category: "Certification",
    verified: true,
  },
  {
    id: "iit-kanpur",
    title: "Internet of Things (IoT) Course",
    issuer: "E&ICT Academy, IIT Kanpur",
    category: "Course",
    verified: true,
  },
  {
    id: "harvard-course",
    title: "Harvard Online Learning Course",
    issuer: "Harvard Online",
    category: "Course",
    verified: false, // Placeholder in data file; external link and specific course title pending verification
    notes: "Awaiting exact course title and verification credential link before publishing details.",
  },
  {
    id: "gemini-ambassador",
    title: "Student Ambassador",
    issuer: "Gemini Student Ambassador Program",
    category: "Program",
    verified: true,
    notes: "Ambassador and community program participation.",
  },
  {
    id: "tech-yuva",
    title: "Technical Representative",
    issuer: "Tech Yuva Community",
    category: "Campus Role",
    verified: true,
  },
  {
    id: "aiml-club",
    title: "Editor",
    issuer: "AI-ML Club",
    category: "Campus Role",
    verified: true,
  },
  {
    id: "spardha-2026",
    title: "Organizing Member",
    issuer: "SPARDHA 2026 (IMS UC Sports Club)",
    category: "Campus Role",
    verified: true,
  },
];
