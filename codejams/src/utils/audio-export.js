/**
 * Audio Export Utility
 * Converts Web Audio API output to downloadable WAV files
 */

export class AudioExporter {
  /**
   * Convert AudioBuffer to WAV file
   * @param {AudioBuffer} buffer - The audio buffer to convert
   * @returns {Blob} WAV file as Blob
   */
  static audioBufferToWav(buffer) {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };

    const setUint32 = (data) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // RIFF identifier
    setUint32(0x46464952); // "RIFF"
    // File length minus RIFF identifier length and file description length
    setUint32(length - 8);
    // RIFF type
    setUint32(0x45564157); // "WAVE"
    // Format chunk identifier
    setUint32(0x20746d66); // "fmt "
    // Format chunk length
    setUint32(16);
    // Sample format (raw)
    setUint16(1);
    // Channel count
    setUint16(buffer.numberOfChannels);
    // Sample rate
    setUint32(buffer.sampleRate);
    // Byte rate (sample rate * block align)
    setUint32(buffer.sampleRate * buffer.numberOfChannels * 2);
    // Block align (channel count * bytes per sample)
    setUint16(buffer.numberOfChannels * 2);
    // Bits per sample
    setUint16(16);
    // Data chunk identifier
    setUint32(0x61746164); // "data"
    // Data chunk length
    setUint32(length - pos - 4);

    // Extract channel data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    // Interleave channels
    offset = pos;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(
          offset,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true
        );
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  /**
   * Render track offline and export as WAV
   * @param {Function} generateFn - Function that generates audio (receives OfflineAudioContext)
   * @param {number} duration - Duration in seconds
   * @param {number} sampleRate - Sample rate (default: 44100)
   * @returns {Promise<Blob>} WAV file as Blob
   */
  static async renderToWav(generateFn, duration, sampleRate = 44100) {
    try {
      // Create offline context
      const offlineContext = new OfflineAudioContext(
        2, // stereo
        sampleRate * duration,
        sampleRate
      );

      // Generate audio
      await generateFn(offlineContext);

      // Render
      const renderedBuffer = await offlineContext.startRendering();

      // Convert to WAV
      return this.audioBufferToWav(renderedBuffer);
    } catch (error) {
      console.error('Error rendering audio:', error);
      throw new Error('Failed to export audio: ' + error.message);
    }
  }

  /**
   * Download blob as file
   * @param {Blob} blob - The blob to download
   * @param {string} filename - Filename for download
   */
  static downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Export track to WAV file
   * @param {Object} params - Export parameters
   * @param {Array} params.commits - Commit data
   * @param {number} params.bpm - Beats per minute
   * @param {string} params.genre - Genre name
   * @param {string} params.repoName - Repository name for filename
   * @param {Function} params.audioEngineGenerator - Function to generate audio
   * @returns {Promise<void>}
   */
  static async exportTrack({ commits, bpm, genre, repoName, audioEngineGenerator }) {
    try {
      const beatDuration = 60 / bpm;
      const totalDuration = Math.ceil(commits.length * beatDuration);

      const blob = await this.renderToWav(
        (offlineContext) => audioEngineGenerator(offlineContext),
        totalDuration
      );

      const filename = `${repoName.replace('/', '-')}-${genre}-${Date.now()}.wav`;
      this.downloadBlob(blob, filename);

      return { success: true, filename };
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }
}
