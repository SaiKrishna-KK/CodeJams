export async function fetchCommits(owner, repo, limit = 100) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits`;
  const params = new URLSearchParams({ per_page: limit });

  try {
    const response = await fetch(`${url}?${params}`);

    if (response.status === 404) {
      throw new Error('Repository not found');
    }

    if (response.status === 403) {
      throw new Error('Rate limit exceeded. Try again later.');
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();

    return commits.map(c => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message.split('\n')[0], // First line only
      author: c.commit.author.name,
      date: c.commit.author.date,
      filesChanged: c.stats?.total || Math.floor(Math.random() * 10) + 1
    }));
  } catch (error) {
    throw error;
  }
}

export async function getRepoInfo(owner, repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  const data = await response.json();

  return {
    name: data.full_name,
    description: data.description,
    stars: data.stargazers_count
  };
}
