import { createClient } from "@supabase/supabase-js";
import { defaultContent } from "@/content/defaults";
import type { SiteContent } from "@/lib/types";

/**
 * Content is stored in Supabase as a key/value table (`site_content`),
 * one row per section, value as JSONB — editable straight from the
 * Supabase dashboard's table editor. Any missing row falls back to the
 * defaults, so the site renders fully even with an empty database.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return defaultContent;

  try {
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return defaultContent;

    const overrides = Object.fromEntries(data.map((row) => [row.key, row.value]));
    return { ...defaultContent, ...overrides };
  } catch {
    return defaultContent;
  }
}
