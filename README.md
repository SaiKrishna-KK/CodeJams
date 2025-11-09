<div align="center">

# 🎵 CodeJams

**Turn your Git commits into music**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Roadmap](#-roadmap) • [Deployment](#-deployment)

Transform any GitHub repository's commit history into AI-generated music tracks. Each commit becomes a beat, contributors add layers, and the music tells your development story.

**🎧 [Try it live at codejams.dev](https://codejams.dev)**

</div>

---

## ✨ Features

### 🎼 Core Music Generation
- **AI-Powered Genre Detection**: Automatically analyzes commit messages and repo metadata to determine musical genre (Synthwave, Industrial, Ambient, Chiptune, Jazz, Techno, Rock, Lo-fi)
- **Advanced Chord Progressions**: Genre-specific harmonic structures with authentic chord voicings
- **Song Structure Sections**: Dynamically generated intro, verse, chorus, bridge, and outro based on commit patterns
- **Multi-Layered Audio**: Up to 4 instrument tracks (drums, bass, synth, vocals) that adapt to repository complexity
- **Commit-Driven Dynamics**: Music intensity responds to file changes, late-night commits, breaking changes, and more

### 🎚️ Professional Controls
- **Audio Mixer**: Individual volume controls for drums, bass, synth, and vocal layers
- **BPM Control**: Adjust tempo from 60-180 BPM to suit your preference
- **Genre Override**: Manually select from 8+ genres if you want a different vibe
- **MP3/WAV Export**: Download high-quality audio files (44.1kHz, stereo)

### 🎨 Beautiful Interface
- **Interactive Timeline**: Visualize commits with color-coded author dots, hover tooltips, and smooth animations
- **Easter Egg System**: Special visual indicators for bugs 🐛, breaking changes 💥, refactors ♻️, merges 🔀, and more
- **Genre Badges**: Visual indicators showing the detected musical style
- **Real-time Progress**: Watch the music generate and play in sync with the timeline

### 🔐 Privacy & Performance
- **100% Client-Side**: All processing happens in your browser - no backend servers
- **Privacy-First**: Your OpenAI API key is stored locally and never sent to our servers
- **Zero Friction**: Just paste a GitHub URL and hear music in seconds
- **Bookmark System**: Save your favorite repositories with automatic new commit monitoring
- **Shareable Links**: Send repository music directly to friends

---

## 🎬 Demo

### Quick Start
1. Visit the app at `http://localhost:5173`
2. Enter any GitHub repository: `facebook/react` or `microsoft/vscode`
3. Add your OpenAI API key (one-time setup)
4. Click **Generate** and hear your code!

### URL Format
```
Original:     github.com/facebook/react
CodeJams:     localhost:5173/github.com/facebook/react
```

### Try These Popular Repos
- `facebook/react` - A JavaScript library for building user interfaces
- `microsoft/vscode` - Visual Studio Code
- `vercel/next.js` - The React Framework
- `torvalds/linux` - Linux kernel source tree

---

## 🚀 Installation

### Prerequisites
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Setup

```bash
# Clone the repository
git clone https://github.com/SaiKrishna-KK/CodeJams.git
cd CodeJams/codejams

# Install dependencies
npm install

# (Optional) Set API key for development
echo "VITE_OPENAI_API_KEY=sk-your-key-here" > .env

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📖 Usage

### Basic Workflow

1. **Enter Repository**: Type `owner/repo` or paste full GitHub URL
2. **Wait for Analysis**: AI analyzes commits (5-10 seconds)
3. **Play Music**: Click the play button to hear your track
4. **Customize**: Adjust BPM, genre, or mixer levels
5. **Export**: Download as MP3 or WAV file

### Advanced Features

#### Audio Mixer
Fine-tune individual instrument tracks:
- **Drums** 🥁: Kick, snare, hi-hat patterns
- **Bass** 🎸: Low-end rhythmic foundation
- **Synth** 🎹: Melodic chord progressions
- **Vocals** 🎤: Formant-synthesized vowel sounds

#### Genre Override
Don't like the AI's choice? Override with:
- **Synthwave** 🌆: Retro 80s electronic vibes
- **Industrial** ⚙️: Heavy, mechanical soundscapes
- **Ambient** ☁️: Ethereal, atmospheric textures
- **Chiptune** 🎮: 8-bit video game nostalgia
- **Jazz** 🎺: Sophisticated chord progressions
- **Techno** 🔊: Driving electronic beats
- **Rock** 🎸: Energetic, guitar-like tones
- **Lo-fi** 📻: Chill, relaxed hip-hop beats

#### Bookmarking
- Click the bookmark icon to save repositories
- Automatically checks for new commits every 5 minutes
- Get notifications when new commits arrive
- Auto-plays new commit music

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18.3 + Vite 6.2 |
| **Styling** | Tailwind CSS v4 |
| **Audio Engine** | Web Audio API (native) |
| **Music Theory** | Custom chord progression system |
| **AI Analysis** | OpenAI GPT-4o-mini |
| **Data Source** | GitHub REST API |
| **State Management** | React Context + Hooks |
| **Routing** | React Router v7 |

---

## 🎯 Current Status

### ✅ Phase 1: Foundation (Complete)
- [x] URL routing and GitHub integration
- [x] API key management with localStorage
- [x] Commit fetching and pagination
- [x] AI-powered vibe analysis
- [x] Basic audio generation
- [x] Interactive timeline visualization
- [x] MP3/WAV export functionality
- [x] Genre override & BPM controls

### ✅ Phase 2: Advanced Music (Complete)
- [x] Chord progressions for 8+ genres
- [x] Song structure (intro/verse/chorus/bridge/outro)
- [x] Commit-driven dynamics (intensity based on metadata)
- [x] Audio mixer with individual track controls
- [x] Multi-instrument layering
- [x] Easter egg system with visual indicators

### 🚧 Phase 3: Enhanced Experience (In Progress)
See [GitHub Issues](https://github.com/SaiKrishna-KK/CodeJams/issues) for details:
- [ ] AI Lyric Generation from commit messages
- [ ] Karaoke Display component with scrolling lyrics
- [ ] Particle Visualization system
- [ ] Real-time Spectrum Analyzer

### 📅 Phase 4: Social & Advanced Features (Planned)
- [ ] Basic Singing Synthesis
- [ ] Leaderboard system (rank repos by music quality)
- [ ] Repo Comparison/Battle Mode
- [ ] Share cards with beautiful OG images
- [ ] Social media integration

---

## 🎵 How It Works

### Music Generation Pipeline

```
1. Fetch Commits      GitHub API retrieves commit history
                      ↓
2. AI Analysis        GPT-4o-mini analyzes patterns and sentiment
                      ↓
3. Genre Detection    Determines musical style from metadata
                      ↓
4. Structure Mapping  Assigns intro/verse/chorus/bridge/outro
                      ↓
5. Chord Generation   Creates genre-specific harmonic progression
                      ↓
6. Audio Synthesis    Web Audio API renders multi-track music
                      ↓
7. Playback          Real-time visualization and controls
```

### Commit-to-Music Mapping

| Commit Property | Musical Effect |
|----------------|----------------|
| **File Changes** | Increases intensity (more files = louder/busier) |
| **Late Night** (10pm-4am) | Adds intensity boost (+0.2) |
| **Breaking Changes** | Triggers orchestral hit effect |
| **Merge Commits** | Adds cowbell sound |
| **Bug Fixes** | Reduces intensity (calmer feel) |
| **Large Commits** (>20 files) | Glitch effect |
| **Author Name** | Determines vowel for vocal synthesis |
| **Commit SHA** | Generates unique melodic notes |

---

## 🔒 Privacy & Security

- **No Backend**: All processing happens client-side in your browser
- **API Key Storage**: Stored in browser `localStorage`, never transmitted to our servers
- **Direct API Calls**: Your API key only goes to OpenAI's official API
- **Public Data Only**: Uses GitHub's public API (no authentication required)
- **No Analytics**: We don't track your usage or collect data

### Managing Your API Key

**View/Change**: Click the ⚙️ icon on the home page

**Reset via DevTools**:
1. Press F12 (Chrome/Firefox) or Cmd+Option+I (Safari)
2. Go to **Application** → **Local Storage** → `http://localhost:5173`
3. Delete `codejams_api_key`
4. Refresh the page

---

## 🚀 Deployment

Want to deploy CodeJams to your own domain? See the complete [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions.

**Quick Start with Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd codejams
vercel

# Deploy to production with custom domain
vercel --prod
```

Then add your custom domain in the Vercel dashboard and configure DNS records.

For detailed instructions including Cloudflare Pages, Netlify, and GitHub Pages options, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 🤝 Contributing

CodeJams is a personal project by Krishna, but contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/SaiKrishna-KK/CodeJams/issues)!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o-mini API
- **GitHub** for public commit data
- **Web Audio API** for native audio synthesis
- All open source contributors whose repos make great music!

---

<div align="center">

**Made with 🎵 and ❤️ by Krishna**

[⭐ Star this repo](https://github.com/SaiKrishna-KK/CodeJams) • [🐛 Report Bug](https://github.com/SaiKrishna-KK/CodeJams/issues) • [💡 Request Feature](https://github.com/SaiKrishna-KK/CodeJams/issues)

</div>
