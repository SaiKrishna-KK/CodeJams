/**
 * Music Theory Utilities
 * Provides chord progressions, scales, and harmonic structures for each genre
 */

/**
 * Convert note name to frequency in Hz
 * @param {string} note - Note name (e.g., 'C4', 'A#3')
 * @returns {number} Frequency in Hz
 */
export function noteToFrequency(note) {
  const noteMap = {
    'C': -9, 'C#': -8, 'Db': -8,
    'D': -7, 'D#': -6, 'Eb': -6,
    'E': -5,
    'F': -4, 'F#': -3, 'Gb': -3,
    'G': -2, 'G#': -1, 'Ab': -1,
    'A': 0, 'A#': 1, 'Bb': 1,
    'B': 2
  };

  const match = note.match(/([A-G][#b]?)(\d)/);
  if (!match) return 440; // Default to A4

  const [, noteName, octave] = match;
  const semitones = noteMap[noteName];
  const octaveOffset = (parseInt(octave) - 4) * 12;

  return 440 * Math.pow(2, (semitones + octaveOffset) / 12);
}

/**
 * Chord progressions for each genre
 * Each chord is an array of note names
 */
export const CHORD_PROGRESSIONS = {
  synthwave: {
    // Emotional, nostalgic (Dm → Am → F → C)
    chords: [
      ['D3', 'F3', 'A3'],    // Dm
      ['A2', 'C3', 'E3'],    // Am
      ['F2', 'A2', 'C3'],    // F
      ['C3', 'E3', 'G3']     // C
    ],
    bassNotes: ['D2', 'A2', 'F2', 'C2'],
    name: 'vi-iii-IV-I (Emotional)',
    color: 'warm'
  },

  industrial: {
    // Powerful, heavy (Em → C → G → D)
    chords: [
      ['E3', 'G3', 'B3'],    // Em
      ['C3', 'E3', 'G3'],    // C
      ['G2', 'B2', 'D3'],    // G
      ['D3', 'F#3', 'A3']    // D
    ],
    bassNotes: ['E2', 'C2', 'G2', 'D2'],
    name: 'i-VI-III-VII (Powerful)',
    color: 'dark'
  },

  ambient: {
    // Dreamy, floating (Am → F → C → G)
    chords: [
      ['A3', 'C4', 'E4'],    // Am
      ['F3', 'A3', 'C4'],    // F
      ['C3', 'E3', 'G3'],    // C
      ['G3', 'B3', 'D4']     // G
    ],
    bassNotes: ['A2', 'F2', 'C2', 'G2'],
    name: 'vi-IV-I-V (Dreamy)',
    color: 'ethereal'
  },

  chiptune: {
    // Upbeat, playful (C → G → Am → F)
    chords: [
      ['C4', 'E4', 'G4'],    // C
      ['G3', 'B3', 'D4'],    // G
      ['A3', 'C4', 'E4'],    // Am
      ['F3', 'A3', 'C4']     // F
    ],
    bassNotes: ['C2', 'G2', 'A2', 'F2'],
    name: 'I-V-vi-IV (Pop)',
    color: 'bright'
  },

  experimental: {
    // Unpredictable, jazzy (Cmaj7 → Fmaj7 → Gmaj7 → Amin7)
    chords: [
      ['C3', 'E3', 'G3', 'B3'],     // Cmaj7
      ['F3', 'A3', 'C4', 'E4'],     // Fmaj7
      ['G3', 'B3', 'D4', 'F#4'],    // Gmaj7
      ['A3', 'C4', 'E4', 'G4']      // Am7
    ],
    bassNotes: ['C2', 'F2', 'G2', 'A2'],
    name: 'I-IV-V-vi (Jazz)',
    color: 'complex'
  }
};

/**
 * Get chord progression for a genre
 * @param {string} genre - Genre name
 * @returns {Object} Chord progression data
 */
export function getChordProgression(genre) {
  const genreKey = genre?.toLowerCase() || 'experimental';
  return CHORD_PROGRESSIONS[genreKey] || CHORD_PROGRESSIONS.experimental;
}

/**
 * Get the chord index for a specific beat
 * @param {number} beatIndex - Current beat number
 * @param {number} beatsPerChord - How many beats per chord (default: 4)
 * @returns {number} Chord index (0-3)
 */
export function getChordIndexForBeat(beatIndex, beatsPerChord = 4) {
  return Math.floor(beatIndex / beatsPerChord) % 4;
}

/**
 * Generate melodic scale for a genre
 * @param {string} genre - Genre name
 * @returns {Array<number>} Array of frequencies for melody
 */
export function getMelodicScale(genre) {
  const scales = {
    synthwave: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'], // Pentatonic major
    industrial: ['E3', 'G3', 'A3', 'B3', 'D4', 'E4', 'G4', 'A4'], // Minor pentatonic
    ambient: ['A3', 'B3', 'C4', 'E4', 'F4', 'A4', 'B4', 'C5'],   // Aeolian
    chiptune: ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'],        // Arpeggio
    experimental: ['C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5'] // Lydian
  };

  const genreKey = genre?.toLowerCase() || 'experimental';
  const scale = scales[genreKey] || scales.experimental;

  return scale.map(noteToFrequency);
}
