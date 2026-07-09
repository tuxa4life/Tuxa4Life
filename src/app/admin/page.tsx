import type { Metadata } from "next";
import { isAuthed } from "@/lib/admin/session";
import { getSiteContent } from "@/lib/content";
import { getGithubProjects } from "@/lib/github";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminApp from "@/components/admin/AdminApp";

// Hidden door: not linked anywhere, and never indexed
export const metadata: Metadata = {
  title: "Admin — tuxa.ge",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthed())) return <AdminLogin />;

  const content = await getSiteContent();
  const githubPreview = await getGithubProjects(content.profile.githubUsername);
  return <AdminApp initialContent={content} githubPreview={githubPreview ?? []} />;
}
