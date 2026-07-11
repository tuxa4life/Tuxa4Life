import { stripMarkup } from "@/lib/markup";
import type { CvEntry, CvSyncSource, Project, SiteContent } from "@/lib/types";

/**
 * Projects a website content category into CV entries, so a single edit on the
 * site can flow into the résumé. Website fields use markdown-lite; it's stripped
 * to plain text here since the CV template renders LaTeX, not markup.
 *
 * Pure and dependency-light — the admin's per-section "Sync from site" action
 * calls this to replace a section's entries.
 */

const bulletFrom = (text: string): string[] => {
  const plain = stripMarkup(text);
  return plain ? [plain] : [];
};

/** name → CV entry: languages/tools as the detail, repo URL clickable on the title. */
const projectEntry = (project: Project): CvEntry => ({
  title: project.name,
  titleUrl: project.url || undefined,
  detail: project.tech.length ? `(${project.tech.join(", ")})` : undefined,
  bullets: bulletFrom(project.description),
});

/** Human label for each source, used in the section's source picker. */
export const SYNC_SOURCE_LABELS: Record<CvSyncSource, string> = {
  experience: "Experience",
  skills: "Skills",
  projects: "Projects (manual list)",
  projectsGithub: "Projects (live GitHub)",
  achievements: "Achievements",
  education: "Education",
};

export function entriesFromSite(
  source: CvSyncSource,
  content: SiteContent,
  githubProjects: Project[] = []
): CvEntry[] {
  switch (source) {
    case "experience":
      return content.experience.map((item) => ({
        title: item.title,
        detail: item.period || undefined,
        bullets: bulletFrom(item.description),
      }));
    case "skills":
      return content.skills.map((group) => ({
        title: group.category ? `${group.category}:` : "",
        text: group.items.join(", ") || undefined,
        bullets: [],
      }));
    case "projects":
      // The manually-curated fallback list (source "manual"), not live GitHub repos
      return content.projects.filter((project) => project.source !== "github").map(projectEntry);
    case "projectsGithub":
      // The live repos fetched from the GitHub API (pinned, or top public repos)
      return githubProjects.map(projectEntry);
    case "achievements":
      return content.achievements.map((item) => ({
        title: item.place,
        text: item.event ? `— ${item.event}` : undefined,
        bullets: [],
      }));
    case "education":
      return content.education.map((item) => ({
        title: item.institution,
        detail: item.period || undefined,
        bullets: item.note ? bulletFrom(item.note) : [],
      }));
  }
}
