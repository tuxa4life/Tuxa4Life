import type { Project } from "@/lib/types";

const REVALIDATE_SECONDS = 3600;

interface PinnedRepoNode {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  primaryLanguage: { name: string } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
}

interface RestRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  pushed_at: string;
}

/**
 * Fetches the user's pinned repositories via the GitHub GraphQL API when a
 * GITHUB_TOKEN is available (pinned items are only exposed there). Without a
 * token, falls back to the public REST API: non-fork repos ranked by stars,
 * then recency. Returns null on total failure so callers can use manual
 * project content instead.
 */
export async function getGithubProjects(username: string): Promise<Project[] | null> {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const pinned = await fetchPinned(username, token);
    if (pinned?.length) return pinned;
  }
  return fetchPublicRepos(username);
}

async function fetchPinned(username: string, token: string): Promise<Project[] | null> {
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name description url homepageUrl stargazerCount
                  primaryLanguage { name }
                  repositoryTopics(first: 5) { nodes { topic { name } } }
                }
              }
            }
          }
        }`,
        variables: { login: username },
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const nodes: PinnedRepoNode[] = json?.data?.user?.pinnedItems?.nodes ?? [];
    return nodes.map((repo) => ({
      name: repo.name,
      description: repo.description ?? "",
      tech: [
        ...(repo.primaryLanguage ? [repo.primaryLanguage.name] : []),
        ...repo.repositoryTopics.nodes.map((n) => n.topic.name),
      ].slice(0, 4),
      url: repo.url,
      homepage: repo.homepageUrl ?? undefined,
      stars: repo.stargazerCount,
      source: "github" as const,
    }));
  } catch {
    return null;
  }
}

async function fetchPublicRepos(username: string): Promise<Project[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) return null;

    const repos: RestRepo[] = await res.json();
    return repos
      .filter((repo) => !repo.fork)
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          Date.parse(b.pushed_at) - Date.parse(a.pushed_at)
      )
      .slice(0, 6)
      .map((repo) => ({
        name: repo.name,
        description: repo.description ?? "",
        tech: [
          ...(repo.language ? [repo.language] : []),
          ...(repo.topics ?? []),
        ].slice(0, 4),
        url: repo.html_url,
        homepage: repo.homepage ?? undefined,
        stars: repo.stargazers_count,
        source: "github" as const,
      }));
  } catch {
    return null;
  }
}
