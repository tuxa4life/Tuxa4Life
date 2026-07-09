"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, type ActionResult } from "@/lib/admin/actions";
import { useTheme } from "@/components/admin/useTheme";
import DotField from "@/components/DotField";
import { LockIcon, MoonIcon, SunIcon } from "@/components/icons";

export default function AdminLogin() {
  const { dark, toggleDark } = useTheme();
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(login, null);

  // The session cookie is set — re-render the page server-side into the editor
  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <DotField dark={dark} />

      {/* Ghost heading, same voice as the homepage name */}
      <div className="absolute top-[34px] left-6 z-[4] select-none lg:left-11">
        <div className="font-display ghost-text pointer-events-none text-[32px] leading-[.98] font-bold tracking-[-.03em] lg:text-[40px]">
          Admin
        </div>
      </div>

      <form action={action} className="glass expanded relative z-[3] w-full max-w-sm rounded-[24px] p-8">
        <div className="mb-6 flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-chip text-fg">
          <LockIcon />
        </div>
        <div className="font-display text-2xl font-bold tracking-[-.02em]">Welcome back</div>
        <p className="mt-1.5 mb-6 text-sm text-muted">
          Enter the admin password to edit site content.
        </p>

        <input
          type="password"
          name="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          className="w-full rounded-[14px] border border-brd2 bg-chip px-4 py-3 text-[15px] text-fg outline-none transition-colors duration-200 placeholder:text-muted/60 focus:border-muted"
        />

        {state?.error && <p className="mt-3 text-[13px] text-red-500">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full cursor-pointer rounded-[14px] bg-fg px-6 py-[13px] text-[15px] font-semibold text-paper transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[2px] disabled:translate-y-0 disabled:opacity-60"
        >
          {pending ? "Checking…" : "Unlock"}
        </button>
      </form>

      <button
        onClick={toggleDark}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="glass fixed right-6 bottom-6 z-[6] flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-[14px] text-fg transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[3px] hover:scale-[1.04]"
      >
        {dark ? <SunIcon size={19} /> : <MoonIcon />}
      </button>
    </div>
  );
}
