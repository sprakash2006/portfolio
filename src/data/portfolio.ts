// All personal content for the site lives here.
// Taken from the latest CV (/public/prakash-swami-cv.pdf), plus older details from the
// previous portfolio (prakash-swami-portfolio.vercel.app).

export const profile = {
  name: "Prakash Swami",
  monogram: "PS",
  role: "Full-Stack Developer",
  location: "Pune, India",
  intro:
    "Versatile creator of innovative, efficient, and user-focused digital solutions across web and beyond.",
  email: "prakashswami.dev@gmail.com",
  phone: "+91 8767690131",
  resume: "/prakash-swami-cv.pdf",
  photo: "/prakash-v6.jpg",
  // Web3Forms access key for the contact form (https://web3forms.com). It's meant to be public.
  web3formsKey: "6b4b537f-8d44-468a-ae9a-021b59157040",
  // Usernames for the activity heatmaps
  handles: {
    github: "sprakash2006",
    leetcode: "sprakash_001",
  },
  socials: {
    github: "https://github.com/sprakash2006",
    linkedin: "https://www.linkedin.com/in/prakash-swami/",
    leetcode: "https://leetcode.com/u/sprakash_001/",
  },
};

export const about = [
  "I'm a Full-Stack Developer and Computer Engineering student at VIT Pune who enjoys turning ideas into products people actually use. As CTO and co-founder of MediChain, I lead the technology behind a platform that puts patients in control of their medical records.",
  "I work across the stack with React, Next.js, Node.js and PostgreSQL, and I like building AI features with LLMs, LangChain and RAG. During my internship at Career Craftly, I built The GP Edge for a client in Australia, owning the system design and backend development with Next.js, TypeScript, PostgreSQL and the Gemini API. With 400+ LeetCode problems solved, my fundamentals in data structures and algorithms stay sharp.",
  "Away from the keyboard, I'm usually watching movies, playing cricket, listening to rap or trying out something new in tech.",
];

export const education = [
  {
    period: "2024 — 2028",
    title: "B.Tech in Computer Engineering",
    place: "VIT Pune · CGPA 8.84",
    focus: "Data structures & algorithms, DBMS, operating systems, OOP, Agile",
  },
  {
    period: "2024",
    title: "HSC (Class XII)",
    place: "Rajarshi Shahu Jr College, Latur · 82.34%",
    focus: "Science",
  },
];

export type Experience = {
  role: string;
  org: string;
  period?: string;
  logo?: string; // square image in /public/experience/; falls back to the org's first letter
  metrics?: { value: string; label: string }[];
  points: string[];
  tech?: string[];
};

