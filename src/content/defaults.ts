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
  cv: {
    fileName: "Nikoloz Tukhashvili - CV.pdf",
    name: "Nikoloz Tukhashvili",
    location: "Rustavi, Kvemo Kartli, Georgia",
    contacts: [
      "nikoloztuxa@gmail.com",
      "+995 599-752-777",
      "https://github.com/tuxa4life",
      "https://tuxa.ge/",
    ],
    sections: [
      {
        title: "Experience",
        syncSource: "experience",
        entries: [
          {
            title: "Independent / Freelance Developer",
            detail: "(ongoing)",
            bullets: [
              "Building tools for automation, building products for clients, and personal projects.",
              "Creating professional business web-pages.",
            ],
          },
          {
            title: "Student / Project Work",
            detail: "(current)",
            bullets: [
              "Coursework and team projects involving complex algorithms, systems design, database management, numerical programming, and robotics prototyping.",
            ],
          },
        ],
      },
      {
        title: "Skills",
        syncSource: "skills",
        entries: [
          {
            title: "Languages:",
            text: "JavaScript (ES6+, React), Java, SQL, Python, C#, Kotlin, C++ (Arduino)",
            bullets: [],
          },
          {
            title: "Web / Backend:",
            text: "React, Node.js, Socket.IO, Express, Supabase, Cheerio, REST APIs",
            bullets: [],
          },
          {
            title: "Hardware / Robotics:",
            text: "Arduino, Raspberry Pi",
            bullets: [],
          },
          {
            title: "Other:",
            text: "Adobe Suite, Canva, Figma, Maya, Blender, Unity",
            bullets: [],
          },
        ],
      },
      {
        title: "Projects",
        syncSource: "projects",
        entries: [
          {
            title: "OpenStreetMap 3D Exporter",
            detail: "(React, Node.js, Three.js)",
            bullets: [
              "A React app that fetches geographic data from OpenStreetMap and generates a 3D map using Three.js based on node information. You can also export the 3D map as a GLTF file.",
            ],
          },
          {
            title: "KIU Drop",
            detail: "(React, Supabase, Stripe, Socket.IO)",
            bullets: [
              "Student-to-student rental/lending platform for campus items; temporary chat via Socket.IO.",
            ],
          },
          {
            title: "What? Where? When?",
            detail: "(React, Node.js, Cheerio, Socket.IO)",
            bullets: [
              "Intellectual game based on the classic TV Show “What? Where? When?”. Built with real-time chat with room customization and other multiplayer features.",
            ],
          },
          {
            title: "Multiplayer Card Game",
            detail: "(React, Node.js, Socket.IO)",
            bullets: [
              "Real-time multiplayer game “Bura” with rooms, turn-based game state sync, custom room management.",
            ],
          },
        ],
      },
      {
        title: "Achievements & Competitions",
        pageBreakBefore: true,
        syncSource: "achievements",
        entries: [
          { title: "1st Place", text: "— UNICO AI Innovation Laboratory Competition, Rustavi", bullets: [] },
          { title: "2nd Place", text: "— Georgian WRO LEGO Robotics Championship", bullets: [] },
          { title: "3rd Place", text: "— Google Developer Group Hackathon", bullets: [] },
          { title: "Top 3", text: "— GITA Innovations Hackathon", bullets: [] },
          { title: "", text: "Participated in multiple other national and university-level hackathons", bullets: [] },
        ],
      },
      {
        title: "Education",
        syncSource: "education",
        entries: [
          {
            title: "Kutaisi International University",
            detail: "2023 - Present",
            bullets: [
              "tukhashvili.nikoloz@kiu.edu.ge",
              "Student assistant in the “Fundamentals of Programming” and “Introduction to Informatics” courses.",
            ],
          },
          {
            title: "IT Step Academy",
            detail: "2019 - 2021",
            bullets: ["Winner of the IT Step Hackathon."],
          },
          {
            title: "Rustavi's Gimnazium",
            detail: "2011 - 2023",
            bullets: [],
          },
        ],
      },
    ],
  },
};
