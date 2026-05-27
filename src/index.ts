/**
 * TermCast - Main Entry Point
 * 
 * Intelligent terminal recording and playback tool
 */

export { TerminalRecorder, quickRecord } from './recorder';
export { TerminalPlayer } from './player';
export { TerminalExporter, quickExport } from './exporter';
export { AIAnnotator, quickAnnotate } from './annotator';
export * from './types';

import { TerminalRecorder } from './recorder';
import { TerminalPlayer } from './player';
import { TerminalExporter } from './exporter';
import { AIAnnotator } from './annotator';

/**
 * TermCast - Main class combining all functionality
 */
export class TermCast {
  private recorder: TerminalRecorder | null = null;
  private player: TerminalPlayer | null = null;
  private annotator: AIAnnotator;

  constructor() {
    this.annotator = new AIAnnotator();
  }

  /**
   * Start recording
   */
  async record(options?: import('./types').RecorderOptions): Promise<void> {
    this.recorder = new TerminalRecorder(options);
    await this.recorder.start();
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<import('./types').Recording | null> {
    if (!this.recorder) return null;
    return this.recorder.stop();
  }

  /**
   * Load and play a recording
   */
  async play(filepath: string, options?: Partial<import('./types').PlaybackOptions>): Promise<void> {
    this.player = new TerminalPlayer(options);
    await this.player.load(filepath);
    await this.player.play();
  }

  /**
   * Export a recording
   */
  async export(
    recording: import('./types').Recording, 
    options: import('./types').ExportOptions
  ): Promise<string> {
    const exporter = new TerminalExporter(recording);
    return exporter.export(options);
  }

  /**
   * Annotate a recording
   */
  annotate(recording: import('./types').Recording): import('./types').CommandAnnotation[] {
    return this.annotator.annotate(recording);
  }
}

// Default export
export default TermCast;
