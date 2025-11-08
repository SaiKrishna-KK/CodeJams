import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { BookmarkMonitor } from '../services/bookmark-monitor';

// Popular and frequently updated open source repos
const POPULAR_REPOS = [
  { owner: 'facebook', repo: 'react', description: 'A JavaScript library for building user interfaces' },
  { owner: 'microsoft', repo: 'vscode', description: 'Visual Studio Code' },
  { owner: 'vercel', repo: 'next.js', description: 'The React Framework' },
  { owner: 'nodejs', repo: 'node', description: 'Node.js JavaScript runtime' },
  { owner: 'vuejs', repo: 'core', description: 'Vue.js framework' },
  { owner: 'angular', repo: 'angular', description: 'Angular framework' },
  { owner: 'tensorflow', repo: 'tensorflow', description: 'Machine Learning for everyone' },
  { owner: 'torvalds', repo: 'linux', description: 'Linux kernel source tree' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { apiKey, setApiKey } = useApp();
  const [input, setInput] = useState('');
  const [recentRepos, setRecentRepos] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState('');
  const [newCommitNotification, setNewCommitNotification] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const monitorRef = useRef(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('codejams_recent') || '[]');
    const bookmarked = JSON.parse(localStorage.getItem('codejams_bookmarks') || '[]');
    setRecentRepos(recent);
    setBookmarks(bookmarked);

    // Start monitoring bookmarks for new commits
    if (bookmarked.length > 0) {
      monitorRef.current = new BookmarkMonitor();
      monitorRef.current.start((bookmark, newCommits) => {
        // Show notification
        setNewCommitNotification({
          repo: `${bookmark.owner}/${bookmark.repo}`,
          count: newCommits.length
        });

        // Refresh bookmarks list
        const updated = JSON.parse(localStorage.getItem('codejams_bookmarks') || '[]');
        setBookmarks(updated);

        // Auto-navigate and play
        setTimeout(() => {
          navigate(`/github.com/${bookmark.owner}/${bookmark.repo}?autoplay=true`);
        }, 2000);
      });
    }

    return () => {
      if (monitorRef.current) {
        monitorRef.current.stop();
      }
    };
  }, [navigate]);

  const parseGitHubUrl = (input) => {
    // Remove protocol and www
    let cleaned = input
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/^github\.com\//, '')
      .trim();

    // Should be owner/repo format
    const match = cleaned.match(/^([^\/]+)\/([^\/]+)$/);
    if (!match) return null;

    return { owner: match[1], repo: match[2] };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsed = parseGitHubUrl(input);
    if (!parsed) {
      setError('Invalid format. Use: owner/repo or github.com/owner/repo');
      return;
    }

    // Save to recent
    const recent = [
      `${parsed.owner}/${parsed.repo}`,
      ...recentRepos.filter(r => r !== `${parsed.owner}/${parsed.repo}`)
    ].slice(0, 5);

    localStorage.setItem('codejams_recent', JSON.stringify(recent));

    navigate(`/github.com/${parsed.owner}/${parsed.repo}`);
  };

  const handleApiKeyUpdate = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      localStorage.setItem('codejams_api_key', tempApiKey.trim());
      setShowApiKeyModal(false);
      setTempApiKey('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-dark via-gray-900 to-dark">
      <div className="max-w-2xl w-full">
        {/* New Commit Notification */}
        {newCommitNotification && (
          <div className="mb-6 bg-primary text-dark px-6 py-4 rounded-lg font-bold text-center animate-pulse">
            🎵 {newCommitNotification.count} new commit{newCommitNotification.count > 1 ? 's' : ''} in {newCommitNotification.repo}! Auto-playing...
          </div>
        )}

        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setTempApiKey(apiKey || '');
                setShowApiKeyModal(true);
              }}
              className="text-sm text-gray-400 hover:text-primary transition"
            >
              ⚙️ {apiKey ? 'Change API Key' : 'Set API Key'}
            </button>
          </div>
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            🎵 CodeJams
          </h1>
          <p className="text-2xl text-gray-400">
            Turn your Git commits into music
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <label className="block text-sm text-gray-400 mb-3">
              Enter any GitHub repository:
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError('');
                }}
                placeholder="facebook/react or github.com/facebook/react"
                className="flex-1 bg-gray-700 px-6 py-4 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary transition text-white"
                autoFocus
              />

              <button
                type="submit"
                className="bg-primary text-dark font-bold px-8 py-4 rounded-xl text-lg hover:bg-opacity-90 transition transform hover:scale-105"
              >
                Generate
              </button>
            </div>

            {error && (
              <p className="text-red-400 mt-3 text-sm">{error}</p>
            )}
          </div>
        </form>

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mb-6">
            <h3 className="text-sm text-gray-400 mb-3">★ Bookmarked Repositories:</h3>
            <div className="space-y-3">
              {bookmarks.map(bookmark => (
                <button
                  key={`${bookmark.owner}/${bookmark.repo}`}
                  onClick={() => navigate(`/github.com/${bookmark.owner}/${bookmark.repo}`)}
                  className="block w-full text-left px-4 py-4 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-100 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-primary font-bold">{bookmark.owner}/{bookmark.repo}</code>
                    {bookmark.genreEmoji && (
                      <span className="text-xs opacity-70">{bookmark.genreEmoji} {bookmark.genre}</span>
                    )}
                  </div>
                  {bookmark.lastCommitMessage && (
                    <p className="text-xs text-gray-500 line-clamp-1">Latest: {bookmark.lastCommitMessage}</p>
                  )}
                  {bookmark.addedAt && (
                    <p className="text-xs text-gray-600 mt-1">
                      Bookmarked {new Date(bookmark.addedAt).toLocaleDateString()}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Repositories */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mb-6">
          <h3 className="text-sm text-gray-400 mb-3">🔥 Popular Open Source Projects:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {POPULAR_REPOS.map(({ owner, repo, description }) => (
              <button
                key={`${owner}/${repo}`}
                onClick={() => navigate(`/github.com/${owner}/${repo}`)}
                className="text-left px-4 py-3 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-100 transition"
              >
                <code className="text-primary font-bold block mb-1">{owner}/{repo}</code>
                <p className="text-xs text-gray-500">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentRepos.length > 0 && (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
            <h3 className="text-sm text-gray-400 mb-3">Recent Searches:</h3>
            <div className="space-y-2">
              {recentRepos.map(repo => (
                <button
                  key={repo}
                  onClick={() => setInput(repo)}
                  className="block w-full text-left px-4 py-3 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-100 transition"
                >
                  <code className="text-primary">{repo}</code>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 text-center text-gray-500 space-y-2">
          <p className="text-sm">
            🎸 Each commit becomes a beat • 🎹 Contributors add layers • 🎤 Music tells your story
          </p>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">OpenAI API Key</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Enter your OpenAI API key to analyze commit messages and generate music vibes.
            </p>

            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-gray-700 px-4 py-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  setTempApiKey('');
                }}
                className="flex-1 bg-gray-700 px-4 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApiKeyUpdate}
                className="flex-1 bg-primary text-dark font-bold px-4 py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Save
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
