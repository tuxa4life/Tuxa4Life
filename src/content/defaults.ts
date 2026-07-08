import type { SiteContent } from "@/lib/types";

/**
 * Default site content sourced from the CV. Acts as the fallback when
 * Supabase is not configured or unreachable, so the site always renders.
 */
export const defaultContent: SiteContent = {
  profile: {
    name: "Nikoloz Tukhashvili",
    role: "Software & Web Developer",
    location: "Rustavi, Georgia",
    email: "nikoloztuxa@gmail.com",
    phone: "+995 599 752 777",
    githubUsername: "tuxa4life",
    githubUrl: "https://github.com/tuxa4life",
    instagramUrl: "https://www.instagram.com/n.tukh_",
    websiteUrl: "https://tuxa.ge",
    tagline:
      "I build clean, fast, human interfaces — with care for motion, clarity, and the small details that make a product feel alive.",
    aboutParagraphs: [
      "I'm a software & web developer focused on building clean, fast, human interfaces. I care about motion, clarity, and the small details that make a product feel alive — the kind of experience that feels free and comfortable to move through.",
      "Currently studying at Kutaisi International University and freelancing — building automation tools, business web pages, and products for clients, while always chasing the next idea worth prototyping.",
    ],
    stats: [
      { value: "3+", label: "years building" },
      { value: "12+", label: "shipped projects" },
    ],
    highlightSkills: ["React", "TypeScript", "Node"],
  },
  skills: [
    {
      category: "Languages",
      items: ["JavaScript (ES6+)", "TypeScript", "Java", "SQL", "Python", "C#", "Kotlin", "C++ (Arduino)"],
    },
    {
      category: "Web & Backend",
      items: ["React", "Next.js", "Node.js", "Express", "Socket.IO", "Supabase", "Cheerio", "REST APIs"],
    },
    {
      category: "Hardware & Robotics",
      items: ["Arduino", "Raspberry Pi"],
    },
    {
      category: "Other",
      items: ["Adobe Suite", "Canva", "Figma", "Maya", "Blender", "Unity"],
    },
  ],
  experience: [
    {
      period: "Ongoing",
      title: "Independent / Freelance Developer",
      description:
        "Building tools for automation, products for clients, and personal projects. Creating professional business web pages.",
    },
    {
      period: "Current",
      title: "Student Assistant · Kutaisi International University",
      description:
        "Assisting in the “Fundamentals of Programming” and “Introduction to Informatics” courses.",
    },
    {
      period: "Current",
      title: "Student / Project Work",
      description:
        "Coursework and team projects involving complex algorithms, systems design, database management, numerical programming, and robotics prototyping.",
    },
  ],
  education: [
    {
      period: "2023 — Present",
      institution: "Kutaisi International University",
      note: "Student assistant in programming courses",
    },
    {
      period: "2019 — 2021",
      institution: "IT Step Academy",
      note: "Winner of the IT Step Hackathon",
    },
    {
      period: "2011 — 2023",
      institution: "Rustavi's Gimnazium",
    },
  ],
  achievements: [
    { place: "1st Place", event: "UNICO AI Innovation Laboratory Competition, Rustavi" },
    { place: "2nd Place", event: "Georgian WRO LEGO Robotics Championship" },
    { place: "3rd Place", event: "Google Developer Group Hackathon" },
    { place: "Top 3", event: "GITA Innovations Hackathon" },
  ],
  projects: [
    {
      name: "OpenStreetMap 3D Exporter",
      description:
        "Fetches geographic data from OpenStreetMap and generates a 3D map with Three.js — exportable as a GLTF file.",
      tech: ["React", "Node.js", "Three.js"],
      source: "manual",
    },
    {
      name: "KIU Drop",
      description:
        "Student-to-student rental and lending platform for campus items, with temporary chat via Socket.IO.",
      tech: ["React", "Supabase", "Stripe", "Socket.IO"],
      source: "manual",
    },
    {
      name: "What? Where? When?",
      description:
        "Intellectual game based on the classic TV show, with real-time chat, room customization and multiplayer features.",
      tech: ["React", "Node.js", "Cheerio", "Socket.IO"],
      source: "manual",
    },
    {
      name: "Multiplayer Card Game",
      description:
        "Real-time multiplayer “Bura” with rooms, turn-based game state sync and custom room management.",
      tech: ["React", "Node.js", "Socket.IO"],
      source: "manual",
    },
  ],
};
