import { fetchCommits } from './github';

export class BookmarkMonitor {
  constructor() {
    this.intervalId = null;
    this.checkInterval = 5 * 60 * 1000; // Check every 5 minutes
  }

  async checkForNewCommits(bookmark) {
    try {
      const commits = await fetchCommits(bookmark.owner, bookmark.repo);
      const latestCommitSha = commits[0]?.sha;

      if (latestCommitSha && latestCommitSha !== bookmark.lastCommitSha) {
        return {
          hasNew: true,
          newCommitSha: latestCommitSha,
          newCommits: commits.filter(c => c.sha !== bookmark.lastCommitSha)
        };
      }

      return { hasNew: false };
    } catch (error) {
      console.error(`Error checking ${bookmark.owner}/${bookmark.repo}:`, error);
      return { hasNew: false };
    }
  }

  async checkAllBookmarks(onNewCommit) {
    const bookmarks = JSON.parse(localStorage.getItem('codejams_bookmarks') || '[]');

    for (const bookmark of bookmarks) {
      const result = await this.checkForNewCommits(bookmark);

      if (result.hasNew) {
        // Update the bookmark with new commit SHA
        const updatedBookmarks = bookmarks.map(b =>
          b.owner === bookmark.owner && b.repo === bookmark.repo
            ? { ...b, lastCommitSha: result.newCommitSha, lastChecked: new Date().toISOString() }
            : b
        );

        // Move this bookmark to the top
        const thisBookmark = updatedBookmarks.find(b => b.owner === bookmark.owner && b.repo === bookmark.repo);
        const otherBookmarks = updatedBookmarks.filter(b => !(b.owner === bookmark.owner && b.repo === bookmark.repo));
        const reordered = [thisBookmark, ...otherBookmarks];

        localStorage.setItem('codejams_bookmarks', JSON.stringify(reordered));

        // Notify callback
        if (onNewCommit) {
          onNewCommit(bookmark, result.newCommits);
        }
      }
    }
  }

  start(onNewCommit) {
    if (this.intervalId) return;

    // Check immediately
    this.checkAllBookmarks(onNewCommit);

    // Then check periodically
    this.intervalId = setInterval(() => {
      this.checkAllBookmarks(onNewCommit);
    }, this.checkInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