export const experience: Experience[] = [
  {
    role: "CTO & Co-Founder",
    org: "MediChain",
    period: "2025 — Present",
    logo: "/experience/medichain.png",
    points: [
      "Co-founded MediChain and lead its technology: a platform that gives patients ownership of their medical records.",
      "Architected the system across a Flutter mobile app, a React web portal, a Node.js backend and Solidity smart contracts on Polygon.",
      "Designed AES-256 encrypted record storage on IPFS, with every grant, revoke, view and download logged on-chain as a tamper-proof audit trail.",
      "Made the app gasless for patients with an ERC-2771 relayer, and built a view-only secure viewer for doctors with watermarks and timed sessions.",
    ],
    tech: ["Flutter", "React", "Node.js", "Solidity", "Polygon", "IPFS", "Supabase"],
  },
  {
    role: "Web Developer Intern",
    org: "Career Craftly",
    logo: "/experience/career-craftly.png",
    period: "May 2026 — Oct 2026",
    points: [
      "Built a full-stack SaaS platform for General Practitioners using Next.js, TypeScript and PostgreSQL, with a personalized dashboard and real-time study analytics.",
      "Implemented secure authentication and role-based access with Clerk, and developed REST APIs for the study, billing and assessment modules.",
      "Engineered an AI-powered Medicare (MBS) billing module with semantic search and LLM-based XML processing to automate code lookup.",
      "Built an exam-prep system with quizzes, mock tests, mastery scoring and automated PDF performance reports.",
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Clerk", "Gemini API", "REST APIs"],
  },
  {
    role: "Website Secretary",
    org: "Indus Connect (ICON), VIT Pune",
    logo: "/experience/icon.png",
    period: "Sept 2025",
    points: [
      "Led development of the official ICON club website, coordinating the web team and event updates.",
      "Managed and updated website content regularly to keep information accurate and engaging.",
      "Collaborated with the technical and design teams to keep the site fast, responsive and easy to navigate.",
    ],
  },
];

export const skills = [
  {
    title: "Languages",
    blurb: "The foundations.",
    items: ["JavaScript", "TypeScript", "C++", "Python", "SQL"],
  },
  {
    title: "Frontend",
    blurb: "Responsive interfaces for web and mobile.",
    items: ["React.js", "Next.js", "React Native", "HTML5", "CSS3", "Responsive UI"],
  },
  {
    title: "Backend & Databases",
    blurb: "APIs, auth and data.",
    items: ["Node.js", "Express.js", "REST APIs", "PostgreSQL", "Supabase", "Firebase", "Redis"],
  },
  {
    title: "AI / LLM",
    blurb: "Shipping LLM-powered features.",
    items: ["LangChain", "LangGraph", "OpenAI API", "Gemini API", "RAG", "ChromaDB", "Prompt Engineering"],
  },
  {
    title: "Data Science",
    blurb: "Analysis and modelling.",
    items: ["NumPy", "Pandas", "Matplotlib", "Supervised Learning"],
  },
  {
    title: "Developer Tools",
    blurb: "The everyday kit.",
    items: ["Git", "GitHub", "Postman", "Clerk", "VS Code", "Agile / Scrum"],
  },
];

// Placeholder screenshots shared by every project until real ones are added
// TODO: replace each project's `screenshots` with its own images in /public/projects/<slug>/
const SAMPLE_SCREENSHOTS = [1, 2, 3, 4, 5].map((n) => ({
  src: `/projects/samples/sample-${String(n).padStart(2, "0")}.jpg`,
  alt: `Sample screenshot ${n}`,
}));

export type Project = {
  slug: string; // URL of the detail page: /projects/<slug>
  title: string;
  description: string; // one-liner shown on the home page card
  tags: string[];
  code?: string;
  live?: string;
  // Detail page
  year: string;
  category: string;
  overview: string[]; // paragraphs
  features: string[];
  screenshots: { src: string; alt: string }[]; // shown one at a time on the project page; put images in /public/projects/<slug>/
};

// Detail-page fields (year, category, overview, features, screenshots) are placeholders marked TODO.
export const projects: Project[] = [
  {
    slug: "medichain",
    title: "MediChain",
    description:
      "Patient-owned medical records: files are AES-256 encrypted onto IPFS, and every grant, revoke, view and download is logged on Polygon. Gasless for patients via an ERC-2771 relayer, with Flutter and React apps.",
    tags: ["Flutter", "React", "Node.js", "Solidity", "Polygon", "IPFS", "Supabase"],
    code: "https://github.com/medichain-connect-app",
    year: "2026", // TODO
    category: "Blockchain", // TODO
    overview: [
      // TODO
      "MediChain gives patients ownership of their medical records. Files are encrypted before they leave the server, stored on IPFS, and every access event is written to the Polygon blockchain as a tamper-proof audit trail.",
      "Placeholder: describe your role across the four repositories (mobile app, web portal, backend, smart contracts) and the hardest problem you solved.",
    ],
    features: [
      // TODO
      "AES-256 encrypted file storage on IPFS via Pinata",
      "On-chain audit trail of every grant, revoke, view and download",
      "Gasless for patients through an ERC-2771 relayer",
      "View-only secure viewer for doctors with watermarks and timed sessions",
    ],
    screenshots: SAMPLE_SCREENSHOTS,
  },
  {
    slug: "the-gp-edge",
    title: "The GP Edge",
    description:
      "Full-stack SaaS platform for General Practitioners: study analytics, an AI-powered Medicare billing lookup and an exam-prep system with mock tests and PDF reports.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Clerk", "Gemini API"],
    code: "https://github.com/thegpedge-ship-it/the-gp-edge",
    year: "2026", // TODO
    category: "Web", // TODO
    overview: [
      // TODO
      "The GP Edge is a full-stack SaaS platform for General Practitioners, built during my internship at Career Craftly. It brings study, billing and exam preparation into one personalized dashboard with real-time analytics.",
      "Placeholder: describe the problem GPs faced, your role on the team, and the architecture decisions behind the platform.",
    ],
    features: [
      // TODO
      "Personalized dashboard with real-time study analytics",
      "Clerk authentication with role-based access",
      "AI-powered Medicare (MBS) billing lookup with semantic search",
      "Exam prep with quizzes, mock tests, mastery scoring and PDF reports",
    ],
    screenshots: SAMPLE_SCREENSHOTS,
  },
  {
    slug: "solarmitra",
    title: "SolarMitra",
    description:
      "AR rooftop solar assessment app: maps the roof in AR, detects obstacles on-device with YOLOv8, pulls PVGIS irradiance data and estimates PM Surya Ghar subsidies, then generates a PDF report in under 2 minutes.",
    tags: ["Flutter", "Dart", "ARCore / ARKit", "YOLOv8", "TensorFlow Lite", "PVGIS API"],
    code: "https://github.com/Siddesh-bype/SolarSense_AR",
    year: "2026", // TODO
    category: "Mobile", // TODO
    overview: [
      // TODO
      "SolarMitra turns a smartphone into a rooftop solar surveyor. Users map their roof in AR, the app detects shading obstacles on-device, and it produces a complete solar feasibility report in under two minutes, with no site visit needed.",
      "Placeholder: describe your role on the team and the parts of the app you built.",
    ],
    features: [
      // TODO
      "AR rooftop mapping with ARCore / ARKit anchor points",
      "On-device obstacle detection with YOLOv8 Nano (TensorFlow Lite)",
      "Location-based solar irradiance from the PVGIS API",
      "PM Surya Ghar subsidy, ROI and payback calculations",
      "16-section PDF report generated entirely on the phone",
    ],
    screenshots: SAMPLE_SCREENSHOTS,
  },
  {
    slug: "papertrail",
    title: "PaperTrail",
    description:
      "RAG knowledge retrieval system for PDF, Word, Excel and CSV documents, with semantic indexing, duplicate detection and citation-backed answers.",
    tags: ["React", "Python", "Supabase", "ChromaDB", "OpenAI API"],
    code: "https://github.com/sprakash2006/PaperTrail-RAG-Knowledge-Retrieval-System-",
    year: "2026", // TODO
    category: "AI", // TODO
    overview: [
      // TODO
      "PaperTrail is a full-stack Retrieval-Augmented Generation platform. Users upload their documents and ask questions in plain language, and get answers backed by citations to the exact source passages.",
      "Placeholder: describe the ingestion pipeline, how duplicate detection works, and how you kept hallucinations low.",
    ],
    features: [
      // TODO
      "Upload PDF, Word, Excel and CSV documents",
      "Semantic indexing with ChromaDB",
      "Duplicate document detection",
      "Citation-backed, low-hallucination answers",
    ],
    screenshots: SAMPLE_SCREENSHOTS,
  },
  {
    slug: "portfolio",
    title: "Developer Portfolio",
    description:
      "This site: a themeable developer portfolio with live GitHub and LeetCode heatmaps, project detail pages and a working contact form.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "three.js"],
    code: "https://github.com/sprakash2006/portfolio",
    year: "2026",
    category: "Web",
    overview: [
      "My personal portfolio, built with Next.js 16 and Tailwind CSS v4. It brings my experience, skills, projects and activity together on one fast, mostly static site, with a separate detail page for every project.",
      "The design has eight switchable themes, each with its own accent colour that carries through the whole site, from the animated dot-field background to the heatmaps and the cursor-friendly navbar.",
    ],
    features: [
      "Eight colour themes, applied before the first paint so there's no flash",
      "Live GitHub and LeetCode activity heatmaps, fetched on the server and refreshed every 12 hours",
      "Filterable project list with statically generated detail pages",
      "Floating navbar that highlights the section you're reading",
      "Contact form that delivers straight to my inbox through Web3Forms",
      "Animated WebGL dot-field background that pauses off-screen and respects reduced motion",
    ],
    screenshots: SAMPLE_SCREENSHOTS,
  },
  {
    slug: "inboxly",
    title: "Inboxly",
    description:
      "WhatsApp Business messaging with a built-in sales CRM: shared inbox, bulk campaigns, a workflow builder, a Gemini-powered auto-reply agent, and leads and deals on a Kanban pipeline.",
    tags: ["React", "Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "BullMQ", "WhatsApp Cloud API", "Gemini API"],
    code: "https://github.com/sprakash2006/inboxly",
    year: "2026", // TODO
    category: "Web", // TODO
    overview: [
      // TODO
      "Inboxly lets a business run WhatsApp campaigns, reply to customers from a shared inbox, automate common replies, and turn conversations into leads and deals, all in one workspace.",
      "Placeholder: describe why you built it, how the background job queue works, and what you learned integrating the WhatsApp Cloud API.",
    ],
    features: [
      // TODO
      "Shared WhatsApp inbox with notes, assignment and template replies",
      "Bulk campaigns with scheduling, retries and delivery reports",
      "Workflow builder and a Gemini-powered auto-reply agent",
      "Leads, a drag-and-drop deals pipeline and follow-up tasks",
    ],
    screenshots: SAMPLE_SCREENSHOTS,
  },
  {
    slug: "gharbudget",
    title: "GharBudget",
    description:
      "Cross-platform household expense manager with real-time cloud sync, budgeting, categories and interactive spending charts.",
    tags: ["React Native", "TypeScript", "Firebase"],
    code: "https://github.com/sprakash2006/GharBudget",
    year: "2026", // TODO
    category: "Mobile", // TODO
    overview: [
      // TODO
      "GharBudget is a cross-platform mobile app that helps households track expenses, set budgets and understand their spending through interactive charts, with data synced in real time across devices.",
      "Placeholder: describe the team, your part in it, and the design decisions behind the app.",
    ],
    features: [
      // TODO
      "Secure authentication",
      "Real-time cloud sync with Firebase",
      "Budgets and expense categories",
      "Interactive spending analytics charts",
    ],
    screenshots: SAMPLE_SCREENSHOTS,
  },
  {
    slug: "ai-business-analyst-agent",
    title: "AI Business Analyst Agent",
    description:
      "Industry project: an LLM analyst workspace that turns project evidence into reviewed, source-cited requirements, BRD/SRS documents, user stories, API and database designs, sprint plans and proposals, with human approval at every step.",
    tags: ["Next.js", "TypeScript", "Supabase", "FastAPI", "OpenRouter", "LLM Agents"],
    year: "2026", // TODO
    category: "AI", // TODO
    overview: [
      // TODO
      "An analyst workspace that turns project evidence (notes, documents and meeting audio) into reviewed requirements and planning artifacts. The LLM drafts each artifact, the system validates its structure and traceability, and a person edits and approves every version.",
      "Placeholder: describe the industry context, your role, and how the approval and traceability workflow is designed.",
    ],
    features: [
      // TODO
      "Source-cited requirements and meeting findings with open questions",
      "BRD, SRS, user stories, ER and OpenAPI designs, sprint plans and proposals",
      "Edit, approve or request revisions, with dependency gates between artifacts",
      "Export approved artifacts as DOCX, PDF or JSON",
    ],
    screenshots: SAMPLE_SCREENSHOTS,
  },
];

export type Certification = {
  slug: string; // URL of the detail page: /certifications/<slug>
  title: string;
  issuer: string;
  url?: string; // verification link
  // Detail page
  date?: string;
  learned: string[]; // "What I learned" bullet points
  skills: string[];
  image?: { src: string; alt: string; width: number; height: number }; // the certificate itself (pixel size sets the frame), e.g. /public/certifications/<slug>.png; missing shows a placeholder
};

// Detail-page fields (date, learned, skills) are placeholders marked TODO; add image once you have it.
export const certifications: Certification[] = [
  {
    slug: "full-stack-web-development-bootcamp",
    title: "Complete Full Stack Web Development Bootcamp",
    issuer: "The App Brewery",
    url: "https://www.udemy.com/certificate/UC-444c13cb-7c3e-4f48-bb1d-1813939a3765/",
    date: "July 18, 2025",
    image: {
      src: "/certifications/full-stack-web-development-bootcamp.jpg",
      alt: "Udemy certificate of completion: The Complete Full-Stack Web Development Bootcamp, Prakash Swami",
      width: 1600,
      height: 1190,
    },
    learned: [
      // TODO
      "Building responsive layouts with semantic HTML, modern CSS and Flexbox/Grid",
      "Writing modern JavaScript and manipulating the DOM",
      "Creating back-end servers and REST APIs with Node.js and Express",
      "Designing and querying relational databases with PostgreSQL",
      "Building component-based front-ends with React",
    ],
    skills: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "PostgreSQL", "React", "REST APIs"], // TODO
  },
  {
    slug: "ai-agents-langchain-llm-apps",
    title: "AI Agents: Automation & Business with LangChain & LLM Apps",
    issuer: "Arnold Oberleiter",
    url: "https://www.udemy.com/certificate/UC-9f13ca10-a431-4f09-88a7-2877aeebb3d4/",
    date: "2026", // TODO
    learned: [
      // TODO
      "Building LLM-powered applications with LangChain",
      "Designing effective prompts and structured outputs",
      "Retrieval-augmented generation (RAG) over custom documents",
      "Creating AI agents that use tools and automate multi-step workflows",
      "Applying LLM automation to real business processes",
    ],
    skills: ["LangChain", "LLM Apps", "AI Agents", "RAG", "Prompt Engineering", "Automation"], // TODO
  },
  {
    slug: "job-ready-data-science",
    title: "The Ultimate Job Ready Data Science Course",
    issuer: "CodeWithHarry",
    date: "2025", // TODO
    learned: [
      // TODO
      "Using Python for data analysis",
      "Cleaning and transforming data with NumPy and Pandas",
      "Visualising data with Matplotlib",
      "Foundations of supervised machine learning",
    ],
    skills: ["Python", "NumPy", "Pandas", "Matplotlib", "Supervised Learning"], // TODO
  },
];
