# Kartik Verma — Personal Portfolio

An editorial, high-performance portfolio website for **Kartik Verma**, BCA student at IMS Ghaziabad exploring AI engineering, cybersecurity, software architecture, and embedded hardware.

Built with an editorial design language inspired by scientific notebooks and technical blueprints, featuring responsive design, dark/light theme switching, a pinned GSAP horizontal work gallery, and an interactive procedural 3D Mecanum rover.

---

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) 16 (App Router, Turbopack, React 19)
* **Language:** TypeScript
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS (`@tailwindcss/postcss`)
* **Motion & UI Animation:** [Motion](https://motion.dev/) (reveals, transitions, interactive filters)
* **Pinned Narrative Gallery:** [GSAP](https://greensock.com/) + ScrollTrigger (desktop pinned horizontal scroll with native keyboard tab accessibility)
* **Signature 3D Moment:** [Three.js](https://threejs.org/) & [@react-three/fiber](https://r3f.docs.pmnd.rs/) (procedural low-poly wireframe rover with responsive SVG fallback)
* **Icons:** [Lucide React](https://lucide.dev/) (UI utility icons) + custom inline SVGs for GitHub and LinkedIn

---

## Getting Started

### Prerequisites

* Node.js 18.18+ or 20+ (recommended LTS)
* npm (or yarn / pnpm / bun)

### Installation

```bash
# Clone repository
git clone https://github.com/kartikverma-dev/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### Development

```bash
# Run local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build optimized static and server bundles
npm run build

# Start local production server
npm run start
```

### Linting

```bash
npm run lint
```

---

## Folder Structure

```
├── app/
│   ├── favicon.ico
│   ├── globals.css           # Design tokens, theme CSS variables, typography imports
│   ├── icon.tsx              # Dynamic KV SVG favicon
│   ├── layout.tsx            # Root layout, fonts (Syne, Outfit, JetBrains Mono), SEO metadata
│   ├── opengraph-image.tsx   # Dynamic OpenGraph card generation
│   ├── page.tsx              # Main single-page application assembling all sections
│   ├── robots.ts             # Search engine crawling directives
│   └── sitemap.ts            # Dynamic sitemap generator
├── components/
│   ├── navigation/
│   │   └── Navbar.tsx        # Responsive header with scroll-spy, theme toggle & mobile drawer
│   ├── sections/
│   │   ├── Hero.tsx          # Hero introduction, headline, coordinates, CTA and 3D rover
│   │   ├── About.tsx         # Academic dossier, background narrative, interests matrix
│   │   ├── Work.tsx          # GSAP pinned horizontal gallery + filterable project archive
│   │   ├── Experience.tsx    # CredgeSol AI internship timeline & CCE spotlight
│   │   ├── Skills.tsx        # Interactive skill groups categorized by proficiency
│   │   ├── Lab.tsx           # Dark digital research notebook for hardware & AI prototypes
│   │   ├── Certifications.tsx# Certifications, courses, and campus community leadership
│   │   ├── Contact.tsx       # Contact headline, mailto CTA with click-to-copy, social links
│   │   └── Footer.tsx        # Monospace footer, client-only IST live clock, back-to-top
│   ├── theme/
│   │   └── ThemeProvider.tsx # System-aware Dark/Light mode provider
│   ├── ui/
│   │   ├── CustomCursor.tsx  # Desktop-only subtle lag cursor (disabled on touch devices)
│   │   ├── LoadingScreen.tsx # First-visit loading overlay (sessionStorage-backed, <noscript> safe)
│   │   ├── ProjectBlueprintPlaceholder.tsx # Technical blueprint visual for projects without screenshots
│   │   └── SocialIcons.tsx   # Accessible inline SVG GitHub & LinkedIn icons
│   └── visuals/
│       ├── HeroRover3D.tsx   # Responsive controller switching between 3D canvas and fallback
│       ├── RoverCanvas.tsx   # Procedural wireframe Mecanum rover with mouse parallax & DPR cap
│       └── RoverFallbackSVG.tsx # Static vector schematic for mobile, reduced-motion, or no WebGL
├── data/
│   ├── certifications.ts     # Certifications, verified courses, and campus leadership records
│   ├── experience.ts         # Professional experience and internship scope details
│   ├── projects.ts           # Primary showcase & archive projects with status labels & boundaries
│   ├── site.ts               # Core site configuration, bio, academic details, and navigation links
│   └── skills.ts             # Technical skills, proficiency levels, and context notes
├── postcss.config.mjs        # PostCSS configuration for Tailwind CSS v4
└── tailwind.config.ts        # Tailwind theme extensions and token definitions
```

---

## Content Editing Guide (`data/`)

All site content is decoupled from components and lives in typed TypeScript data files in `data/`:

* **`data/site.ts`**: Edit personal details, degree/campus info, contact email, social profile URLs, hero statements, and navbar items.
* **`data/projects.ts`**: Add or modify projects. Each project entry supports categories, tech tags, live links, and honesty boundary notes.
* **`data/experience.ts`**: Update internship or employment roles, verified scopes, and project spotlights.
* **`data/skills.ts`**: Add technical skills into one of the 5 domains (`Programming & Web`, `AI & Machine Learning`, `Cybersecurity & Systems`, `Embedded & Hardware`, `Creative Development`) with proficiency flags.
* **`data/certifications.ts`**: Maintain official certifications, courses, and student leadership roles.

---

## Honesty & Verification Rules

This website follows strict honesty principles as specified in `MASTER_PROMPT.md`:

1. **No Invented Metrics:** Never add fabricated benchmark results, accuracy scores, evaluation counts, user counts, or revenue metrics.
2. **Context on Metrics:** Any reported number must include its exact scope (for example: the CredgeAiVerse 86.7% figure represents reported agreement with senior AI architects on platform scoring, not general model accuracy).
3. **No Fake Screenshots:** If a project does not have a real, verified production screenshot, use the provided `<ProjectBlueprintPlaceholder />` with an explicit label (`"Illustrative diagram, not a screenshot"`). Never generate fake UI interfaces and present them as real software.
4. **Link Verification:** Each link in `data/projects.ts` and `data/certifications.ts` contains a `verified: boolean` flag:
   * Only set `verified: true` when a live URL or repository is verified.
   * If a repository or certificate URL is unconfirmed (e.g., Harvard course verification or uncertain repo names), leave `verified: false`. The UI will display a status badge without rendering a clickable broken link.
5. **Clear Statuses:** Every project must declare an honest status: `"Completed"`, `"In Progress"`, `"Prototype"`, `"Research Concept"`, or `"Hardware Prototype"`.
6. **Hardware Distinctions:** For hardware experiments (such as NEXUS AI ROVER, TinyNAS, or LUMOS), clearly separate demonstrated bench tests from planned concepts; do not claim working motor assemblies or wireless links unless physical testing has been completed.
7. **Skill Proficiencies:** Do not use arbitrary percentage bars (e.g., "Python 95%"). Use only truthful categorical badges: `"Working Knowledge"`, `"Project Experience"`, or `"Currently Exploring"`.

---

## License

Personal portfolio content and assets &copy; Kartik Verma. All rights reserved.
Code released under the MIT License.
