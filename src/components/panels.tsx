import type { Project, SiteContent } from "@/lib/types";
import { Markup } from "@/lib/markup";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  GithubIcon,
  MailIcon,
  StarIcon,
} from "@/components/icons";

function PanelHeading({ label, title }: { label: string; title: string }) {
  return (
    <>
      <div className="text-[13px] uppercase tracking-[.14em] text-muted">{label}</div>
      <h2 className="font-display mt-2 mb-5 text-[32px] font-bold tracking-[-.02em]">
        {title}
      </h2>
    </>
  );
}

export function AboutPanel({ content }: { content: SiteContent }) {
  const { profile } = content;
  return (
    <div>
      <PanelHeading label="About" title={profile.name} />
      {profile.aboutParagraphs.map((paragraph, i) => (
        <p
          key={i}
          className={`max-w-[58ch] text-base leading-[1.7] ${i === 0 ? "text-fg" : "mt-3.5 text-muted"}`}
        >
          <Markup text={paragraph} />
        </p>
      ))}
    </div>
  );
}

export function SkillsPanel({ content }: { content: SiteContent }) {
  return (
    <div>
      <PanelHeading label="Skills" title="What I build with" />
      <div className="flex flex-col gap-5">
        {content.skills.map((group) => (
          <div key={group.category}>
            <div className="mb-2.5 text-[13px] text-muted">{group.category}</div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-brd2 bg-chip px-[15px] py-2 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperiencePanel({ content }: { content: SiteContent }) {
  return (
    <div>
      <PanelHeading label="Experience" title="The path so far" />
      <div className="flex flex-col gap-5">
        {content.experience.map((item) => (
          <div key={item.title} className="flex flex-col gap-1 sm:flex-row sm:gap-[18px]">
            <div className="min-w-[110px] pt-0.5 text-[13px] text-muted">{item.period}</div>
            <div>
              <div className="text-base font-semibold">{item.title}</div>
              <div className="mt-1 text-sm leading-relaxed text-muted">
                <Markup text={item.description} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="font-display mt-9 mb-4 text-lg font-semibold tracking-[-.01em]">
        Achievements
      </div>
      <div className="flex flex-col gap-2.5">
        {content.achievements.map((achievement) => (
          <div key={achievement.event} className="flex items-baseline gap-3">
            <span className="min-w-[76px] text-sm font-semibold">{achievement.place}</span>
            <span className="text-sm text-muted">{achievement.event}</span>
          </div>
        ))}
      </div>

      <div className="font-display mt-9 mb-4 text-lg font-semibold tracking-[-.01em]">
        Education
      </div>
      <div className="flex flex-col gap-3.5">
        {content.education.map((item) => (
          <div key={item.institution} className="flex flex-col gap-1 sm:flex-row sm:gap-[18px]">
            <div className="min-w-[110px] text-[13px] text-muted">{item.period}</div>
            <div>
              <div className="text-sm font-semibold">{item.institution}</div>
              {item.note && (
                <div className="mt-0.5 text-[13px] text-muted">
                  <Markup text={item.note} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsPanel({
  projects,
  githubUrl,
}: {
  projects: Project[];
  githubUrl: string;
}) {
  return (
    <div>
      <PanelHeading label="Projects" title="Things I've made" />
      <div className="flex flex-col gap-3.5">
        {projects.map((project) => {
          const inner = (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[17px] font-semibold">
                  {project.name}
                  {project.url && <ArrowUpRightIcon size={15} className="opacity-45" />}
                </div>
                <span className="flex shrink-0 items-center gap-2.5 text-xs text-muted">
                  {typeof project.stars === "number" && project.stars > 0 && (
                    <span className="flex items-center gap-1">
                      <StarIcon /> {project.stars}
                    </span>
                  )}
                  {project.tech.join(" · ")}
                </span>
              </div>
              {project.description && (
                <div className="mt-1.5 text-sm leading-relaxed text-muted">
                  {/* Card may be wrapped in an <a>; nested anchors are invalid */}
                  <Markup text={project.description} links={!project.url} />
                </div>
              )}
            </>
          );
          const className =
            "block rounded-2xl border border-brd2 px-5 py-[18px] transition-colors duration-300";
          return project.url ? (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className={`${className} hover:bg-chip`}
            >
              {inner}
            </a>
          ) : (
            <div key={project.name} className={className}>
              {inner}
            </div>
          );
        })}
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-2xl border border-brd2 px-5 py-[18px] text-fg transition-colors duration-300 hover:bg-chip"
        >
          <span className="flex items-center gap-3 text-[15px] font-semibold">
            <GithubIcon size={19} />
            Check out more on GitHub
          </span>
          <ArrowUpRightIcon size={15} className="opacity-45" />
        </a>
      </div>
    </div>
  );
}

export function ContactPanel({ content }: { content: SiteContent }) {
  const { profile } = content;
  const links = [
    {
      href: `mailto:${profile.email}`,
      icon: <MailIcon />,
      text: profile.email,
      cta: "Email →",
    },
    {
      href: profile.githubUrl,
      icon: <GithubIcon size={19} />,
      text: profile.githubUrl.replace("https://", ""),
      cta: "GitHub →",
    },
  ];
  return (
    <div>
      <PanelHeading label="Contact" title="Let's talk" />
      <p className="mb-6 -mt-2 max-w-[52ch] text-base leading-[1.7] text-muted">
        Open to freelance work, collaborations, or just a good conversation about design and
        code.
      </p>
      <div className="flex max-w-[520px] flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.cta}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-brd2 px-5 py-4 text-fg transition-colors duration-300 hover:bg-chip"
          >
            <span className="flex items-center gap-3 text-[15px]">
              {link.icon}
              {link.text}
            </span>
            <span className="text-[13px] text-muted">{link.cta}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function ResumePanel() {
  return (
    <div>
      <PanelHeading label="Résumé" title="Grab my CV" />
      <p className="mb-6 -mt-2 max-w-[52ch] text-base leading-[1.7] text-muted">
        A one-page summary of my experience, skills and selected work — PDF, always kept
        current.
      </p>
      <a
        href="/cv.pdf"
        download="Nikoloz Tukhashvili - CV.pdf"
        className="inline-flex items-center gap-3 rounded-[14px] bg-fg px-6 py-[15px] text-[15px] font-semibold text-paper transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[3px]"
      >
        <DownloadIcon size={18} />
        Download résumé (PDF)
      </a>
    </div>
  );
}
