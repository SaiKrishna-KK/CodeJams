export const GENRES = {
  synthwave: {
    name: 'Synthwave',
    emoji: '🌆',
    extensions: ['.jsx', '.tsx', '.css', '.scss', '.html', '.vue', '.svelte'],
    bpmRange: [110, 130],
    description: 'Frontend-heavy, modern web vibes'
  },
  industrial: {
    name: 'Industrial',
    emoji: '⚙️',
    extensions: ['.py', '.go', '.java', '.rs', '.cpp', '.c', '.rb'],
    bpmRange: [95, 115],
    description: 'Backend systems, heavy processing'
  },
  ambient: {
    name: 'Ambient',
    emoji: '☁️',
    extensions: ['.csv', '.json', '.sql', '.ipynb', '.xml', '.yaml'],
    bpmRange: [80, 100],
    description: 'Data-focused, analytical flow'
  },
  chiptune: {
    name: 'Chiptune',
    emoji: '🎮',
    extensions: ['.unity', '.godot', '.asm', '.shader', '.glsl'],
    bpmRange: [140, 160],
    description: 'Game dev, retro computing'
  },
  experimental: {
    name: 'Experimental',
    emoji: '🔬',
    extensions: [], // fallback
    bpmRange: [100, 120],
    description: 'Mixed or unknown styles'
  }
};

export function detectGenre(commits) {
  // Extract file extensions from commit messages
  const extensions = new Set();

  commits.forEach(commit => {
    const matches = commit.message.match(/\.\w+/g);
    if (matches) {
      matches.forEach(ext => extensions.add(ext.toLowerCase()));
    }
  });

  // Count matches for each genre
  const scores = {};

  Object.keys(GENRES).forEach(genre => {
    scores[genre] = 0;
    GENRES[genre].extensions.forEach(ext => {
      if (extensions.has(ext)) {
        scores[genre]++;
      }
    });
  });

  // Find genre with highest score
  let maxScore = 0;
  let detectedGenre = 'experimental';

  Object.entries(scores).forEach(([genre, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedGenre = genre;
    }
  });

  return GENRES[detectedGenre];
}
