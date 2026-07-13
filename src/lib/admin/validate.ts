/**
 * Structural validation for site_content sections, mirroring the shapes in
 * src/lib/types.ts. Returns an error message, or null when the value is valid.
 * Runs server-side before every write so malformed JSON can never reach the
 * database (the public site would silently fall back to defaults otherwise,
 * but bad rows are still worth rejecting early).
 */

export const SECTION_KEYS = [
  "profile",
  "skills",
  "experience",
  "education",
  "achievements",
  "projects",
  "cv",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

const isStr = (v: unknown): v is string => typeof v === "string";
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function checkRows(
  value: unknown,
  section: string,
  check: (row: Record<string, unknown>) => boolean
): string | null {
  if (!Array.isArray(value)) return `${section} must be a list.`;
  for (let i = 0; i < value.length; i++) {
    const row = value[i];
    if (!isObj(row) || !check(row)) return `${section}: item ${i + 1} has a wrong shape.`;
  }
  return null;
}

export function validateSection(key: SectionKey, value: unknown): string | null {
  switch (key) {
    case "profile": {
      if (!isObj(value)) return "profile must be an object.";
      const strings = [
        "name",
        "role",
        "location",
        "email",
        "phone",
        "githubUsername",
        "githubUrl",
        "instagramUrl",
        "websiteUrl",
        "tagline",
      ];
      for (const field of strings) {
        if (!isStr(value[field])) return `profile.${field} must be text.`;
      }
      if (value.photoUrl !== undefined && !isStr(value.photoUrl))
        return "profile.photoUrl must be text.";
      if (!isStrArr(value.aboutParagraphs)) return "profile.aboutParagraphs must be a list of text.";
      if (
        !Array.isArray(value.stats) ||
        !value.stats.every((s) => isObj(s) && isStr(s.value) && isStr(s.label))
      )
        return "profile.stats must be a list of { value, label }.";
      if (!isStrArr(value.highlightSkills)) return "profile.highlightSkills must be a list of text.";
      return null;
    }
    case "skills":
      return checkRows(value, "skills", (row) => isStr(row.category) && isStrArr(row.items));
    case "experience":
      return checkRows(
        value,
        "experience",
        (row) => isStr(row.period) && isStr(row.title) && isStr(row.description)
      );
    case "education":
      return checkRows(
        value,
        "education",
        (row) =>
          isStr(row.period) &&
          isStr(row.institution) &&
          (row.note === undefined || isStr(row.note))
      );
    case "achievements":
      return checkRows(value, "achievements", (row) => isStr(row.place) && isStr(row.event));
    case "projects":
      return checkRows(
        value,
        "projects",
        (row) =>
          isStr(row.name) &&
          isStr(row.description) &&
          isStrArr(row.tech) &&
          (row.url === undefined || isStr(row.url)) &&
          (row.homepage === undefined || isStr(row.homepage)) &&
          (row.source === "manual" || row.source === "github")
      );
    case "cv": {
      if (!isObj(value)) return "cv must be an object.";
      for (const field of ["fileName", "name", "location"]) {
        if (!isStr(value[field])) return `cv.${field} must be text.`;
      }
      if (!isStrArr(value.contacts)) return "cv.contacts must be a list of text.";
      if (!Array.isArray(value.sections)) return "cv.sections must be a list.";
      for (let i = 0; i < value.sections.length; i++) {
        const section = value.sections[i];
        if (!isObj(section) || !isStr(section.title))
          return `cv: section ${i + 1} has a wrong shape.`;
        if (section.pageBreakBefore !== undefined && typeof section.pageBreakBefore !== "boolean")
          return `cv: section ${i + 1} pageBreakBefore must be true/false.`;
        if (
          section.syncSource !== undefined &&
          ![
            "experience",
            "skills",
            "projects",
            "projectsGithub",
            "achievements",
            "education",
          ].includes(section.syncSource as string)
        )
          return `cv: section ${i + 1} has an invalid sync source.`;
        const entriesError = checkRows(
          section.entries,
          `cv "${section.title}" entries`,
          (row) =>
            isStr(row.title) &&
            (row.titleUrl === undefined || isStr(row.titleUrl)) &&
            (row.text === undefined || isStr(row.text)) &&
            (row.detail === undefined || isStr(row.detail)) &&
            isStrArr(row.bullets)
        );
        if (entriesError) return entriesError;
      }
      return null;
    }
  }
}
