"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CvData } from "@/lib/types";
import { DownloadIcon } from "@/components/icons";

type Phase = "idle" | "building" | "done" | "error";

const LABELS: Record<Phase, string> = {
  idle: "Download résumé (PDF)",
  building: "Building your PDF…",
  done: "Downloaded",
  error: "Couldn't build the PDF — try again",
};

/**
 * Compiles the CV to PDF in the visitor's browser and downloads it. The
 * generator and the WASM engine (~2 MB) are dynamic-imported on first click,
 * so they cost nothing on normal page loads.
 */
export default function CvDownloadButton({ cv }: { cv: CvData }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const resetTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const settle = useCallback((next: Phase) => {
    setPhase(next);
    resetTimer.current = window.setTimeout(() => setPhase("idle"), next === "done" ? 2500 : 5000);
  }, []);

  const download = useCallback(async () => {
    if (phase === "building") return;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setPhase("building");
    try {
      // Both modules are client-only and code-split away from the page bundle
      const [{ buildResumeTex }, { compileTexToPdf }] = await Promise.all([
        import("@/lib/cv/buildResumeTex"),
        import("@/lib/cv/compile"),
      ]);
      const blob = await compileTexToPdf(buildResumeTex(cv));

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = cv.fileName || "CV.pdf";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      settle("done");
    } catch (error) {
      console.error(error);
      settle("error");
    }
  }, [cv, phase, settle]);

  return (
    <button
      type="button"
      onClick={download}
      disabled={phase === "building"}
      className="inline-flex cursor-pointer items-center gap-3 rounded-[14px] bg-fg px-6 py-[15px] text-[15px] font-semibold text-paper transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[3px] disabled:translate-y-0 disabled:cursor-default disabled:opacity-70"
    >
      {phase === "building" ? (
        <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
      ) : (
        <DownloadIcon size={18} />
      )}
      {LABELS[phase]}
    </button>
  );
}
