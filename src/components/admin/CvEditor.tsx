"use client";

import type {
  CvData,
  CvEntry,
  CvSection,
  CvSyncSource,
  Project,
  SiteContent,
} from "@/lib/types";
import {
  CheckboxField,
  ChipsEditor,
  Field,
  ListEditor,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/admin/fields";
import CvDownloadButton from "@/components/CvDownloadButton";
import { entriesFromSite, SYNC_SOURCE_LABELS } from "@/lib/cv/sync";
import { RotateIcon } from "@/components/icons";

const SYNC_SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Manual — no sync" },
  ...(Object.entries(SYNC_SOURCE_LABELS) as [CvSyncSource, string][]).map(
    ([value, label]) => ({ value, label })
  ),
];

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-display mt-7 mb-3 text-base font-semibold tracking-[-.01em]">
      {children}
    </div>
  );
}

/** Secondary button used for the sync actions. */
function SyncButton({
  label,
  title,
  onClick,
}: {
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex shrink-0 cursor-pointer items-center gap-2 rounded-[9px] border border-brd2 bg-chip px-4 py-2 text-[13px] font-medium text-fg transition-colors duration-300 hover:bg-brd2"
    >
      <RotateIcon />
      {label}
    </button>
  );
}

function EntryEditor({
  entry,
  update,
}: {
  entry: CvEntry;
  update: (patch: Partial<CvEntry>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title (bold)">
          <TextInput
            value={entry.title}
            onChange={(next) => update({ title: next })}
            placeholder="Independent / Freelance Developer"
          />
        </Field>
        <Field label="Right-aligned detail (optional)">
          <TextInput
            value={entry.detail ?? ""}
            onChange={(next) => update({ detail: next || undefined })}
            placeholder="2023 - Present"
          />
        </Field>
      </div>
      <Field label="Title link (optional) — makes the title clickable in the PDF">
        <TextInput
          value={entry.titleUrl ?? ""}
          onChange={(next) => update({ titleUrl: next || undefined })}
          placeholder="https://github.com/you/repo"
        />
      </Field>
      <Field label="Text after the title (optional)">
        <TextInput
          value={entry.text ?? ""}
          onChange={(next) => update({ text: next || undefined })}
          placeholder="— Google Developer Group Hackathon"
        />
      </Field>
      <Field label="Bullet lines">
        <ListEditor<string>
          items={entry.bullets}
          onChange={(next) => update({ bullets: next })}
          blank={() => ""}
          addLabel="Add bullet"
          render={(bullet, _update, i) => (
            <TextArea
              value={bullet}
              rows={2}
              onChange={(next) =>
                update({ bullets: entry.bullets.map((b, j) => (j === i ? next : b)) })
              }
            />
          )}
        />
      </Field>
    </div>
  );
}

export default function CvEditor({
  value,
  siteContent,
  githubProjects,
  onChange,
}: {
  value: CvData;
  /** Live in-editor site content — the source the per-section sync pulls from */
  siteContent: SiteContent;
  /** Live repos from the GitHub API, for the "Projects (live GitHub)" source */
  githubProjects: Project[];
  onChange: (next: CvData) => void;
}) {
  const set = (patch: Partial<CvData>) => onChange({ ...value, ...patch });

  const buildEntries = (source: CvSyncSource) =>
    entriesFromSite(source, siteContent, githubProjects);

  const syncSection = (
    section: CvSection,
    update: (patch: Partial<CvSection>) => void
  ) => {
    if (!section.syncSource) return;
    const next = buildEntries(section.syncSource);
    if (next.length === 0) {
      window.alert(
        section.syncSource === "projectsGithub"
          ? "No GitHub projects are available to sync — check the GitHub token on the Status page."
          : "The site has no items for this source yet, so there's nothing to sync."
      );
      return;
    }
    if (
      section.entries.length > 0 &&
      !window.confirm(
        `Replace the ${section.entries.length} ${
          section.entries.length === 1 ? "entry" : "entries"
        } in “${section.title || "this section"}” with the current site content?`
      )
    )
      return;
    update({ entries: next });
  };

  const syncAll = () => {
    const mapped = value.sections.filter((s) => s.syncSource);
    if (mapped.length === 0) {
      window.alert("No sections are set to sync from the site yet.");
      return;
    }
    if (
      !window.confirm(
        `Re-sync all ${mapped.length} mapped section${
          mapped.length === 1 ? "" : "s"
        } from the current site content? This replaces their entries (manual sections are left alone).`
      )
    )
      return;
    // A source with no data (e.g. GitHub briefly unreachable) keeps its old
    // entries instead of being wiped to an empty section.
    set({
      sections: value.sections.map((section) => {
        if (!section.syncSource) return section;
        const entries = buildEntries(section.syncSource);
        return entries.length > 0 ? { ...section, entries } : section;
      }),
    });
  };

  return (
    <div>
      {/* Compiles whatever is in the editor right now — including unsaved edits */}
      <div className="mb-7 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-brd2 p-4">
        <CvDownloadButton cv={value} />
        <p className="max-w-[44ch] text-[13px] leading-relaxed text-muted">
          Builds the PDF from the fields below as they are now — preview your edits before
          saving.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name">
          <TextInput value={value.name} onChange={(next) => set({ name: next })} />
        </Field>
        <Field label="Location">
          <TextInput value={value.location} onChange={(next) => set({ location: next })} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="PDF file name">
          <TextInput
            value={value.fileName}
            onChange={(next) => set({ fileName: next })}
            placeholder="Nikoloz Tukhashvili - CV.pdf"
          />
        </Field>
      </div>

      <SubHeading>Contact line</SubHeading>
      <p className="mb-3 -mt-1 text-[13px] leading-relaxed text-muted">
        Shown under your name. Emails, phone numbers and URLs become clickable links in the
        PDF automatically.
      </p>
      <ChipsEditor
        items={value.contacts}
        onChange={(next) => set({ contacts: next })}
        placeholder="Add contact…"
      />

      <div className="mt-7 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="font-display text-base font-semibold tracking-[-.01em]">Sections</div>
        <SyncButton
          label="Sync all from site"
          title="Re-sync every section that has a site source, all at once"
          onClick={syncAll}
        />
      </div>
      <p className="mb-3 -mt-1 text-[13px] leading-relaxed text-muted">
        Pick a “Sync from site section” to pull entries straight from your website content —
        edit a skill or project once on the site, then hit Sync here. Leave it on “Manual” for
        sections the site can’t provide (they stay fully hand-edited).
      </p>
      <ListEditor<CvSection>
        items={value.sections}
        onChange={(next) => set({ sections: next })}
        blank={() => ({ title: "", entries: [] })}
        addLabel="Add section"
        render={(section, updateSection) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Section title">
                <TextInput
                  value={section.title}
                  onChange={(next) => updateSection({ title: next })}
                  placeholder="Certifications"
                />
              </Field>
              <Field label="Sync from site section">
                <SelectInput
                  value={section.syncSource ?? ""}
                  onChange={(next) =>
                    updateSection({ syncSource: (next || undefined) as CvSyncSource | undefined })
                  }
                  options={SYNC_SOURCE_OPTIONS}
                />
              </Field>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CheckboxField
                label="Start on a new page"
                checked={section.pageBreakBefore ?? false}
                onChange={(next) => updateSection({ pageBreakBefore: next || undefined })}
              />
              {section.syncSource && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">
                    {buildEntries(section.syncSource).length}{" "}
                    {section.syncSource === "projectsGithub" ? "repos" : "items"} available
                  </span>
                  <SyncButton
                    label="Sync entries from site"
                    title="Replace this section's entries with the current site content"
                    onClick={() => syncSection(section, updateSection)}
                  />
                </div>
              )}
            </div>
            <Field label="Entries">
              <ListEditor<CvEntry>
                items={section.entries}
                onChange={(next) => updateSection({ entries: next })}
                blank={() => ({ title: "", bullets: [] })}
                addLabel="Add entry"
                render={(entry, updateEntry) => (
                  <EntryEditor entry={entry} update={updateEntry} />
                )}
              />
            </Field>
          </div>
        )}
      />
    </div>
  );
}
