export interface Stat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  githubUsername: string;
  githubUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  tagline: string;
  aboutParagraphs: string[];
  stats: Stat[];
  /** Skills shown as small chips on the bento card */
  highlightSkills: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  period: string;
  title: string;
  description: string;
}

export interface EducationItem {
  period: string;
  institution: string;
  note?: string;
}

export interface Achievement {
  place: string;
  event: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  homepage?: string;
  stars?: number;
  source: "github" | "manual";
}

export interface SiteContent {
  profile: Profile;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  education: EducationItem[];
  achievements: Achievement[];
  /** Manual projects, used as fallback when GitHub is unavailable */
  projects: Project[];
}
