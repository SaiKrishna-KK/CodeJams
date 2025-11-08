import { useState } from 'react';

export default function APIKeyModal({ onSubmit, onClose }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!key.startsWith('sk-')) {
      setError('Invalid API key format');
      return;
    }
    onSubmit(key);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Enter OpenAI API Key</h2>
        <p className="text-gray-400 mb-6">
          Your key is stored locally and never sent to our servers.
        </p>

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
          className="w-full bg-gray-700 px-4 py-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary text-white"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-dark font-bold py-3 rounded hover:bg-opacity-90 transition"
        >
          Save API Key
        </button>
      </div>
    </div>
  );
}
