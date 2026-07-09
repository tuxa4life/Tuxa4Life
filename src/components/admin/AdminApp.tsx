"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, SiteContent } from "@/lib/types";
import { defaultContent } from "@/content/defaults";
import { logout, saveSection } from "@/lib/admin/actions";
import type { SectionKey } from "@/lib/admin/validate";
import { useTheme } from "@/components/admin/useTheme";
import DotField from "@/components/DotField";
import {
  AchievementsEditor,
  EducationEditor,
  ExperienceEditor,
  ProfileEditor,
  ProjectsEditor,
  SkillsEditor,
} from "@/components/admin/editors";
import StatusPanel from "@/components/admin/StatusPanel";
import {
  ActivityIcon,
  BriefcaseIcon,
  CheckIcon,
  CodeIcon,
  FileIcon,
  LayersIcon,
  LogoutIcon,
  MoonIcon,
  RotateIcon,
  StarIcon,
  SunIcon,
  UserIcon,
} from "@/components/icons";

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

/** Content sections plus the env-var status view (which has no save bar) */
type NavKey = SectionKey | "status";

const SECTIONS: { key: SectionKey; title: string; hint: string; icon: React.ReactNode }[] = [
  { key: "profile", title: "Profile", hint: "Name, links, about", icon: <UserIcon /> },
  { key: "skills", title: "Skills", hint: "Grouped skill chips", icon: <CodeIcon /> },
  { key: "experience", title: "Experience", hint: "The path so far", icon: <BriefcaseIcon /> },
  { key: "education", title: "Education", hint: "Schools & courses", icon: <FileIcon /> },
  { key: "achievements", title: "Achievements", hint: "Places & events", icon: <StarIcon size={19} /> },
  { key: "projects", title: "Projects", hint: "GitHub + fallback", icon: <LayersIcon /> },
];

