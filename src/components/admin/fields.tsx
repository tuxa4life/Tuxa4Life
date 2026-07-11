"use client";

import { useRef, useState } from "react";
import { Markup } from "@/lib/markup";
import {
  BoldIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  ItalicIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
  UnderlineIcon,
} from "@/components/icons";

/* Shared input styling: chip-toned surfaces with the site's border tokens */
const inputClass =
  "w-full rounded-[12px] border border-brd2 bg-chip px-3.5 py-2.5 text-sm text-fg outline-none transition-colors duration-200 placeholder:text-muted/60 focus:border-muted";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} cursor-pointer appearance-none`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-paper text-fg">
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} resize-y leading-relaxed`}
    />
  );
}

/**
 * TextArea with markdown-lite support: a small toolbar that wraps the current
 * selection in **bold** / *italic* / __underline__ / [text](url), and a live
 * preview underneath rendered by the same <Markup> component the public site
 * uses — so the preview is exactly what visitors will see.
 */
export function MarkupTextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "text";

    let next: string;
    let selectStart: number;
    let selectEnd: number;
    if (before === "[") {
      // Link: wrap as [selection](https://) and select the URL placeholder
      next = `${value.slice(0, start)}[${selected}](https://)${value.slice(end)}`;
      selectStart = start + selected.length + 3;
      selectEnd = selectStart + 8;
    } else {
      next = value.slice(0, start) + before + selected + after + value.slice(end);
      selectStart = start + before.length;
      selectEnd = selectStart + selected.length;
    }
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectStart, selectEnd);
    });
  };

  const tools: { title: string; icon: React.ReactNode; before: string; after: string }[] = [
    { title: "Bold — **text**", icon: <BoldIcon />, before: "**", after: "**" },
    { title: "Italic — *text*", icon: <ItalicIcon />, before: "*", after: "*" },
    { title: "Underline — __text__", icon: <UnderlineIcon />, before: "__", after: "__" },
    { title: "Link — [text](url)", icon: <LinkIcon />, before: "[", after: "]()" },
  ];

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            title={tool.title}
            // Runs before the textarea loses focus, keeping the selection alive
            onMouseDown={(e) => {
              e.preventDefault();
              wrapSelection(tool.before, tool.after);
            }}
            className="cursor-pointer rounded-[8px] border border-brd2 bg-chip p-1.5 text-muted transition-colors duration-200 hover:text-fg"
          >
            {tool.icon}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y leading-relaxed`}
      />
      {value.trim() && (
        <div className="mt-1.5 rounded-[12px] border border-dashed border-brd2 px-3.5 py-2.5">
          <div className="mb-1 text-[10px] uppercase tracking-[.14em] text-muted/70">Preview</div>
          <div className="text-sm leading-relaxed text-muted">
            <Markup text={value} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Small labeled checkbox, styled to match the chip-toned inputs. */
export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-fg">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-current"
      />
      {label}
    </label>
  );
}

/** Editable list of short strings rendered as removable chips + an adder. */
export function ChipsEditor({
  items,
  onChange,
  placeholder = "Add…",
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="flex items-center gap-1.5 rounded-full border border-brd2 bg-chip py-1.5 pr-2 pl-3.5 text-sm"
        >
          {item}
          <button
            type="button"
            title={`Remove ${item}`}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="cursor-pointer rounded-full p-0.5 text-muted transition-colors hover:text-fg"
          >
            <CloseIcon size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        className="w-28 rounded-full border border-dashed border-brd2 bg-transparent px-3.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-muted"
      />
    </div>
  );
}

/** Move-up / move-down / delete controls shared by every list row. */
export function RowControls({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  const buttonClass =
    "cursor-pointer rounded-[9px] border border-brd2 bg-chip p-1.5 text-muted transition-colors duration-200 hover:text-fg disabled:cursor-default disabled:opacity-30 disabled:hover:text-muted";
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        title="Move up"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className={buttonClass}
      >
        <ChevronUpIcon />
      </button>
      <button
        type="button"
        title="Move down"
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        className={buttonClass}
      >
        <ChevronDownIcon />
      </button>
      <button
        type="button"
        title="Remove"
        onClick={() => onRemove(index)}
        className={`${buttonClass} hover:border-red-400/40 hover:text-red-500`}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

/** Generic list editor: bordered row cards with reorder/remove + an add button. */
export function ListEditor<T>({
  items,
  onChange,
  render,
  blank,
  addLabel,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  blank: () => T;
  addLabel: string;
}) {
  const move = (from: number, to: number) => {
    const next = [...items];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-brd2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted">#{i + 1}</span>
            <RowControls
              index={i}
              total={items.length}
              onMove={move}
              onRemove={(index) => onChange(items.filter((_, j) => j !== index))}
            />
          </div>
          {render(
            item,
            (patch) => onChange(items.map((row, j) => (j === i ? { ...row, ...patch } : row))),
            i
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, blank()])}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-brd2 px-4 py-3 text-sm text-muted transition-colors duration-200 hover:border-muted hover:text-fg"
      >
        <PlusIcon size={15} />
        {addLabel}
      </button>
    </div>
  );
}
