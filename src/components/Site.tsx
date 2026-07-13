"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project, SiteContent } from "@/lib/types";
import { stripMarkup } from "@/lib/markup";
import DotField from "@/components/DotField";
import {
  AboutPanel,
  ContactPanel,
  ExperiencePanel,
  ProjectsPanel,
  ResumePanel,
  SkillsPanel,
} from "@/components/panels";
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  CodeIcon,
  FileIcon,
  GithubIcon,
  LayersIcon,
  MailIcon,
  MapPinIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@/components/icons";

type SectionKey = "about" | "skills" | "projects" | "experience" | "contact" | "resume";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const morph = { duration: 0.55, ease: EASE };

// When a section is expanded, the other five shrink into a left-hand rail of
// square tiles — one per row of the 5-row grid, so together they span the
// full board height.
const MINI_ROW = [
  "lg:row-start-1",
  "lg:row-start-2",
  "lg:row-start-3",
  "lg:row-start-4",
  "lg:row-start-5",
];

function ChipIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-chip text-fg">
      {children}
    </div>
  );
}

function CardTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <div className="font-display text-lg font-semibold tracking-[-.01em]">{title}</div>
      <div className="mt-0.5 text-xs text-muted">{subtitle}</div>
    </div>
  );
}

export default function Site({
  content,
  projects,
}: {
  content: SiteContent;
  projects: Project[];
}) {
  const { profile } = content;
  const [dark, setDark] = useState(false);
  const [selected, setSelected] = useState<SectionKey | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  // Desktop rail: icon-only by default, expands leftward over the panel on
  // hover. Collapse is delayed slightly so crossing the gaps between rail
  // items doesn't flicker. The expansion cascade radiates outward from the
  // tile the mouse entered on (railOrigin); it's locked while the rail is
  // open so moving between tiles doesn't reshuffle mid-animation.
  const [railHover, setRailHover] = useState(false);
  const [railOrigin, setRailOrigin] = useState(0);
  const railHoverRef = useRef(false);
  const railTimer = useRef<number | null>(null);
  const railEnter = useCallback((origin: number) => {
    if (railTimer.current) clearTimeout(railTimer.current);
    if (!railHoverRef.current) setRailOrigin(origin);
    railHoverRef.current = true;
    setRailHover(true);
  }, []);
  const railLeave = useCallback(() => {
    if (railTimer.current) clearTimeout(railTimer.current);
    railTimer.current = window.setTimeout(() => {
      railHoverRef.current = false;
      setRailHover(false);
    }, 180);
  }, []);

  // width:max-content can't be transitioned cross-browser, so rail widths are
  // animated to measured pixel values instead: collapsed = tile height
  // (square), expanded = content width. The content is measured by briefly
  // setting width:max-content within the same layout pass (scrollWidth can't
  // be used — flex-row-reverse overflows leftward, which it doesn't count).
  const tileRefs = useRef(new Map<SectionKey, HTMLDivElement>());
  useLayoutEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 64rem)").matches;
    tileRefs.current.forEach((el, key) => {
      const isMini = !!selected && selected !== key;
      if (!isDesktop || !isMini) {
        el.style.width = "";
        return;
      }
      if (railHover) {
        const from = el.style.width;
        // aspect-ratio:1 transfers through the definite height and hijacks
        // max-content resolution, so drop it while measuring
        el.style.aspectRatio = "auto";
        el.style.width = "max-content";
        const target = el.offsetWidth;
        el.style.width = from;
        el.style.aspectRatio = "";
        void el.offsetWidth; // reflow so the transition starts from here
        el.style.width = `${target}px`;
      } else {
        el.style.width = `${el.offsetHeight}px`;
      }
    });
  }, [railHover, selected]);

  // Sync with the theme applied pre-paint by the inline script in layout.tsx
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.dataset.theme = next ? "dark" : "";
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Never leave the rail stuck open after a section closes
  useEffect(() => {
    if (!selected) {
      railHoverRef.current = false;
      setRailHover(false);
    }
  }, [selected]);

  const sections: {
    key: SectionKey;
    title: string;
    icon: React.ReactNode;
    gridClass: string;
    body: React.ReactNode;
    panel: React.ReactNode;
  }[] = [
    {
      key: "about",
      title: "About",
      icon: <UserIcon />,
      gridClass: "lg:col-start-1 lg:row-start-1",
      panel: <AboutPanel content={content} />,
      body: (
        <div className="relative h-full">
          {/* Grayscale photo fills the card, inset 2px so the card border shows */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.photoUrl || "/profile.jpg"}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] rounded-[22px] object-cover object-top opacity-90 [filter:grayscale(1)]"
          />
          <div className="relative flex h-full flex-col justify-end p-5">
            <div className="font-display text-lg font-semibold tracking-[-.01em] text-white">
              About
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "skills",
      title: "Skills",
      icon: <CodeIcon />,
      gridClass: "lg:col-span-2 lg:col-start-2 lg:row-start-1",
      panel: <SkillsPanel content={content} />,
      body: (
        <div className="flex h-full flex-col justify-between gap-5 p-[22px] lg:gap-0">
          <ChipIcon><CodeIcon /></ChipIcon>
          <CardTitle title="Skills" subtitle="The tools I build with" />
        </div>
      ),
    },
    {
      key: "projects",
      title: "Projects",
      icon: <LayersIcon />,
      gridClass: "sm:col-span-2 lg:col-span-1 lg:col-start-4 lg:row-span-3 lg:row-start-1",
      panel: <ProjectsPanel projects={projects} githubUrl={profile.githubUrl} />,
      body: (
        <div className="flex h-full flex-col justify-between gap-5 p-[22px] lg:gap-0">
          <ChipIcon><LayersIcon /></ChipIcon>
          <div className="flex flex-col gap-[11px]">
            {projects.slice(0, 3).map((project) => (
              <div key={project.name} className="border-t border-brd2 pt-2.5">
                <div className="truncate text-[13px] font-semibold">{project.name}</div>
                <div className="truncate text-[11px] text-muted">
                  {stripMarkup(project.description) || project.tech.join(" · ")}
                </div>
              </div>
            ))}
          </div>
          <CardTitle title="Projects" subtitle="Things I've made" />
        </div>
      ),
    },
    {
      key: "experience",
      title: "Experience",
      icon: <BriefcaseIcon />,
      gridClass: "sm:col-span-2 lg:col-span-3 lg:col-start-1 lg:row-start-2",
      panel: <ExperiencePanel content={content} />,
      body: (
        <div className="flex h-full flex-row items-center justify-between p-[22px]">
          <div className="flex flex-col gap-2">
            <ChipIcon><BriefcaseIcon /></ChipIcon>
            <CardTitle title="Experience" subtitle="The path so far" />
          </div>
          <div className="flex items-end gap-[26px]">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="text-right">
                <div className="font-display text-2xl font-semibold">{stat.value}</div>
                <div className="text-[11px] text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      title: "Contact",
      icon: <MailIcon />,
      gridClass: "lg:col-span-2 lg:col-start-1 lg:row-start-3",
      panel: <ContactPanel content={content} />,
      body: (
        <div className="flex h-full flex-row items-center justify-between p-5">
          <div className="flex items-center gap-[13px]">
            <ChipIcon><MailIcon /></ChipIcon>
            <CardTitle title="Contact" subtitle={profile.email} />
          </div>
          <ArrowUpRightIcon size={21} className="opacity-50" />
        </div>
      ),
    },
    {
      key: "resume",
      title: "Résumé",
      icon: <FileIcon />,
      gridClass: "lg:col-start-3 lg:row-start-3",
      panel: <ResumePanel cv={content.cv} />,
      body: (
        <div className="flex h-full flex-col justify-between gap-5 p-5 lg:gap-0">
          <ChipIcon><FileIcon /></ChipIcon>
          <CardTitle title="Résumé" subtitle="Download CV" />
        </div>
      ),
    },
  ];

  const others = sections.filter((s) => s.key !== selected).map((s) => s.key);

  return (
    <div className="relative min-h-dvh overflow-x-clip lg:h-dvh lg:overflow-hidden">
      <DotField dark={dark} />

      {/* Ghost name + location, top left */}
      <div className="absolute top-[34px] left-6 z-[4] select-none lg:left-11">
        <div className="font-display ghost-text pointer-events-none text-[32px] leading-[.98] font-bold tracking-[-.03em] lg:text-[40px]">
          {profile.name.split(" ").map((part) => (
            <span key={part}>
              {part}
              <br />
            </span>
          ))}
        </div>
        <div className="mt-3.5 flex items-center gap-1.5 text-[13px] text-muted">
          <MapPinIcon size={14} />
          {profile.location}
        </div>
      </div>

      {/* Social links, top right. Hovering a button pops its handle in a
          small pill underneath — centered under the button, nudged left when
          it would poke past the screen edge (long email addresses). */}
      <div className="absolute top-[38px] right-6 z-[6] flex gap-3 lg:right-11">
        {[
          {
            href: profile.githubUrl,
            title: "GitHub",
            hint: profile.githubUrl.replace(/\/+$/, "").split("/").pop(),
            icon: <GithubIcon />,
          },
          {
            href: `mailto:${profile.email}`,
            title: "Email",
            hint: profile.email,
            icon: <MailIcon size={21} />,
          },
        ].map((link) => (
          <div
            key={link.title}
            className="relative"
            onMouseEnter={() => setHint(link.title)}
            onMouseLeave={() => setHint(null)}
          >
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={link.title}
              className="glass flex h-[46px] w-[46px] items-center justify-center rounded-[14px] text-fg transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[3px] hover:scale-[1.04]"
            >
              {link.icon}
            </a>
            <AnimatePresence>
              {hint === link.title && (
                <motion.div
                  // Center under the 46px button (offsetWidth ignores the
                  // in-flight scale, unlike getBoundingClientRect), clamped
                  // so the pill stays 12px inside the viewport
                  ref={(el: HTMLDivElement | null) => {
                    if (!el) return;
                    const btn = el.parentElement!.getBoundingClientRect();
                    const centered = (btn.width - el.offsetWidth) / 2;
                    const overflow =
                      btn.left + centered + el.offsetWidth - (window.innerWidth - 12);
                    el.style.left = `${centered - Math.max(0, overflow)}px`;
                  }}
                  initial={{ opacity: 0, scale: 0.4, y: -9 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -7, transition: { duration: 0.18, ease: EASE } }}
                  transition={{ type: "spring", stiffness: 520, damping: 21, mass: 0.8 }}
                  className="glass pointer-events-none absolute top-full origin-top rounded-[9px] px-2.5 py-1 text-[11px] whitespace-nowrap text-muted"
                  style={{ marginTop: 8 }}
                >
                  {link.hint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Bento board */}
      <div className="relative z-[3] flex min-h-dvh items-start justify-center px-4 pt-40 pb-24 lg:h-full lg:items-center lg:px-11 lg:pt-[118px]">
        <div className="relative w-full max-w-xl lg:w-[min(680px,92vw)] lg:max-w-none lg:aspect-[5/3] lg:max-h-full">
          {/* Invisible hover zone for the rail: covers the tiles AND the gaps
              between them, so the rail stays open anywhere inside the column.
              While open it extends left over the flyout labels too. */}
          {selected && (
            <div
              className="absolute inset-y-0 z-10 hidden lg:block"
              style={{
                left: railHover ? -96 : 0,
                width: railHover ? 168 : 72,
              }}
              onMouseEnter={(e) => {
                // Map the entry point to one of the 5 rail rows so the
                // cascade radiates from the tile under the cursor
                const rect = e.currentTarget.getBoundingClientRect();
                const row = Math.floor(
                  ((e.clientY - rect.top) / rect.height) * others.length,
                );
                railEnter(Math.min(others.length - 1, Math.max(0, row)));
              }}
              onMouseLeave={railLeave}
            />
          )}
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:h-full ${
              selected
                ? "lg:grid-cols-[auto_minmax(0,1fr)] lg:grid-rows-5"
                : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)] lg:grid-rows-3"
            }`}
          >
            {sections.map((section) => {
              const mode = !selected
                ? "grid"
                : selected === section.key
                  ? "expanded"
                  : "mini";
              const miniIndex = others.indexOf(section.key);

              // Cascade: expansion radiates outward from the hovered tile;
              // collapse retracts back toward it (farthest tiles first)
              const originDist = Math.abs(miniIndex - railOrigin);
              const maxDist = Math.max(railOrigin, others.length - 1 - railOrigin);
              const cascadeDelay = `${(railHover ? originDist : maxDist - originDist) * 70}ms`;

              const wrapperClass =
                mode === "grid"
                  ? `${section.gridClass} transition-transform duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1.5`
                  : mode === "expanded"
                    ? "sm:col-span-2 lg:col-start-2 lg:row-span-5 lg:row-start-1"
                    : `relative sm:col-span-1 lg:col-start-1 lg:aspect-square lg:h-full ${MINI_ROW[miniIndex]}`;

              return (
                <div
                  key={section.key}
                  className={wrapperClass}
                  onClick={mode === "expanded" ? undefined : () => setSelected(section.key)}
                  onMouseEnter={mode === "mini" ? () => railEnter(miniIndex) : undefined}
                  onMouseLeave={mode === "mini" ? railLeave : undefined}
                >
                  <motion.div
                    layout
                    // FLIP only when the selection changes; the rail's hover
                    // width is a plain CSS transition (no transform distortion)
                    layoutDependency={selected}
                    transition={morph}
                    ref={(el: HTMLDivElement | null) => {
                      if (el) tileRefs.current.set(section.key, el);
                      else tileRefs.current.delete(section.key);
                    }}
                    style={{
                      borderRadius: mode === "mini" ? 16 : 24,
                      transitionDelay: mode === "mini" ? cascadeDelay : undefined,
                    }}
                    className={
                      mode === "expanded"
                        ? "glass expanded h-full overflow-hidden rounded-[24px]"
                        : mode === "grid"
                          ? "glass h-full overflow-hidden rounded-[24px] min-h-[150px] cursor-pointer lg:min-h-0"
                          : `mini-tile h-full cursor-pointer overflow-hidden ${
                              railHover ? "rail-open" : ""
                            }`
                    }
                  >
                    {mode === "grid" && (
                      <motion.div
                        key="grid"
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.15 } }}
                        className="h-full"
                      >
                        {section.body}
                      </motion.div>
                    )}

                    {mode === "mini" && (
                      <motion.div
                        key="mini"
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.15 } }}
                        className="flex h-full items-center gap-3 px-4 py-3 lg:flex-row-reverse lg:gap-0 lg:p-0"
                      >
                        <div className="flex shrink-0 items-center justify-center [&_svg]:h-6 [&_svg]:w-6 lg:aspect-square lg:h-full lg:[&_svg]:h-[26px] lg:[&_svg]:w-[26px]">
                          {section.icon}
                        </div>
                        <span
                          className={`font-display text-sm font-semibold tracking-[-.01em] whitespace-nowrap transition-opacity duration-200 lg:pl-5 ${
                            railHover ? "opacity-100" : "lg:opacity-0"
                          }`}
                          style={{ transitionDelay: cascadeDelay }}
                        >
                          {section.title}
                        </span>
                      </motion.div>
                    )}

                    {mode === "expanded" && (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
                        className="relative h-full"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(null);
                          }}
                          className="absolute top-5 right-5 z-[2] cursor-pointer rounded-[9px] border border-brd2 bg-chip px-4 py-2 text-[13px] font-medium text-fg transition-colors duration-300 hover:bg-brd2"
                        >
                          Close
                        </button>
                        <div className="h-full lg:py-2 lg:pr-1.5">
                          <div className="slim-scroll h-full overflow-y-auto p-7 lg:py-7 lg:pl-9 lg:pr-8">
                            {section.panel}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              );
            })}
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
