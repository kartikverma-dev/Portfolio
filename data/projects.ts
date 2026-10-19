export type ProjectStatus =
  | "Prototype"
  | "In progress"
  | "Concept"
  | "Research"
  | "Experiment";

export interface ProjectLink {
  type: "github" | "live" | "demo" | "profile";
  url: string;
  label: string;
  verified: boolean;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  status: ProjectStatus;
  statusLabel: string;
  limitation?: string;
  featuredOnHome: boolean;
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: "idguard",
    number: "01",
    title: "IDGUARD",
    category: "AI, Computer Vision",
    description:
      "AI document-screening project for a Smart India Hackathon-related initiative. YOLO-based detection of Aadhaar-related fields (name, date of birth, gender, address, number). Datasets merged, deduplicated and split into 4,652 training, 1,329 validation and 666 testing images.",
    technologies: [
      "Python",
      "Ultralytics YOLO",
      "Computer Vision",
    ],
    status: "Prototype",
    statusLabel: "Prototype",
    limitation:
      "Prototype document-screening tool; not guaranteed identity verification or production certified. Real personal data is never shown.",
    featuredOnHome: true,
    links: [
      {
        type: "live",
        url: "https://idguard.vercel.app",
        label: "Live Demo",
        verified: true,
      },
      {
        type: "github",
        url: "https://github.com/kartikverma-dev/IDGUARD",
        label: "GitHub Repository",
        verified: true,
      },
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "Author GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "credgeaiverse",
    number: "02",
    title: "CredgeAiVerse",
    category: "AI, Research",
    description:
      "Platform for tracking 58 AI concepts, maturity statuses, evidence-based scoring and learning priorities.",
    technologies: ["AI Research", "Next.js"],
    status: "Prototype",
    statusLabel: "Prototype",
    limitation:
      "Reported agreement with senior AI architects on the platform's scoring. Not a general accuracy or commercial-performance claim.",
    featuredOnHome: true,
    links: [
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "evilclown-ai",
    number: "03",
    title: "EVILCLOWN AI Platform",
    category: "AI, Full-Stack",
    description:
      "AI platform concept with a Rust backend and a Next.js dashboard.",
    technologies: ["Rust", "Next.js", "TypeScript", "AI Integration", "Tailwind CSS"],
    status: "Concept",
    statusLabel: "Concept",
    limitation: "Concept architecture; not in production usage or customer deployment.",
    featuredOnHome: true,
    links: [
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "dogos-pawpath",
    number: "04",
    title: "DogOS / PawPath",
    category: "SaaS, Full-Stack",
    description:
      "Dog-training SaaS concept showing interface design, workflow planning and architecture.",
    technologies: ["Next.js", "TypeScript", "UI/UX Architecture", "Tailwind CSS"],
    status: "Concept",
    statusLabel: "Concept",
    limitation: "Interface and planning concept; no revenue, customers, or operational metrics.",
    featuredOnHome: false,
    links: [
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "smartcctv-brain",
    number: "05",
    title: "SmartCCTV AI Android Brain",
    category: "Android, AI, Computer Vision",
    description:
      "Android smart-camera and computer-vision concept exploring edge inferencing on mobile hardware.",
    technologies: ["Android", "Computer Vision", "TensorFlow Lite", "Java/Kotlin"],
    status: "In progress",
    statusLabel: "In progress",
    limitation: "Prototype exploration; unfinished components remain work in progress.",
    featuredOnHome: false,
    links: [
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "nexus-rover",
    number: "06",
    title: "NEXUS AI ROVER",
    category: "Robotics, Embedded",
    description:
      "Arduino Uno, ESP8266, NRF24L01 wireless communication, Li-ion power, motor control, Mecanum wheels.",
    technologies: [
      "Arduino Uno",
      "ESP8266",
      "NRF24L01 Wireless",
      "Mecanum Wheels",
      "Motor Control",
    ],
    status: "Prototype",
    statusLabel: "Prototype",
    limitation: "Robotics prototype; no autonomous navigation or advanced AI claimed.",
    featuredOnHome: true,
    links: [
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "tinynas",
    number: "07",
    title: "TinyNAS",
    category: "Embedded, IoT",
    description:
      "Experiment with Arduino Uno, ESP8266 and storage or networking ideas on tiny hardware.",
    technologies: ["Arduino Uno", "ESP8266", "Embedded Prototyping", "IoT Concepts"],
    status: "Experiment",
    statusLabel: "Experiment",
    limitation: "Early hardware experiment; separated demonstrated features from planned ones.",
    featuredOnHome: false,
    links: [
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "lumos-projects",
    number: "08",
    title: "LUMOS Projects",
    category: "Experimental, Hardware",
    description:
      "LUMOS RF (research and prototype), LUMOS ROVER (in progress), LUMOS AI PIN (prototype and research).",
    technologies: ["RF Prototyping", "Embedded Systems", "Sensors", "Hardware Design"],
    status: "Research",
    statusLabel: "Research",
    limitation: "Experimental hardware research; no finalized commercial specifications.",
    featuredOnHome: false,
    links: [
      {
        type: "github",
        url: "https://github.com/kartikverma-dev/LUMOS-RF",
        label: "LUMOS-RF Repository",
        verified: true,
      },
      {
        type: "github",
        url: "https://github.com/kartikverma-dev/LUMOS-AI-PIN",
        label: "LUMOS-AI-PIN Repository",
        verified: true,
      },
      {
        type: "github",
        url: "https://github.com/kartikverma-dev/lumos-AI-Rover",
        label: "lumos-AI-Rover Repository",
        verified: true,
      },
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "gesture-sharing",
    number: "09",
    title: "Android Hand-Gesture Sharing",
    category: "Android, Computer Vision, HCI",
    description:
      "Grab and pinch gestures to select a sending and a receiving device. Started from Google's MediaPipe Hand Landmarker sample; hand landmarks and one hand tracked on a Samsung Galaxy A55.",
    technologies: [
      "Android",
      "Google MediaPipe",
      "Hand Landmarker",
      "Computer Vision",
      "HCI",
    ],
    status: "Prototype",
    statusLabel: "Hand landmark tracking tested",
    limitation: "Hand landmark tracking tested on Samsung Galaxy A55. Gesture interaction experiment in progress; not a complete file transfer.",
    featuredOnHome: true,
    links: [
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
  {
    id: "ai-video-lab",
    number: "10",
    title: "AI Video Lab",
    category: "AI, Generative Media",
    description:
      "Experiments with ComfyUI, Hugging Face models, Google Colab and GPU-based video generation.",
    technologies: ["ComfyUI", "Hugging Face Models", "Google Colab", "Python"],
    status: "Experiment",
    statusLabel: "Experiment",
    limitation: "Workflow experimentation; no custom trained models or unverified output claims.",
    featuredOnHome: false,
    links: [
      {
        type: "profile",
        url: "https://github.com/kartikverma-dev",
        label: "GitHub Profile",
        verified: true,
      },
    ],
  },
];
