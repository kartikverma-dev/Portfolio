export type SkillProficiency =
  | "Working Knowledge"
  | "Project Experience"
  | "Currently Exploring";

export interface SkillItem {
  name: string;
  proficiency: SkillProficiency;
  context?: string;
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
      { name: "Python", proficiency: "Working Knowledge", context: "Automation, scripts, CV pipelines" },
      { name: "C", proficiency: "Working Knowledge", context: "Academic coursework & low-level memory" },
      { name: "HTML5 & CSS3", proficiency: "Working Knowledge", context: "Semantic markup, modern CSS" },
      { name: "JavaScript Fundamentals", proficiency: "Working Knowledge", context: "Modern ES6+, DOM APIs" },
      { name: "React & Next.js", proficiency: "Project Experience", context: "App Router, SSR, UI components" },
      { name: "Tailwind CSS", proficiency: "Project Experience", context: "Design systems, fluid layouts" },
      { name: "MySQL", proficiency: "Working Knowledge", context: "Relational queries & schema modeling" },
      { name: "Git & GitHub", proficiency: "Working Knowledge", context: "Version control, branching, PRs" },
    ],
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning",
    description: "Vision models, local inference, workflow automation, and prompt engineering",
    skills: [
      { name: "Ultralytics YOLO", proficiency: "Project Experience", context: "Object detection, ID document screening" },
      { name: "Computer Vision & OpenCV", proficiency: "Project Experience", context: "Preprocessing, image manipulation" },
      { name: "Google MediaPipe", proficiency: "Project Experience", context: "Hand landmark tracking" },
      { name: "Local LLMs with Ollama", proficiency: "Project Experience", context: "Qwen, Gemma local deployments" },
      { name: "Prompt Engineering", proficiency: "Working Knowledge", context: "Structured outputs, system design" },
      { name: "Hugging Face Ecosystem", proficiency: "Project Experience", context: "Model exploration, inference APIs" },
      { name: "FastAPI & AI Integration", proficiency: "Project Experience", context: "Exposing inference endpoints" },
      { name: "TensorFlow Lite", proficiency: "Currently Exploring", context: "Edge deployment on mobile" },
    ],
  },
  {
    id: "cybersecurity-systems",
    title: "Cybersecurity & Systems",
    description: "Defensive concepts, security research, Linux systems, and network protocols",
    skills: [
      { name: "Cybersecurity Fundamentals", proficiency: "Working Knowledge", context: "Threat models, CIA triad, security hygiene" },
      { name: "Ethical Hacking Research", proficiency: "Currently Exploring", context: "Lab environments & security research" },
      { name: "Kali Linux", proficiency: "Working Knowledge", context: "Security assessment utilities" },
      { name: "Linux Command Line", proficiency: "Working Knowledge", context: "Bash scripting, process control, file permissions" },
      { name: "Networking Fundamentals", proficiency: "Working Knowledge", context: "TCP/IP, routing, DNS, packet flow" },
      { name: "Software Analysis & Reverse Engineering", proficiency: "Currently Exploring", context: "Binary inspection & decompilation basics" },
    ],
  },
  {
    id: "embedded-hardware",
    title: "Embedded & Hardware",
    description: "Microcontrollers, RF telemetry, robotics drive trains, and sensor integration",
    skills: [
      { name: "Arduino Uno", proficiency: "Project Experience", context: "Hardware control, PWM, sensor inputs" },
      { name: "ESP8266 Wi-Fi", proficiency: "Project Experience", context: "IoT connectivity, simple web servers" },
      { name: "NRF24L01 Wireless", proficiency: "Project Experience", context: "2.4GHz transceivers for robotics control" },
      { name: "Motor Control & Mecanum Drive", proficiency: "Project Experience", context: "H-bridge drivers, multi-directional kinematics" },
      { name: "Sensors & Basic Electronics", proficiency: "Working Knowledge", context: "Ultrasonic, IR, voltage regulation, soldering" },
      { name: "Android Development", proficiency: "Currently Exploring", context: "Native mobile exploration with MediaPipe" },
    ],
  },
  {
    id: "creative-development",
    title: "Creative Development",
    description: "Motion design, spatial UI, fluid typography, and microinteractions",
    skills: [
      { name: "Responsive Interface Design", proficiency: "Project Experience", context: "Fluid layouts, mobile-first systems" },
      { name: "Motion for React", proficiency: "Project Experience", context: "Staggered reveals, physics transitions" },
      { name: "GSAP & ScrollTrigger", proficiency: "Project Experience", context: "Pinned narrative & orchestrated sequences" },
      { name: "Three.js / React Three Fiber", proficiency: "Currently Exploring", context: "Lightweight 3D models with fallback" },
      { name: "WebGL Concepts & Shaders", proficiency: "Currently Exploring", context: "Interactive shaders & canvas effects" },
      { name: "Microinteractions & CSS Animation", proficiency: "Working Knowledge", context: "Refined transitions, state changes" },
    ],
  },
];
