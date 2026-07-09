"use client";

import { useCallback, useEffect, useState } from "react";
import { checkEnv, type EnvStatus } from "@/lib/admin/actions";
import { RotateIcon } from "@/components/icons";

const DOT: Record<EnvStatus["status"], string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  error: "bg-red-500",
};

const BADGE: Record<EnvStatus["status"], string> = {
  ok: "Working",
  warn: "Fallback",
  error: "Problem",
};

export default function StatusPanel() {
  const [checks, setChecks] = useState<EnvStatus[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await checkEnv();
    if (result.ok && result.checks) setChecks(result.checks);
    else setError(result.error ?? "Could not run the checks.");
    setLoading(false);
  }, []);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <div>
      <p className="mb-6 max-w-[58ch] text-sm leading-relaxed text-muted">
        Presence and a live round trip for every environment variable the site uses. Green is
        working, amber means a fallback is covering for it, red needs fixing.
      </p>

      {error && <p className="mb-4 text-[13px] text-red-500">{error}</p>}

      <div className="flex flex-col gap-3">
        {(checks ?? []).map((check) => (
          <div key={check.key} className="rounded-2xl border border-brd2 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-semibold">{check.label}</span>
              <span className="flex shrink-0 items-center gap-2 rounded-full border border-brd2 bg-chip px-3 py-1 text-xs text-muted">
                <span className={`h-1.5 w-1.5 rounded-full ${DOT[check.status]}`} />
                {BADGE[check.status]}
              </span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-muted/80">{check.key}</div>
            <div className="mt-1.5 text-sm leading-relaxed text-muted">{check.detail}</div>
          </div>
        ))}

        {loading &&
          !checks &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[92px] animate-pulse rounded-2xl border border-brd2 bg-chip/50" />
          ))}
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="mt-5 flex cursor-pointer items-center gap-2 rounded-[9px] border border-brd2 bg-chip px-4 py-2 text-[13px] font-medium text-fg transition-colors duration-300 hover:bg-brd2 disabled:cursor-default disabled:opacity-50"
      >
        <RotateIcon className={loading ? "animate-spin" : undefined} />
        {loading ? "Checking…" : "Re-run checks"}
      </button>
    </div>
  );
}
