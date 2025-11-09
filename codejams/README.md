# 🎵 CodeJams

Transform GitHub repository commit history into auto-generated music tracks. Hear what your coding journey sounds like!

## Features

- **Zero friction**: Edit URL, hear music in seconds
- **Privacy-first**: API keys never leave the browser
- **100% client-side**: No backend costs, fully static deployment
- **Shareable**: Send links to friends instantly

## How It Works

1. Navigate to any public GitHub repo you want to "hear"
2. Add `localhost:5173/` before the GitHub URL
3. Enter your OpenAI API key (first time only)
4. Listen to your commits!

### Example

```
github.com/facebook/react
      ↓
localhost:5173/github.com/facebook/react
```

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API (native, no libraries)
- **LLM**: OpenAI GPT-4o-mini
- **Data**: GitHub REST API

## Getting Started

### Prerequisites

- Node.js 16+
- OpenAI API key

### Installation

```bash
# Install dependencies
npm install

# (Optional) Set up your API key for local development
# Create a .env file in the root directory:
echo "VITE_OPENAI_API_KEY=your-api-key-here" > .env

# Start dev server
npm run dev
```

**Note:** If you set `VITE_OPENAI_API_KEY` in `.env`, the app will auto-load it during development, skipping the API key modal.

### Build for Production

```bash
npm run build
```

## Usage

1. Start the dev server (default: http://localhost:5173)
2. Click on example repositories or manually navigate to `/github.com/{owner}/{repo}`
3. Enter your OpenAI API key when prompted
4. Wait for analysis (5-10 seconds)
5. Click "Play" to hear your code!

## API Key Storage

Your OpenAI API key is stored in `localStorage` and never sent to any server except OpenAI's API directly from your browser.

To reset your API key:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Delete the `codejams_api_key` entry
4. Refresh the page

## Current Features

### Tier 1 - MVP ✅
- ✅ URL routing and parsing
- ✅ API key management
- ✅ GitHub commit fetching
- ✅ LLM-powered vibe analysis
- ✅ Basic drum pattern generation (kick + snare)
- ✅ Commit timeline visualization
- ✅ Shareable links

### Tier 2 - Enhanced Features ✅
- ✅ **Genre detection** (synthwave 🌆, industrial ⚙️, ambient ☁️, chiptune 🎮)
- ✅ **Multi-layered audio** (drums + bass + synth based on contributor count)
- ✅ **Easter eggs** (🐛 bugs, 💥 breaking changes, ♻️ refactors, 🔀 merges, 🚧 WIP, 🔔 frustration)
- ✅ **Enhanced visualizer** with easter egg icons and genre badges

## Roadmap

### Tier 3 (Polish)
- [ ] Export to MP3
- [ ] Waveform visualization
- [ ] Social sharing (Twitter, Discord)
- [ ] Settings panel (volume, LLM provider)
- [ ] Smooth animations

## Contributing

This is a personal project by Krishna. Feel free to fork and experiment!

## License

MIT

---

Made with 🎵 by Krishna
