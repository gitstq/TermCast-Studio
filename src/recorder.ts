/**
 * TermCast - Terminal Recorder
 * 
 * Records terminal sessions with PTY support
 */

import * as os from 'os';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as pty from 'node-pty';
import { 
  Recording, 
  TerminalFrame, 
  TerminalHeader, 
  RecorderOptions 
} from './types';

export class TerminalRecorder {
  private ptyProcess: pty.IPty | null = null;
  private frames: TerminalFrame[] = [];
  private startTime: number = 0;
  private isRecording: boolean = false;
  private outputBuffer: string = '';
  private options: RecorderOptions;
  private outputPath: string;

  constructor(options: RecorderOptions = {}) {
    this.options = {
      cols: process.stdout.columns || 80,
      rows: process.stdout.rows || 24,
      enableAI: true,
      autoRedact: true,
      ...options
    };
    this.outputPath = options.output || './recordings';
  }

  /**
   * Start recording a terminal session
   */
  async start(): Promise<void> {
    if (this.isRecording) {
      throw new Error('Recording is already in progress');
    }

    this.frames = [];
    this.startTime = Date.now();
    this.isRecording = true;
    this.outputBuffer = '';

    const shell = this.options.command || process.env.SHELL || '/bin/bash';
    const cols = this.options.cols || 80;
    const rows = this.options.rows || 24;

    // Create PTY process
    this.ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-256color',
      cols,
      rows,
      cwd: process.cwd(),
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        ...this.options.env
      }
    });

    // Handle PTY output
    this.ptyProcess.onData((data: string) => {
      if (this.isRecording) {
        this.addFrame(data);
        process.stdout.write(data);
      }
    });

    // Handle PTY exit
    this.ptyProcess.onExit(({ exitCode }) => {
      this.isRecording = false;
      console.log(`\n🎬 Recording stopped. Exit code: ${exitCode}`);
    });

    console.log('🎬 Recording started...');
    console.log(`📁 Output directory: ${this.outputPath}`);
    console.log('Press Ctrl+D or type "exit" to stop recording.\n');
  }

  /**
   * Add a frame to the recording
   */
  private addFrame(data: string): void {
    const frame: TerminalFrame = {
      time: Date.now() - this.startTime,
      data: Buffer.from(data).toString('base64'),
      event: 'output'
    };
    this.frames.push(frame);
    this.outputBuffer += data;
  }

  /**
   * Handle user input
   */
  handleInput(data: Buffer): void {
    if (this.ptyProcess && this.isRecording) {
      this.ptyProcess.write(data.toString());
    }
  }

  /**
   * Stop recording and save
   */
  async stop(): Promise<Recording> {
    if (!this.isRecording) {
      throw new Error('No recording in progress');
    }

    this.isRecording = false;

    if (this.ptyProcess) {
      this.ptyProcess.kill();
      this.ptyProcess = null;
    }

    const duration = (Date.now() - this.startTime) / 1000;

    const header: TerminalHeader = {
      version: 2,
      width: this.options.cols || 80,
      height: this.options.rows || 24,
      timestamp: new Date().toISOString(),
      env: {
        SHELL: process.env.SHELL || '/bin/bash',
        TERM: 'xterm-256color'
      },
      shell: process.env.SHELL,
      title: this.options.title || 'Terminal Recording',
      duration,
      command: this.options.command
    };

    const recording: Recording = {
      id: uuidv4(),
      header,
      frames: this.frames,
      annotations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save recording
    await this.saveRecording(recording);

    console.log(`\n✅ Recording saved: ${recording.id}`);
    console.log(`📊 Duration: ${duration.toFixed(2)}s`);
    console.log(`📦 Frames: ${this.frames.length}`);

    return recording;
  }

  /**
   * Save recording to file
   */
  private async saveRecording(recording: Recording): Promise<void> {
    await fs.ensureDir(this.outputPath);
    
    const filename = `recording-${recording.id}.cast`;
    const filepath = path.join(this.outputPath, filename);

    // Write header line
    const headerLine = JSON.stringify(recording.header) + '\n';
    
    // Write frames
    const frameLines = recording.frames.map(f => JSON.stringify(f)).join('\n');
    
    await fs.writeFile(filepath, headerLine + frameLines);

    // Also save metadata
    const metaPath = path.join(this.outputPath, `${recording.id}.json`);
    await fs.writeJson(metaPath, {
      id: recording.id,
      title: recording.header.title,
      duration: recording.header.duration,
      frameCount: recording.frames.length,
      createdAt: recording.createdAt,
      path: filepath
    }, { spaces: 2 });
  }

  /**
   * Get recording status
   */
  getStatus(): { isRecording: boolean; frameCount: number; duration: number } {
    return {
      isRecording: this.isRecording,
      frameCount: this.frames.length,
      duration: this.isRecording ? (Date.now() - this.startTime) / 1000 : 0
    };
  }

  /**
   * Resize terminal
   */
  resize(cols: number, rows: number): void {
    if (this.ptyProcess) {
      this.ptyProcess.resize(cols, rows);
    }
  }
}

/**
 * Quick record function
 */
export async function quickRecord(options: RecorderOptions = {}): Promise<Recording> {
  const recorder = new TerminalRecorder(options);
  await recorder.start();
  
  return new Promise((resolve, reject) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (data) => {
      // Check for Ctrl+C
      if (data[0] === 3) {
        recorder.stop().then(resolve).catch(reject);
        process.stdin.setRawMode(false);
        process.stdin.pause();
      } else {
        recorder.handleInput(data);
      }
    });
  });
}
