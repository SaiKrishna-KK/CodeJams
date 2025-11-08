import { getChordProgression, getChordIndexForBeat, noteToFrequency, getMelodicScale } from '../utils/music-theory.js';

export class AudioEngine {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.isPlaying = false;
  }

  init() {
    if (this.context) return;

    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.6;
    this.masterGain.connect(this.context.destination);
  }

  /**
   * Play a chord (multiple notes simultaneously)
   */
  playChord(time, notes, duration = 0.8, intensity = 1.0) {
    notes.forEach(note => {
      const freq = typeof note === 'string' ? noteToFrequency(note) : note;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.15 * intensity, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  playKick(time) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  playSnare(time) {
    // Create noise buffer
    const bufferSize = this.context.sampleRate * 0.2;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;

    const filter = this.context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.2);
  }

  playBass(time, note = 80, duration = 0.8, intensity = 1.0) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    // Convert note to frequency if it's a string
    const freq = typeof note === 'string' ? noteToFrequency(note) : note;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.3 * intensity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  playSynth(time, frequency = 440) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(frequency, time);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  playScratch(time) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1000, time);
    osc.frequency.linearRampToValueAtTime(100, time + 0.1);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.linearRampToValueAtTime(0, time + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  playReverseCymbal(time) {
    const bufferSize = this.context.sampleRate * 0.3;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (i / bufferSize);
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.3, time);

    noise.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
  }

  playOrchestralHit(time) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, time);

    gain.gain.setValueAtTime(1.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  playDrumRoll(time) {
    for (let i = 0; i < 8; i++) {
      this.playSnare(time + (i * 0.05));
    }
  }

  playCowbell(time) {
    for (let i = 0; i < 5; i++) {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      osc.type = 'square';
      osc.frequency.value = 800 + (i * 100);

      gain.gain.setValueAtTime(0.3, time + (i * 0.1));
      gain.gain.exponentialRampToValueAtTime(0.001, time + (i * 0.1) + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time + (i * 0.1));
      osc.stop(time + (i * 0.1) + 0.1);
    }
  }

  playGlitch(time) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, time);
    osc.frequency.setValueAtTime(220, time + 0.05);
    osc.frequency.setValueAtTime(880, time + 0.1);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.setValueAtTime(0, time + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  playHiHat(time, variant = 'closed', intensity = 1.0) {
    const bufferSize = this.context.sampleRate * 0.05;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 10);
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;

    const filter = this.context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = variant === 'open' ? 8000 : 12000;

    const gain = this.context.createGain();
    const volume = (variant === 'open' ? 0.2 : 0.15) * intensity;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (variant === 'open' ? 0.2 : 0.05));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
  }

  singVowel(time, duration, vowel, pitch, intensity = 1.0) {
    const VOWELS = {
      'a': { f1: 730, f2: 1090, f3: 2440 },
      'e': { f1: 530, f2: 1840, f3: 2480 },
      'i': { f1: 270, f2: 2290, f3: 3010 },
      'o': { f1: 570, f2: 840, f3: 2410 },
      'u': { f1: 440, f2: 1020, f3: 2240 }
    };

    const formants = VOWELS[vowel] || VOWELS['a'];

    const carrier = this.context.createOscillator();
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(pitch, time);

    const filter1 = this.context.createBiquadFilter();
    const filter2 = this.context.createBiquadFilter();
    const filter3 = this.context.createBiquadFilter();

    [filter1, filter2, filter3].forEach((filter) => {
      filter.type = 'bandpass';
      filter.Q.value = 10;
    });

    filter1.frequency.value = formants.f1;
    filter2.frequency.value = formants.f2;
    filter3.frequency.value = formants.f3;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.3 * intensity, time + 0.05);
    gain.gain.setValueAtTime(0.3 * intensity, time + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0, time + duration);

    carrier.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(filter3);
    filter3.connect(gain);
    gain.connect(this.masterGain);

    carrier.start(time);
    carrier.stop(time + duration);
  }

  getVowelForAuthor(authorName) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const charCode = authorName.charCodeAt(0);
    return vowels[charCode % vowels.length];
  }

  selectBeatPattern(commit, recentCommits) {
    const PATTERNS = {
      basic: ['K', 'H', 'S', 'H', 'K', 'H', 'S', 'H'],
      energetic: ['K', 'H', 'K', 'H', 'S', 'H', 'K', 'S'],
      syncopated: ['K', 'H', 'H', 'S', 'K', 'K', 'S', 'H'],
      breakdown: ['K', 'K', 'S', 'S', 'K', 'S', 'K', 'S'],
      buildup: ['H', 'H', 'H', 'H', 'K', 'S', 'K', 'S']
    };

    if (commit.message.toLowerCase().includes('merge')) return PATTERNS.breakdown;
    if (commit.filesChanged > 15) return PATTERNS.syncopated;
    if (/feat|feature|add/i.test(commit.message)) return PATTERNS.buildup;

    if (recentCommits.length >= 3) {
      const avgTime = recentCommits.reduce((sum, c, i) => {
        if (i === 0) return sum;
        const prev = new Date(recentCommits[i - 1].date);
        const curr = new Date(c.date);
        return sum + Math.abs(prev - curr);
      }, 0) / (recentCommits.length - 1);

      if (avgTime < 3600000) return PATTERNS.energetic;
    }

    return PATTERNS.basic;
  }

  detectSongStructure(commits) {
    const sections = [];
    const totalCommits = commits.length;

    // Intro (first 8 commits or 10%)
    const introSize = Math.min(8, Math.floor(totalCommits * 0.1));
    if (introSize > 0) {
      sections.push({
        type: 'intro',
        commits: commits.slice(totalCommits - introSize, totalCommits),
        layers: ['drums'],
        intensity: 0.5
      });
    }

    // Verse (next 30%)
    const verseSize = Math.floor(totalCommits * 0.3);
    if (verseSize > 0) {
      sections.push({
        type: 'verse',
        commits: commits.slice(totalCommits - introSize - verseSize, totalCommits - introSize),
        layers: ['drums', 'bass'],
        intensity: 0.7
      });
    }

    // Find intense period for chorus
    const intensePeriod = this.findIntenseCommitPeriod(commits);
    if (intensePeriod.length >= 4) {
      sections.push({
        type: 'chorus',
        commits: intensePeriod,
        layers: ['drums', 'bass', 'synth', 'vocal'],
        intensity: 1.0
      });
    }

    // Bridge (refactors/breaking changes)
    const breakingChanges = commits.filter(c =>
      /refactor|breaking|major|rewrite/.test(c.message.toLowerCase())
    );
    if (breakingChanges.length >= 4) {
      sections.push({
        type: 'bridge',
        commits: breakingChanges.slice(0, 8),
        layers: ['bass', 'synth'],
        intensity: 0.6
      });
    }

    // Outro (last 4 commits)
    const outroSize = Math.min(4, Math.floor(totalCommits * 0.1));
    if (outroSize > 0) {
      sections.push({
        type: 'outro',
        commits: commits.slice(0, outroSize),
        layers: ['drums', 'bass'],
        intensity: 0.4
      });
    }

    // If no sections detected, return full track as one verse
    if (sections.length === 0) {
      sections.push({
        type: 'verse',
        commits: commits,
        layers: ['drums', 'bass', 'synth'],
        intensity: 0.8
      });
    }

    return sections;
  }

  findIntenseCommitPeriod(commits) {
    if (commits.length < 10) return [];

    const windowSize = 10;
    let maxDensity = 0;
    let bestWindow = [];

    for (let i = 0; i < commits.length - windowSize; i++) {
      const window = commits.slice(i, i + windowSize);
      const firstDate = new Date(window[0].date);
      const lastDate = new Date(window[windowSize - 1].date);
      const timeSpan = Math.abs(firstDate - lastDate);

      if (timeSpan === 0) continue;

      const density = windowSize / (timeSpan / (1000 * 60 * 60));

      if (density > maxDensity) {
        maxDensity = density;
        bestWindow = window;
      }
    }

    return bestWindow.length > 0 ? bestWindow : commits.slice(0, 10);
  }

  generateTrack(commits, bpm, genre, onBeat, onSection) {
    this.init();

    const beatDuration = 60 / bpm;
    const startTime = this.context.currentTime + 0.1;

    // Get chord progression for this genre
    const progression = getChordProgression(genre);
    const melodicScale = getMelodicScale(genre);

    // Just play all commits in order, no sections
    commits.forEach((commit, beatIndex) => {
      const time = startTime + (beatIndex * beatDuration);
      const pattern = this.selectBeatPattern(commit, commits.slice(Math.max(0, beatIndex - 5), beatIndex));
      const patternIndex = beatIndex % pattern.length;
      const intensity = 0.8;

      // Get current chord based on beat position
      const chordIndex = getChordIndexForBeat(beatIndex, 4); // Change chord every 4 beats
      const currentChord = progression.chords[chordIndex];
      const currentBassNote = progression.bassNotes[chordIndex];

      // Play drums based on pattern
      if (pattern[patternIndex] === 'K') {
        this.playKick(time, intensity);
      } else if (pattern[patternIndex] === 'S') {
        this.playSnare(time, intensity);
      } else if (pattern[patternIndex] === 'H') {
        this.playHiHat(time, 'closed', intensity);
      }

      // Bass (every 2 beats) - now using chord progression
      if (beatIndex % 2 === 0) {
        this.playBass(time, currentBassNote, beatDuration * 1.5, intensity);
      }

      // Chords (every 4 beats) - NEW! Play full chords
      if (beatIndex % 4 === 0) {
        this.playChord(time, currentChord, beatDuration * 3.5, intensity * 0.7);
      }

      // Melodic synth (based on commit hash) - now uses scale
      if (commit) {
        const hashNum = parseInt(commit.sha.substring(0, 2), 16);
        if (hashNum % 3 === 0) {
          const noteIndex = hashNum % melodicScale.length;
          this.playSynth(time, melodicScale[noteIndex], beatDuration * 0.8, intensity * 0.8);
        }
      }

      // Vocals (every 8th beat)
      if (beatIndex % 8 === 0 && commit) {
        const vowel = this.getVowelForAuthor(commit.author);
        const pitch = 220 + (parseInt(commit.sha.substring(0, 4), 16) % 220);
        this.singVowel(time, beatDuration * 2, vowel, pitch, intensity);
      }

      // Easter eggs
      if (commit && commit.easterEggs && commit.easterEggs.length > 0) {
        commit.easterEggs.forEach(egg => {
          const soundMethod = `play${egg.sound.charAt(0).toUpperCase() + egg.sound.slice(1)}`;
          if (this[soundMethod]) {
            this[soundMethod](time + 0.1);
          }
        });
      }

      // Callback for visualizer
      if (onBeat) {
        setTimeout(() => onBeat(beatIndex), (time - this.context.currentTime) * 1000);
      }
    });

    this.isPlaying = true;
    const totalDuration = commits.length * beatDuration;

    setTimeout(() => {
      this.isPlaying = false;
    }, totalDuration * 1000);

    return { duration: totalDuration };
  }

  stop() {
    if (this.context) {
      this.context.close();
      this.context = null;
      this.masterGain = null;
      this.isPlaying = false;
    }
  }

  /**
   * Generate track for offline rendering (export to file)
   * @param {AudioContext} context - The audio context to use (can be offline)
   * @param {Array} commits - Commit data
   * @param {number} bpm - Beats per minute
   * @param {string} genre - Genre name
   * @returns {number} Total duration in seconds
   */
  generateTrackOffline(context, commits, bpm, genre) {
    // Create master gain for this context
    const masterGain = context.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(context.destination);

    const beatDuration = 60 / bpm;
    const startTime = 0;

    // Get chord progression for this genre
    const progression = getChordProgression(genre);
    const melodicScale = getMelodicScale(genre);

    // Helper functions for offline rendering
    const playKickOffline = (time, intensity = 1.0) => {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);

      gain.gain.setValueAtTime(1 * intensity, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(time);
      osc.stop(time + 0.5);
    };

    const playSnareOffline = (time, intensity = 1.0) => {
      const bufferSize = context.sampleRate * 0.2;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = context.createBufferSource();
      noise.buffer = buffer;

      const filter = context.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;

      const gain = context.createGain();
      gain.gain.setValueAtTime(0.8 * intensity, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      noise.start(time);
      noise.stop(time + 0.2);
    };

    const playHiHatOffline = (time, variant = 'closed', intensity = 1.0) => {
      const bufferSize = context.sampleRate * 0.05;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 10);
      }

      const noise = context.createBufferSource();
      noise.buffer = buffer;

      const filter = context.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = variant === 'open' ? 8000 : 12000;

      const gain = context.createGain();
      const volume = (variant === 'open' ? 0.2 : 0.15) * intensity;
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + (variant === 'open' ? 0.2 : 0.05));

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      noise.start(time);
    };

    const playBassOffline = (time, note = 80, duration = 0.8, intensity = 1.0) => {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, time);

      gain.gain.setValueAtTime(0.3 * intensity, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(time);
      osc.stop(time + duration);
    };

    const playSynthOffline = (time, frequency = 440, duration = 0.3, intensity = 1.0) => {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(frequency, time);

      gain.gain.setValueAtTime(0.15 * intensity, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(time);
      osc.stop(time + duration);
    };

    const singVowelOffline = (time, duration, vowel, pitch, intensity = 1.0) => {
      const VOWELS = {
        'a': { f1: 730, f2: 1090, f3: 2440 },
        'e': { f1: 530, f2: 1840, f3: 2480 },
        'i': { f1: 270, f2: 2290, f3: 3010 },
        'o': { f1: 570, f2: 840, f3: 2410 },
        'u': { f1: 440, f2: 1020, f3: 2240 }
      };

      const formants = VOWELS[vowel] || VOWELS['a'];

      const carrier = context.createOscillator();
      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(pitch, time);

      const filter1 = context.createBiquadFilter();
      const filter2 = context.createBiquadFilter();
      const filter3 = context.createBiquadFilter();

      [filter1, filter2, filter3].forEach((filter) => {
        filter.type = 'bandpass';
        filter.Q.value = 10;
      });

      filter1.frequency.value = formants.f1;
      filter2.frequency.value = formants.f2;
      filter3.frequency.value = formants.f3;

      const gain = context.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.3 * intensity, time + 0.05);
      gain.gain.setValueAtTime(0.3 * intensity, time + duration - 0.1);
      gain.gain.linearRampToValueAtTime(0, time + duration);

      carrier.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(filter3);
      filter3.connect(gain);
      gain.connect(masterGain);

      carrier.start(time);
      carrier.stop(time + duration);
    };

    const playChordOffline = (time, notes, duration = 0.8, intensity = 1.0) => {
      notes.forEach(note => {
        const freq = typeof note === 'string' ? noteToFrequency(note) : note;
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.15 * intensity, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(time);
        osc.stop(time + duration);
      });
    };

    // Generate all beats
    commits.forEach((commit, beatIndex) => {
      const time = startTime + (beatIndex * beatDuration);
      const pattern = this.selectBeatPattern(commit, commits.slice(Math.max(0, beatIndex - 5), beatIndex));
      const patternIndex = beatIndex % pattern.length;
      const intensity = 0.8;

      // Get current chord based on beat position
      const chordIndex = getChordIndexForBeat(beatIndex, 4); // Change chord every 4 beats
      const currentChord = progression.chords[chordIndex];
      const currentBassNote = progression.bassNotes[chordIndex];

      // Play drums based on pattern
      if (pattern[patternIndex] === 'K') {
        playKickOffline(time, intensity);
      } else if (pattern[patternIndex] === 'S') {
        playSnareOffline(time, intensity);
      } else if (pattern[patternIndex] === 'H') {
        playHiHatOffline(time, 'closed', intensity);
      }

      // Bass (every 2 beats) - now using chord progression
      if (beatIndex % 2 === 0) {
        playBassOffline(time, currentBassNote, beatDuration * 1.5, intensity);
      }

      // Chords (every 4 beats) - NEW! Play full chords
      if (beatIndex % 4 === 0) {
        playChordOffline(time, currentChord, beatDuration * 3.5, intensity * 0.7);
      }

      // Melodic synth (based on commit hash) - now uses scale
      if (commit) {
        const hashNum = parseInt(commit.sha.substring(0, 2), 16);
        if (hashNum % 3 === 0) {
          const noteIndex = hashNum % melodicScale.length;
          playSynthOffline(time, melodicScale[noteIndex], beatDuration * 0.8, intensity * 0.8);
        }
      }

      // Vocals (every 8th beat)
      if (beatIndex % 8 === 0 && commit) {
        const vowel = this.getVowelForAuthor(commit.author);
        const pitch = 220 + (parseInt(commit.sha.substring(0, 4), 16) % 220);
        singVowelOffline(time, beatDuration * 2, vowel, pitch, intensity);
      }
    });

    return commits.length * beatDuration;
  }
}
