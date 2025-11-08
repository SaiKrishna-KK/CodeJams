export function parseGitHubUrl(pathname) {
  const match = pathname.match(/\/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2]
  };
}
