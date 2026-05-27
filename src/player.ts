/**
 * TermCast - Terminal Player
 * 
 * Plays back recorded terminal sessions
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { Recording, TerminalFrame, TerminalHeader, PlaybackOptions, SearchResult } from './types';

export class TerminalPlayer {
  private recording: Recording | null = null;
  private currentFrame: number = 0;
  private isPlaying: boolean = false;
  private playbackTimeout: NodeJS.Timeout | null = null;
  private options: PlaybackOptions;

  constructor(options: Partial<PlaybackOptions> = {}) {
    this.options = {
      speed: 1,
      loop: false,
      showTimestamps: true,
      showAnnotations: true,
      ...options
    };
  }

  /**
   * Load a recording from file
   */
  async load(filepath: string): Promise<Recording> {
    const content = await fs.readFile(filepath, 'utf-8');
    const lines = content.trim().split('\n');

    if (lines.length < 2) {
      throw new Error('Invalid recording file: not enough data');
    }

    // Parse header
    const header: TerminalHeader = JSON.parse(lines[0]);

    // Parse frames
    const frames: TerminalFrame[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        frames.push(JSON.parse(lines[i]));
      }
    }

    this.recording = {
      id: path.basename(filepath, '.cast'),
      header,
      frames,
      annotations: [],
      createdAt: header.timestamp,
      updatedAt: header.timestamp
    };

    console.log(chalk.blue(`📹 Loaded: ${this.recording.header.title || 'Untitled'}`));
    console.log(chalk.gray(`   Duration: ${this.recording.header.duration?.toFixed(2) || 'unknown'}s`));
    console.log(chalk.gray(`   Frames: ${frames.length}`));
    console.log(chalk.gray(`   Size: ${header.width}x${header.height}`));

    return this.recording;
  }

  /**
   * Start playback
   */
  async play(): Promise<void> {
    if (!this.recording) {
      throw new Error('No recording loaded');
    }

    if (this.isPlaying) {
      console.log(chalk.yellow('Already playing'));
      return;
    }

    this.isPlaying = true;
    this.currentFrame = this.options.startFrame || 0;
    const endFrame = this.options.endFrame || this.recording.frames.length - 1;

    console.log(chalk.green('\n▶️  Starting playback...\n'));
    console.log(chalk.gray('Press Ctrl+C to stop\n'));

    // Clear screen
    process.stdout.write('\x1b[2J\x1b[H');

    await this.playFrames(endFrame);
  }

  /**
   * Play frames sequentially
   */
  private async playFrames(endFrame: number): Promise<void> {
    if (!this.recording || !this.isPlaying) return;

    while (this.currentFrame <= endFrame && this.isPlaying) {
      const frame = this.recording.frames[this.currentFrame];
      
      // Calculate delay
      let delay = 0;
      if (this.currentFrame > 0) {
        const prevFrame = this.recording.frames[this.currentFrame - 1];
        delay = (frame.time - prevFrame.time) / this.options.speed;
      }

      // Wait for delay
      if (delay > 0) {
        await this.sleep(delay);
      }

      // Output frame data
      const data = Buffer.from(frame.data, 'base64').toString();
      process.stdout.write(data);

      // Show timestamp if enabled
      if (this.options.showTimestamps && this.currentFrame % 100 === 0) {
        const timestamp = this.formatTime(frame.time);
        process.stderr.write(chalk.gray(` [${timestamp}]`));
      }

      this.currentFrame++;
    }

    // Loop if enabled
    if (this.options.loop && this.isPlaying) {
      this.currentFrame = 0;
      process.stdout.write('\x1b[2J\x1b[H');
      await this.playFrames(endFrame);
    } else {
      this.isPlaying = false;
      console.log(chalk.green('\n\n✅ Playback finished'));
    }
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.isPlaying = false;
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
    }
    console.log(chalk.yellow('\n⏸️  Paused'));
  }

  /**
   * Resume playback
   */
  resume(): void {
    if (!this.recording) return;
    this.isPlaying = true;
    console.log(chalk.green('▶️  Resumed'));
    this.playFrames(this.recording.frames.length - 1);
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.isPlaying = false;
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout);
    }
    this.currentFrame = 0;
    console.log(chalk.red('\n⏹️  Stopped'));
  }

  /**
   * Jump to specific frame
   */
  seek(frameIndex: number): void {
    if (!this.recording) return;
    this.currentFrame = Math.max(0, Math.min(frameIndex, this.recording.frames.length - 1));
    console.log(chalk.blue(`⏩ Jumped to frame ${this.currentFrame}`));
  }

  /**
   * Jump to timestamp
   */
  seekToTime(timestampMs: number): void {
    if (!this.recording) return;
    
    const frameIndex = this.recording.frames.findIndex(f => f.time >= timestampMs);
    if (frameIndex !== -1) {
      this.seek(frameIndex);
    }
  }

  /**
   * Search within recording
   */
  search(query: string): SearchResult[] {
    if (!this.recording) return [];

    const results: SearchResult[] = [];
    let buffer = '';

    for (let i = 0; i < this.recording.frames.length; i++) {
      const frame = this.recording.frames[i];
      const data = Buffer.from(frame.data, 'base64').toString();
      buffer += data;

      // Remove ANSI codes for searching
      const cleanData = this.stripAnsi(buffer);
      
      if (cleanData.toLowerCase().includes(query.toLowerCase())) {
        const matchIndex = cleanData.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, matchIndex - 50);
        const end = Math.min(cleanData.length, matchIndex + query.length + 50);
        
        results.push({
          frameIndex: i,
          timestamp: frame.time,
          match: query,
          context: cleanData.substring(start, end)
        });
      }
    }

    return results;
  }

  /**
   * Get recording info
   */
  getInfo(): Recording | null {
    return this.recording;
  }

  /**
   * Format time in MM:SS.ms format
   */
  private formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const remainingMs = ms % 1000;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${remainingMs.toString().padStart(3, '0')}`;
  }

  /**
   * Strip ANSI escape codes
   */
  private stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      this.playbackTimeout = setTimeout(resolve, ms);
    });
  }
}
