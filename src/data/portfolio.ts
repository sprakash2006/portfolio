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
  "I'm a Full-Stack Developer and Computer Engineering student at VIT Pune, building scalable web applications with React.js, Next.js, Node.js, Express.js and PostgreSQL.",
  "I design REST APIs, integrate authentication, and ship AI/LLM-powered features using LangChain and RAG. I have a strong foundation in data structures, algorithms and OOP, with 400+ problems solved on LeetCode.",
  "Outside of code you'll find me watching movies, playing cricket, listening to rap or exploring new tech. I speak English, Hindi, Marathi and Kannada.",
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
  metrics?: { value: string; label: string }[];
  points: string[];
  tech?: string[];
};

export const experience: Experience[] = [
  {
    role: "Web Developer Intern",
    org: "Career Craftly · Project: The GP Edge",
    period: "May 2026 — Present",
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
  screenshots: { src: string; alt: string }[]; // put images in /public/projects/<slug>/; empty shows placeholders
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
    screenshots: [],
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
    screenshots: [],
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
    screenshots: [],
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
    screenshots: [],
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
    screenshots: [],
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
    screenshots: [],
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
    screenshots: [],
  },
];

export const certifications: { title: string; issuer: string; url?: string }[] = [
  {
    title: "Complete Full Stack Web Development Bootcamp",
    issuer: "The App Brewery",
    url: "https://www.udemy.com/certificate/UC-444c13cb-7c3e-4f48-bb1d-1813939a3765/",
  },
  {
    title: "AI Agents: Automation & Business with LangChain & LLM Apps",
    issuer: "Arnold Oberleiter",
    url: "https://www.udemy.com/certificate/UC-9f13ca10-a431-4f09-88a7-2877aeebb3d4/",
  },
  { title: "The Ultimate Job Ready Data Science Course", issuer: "CodeWithHarry" },
];

export const achievements = [
  "Solved 400+ data structures & algorithms problems on LeetCode.",
  "Finalist in CanHack International and 4 national-level hackathons.",
  "Led development of the official ICON club website, coordinating the web team and event updates.",
];
