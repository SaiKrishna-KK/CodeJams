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
          <div className="absolute inset-0 -m-2 rounded-full border-4 border-white animate-ping" />
        )}
        {isActive && (
          <div className="absolute inset-0 -m-2 rounded-full border-4 border-white" />
        )}
        <div
          className={`w-4 h-4 rounded-full transition-all relative z-10 ${
            isActive ? 'scale-150' : 'scale-100'
          }`}
          style={{
            backgroundColor: getAuthorColor(commit.author)
          }}
        />
      </div>

      {/* Tooltip */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 ${
        isActive ? 'block' : 'hidden group-hover:block'
      }`}>
        <div className="font-bold">{commit.author}</div>
        <div className="text-gray-400">{commit.message.substring(0, 40)}</div>
        {commit.easterEggs && commit.easterEggs.length > 0 && (
          <div className="text-primary mt-1">
            {commit.easterEggs.map(e => e.icon).join(' ')}
          </div>
        )}
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
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 px-2">
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

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {authors.map(author => (
          <div key={author} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getAuthorColor(author) }}
            />
            <span className="text-sm text-gray-400">{author}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
