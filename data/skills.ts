export type SkillProficiency =
  | "Working Knowledge"
  | "Project Experience"
  | "Currently Exploring";

export interface SkillItem {
  name: string;
  proficiency: SkillProficiency;
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "programming-web",
    title: "Programming & Web",
    description: "Core languages, web architecture, and modern front-end engineering",
    skills: [
      { name: "Python", proficiency: "Working Knowledge" },
      { name: "C", proficiency: "Working Knowledge" },
      { name: "HTML5 & CSS3", proficiency: "Working Knowledge" },
      { name: "JavaScript Fundamentals", proficiency: "Working Knowledge" },
      { name: "React & Next.js", proficiency: "Project Experience" },
      { name: "Tailwind CSS", proficiency: "Project Experience" },
      { name: "MySQL", proficiency: "Working Knowledge" },
      { name: "Git & GitHub", proficiency: "Working Knowledge" },
    ],
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning",
    description: "Vision models, local inference, workflow automation, and prompt engineering",
    skills: [
      { name: "Ultralytics YOLO", proficiency: "Project Experience" },
      { name: "Computer Vision", proficiency: "Project Experience" },
      { name: "Google MediaPipe", proficiency: "Project Experience" },
      { name: "Local LLMs with Ollama", proficiency: "Project Experience" },
      { name: "Prompt Engineering", proficiency: "Working Knowledge" },
      { name: "Hugging Face Ecosystem", proficiency: "Project Experience" },
      { name: "TensorFlow Lite", proficiency: "Currently Exploring" },
    ],
  },
  {
    id: "cybersecurity-systems",
    title: "Cybersecurity & Systems",
    description: "Defensive concepts, security research, Linux systems, and network protocols",
    skills: [
      { name: "Cybersecurity Fundamentals", proficiency: "Working Knowledge" },
      { name: "Ethical Hacking Research", proficiency: "Currently Exploring" },
      { name: "Kali Linux", proficiency: "Working Knowledge" },
      { name: "Linux Command Line", proficiency: "Working Knowledge" },
      { name: "Networking Fundamentals", proficiency: "Working Knowledge" },
      { name: "Software Analysis & Reverse Engineering", proficiency: "Currently Exploring" },
    ],
  },
  {
    id: "embedded-hardware",
    title: "Embedded & Hardware",
    description: "Microcontrollers, wireless communication, robotics drive trains, and sensor integration",
    skills: [
      { name: "Arduino Uno", proficiency: "Project Experience" },
      { name: "ESP8266 Wi-Fi", proficiency: "Project Experience" },
      { name: "NRF24L01 Wireless", proficiency: "Project Experience" },
      { name: "Motor Control & Mecanum Drive", proficiency: "Project Experience" },
      { name: "Sensors & Basic Electronics", proficiency: "Working Knowledge" },
      { name: "Android Development", proficiency: "Currently Exploring" },
    ],
  },
  {
    id: "creative-development",
    title: "Creative Development",
    description: "Motion design, spatial UI, fluid typography, and microinteractions",
    skills: [
      { name: "Responsive Interface Design", proficiency: "Project Experience" },
      { name: "Motion for React", proficiency: "Project Experience" },
      { name: "GSAP & ScrollTrigger", proficiency: "Project Experience" },
      { name: "Three.js / React Three Fiber", proficiency: "Currently Exploring" },
      { name: "WebGL Concepts", proficiency: "Currently Exploring" },
      { name: "Microinteractions & CSS Animation", proficiency: "Working Knowledge" },
    ],
  },
];
