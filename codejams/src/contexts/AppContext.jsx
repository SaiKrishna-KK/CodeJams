import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be within AppProvider');
  return context;
}

export function AppProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => {
    // First check localStorage
    const storedKey = localStorage.getItem('codejams_api_key');
    if (storedKey) return storedKey;

    // In development, try to load from .env
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envKey) return envKey;

    return null;
  });

  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('codejams_api_key', apiKey);
    }
  }, [apiKey]);

  return (
    <AppContext.Provider value={{
      apiKey,
      setApiKey,
      currentTrack,
      setCurrentTrack
    }}>
      {children}
    </AppContext.Provider>
  );
}
