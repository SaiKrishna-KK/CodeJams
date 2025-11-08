import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Player from './components/Player';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/github.com/:owner/:repo" element={<Player />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404: Invalid URL</h1>
                <p className="text-gray-400 mb-6">
                  Please use the format: /github.com/owner/repo
                </p>
                <a href="/" className="bg-primary text-dark px-6 py-3 rounded font-bold hover:bg-opacity-90">
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
