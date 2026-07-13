"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  createSession,
  destroySession,
  isAuthed,
  passwordMatches,
} from "@/lib/admin/session";
import { validateSection, type SectionKey } from "@/lib/admin/validate";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function login(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const password = formData.get("password");
  if (typeof password !== "string" || !password) {
    return { ok: false, error: "Enter the password." };
  }
  if (!process.env.ADMIN_PASSWORD) {
    return { ok: false, error: "ADMIN_PASSWORD is not configured on the server." };
  }
  if (!passwordMatches(password)) {
    // Damp brute-force attempts a little
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: false, error: "Wrong password." };
  }
  await createSession();
  return { ok: true };
}

export async function logout(): Promise<void> {
  await destroySession();
}

/**
 * Upserts one section row. Auth is checked here (server actions are reachable
 * by direct POST, not just the UI) and the value is validated before writing.
 * Writes use the service-role key — RLS keeps the anon key read-only.
 */
export async function saveSection(key: SectionKey, value: unknown): Promise<ActionResult> {
  if (!(await isAuthed())) {
    return { ok: false, error: "Session expired — reload the page and log in again." };
  }

  const invalid = validateSection(key, value);
  if (invalid) return { ok: false, error: invalid };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return {
      ok: false,
      error: "SUPABASE_SERVICE_ROLE_KEY is not configured — add it to the server env vars.",
    };
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.from("site_content").upsert({ key, value });
  if (error) return { ok: false, error: `Supabase: ${error.message}` };

  // Regenerate the homepage immediately instead of waiting out the ISR hour
  revalidatePath("/");
  return { ok: true };
}

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/** Storage bucket (public) that holds admin-uploaded imagery. */
const PHOTO_BUCKET = "Pictures";

/**
 * Uploads a profile photo to Supabase Storage and returns its public URL.
 * Auth + type/size limits are enforced here since server actions are reachable
 * by direct POST. The returned URL is stored in profile.photoUrl via the normal
 * saveSection flow — this action only handles the binary.
 */
export async function uploadProfilePhoto(formData: FormData): Promise<UploadResult> {
  if (!(await isAuthed())) {
    return { ok: false, error: "Session expired — reload the page and log in again." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file received." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Only image files are allowed." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Image must be under 5 MB." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return {
      ok: false,
      error: "SUPABASE_SERVICE_ROLE_KEY is not configured — add it to the server env vars.",
    };
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `profile/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });
  if (error) {
    return { ok: false, error: `Upload failed: ${error.message}` };
  }

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export interface EnvStatus {
  /** Env var name(s) the check covers, for display */
  key: string;
  label: string;
  status: "ok" | "warn" | "error";
  detail: string;
}

async function supabaseReadCheck(): Promise<EnvStatus> {
  const base: Pick<EnvStatus, "key" | "label"> = {
    key: "NEXT_PUBLIC_SUPABASE_URL · NEXT_PUBLIC_SUPABASE_ANON_KEY",
    label: "Supabase content store",
  };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return {
      ...base,
      status: "warn",
      detail: `${!url ? "URL" : "Anon key"} not set — the site renders built-in defaults instead of database content.`,
    };
  }
  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { count, error } = await supabase
    .from("site_content")
    .select("key", { count: "exact", head: true });
  return error
    ? { ...base, status: "error", detail: `Read failed: ${error.message}` }
    : {
        ...base,
        status: "ok",
        detail: `Connected — ${count ?? 0} content row${count === 1 ? "" : "s"} readable.`,
      };
}

async function supabaseWriteCheck(): Promise<EnvStatus> {
  const base: Pick<EnvStatus, "key" | "label"> = {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    label: "Supabase write access",
  };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    return {
      ...base,
      status: "error",
      detail: "NEXT_PUBLIC_SUPABASE_URL is not set, so the key can't be tested.",
    };
  }
  if (!serviceKey) {
    return {
      ...base,
      status: "error",
      detail: "Not set — saving sections from this panel will fail.",
    };
  }
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // A read is enough to prove the key is accepted: service_role bypasses RLS,
  // so a bad or foreign-project key is rejected outright.
  const { error } = await supabase
    .from("site_content")
    .select("key", { count: "exact", head: true });
  return error
    ? { ...base, status: "error", detail: `Key rejected: ${error.message}` }
    : { ...base, status: "ok", detail: "Key accepted — saves from this panel work." };
}

async function githubCheck(): Promise<EnvStatus> {
  const base: Pick<EnvStatus, "key" | "label"> = {
    key: "GITHUB_TOKEN",
    label: "GitHub token",
  };
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      ...base,
      status: "warn",
      detail: "Not set — the site shows top public repos instead of pinned ones.",
    };
  }
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query:
          "query { viewer { login pinnedItems(first: 6, types: REPOSITORY) { totalCount } } }",
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ...base, status: "error", detail: `GitHub rejected the token (HTTP ${res.status}).` };
    }
    const json = await res.json();
    const viewer = json?.data?.viewer;
    if (!viewer) {
      return { ...base, status: "error", detail: "Token accepted, but the account query failed." };
    }
    return {
      ...base,
      status: "ok",
      detail: `Authenticated as ${viewer.login} — ${viewer.pinnedItems.totalCount} pinned repos found.`,
    };
  } catch {
    return { ...base, status: "error", detail: "Could not reach GitHub." };
  }
}

/** Live-checks every env var the site uses: presence AND a real round trip. */
export async function checkEnv(): Promise<{
  ok: boolean;
  error?: string;
  checks?: EnvStatus[];
}> {
  if (!(await isAuthed())) {
    return { ok: false, error: "Session expired — reload the page and log in again." };
  }

  const checks = await Promise.all([
    // Being logged in proves ADMIN_PASSWORD works — sessions are signed with it
    Promise.resolve<EnvStatus>({
      key: "ADMIN_PASSWORD",
      label: "Admin password",
      status: "ok",
      detail: "Set — this session is signed with it.",
    }),
    supabaseReadCheck(),
    supabaseWriteCheck(),
    githubCheck(),
  ]);

  return { ok: true, checks };
}
