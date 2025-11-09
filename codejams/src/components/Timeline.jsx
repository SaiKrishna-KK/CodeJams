import { useMemo, useEffect } from 'react';

const CommitDot = ({ commit, index, currentBeat, onBeatClick, getAuthorColor }) => {
  const isActive = index === currentBeat;

  return (
    <div
      className="relative flex-shrink-0 group cursor-pointer"
      onClick={() => onBeatClick && onBeatClick(index)}
    >
      {/* Easter Egg Icons */}
      {commit.easterEggs && commit.easterEggs.length > 0 && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
          {commit.easterEggs.map((egg, eggIndex) => (
            <span
              key={eggIndex}
              className="text-lg"
              title={egg.description}
            >
              {egg.icon}
            </span>
          ))}
        </div>
      )}

      {/* Commit Circle */}
      <div className="relative">
        {isActive && (
          <div className="absolute inset-0 -m-3 rounded-full border-4 border-primary animate-ping opacity-75" />
        )}
        {isActive && (
          <div className="absolute inset-0 -m-2 rounded-full border-4 border-primary" />
        )}
        <div
          className={`w-4 h-4 rounded-full transition-all relative z-10 ${
            isActive ? 'scale-150 shadow-lg' : 'scale-100 hover:scale-125'
          }`}
          style={{
            backgroundColor: getAuthorColor(commit.author),
            boxShadow: isActive ? `0 0 20px ${getAuthorColor(commit.author)}, 0 0 40px ${getAuthorColor(commit.author)}50` : `0 0 5px ${getAuthorColor(commit.author)}50`
          }}
        />
      </div>

      {/* Tooltip */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20 border border-gray-700 shadow-xl ${
        isActive ? 'block' : 'hidden group-hover:block'
      }`}>
        <div className="font-bold text-primary">{commit.author}</div>
        <div className="text-gray-300 mt-1">{commit.message.substring(0, 40)}</div>
        {commit.easterEggs && commit.easterEggs.length > 0 && (
          <div className="text-primary mt-1">
            {commit.easterEggs.map(e => e.icon).join(' ')}
          </div>
        )}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default function Timeline({ commits, currentBeat, onBeatClick }) {
  useEffect(() => {
    console.log('🎯 Timeline: currentBeat changed to', currentBeat);
  }, [currentBeat]);

  const authors = useMemo(() => {
    return [...new Set(commits.map(c => c.author))];
  }, [commits]);

  const getAuthorColor = (author) => {
    const index = authors.indexOf(author);
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-primary flex items-center gap-2">
          <span>🎼</span> Commit Timeline
          <span className="text-xs text-gray-500 font-normal">
            ({commits.length} commits)
          </span>
        </h3>
      </div>

      {/* Timeline Container with gradient background */}
      <div className="relative">
        {/* Background gradient bar */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-gray-700 via-primary/30 to-gray-700 rounded-full"></div>

        {/* Commits */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 px-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {commits.slice(0, 50).map((commit, index) => (
            <CommitDot
              key={commit.sha}
              commit={commit}
              index={index}
              currentBeat={currentBeat}
              onBeatClick={onBeatClick}
              getAuthorColor={getAuthorColor}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-700">
        {authors.map(author => (
          <div key={author} className="flex items-center gap-2 px-3 py-1 bg-gray-900/50 rounded-full border border-gray-700/50">
            <div
              className="w-3 h-3 rounded-full shadow-lg"
              style={{ backgroundColor: getAuthorColor(author), boxShadow: `0 0 10px ${getAuthorColor(author)}50` }}
            />
            <span className="text-xs text-gray-400">{author}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
