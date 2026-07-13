import type { CvData, CvEntry, CvSection } from "@/lib/types";

/**
 * Turns the CV content into a complete pdflatex document. The template is
 * hardcoded here (same structure as the original hand-written resume.tex);
 * only the content is dynamic. Pure and dependency-free — safe to unit-test
 * and to run in the browser.
 */

/** Escape user content so it can't break (or inject into) the LaTeX source. */
const LATEX_ESCAPES: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  "$": "\\$",
  "#": "\\#",
  "_": "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
  // Typographic characters pdflatex's default encoding chokes on
  "“": "``",
  "”": "''",
  "‘": "`",
  "’": "'",
  "—": "---",
  "–": "--",
  "…": "\\ldots{}",
  " ": "~",
  // Symbols that need TS1/textcomp fonts we don't ship — use math-mode
  // equivalents that live in the always-available Computer Modern set
  "·": "$\\cdot$",
  "•": "$\\bullet$",
  "°": "$^{\\circ}$",
  "±": "$\\pm$",
  "×": "$\\times$",
  "÷": "$\\div$",
  "µ": "$\\mu$",
  "©": "\\copyright{}",
  "§": "\\S{}",
  "¶": "\\P{}",
};

// One regex built from the map, so adding an entry above is all it takes
const ESCAPE_RE = new RegExp(
  "[" + Object.keys(LATEX_ESCAPES).join("").replace(/[\\\]^-]/g, "\\$&") + "]",
  "g"
);

/**
 * Anything else outside ASCII + accented Latin-1 letters (emoji, arrows,
 * pictographs, non-Latin scripts…) has no glyph in Computer Modern and would
 * abort the whole compile — strip it. Synced GitHub descriptions are full of
 * such characters.
 */
const UNTYPESETTABLE = /[^\x20-\x7E\n\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/g;

export function escapeLatex(input: string): string {
  return input
    .replace(ESCAPE_RE, (ch) => LATEX_ESCAPES[ch])
    .replace(UNTYPESETTABLE, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Escape a URL for use inside \url{} / \href{}{} (its first argument). */
function escapeUrl(url: string): string {
  return url.trim().replace(/([%#&])/g, "\\$1");
}

/** Render one contact as a clickable link when it looks like one. */
function contactTex(contact: string): string {
  const trimmed = contact.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return `\\url{${escapeUrl(trimmed)}}`;
  }
  if (trimmed.includes("@") && !trimmed.includes(" ")) {
    return `\\href{mailto:${trimmed}}{${escapeLatex(trimmed)}}`;
  }
  if (/^\+?[\d\s().-]{6,}$/.test(trimmed)) {
    return `\\href{tel:${trimmed.replace(/[^+\d]/g, "")}}{${escapeLatex(trimmed)}}`;
  }
  return escapeLatex(trimmed);
}

/** The bold lead of an entry — underlined too when it links somewhere. */
function titleTex(entry: CvEntry): string {
  const escaped = escapeLatex(entry.title.trim());
  // Underline linked titles so it's visible they redirect (hyperref runs
  // with hidelinks, so links are otherwise indistinguishable from plain text)
  return entry.titleUrl?.trim()
    ? `\\textbf{\\href{${escapeUrl(entry.titleUrl)}}{\\underline{${escaped}}}}`
    : `\\textbf{${escaped}}`;
}

/** Bullets a nested itemize under an entry, or "" when there are none. */
function bulletsTex(entry: CvEntry, indent: string): string {
  const bullets = entry.bullets.map((b) => b.trim()).filter(Boolean);
  if (bullets.length === 0) return "";
  return [
    "",
    `${indent}\\begin{itemize}`,
    ...bullets.map((bullet) => `${indent}  \\item ${escapeLatex(bullet)}`),
    `${indent}\\end{itemize}`,
  ].join("\n");
}

function entryTex(entry: CvEntry): string {
  const parts: string[] = [];
  if (entry.title.trim()) parts.push(titleTex(entry));
  if (entry.text?.trim()) parts.push(escapeLatex(entry.text.trim()));
  let line = `  \\item ${parts.join(" ") || "~"}`;
  if (entry.detail?.trim()) line += ` \\hfill ${escapeLatex(entry.detail.trim())}`;
  return line + bulletsTex(entry, "    ");
}

/**
 * A "plain" section skips the bulleted list: each entry is a paragraph with its
 * bold title (if any) followed by normal text — for prose like a short "About
 * me" or a summary. Nested bullets, if present, still render under the entry.
 */
function plainEntryTex(entry: CvEntry): string {
  const parts: string[] = [];
  if (entry.title.trim()) parts.push(titleTex(entry));
  if (entry.text?.trim()) parts.push(escapeLatex(entry.text.trim()));
  let line = parts.join(" ") || "~";
  if (entry.detail?.trim()) line += ` \\hfill ${escapeLatex(entry.detail.trim())}`;
  return line + bulletsTex(entry, "");
}

function sectionTex(section: CvSection): string {
  const entries = section.entries.filter(
    (entry) => entry.title.trim() || entry.text?.trim() || entry.bullets.some((b) => b.trim())
  );
  if (entries.length === 0) return "";

  const head = [
    ...(section.pageBreakBefore ? ["\\pagebreak", ""] : []),
    `\\section*{${escapeLatex(section.title)}}`,
  ];

  if (section.plain) {
    return [
      ...head,
      // Blank line between entries = separate paragraphs (parskip is loaded)
      entries.map(plainEntryTex).join("\n\n"),
    ].join("\n");
  }

  return [
    ...head,
    "\\begin{itemize}",
    ...entries.map(entryTex),
    "\\end{itemize}",
  ].join("\n");
}

export function buildResumeTex(cv: CvData): string {
  const contacts = cv.contacts
    .map((c) => c.trim())
    .filter(Boolean)
    .map(contactTex)
    .join(" \\quad | \\quad ");

  const sections = cv.sections
    .map(sectionTex)
    .filter(Boolean)
    .join("\n\n");

  return `% ${escapeLatex(cv.name)} — CV (generated from site content)
\\documentclass[11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[a4paper,margin=0.8in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{enumitem}
\\usepackage{parskip}
\\usepackage{titlesec}
\\renewcommand{\\familydefault}{\\rmdefault}
\\setlist[itemize]{noitemsep, topsep=0pt}
% Math-mode bullets: keeps glyphs in the always-available CM fonts (no TS1)
\\renewcommand{\\labelitemi}{$\\bullet$}
\\renewcommand{\\labelitemii}{\\normalfont\\bfseries\\textendash}

\\linespread{1.5}

% Section formatting with line
\\titleformat{\\section}
  {\\large\\bfseries}
  {}{0em}{}[\\titlerule]

\\begin{document}

% Header
\\begin{center}
  {\\LARGE \\textbf{${escapeLatex(cv.name)}}} \\\\[2pt]
  ${escapeLatex(cv.location)}${contacts ? ` \\\\[6pt]\n  ${contacts}` : ""}
\\end{center}

\\vspace{6pt}

${sections}

\\noindent\\rule{\\textwidth}{0.4pt}
\\end{document}
`;
}
