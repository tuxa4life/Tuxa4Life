"use client";

import { useRef, useState } from "react";
import type {
  Achievement,
  EducationItem,
  ExperienceItem,
  Profile,
  Project,
  SkillGroup,
  Stat,
} from "@/lib/types";
import { uploadProfilePhoto } from "@/lib/admin/actions";
import {
  ChipsEditor,
  Field,
  ListEditor,
  MarkupTextArea,
  TextInput,
} from "@/components/admin/fields";
import { StarIcon } from "@/components/icons";

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-display mt-7 mb-3 text-base font-semibold tracking-[-.01em]">
      {children}
    </div>
  );
}

/**
 * Profile photo picker: previews the current image, uploads the chosen file to
 * Supabase Storage, and stores the returned public URL back into the profile.
 * The heavy lifting (auth, validation, storage) lives in the server action.
 */
function PhotoField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "uploading" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ kind: "error", message: "Choose an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ kind: "error", message: "Image must be under 5 MB." });
      return;
    }
    setStatus({ kind: "uploading" });
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProfilePhoto(formData);
    if (result.ok && result.url) {
      onChange(result.url);
      setStatus({ kind: "idle" });
    } else {
      setStatus({ kind: "error", message: result.error ?? "Upload failed." });
    }
  };

  const preview = value || "/profile.jpg";

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[14px] border border-brd2 bg-chip">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Profile" className="h-full w-full object-cover object-top" />
      </div>
      <div className="flex flex-col items-start gap-1.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status.kind === "uploading"}
          className="cursor-pointer rounded-[9px] border border-brd2 bg-chip px-4 py-2 text-[13px] font-medium text-fg transition-colors duration-300 hover:bg-brd2 disabled:cursor-default disabled:opacity-50"
        >
          {status.kind === "uploading" ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
        </button>
        <span className="text-[11px] text-muted">
          JPG or PNG, under 5 MB. Grayscale on the board, full colour in the panel.
        </span>
        {status.kind === "error" && (
          <span className="text-[11px] text-red-500">{status.message}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}

export function ProfileEditor({
  value,
  onChange,
}: {
  value: Profile;
  onChange: (next: Profile) => void;
}) {
  const set = (patch: Partial<Profile>) => onChange({ ...value, ...patch });

  const textFields: { key: keyof Profile & string; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "location", label: "Location" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "githubUsername", label: "GitHub username" },
    { key: "githubUrl", label: "GitHub URL" },
    { key: "instagramUrl", label: "Instagram URL" },
    { key: "websiteUrl", label: "Website URL" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {textFields.map((field) => (
          <Field key={field.key} label={field.label}>
            <TextInput
              value={value[field.key] as string}
              onChange={(next) => set({ [field.key]: next })}
            />
          </Field>
        ))}
      </div>

      <div className="mt-4">
        <Field label="Tagline">
          <MarkupTextArea value={value.tagline} rows={2} onChange={(next) => set({ tagline: next })} />
        </Field>
      </div>

      <SubHeading>Photo</SubHeading>
      <PhotoField value={value.photoUrl ?? ""} onChange={(next) => set({ photoUrl: next })} />

      <SubHeading>About paragraphs</SubHeading>
      <ListEditor<string>
        items={value.aboutParagraphs}
        onChange={(next) => set({ aboutParagraphs: next })}
        blank={() => ""}
        addLabel="Add paragraph"
        render={(paragraph, _update, i) => (
          <MarkupTextArea
            value={paragraph}
            rows={3}
            onChange={(next) =>
              set({
                aboutParagraphs: value.aboutParagraphs.map((p, j) => (j === i ? next : p)),
              })
            }
          />
        )}
      />

      <SubHeading>Stats</SubHeading>
      <ListEditor<Stat>
        items={value.stats}
        onChange={(next) => set({ stats: next })}
        blank={() => ({ value: "", label: "" })}
        addLabel="Add stat"
        render={(stat, update) => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Value">
              <TextInput value={stat.value} onChange={(next) => update({ value: next })} placeholder="3+" />
            </Field>
            <Field label="Label">
              <TextInput value={stat.label} onChange={(next) => update({ label: next })} placeholder="years building" />
            </Field>
          </div>
        )}
      />

      <SubHeading>Highlight skills</SubHeading>
      <ChipsEditor
        items={value.highlightSkills}
        onChange={(next) => set({ highlightSkills: next })}
        placeholder="Add skill…"
      />
    </div>
  );
}

export function SkillsEditor({
  value,
  onChange,
}: {
  value: SkillGroup[];
  onChange: (next: SkillGroup[]) => void;
}) {
  return (
    <ListEditor<SkillGroup>
      items={value}
      onChange={onChange}
      blank={() => ({ category: "", items: [] })}
      addLabel="Add skill group"
      render={(group, update) => (
        <div className="flex flex-col gap-4">
          <Field label="Category">
            <TextInput
              value={group.category}
              onChange={(next) => update({ category: next })}
              placeholder="Languages"
            />
          </Field>
          <Field label="Skills">
            <ChipsEditor
              items={group.items}
              onChange={(next) => update({ items: next })}
              placeholder="Add skill…"
            />
          </Field>
        </div>
      )}
    />
  );
}

export function ExperienceEditor({
  value,
  onChange,
}: {
  value: ExperienceItem[];
  onChange: (next: ExperienceItem[]) => void;
}) {
  return (
    <ListEditor<ExperienceItem>
      items={value}
      onChange={onChange}
      blank={() => ({ period: "", title: "", description: "" })}
      addLabel="Add experience"
      render={(item, update) => (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
            <Field label="Period">
              <TextInput value={item.period} onChange={(next) => update({ period: next })} placeholder="2023 — Present" />
            </Field>
            <Field label="Title">
              <TextInput value={item.title} onChange={(next) => update({ title: next })} />
            </Field>
          </div>
          <Field label="Description">
            <MarkupTextArea value={item.description} rows={2} onChange={(next) => update({ description: next })} />
          </Field>
        </div>
      )}
    />
  );
}

export function EducationEditor({
  value,
  onChange,
}: {
  value: EducationItem[];
  onChange: (next: EducationItem[]) => void;
}) {
  return (
    <ListEditor<EducationItem>
      items={value}
      onChange={onChange}
      blank={() => ({ period: "", institution: "" })}
      addLabel="Add education"
      render={(item, update) => (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
            <Field label="Period">
              <TextInput value={item.period} onChange={(next) => update({ period: next })} placeholder="2019 — 2021" />
            </Field>
            <Field label="Institution">
              <TextInput value={item.institution} onChange={(next) => update({ institution: next })} />
            </Field>
          </div>
          <Field label="Note (optional)">
            <MarkupTextArea
              value={item.note ?? ""}
              rows={2}
              onChange={(next) => update({ note: next || undefined })}
            />
          </Field>
        </div>
      )}
    />
  );
}

export function AchievementsEditor({
  value,
  onChange,
}: {
  value: Achievement[];
  onChange: (next: Achievement[]) => void;
}) {
  return (
    <ListEditor<Achievement>
      items={value}
      onChange={onChange}
      blank={() => ({ place: "", event: "" })}
      addLabel="Add achievement"
      render={(item, update) => (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
          <Field label="Place">
            <TextInput value={item.place} onChange={(next) => update({ place: next })} placeholder="1st Place" />
          </Field>
          <Field label="Event">
            <TextInput value={item.event} onChange={(next) => update({ event: next })} />
          </Field>
        </div>
      )}
    />
  );
}

export function ProjectsEditor({
  value,
  onChange,
  githubPreview,
}: {
  value: Project[];
  onChange: (next: Project[]) => void;
  githubPreview: Project[];
}) {
  return (
    <div>
      {githubPreview.length > 0 && (
        <div className="mb-7">
          <div className="mb-1 text-xs font-medium text-muted">
            Live from GitHub — what visitors currently see
          </div>
          <p className="mb-3 text-[13px] leading-relaxed text-muted">
            The site pulls these automatically (pinned repos, refreshed hourly). The list below
            them is only the fallback shown if GitHub is unreachable.
          </p>
          <div className="flex flex-wrap gap-2">
            {githubPreview.map((project) => (
              <span
                key={project.name}
                className="flex items-center gap-2 rounded-full border border-brd2 bg-chip px-3.5 py-1.5 text-[13px]"
              >
                {project.name}
                {typeof project.stars === "number" && project.stars > 0 && (
                  <span className="flex items-center gap-1 text-muted">
                    <StarIcon /> {project.stars}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <ListEditor<Project>
        items={value}
        onChange={onChange}
        blank={() => ({ name: "", description: "", tech: [], source: "manual" })}
        addLabel="Add fallback project"
        render={(project, update) => (
          <div className="flex flex-col gap-4">
            <Field label="Name">
              <TextInput value={project.name} onChange={(next) => update({ name: next })} />
            </Field>
            <Field label="Description">
              <MarkupTextArea value={project.description} rows={2} onChange={(next) => update({ description: next })} />
            </Field>
            <Field label="Tech">
              <ChipsEditor
                items={project.tech}
                onChange={(next) => update({ tech: next })}
                placeholder="Add tech…"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Repo URL (optional)">
                <TextInput
                  value={project.url ?? ""}
                  onChange={(next) => update({ url: next || undefined })}
                />
              </Field>
              <Field label="Homepage (optional)">
                <TextInput
                  value={project.homepage ?? ""}
                  onChange={(next) => update({ homepage: next || undefined })}
                />
              </Field>
            </div>
          </div>
        )}
      />
    </div>
  );
}
