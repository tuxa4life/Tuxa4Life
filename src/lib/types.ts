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
  /**
   * Public URL of the profile photo. Shown grayscale as the About card's
   * background and full-colour in the About panel. Uploaded from the admin
   * to Supabase Storage; optional so pre-existing content rows still validate,
   * with the UI falling back to the bundled /profile.jpg.
   */
  photoUrl?: string;
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

export interface CvEntry {
  /** Bold lead text — a job title, institution, "Languages:", "1st Place"… May be empty for a plain line. */
  title: string;
  /** When set, the title renders as a clickable link (e.g. a GitHub repo URL) */
  titleUrl?: string;
  /** Text following the title on the same line, e.g. "— UNICO AI Innovation Laboratory Competition" */
  text?: string;
  /** Right-aligned detail on the same line (date range, tech list), e.g. "2023 - Present" */
  detail?: string;
  /** Indented bullet lines under the entry */
  bullets: string[];
}

/** Website content categories a CV section can be auto-filled from */
export type CvSyncSource =
  | "experience"
  | "skills"
  | "projects"
  | "projectsGithub"
  | "achievements"
  | "education";

export interface CvSection {
  title: string;
  /** Start this section on a new page of the PDF */
  pageBreakBefore?: boolean;
  /**
   * Render entries as plain paragraphs (bold title + text, no bullet points)
   * instead of a bulleted list — for prose like a short "About me" or summary.
   */
  plain?: boolean;
  /**
   * When set, the admin's "Sync from site" action rebuilds this section's
   * entries from the matching website content. Unset = fully manual.
   */
  syncSource?: CvSyncSource;
  entries: CvEntry[];
}

/**
 * The CV is its own document, independent of the site sections: edited in the
 * admin panel and compiled to PDF in the visitor's browser. Sections are fully
 * dynamic — add, rename, reorder or remove any of them.
 */
export interface CvData {
  /** Download file name, e.g. "Nikoloz Tukhashvili - CV.pdf" */
  fileName: string;
  name: string;
  location: string;
  /** Contact line under the header; emails, phone numbers and URLs are auto-linked */
  contacts: string[];
  sections: CvSection[];
}

export interface SiteContent {
  profile: Profile;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  education: EducationItem[];
  achievements: Achievement[];
  /** Manual projects, used as fallback when GitHub is unavailable */
  projects: Project[];
  /** Résumé content, compiled to PDF on demand */
  cv: CvData;
}