export default function AdminApp({
  initialContent,
  githubPreview,
}: {
  initialContent: SiteContent;
  githubPreview: Project[];
}) {
  const { dark, toggleDark } = useTheme();
  const router = useRouter();

  const [content, setContent] = useState<SiteContent>(initialContent);
  const [active, setActive] = useState<NavKey>("profile");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Last-saved snapshots for dirty tracking, keyed by section
  const [snapshots, setSnapshots] = useState<Record<SectionKey, string>>(() => {
    const initial = {} as Record<SectionKey, string>;
    for (const section of SECTIONS) initial[section.key] = JSON.stringify(initialContent[section.key]);
    return initial;
  });

  const dirty = useMemo(() => {
    const map = {} as Record<SectionKey, boolean>;
    for (const section of SECTIONS)
      map[section.key] = JSON.stringify(content[section.key]) !== snapshots[section.key];
    return map;
  }, [content, snapshots]);
  const anyDirty = Object.values(dirty).some(Boolean);

  // Warn before leaving the page with unsaved edits
  useEffect(() => {
    if (!anyDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [anyDirty]);

  const savedTimer = useRef<number | null>(null);
  const setSection = useCallback(
    <K extends SectionKey>(key: K, value: SiteContent[K]) =>
      setContent((prev) => ({ ...prev, [key]: value })),
    []
  );

  const save = useCallback(async () => {
    if (active === "status") return;
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setStatus({ kind: "saving" });
    const result = await saveSection(active, content[active]);
    if (result.ok) {
      setSnapshots((prev) => ({ ...prev, [active]: JSON.stringify(content[active]) }));
      setStatus({ kind: "saved" });
      savedTimer.current = window.setTimeout(() => setStatus({ kind: "idle" }), 2500);
    } else {
      setStatus({ kind: "error", message: result.error ?? "Something went wrong." });
    }
  }, [active, content]);

  const resetToDefaults = useCallback(() => {
    if (active === "status") return;
    setSection(active, structuredClone(defaultContent[active]));
    setStatus({ kind: "idle" });
  }, [active, setSection]);

  const handleLogout = useCallback(async () => {
    if (anyDirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    await logout();
    router.refresh();
  }, [anyDirty, router]);

  const activeTitle =
    active === "status" ? "Status" : SECTIONS.find((section) => section.key === active)!.title;

  return (
    <div className="relative min-h-dvh overflow-x-clip lg:h-dvh lg:overflow-hidden">
      <DotField dark={dark} />

      {/* Ghost heading, same voice as the homepage name */}
      <div className="absolute top-[34px] left-6 z-[4] select-none lg:left-11">
        <div className="font-display ghost-text pointer-events-none text-[32px] leading-[.98] font-bold tracking-[-.03em] lg:text-[40px]">
          Admin
        </div>
        <div className="mt-3.5 text-[13px] text-muted">Content editor</div>
      </div>

      {/* Logout, top right */}
      <button
        onClick={handleLogout}
        title="Log out"
        className="glass absolute top-[38px] right-6 z-[6] flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-[14px] text-fg transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[3px] hover:scale-[1.04] lg:right-11"
      >
        <LogoutIcon />
      </button>

      {/* Editor board */}
      <div className="relative z-[3] flex min-h-dvh items-start justify-center px-4 pt-40 pb-24 lg:h-full lg:items-center lg:px-11 lg:pt-[118px] lg:pb-[96px]">
        <div className="glass expanded flex h-full max-h-[820px] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] lg:flex-row">
          {/* Section nav: horizontal chips on mobile, left rail on desktop */}
          <nav className="slim-scroll flex shrink-0 gap-2 overflow-x-auto border-b border-brd2 p-4 lg:w-60 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-b-0 lg:p-5">
            {SECTIONS.map((section) => {
              const isActive = section.key === active;
              return (
                <button
                  key={section.key}
                  onClick={() => setActive(section.key)}
                  className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-left transition-colors duration-200 ${
                    isActive ? "bg-chip text-fg" : "text-muted hover:bg-chip/60 hover:text-fg"
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]">
                    {section.icon}
                  </span>
                  <span className="lg:flex-1">
                    <span className="block text-sm font-semibold whitespace-nowrap">
                      {section.title}
                    </span>
                    <span className="hidden text-[11px] text-muted lg:block">{section.hint}</span>
                  </span>
                  {dirty[section.key] && (
                    <span
                      title="Unsaved changes"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                    />
                  )}
                </button>
              );
            })}

            <div className="my-1 hidden border-t border-brd2 lg:block" />
            <button
              onClick={() => setActive("status")}
              className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-left transition-colors duration-200 ${
                active === "status" ? "bg-chip text-fg" : "text-muted hover:bg-chip/60 hover:text-fg"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]">
                <ActivityIcon />
              </span>
              <span className="lg:flex-1">
                <span className="block text-sm font-semibold whitespace-nowrap">Status</span>
                <span className="hidden text-[11px] text-muted lg:block">Env & connections</span>
              </span>
            </button>
          </nav>

          {/* Active editor */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="slim-scroll min-h-0 flex-1 overflow-y-auto p-6 lg:p-8">
              <div className="text-[13px] uppercase tracking-[.14em] text-muted">
                {active === "status" ? "System" : "Edit section"}
              </div>
              <h2 className="font-display mt-2 mb-6 text-[28px] font-bold tracking-[-.02em]">
                {activeTitle}
              </h2>

              {active === "status" && <StatusPanel />}
              {active === "profile" && (
                <ProfileEditor value={content.profile} onChange={(next) => setSection("profile", next)} />
              )}
              {active === "skills" && (
                <SkillsEditor value={content.skills} onChange={(next) => setSection("skills", next)} />
              )}
              {active === "experience" && (
                <ExperienceEditor value={content.experience} onChange={(next) => setSection("experience", next)} />
              )}
              {active === "education" && (
                <EducationEditor value={content.education} onChange={(next) => setSection("education", next)} />
              )}
              {active === "achievements" && (
                <AchievementsEditor value={content.achievements} onChange={(next) => setSection("achievements", next)} />
              )}
              {active === "projects" && (
                <ProjectsEditor
                  value={content.projects}
                  onChange={(next) => setSection("projects", next)}
                  githubPreview={githubPreview}
                />
              )}
            </div>

            {/* Save bar (the status view has nothing to save) */}
            {active !== "status" && (
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-brd2 px-6 py-4 lg:px-8">
              <button
                onClick={resetToDefaults}
                title="Fill this section with the built-in defaults (you still need to Save)"
                className="flex cursor-pointer items-center gap-2 rounded-[9px] border border-brd2 bg-chip px-4 py-2 text-[13px] font-medium text-fg transition-colors duration-300 hover:bg-brd2"
              >
                <RotateIcon />
                Reset to defaults
              </button>

              <div className="flex items-center gap-3.5">
                <span
                  className={`text-[13px] transition-opacity duration-300 ${
                    status.kind === "idle" && !dirty[active] ? "opacity-0" : "opacity-100"
                  } ${status.kind === "error" ? "text-red-500" : "text-muted"}`}
                >
                  {status.kind === "error"
                    ? status.message
                    : status.kind === "saving"
                      ? "Saving…"
                      : status.kind === "saved"
                        ? "Saved — site updated"
                        : dirty[active]
                          ? "Unsaved changes"
                          : ""}
                </span>
                <button
                  onClick={save}
                  disabled={status.kind === "saving" || !dirty[active]}
                  className="flex cursor-pointer items-center gap-2 rounded-[14px] bg-fg px-6 py-[11px] text-sm font-semibold text-paper transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[2px] disabled:translate-y-0 disabled:cursor-default disabled:opacity-40"
                >
                  {status.kind === "saved" ? <CheckIcon /> : null}
                  {status.kind === "saving" ? "Saving…" : status.kind === "saved" ? "Saved" : "Save"}
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleDark}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="glass fixed right-6 bottom-6 z-[6] flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-[14px] text-fg transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[3px] hover:scale-[1.04] lg:absolute lg:right-11 lg:bottom-[38px]"
      >
        {dark ? <SunIcon size={19} /> : <MoonIcon />}
      </button>
    </div>
  );
}
