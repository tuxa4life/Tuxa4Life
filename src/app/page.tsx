import Site from "@/components/Site";
import { getSiteContent } from "@/lib/content";
import { getGithubProjects } from "@/lib/github";

// Re-fetch content and GitHub projects at most once an hour
export const revalidate = 3600;

export default async function Page() {
  const content = await getSiteContent();
  const githubProjects = await getGithubProjects(content.profile.githubUsername);
  const projects = githubProjects?.length ? githubProjects : content.projects;

  return <Site content={content} projects={projects} />;
}
