export const EASTER_EGGS = {
  bug: {
    keywords: ['fix', 'bug', 'error', 'issue'],
    icon: '🐛',
    sound: 'scratch',
    description: 'Bug fix'
  },
  refactor: {
    keywords: ['refactor', 'cleanup', 'reorganize'],
    icon: '♻️',
    sound: 'reverseCymbal',
    description: 'Refactoring'
  },
  breaking: {
    keywords: ['breaking', 'break', 'major'],
    icon: '💥',
    sound: 'orchestralHit',
    description: 'Breaking change'
  },
  wip: {
    keywords: ['wip', 'temp', 'todo', 'hack'],
    icon: '🚧',
    sound: 'drumRoll',
    description: 'Work in progress'
  },
  profanity: {
    keywords: ['fuck', 'shit', 'damn', 'hell'],
    icon: '🔔',
    sound: 'cowbell',
    description: 'Frustrated commit'
  },
  merge: {
    keywords: ['merge', 'merged'],
    icon: '🔀',
    sound: 'glitch',
    description: 'Merge commit'
  }
};

export function detectEasterEggs(commits) {
  return commits.map((commit, index) => {
    const message = commit.message.toLowerCase();
    const eggs = [];

    Object.entries(EASTER_EGGS).forEach(([key, egg]) => {
      const found = egg.keywords.some(keyword => message.includes(keyword));
      if (found) {
        eggs.push({ type: key, ...egg });
      }
    });

    return {
      ...commit,
      index,
      easterEggs: eggs
    };
  });
}
