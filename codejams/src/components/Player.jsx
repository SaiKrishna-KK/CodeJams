import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { fetchCommits } from '../services/github';
import { analyzeCommits } from '../services/llm';
import { AudioEngine } from '../services/audio';
import { detectEasterEggs } from '../utils/easter-eggs';
import { AudioExporter } from '../utils/audio-export';
import { GENRES } from '../utils/genre-detector';
import APIKeyModal from './APIKeyModal';
import Timeline from './Timeline';

export default function Player() {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { apiKey, setApiKey } = useApp();

  const [commits, setCommits] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [showKeyModal, setShowKeyModal] = useState(!apiKey);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [customGenre, setCustomGenre] = useState(null);
  const [customBPM, setCustomBPM] = useState(null);
  const [showControls, setShowControls] = useState(false);

  const audioEngine = useRef(new AudioEngine());

  // Get effective genre and BPM (custom or original)
  const effectiveGenre = customGenre || analysis?.genre;
  const effectiveBPM = customBPM || analysis?.bpm;

  useEffect(() => {
    // Check if this repo is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('codejams_bookmarks') || '[]');
    const bookmarked = bookmarks.some(b => b.owner === owner && b.repo === repo);
    setIsBookmarked(bookmarked);
  }, [owner, repo]);

  useEffect(() => {
    if (!apiKey) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Fetch commits
        const commitsData = await fetchCommits(owner, repo);

        // Add easter egg detection
        const commitsWithEggs = detectEasterEggs(commitsData);
        setCommits(commitsWithEggs);

        // Analyze with LLM
        const analysisData = await analyzeCommits(commitsData, apiKey);
        setAnalysis(analysisData);

        setLoading(false);

        // Autoplay if query param is present
        if (searchParams.get('autoplay') === 'true') {
          setTimeout(() => {
            handlePlay();
          }, 1000);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    load();

    return () => {
      audioEngine.current.stop();
    };
  }, [owner, repo, apiKey, searchParams]);

  const handlePlay = () => {
    if (!analysis) return;

    setIsPlaying(true);
    setCurrentBeat(0);

    const result = audioEngine.current.generateTrack(
      commits,
      effectiveBPM,
      effectiveGenre,
      (beatIndex) => {
        console.log('🔔 Beat callback received:', beatIndex);
        setCurrentBeat(beatIndex);
        console.log('✏️ setCurrentBeat called with:', beatIndex);
      }
    );

    // Reset after playback
    setTimeout(() => {
      setIsPlaying(false);
    }, result.duration * 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied! 🎵');
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('codejams_bookmarks') || '[]');

    if (isBookmarked) {
      // Remove bookmark
      const updated = bookmarks.filter(b => !(b.owner === owner && b.repo === repo));
      localStorage.setItem('codejams_bookmarks', JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      // Add bookmark
      const newBookmark = {
        owner,
        repo,
        lastCommitSha: commits[0]?.sha || null,
        lastCommitMessage: commits[0]?.message || null,
        addedAt: new Date().toISOString(),
        genre: analysis?.genre,
        genreEmoji: analysis?.genreEmoji
      };
      const updated = [newBookmark, ...bookmarks];
      localStorage.setItem('codejams_bookmarks', JSON.stringify(updated));
      setIsBookmarked(true);
    }
  };

  const handleExport = async () => {
    if (!analysis || isExporting) return;

    try {
      setIsExporting(true);

      const beatDuration = 60 / effectiveBPM;
      const totalDuration = Math.ceil(commits.length * beatDuration);
      const sampleRate = 44100;

      // Create offline audio context
      const offlineContext = new OfflineAudioContext(
        2,
        sampleRate * totalDuration,
        sampleRate
      );

      // Generate audio offline
      const engine = new AudioEngine();
      engine.generateTrackOffline(offlineContext, commits, effectiveBPM, effectiveGenre);

      // Render to buffer
      const renderedBuffer = await offlineContext.startRendering();

      // Convert to WAV
      const blob = AudioExporter.audioBufferToWav(renderedBuffer);

      // Download
      const filename = `${owner}-${repo}-${effectiveGenre}-${Date.now()}.wav`;
      AudioExporter.downloadBlob(blob, filename);

      // Show success message
      alert(`Track exported successfully! 🎵\n\nFile: ${filename}`);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (showKeyModal) {
    return (
      <APIKeyModal
        onSubmit={(key) => {
          setApiKey(key);
          setShowKeyModal(false);
        }}
        onClose={() => navigate('/')}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🎵</div>
          <p className="text-xl">Analyzing {repo}...</p>
          <p className="text-gray-400 mt-2">Fetching commits and generating vibe</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">⚠️ Error</h2>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-gray-700 px-6 py-2 rounded hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg font-bold hover:from-green-500 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
            >
              {isExporting ? '⏳ Exporting...' : '⬇️ Download WAV'}
            </button>
            <button
              onClick={handleBookmark}
              className={`px-4 py-2 rounded-lg transition shadow-lg ${
                isBookmarked
                  ? 'bg-primary text-dark font-bold hover:bg-opacity-90'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 text-white transition shadow-lg"
            >
              🔗 Share
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">
              🎵 {owner}/{repo}
            </h1>
            {GENRES[effectiveGenre?.toLowerCase()]?.emoji && (
              <span className="bg-primary text-dark px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {GENRES[effectiveGenre.toLowerCase()].emoji} {effectiveGenre.toUpperCase()}
              </span>
            )}
            {customGenre && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                CUSTOM
              </span>
            )}
          </div>
          <p className="text-xl text-gray-400 italic">
            "{analysis?.vibe}"
          </p>
        </div>

        {/* Customization Controls */}
        <div className="mb-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 shadow-2xl border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary">🎛️ Customize Track</h3>
            <button
              onClick={() => setShowControls(!showControls)}
              className="text-sm text-gray-400 hover:text-primary transition"
            >
              {showControls ? '▲ Hide' : '▼ Show Controls'}
            </button>
          </div>

          {showControls && (
            <div className="space-y-6">
              {/* Genre Override */}
              <div>
                <label className="block text-sm text-gray-400 mb-3 font-bold">
                  🎸 Genre Override
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Object.entries(GENRES).map(([key, genre]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCustomGenre(genre.name);
                        // Auto-adjust BPM to genre's middle range
                        if (!customBPM) {
                          const midBPM = Math.floor((genre.bpmRange[0] + genre.bpmRange[1]) / 2);
                          setCustomBPM(midBPM);
                        }
                      }}
                      className={`px-4 py-3 rounded-lg font-bold transition shadow-lg ${
                        effectiveGenre === genre.name
                          ? 'bg-primary text-dark scale-105'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{genre.emoji}</div>
                      <div className="text-xs">{genre.name}</div>
                    </button>
                  ))}
                </div>
                {customGenre && (
                  <button
                    onClick={() => {
                      setCustomGenre(null);
                      setCustomBPM(null);
                    }}
                    className="mt-3 text-sm text-red-400 hover:text-red-300 transition"
                  >
                    ✕ Reset to Auto-Detected
                  </button>
                )}
              </div>

              {/* BPM Control */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-gray-400 font-bold">
                    🥁 Tempo (BPM)
                  </label>
                  <span className="text-2xl font-bold text-primary">{effectiveBPM}</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={effectiveBPM}
                  onChange={(e) => setCustomBPM(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #00ff94 0%, #00ff94 ${((effectiveBPM - 60) / 120) * 100}%, #4b5563 ${((effectiveBPM - 60) / 120) * 100}%, #4b5563 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Slow (60)</span>
                  <span>Medium (120)</span>
                  <span>Fast (180)</span>
                </div>
                {customBPM && (
                  <button
                    onClick={() => setCustomBPM(null)}
                    className="mt-2 text-sm text-red-400 hover:text-red-300 transition"
                  >
                    ✕ Reset BPM
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <Timeline
            commits={commits}
            currentBeat={currentBeat}
            onBeatClick={(beatIndex) => {
              setCurrentBeat(beatIndex);
            }}
          />
        </div>

        {/* Current Commit Info */}
        {commits[currentBeat] && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-3xl">
                {commits[currentBeat].easterEggs && commits[currentBeat].easterEggs.length > 0
                  ? commits[currentBeat].easterEggs.map(e => e.icon).join(' ')
                  : '💬'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-primary font-bold">{commits[currentBeat].author}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(commits[currentBeat].timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-lg mb-2">{commits[currentBeat].message}</p>
                <div className="text-sm text-gray-400">
                  Commit {currentBeat + 1} of {commits.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="bg-primary text-dark font-bold px-8 py-4 rounded-lg text-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPlaying ? '⏸ Playing...' : '▶ Play'}
          </button>

          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="bg-gray-700 px-6 py-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            🔄 Replay
          </button>
        </div>

        {/* Stats */}
        <div className="text-center text-gray-400">
          <p>
            {commits.length} commits • {[...new Set(commits.map(c => c.author))].length} contributors • {effectiveBPM} BPM
            {customBPM && <span className="text-primary ml-2">(Custom)</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
