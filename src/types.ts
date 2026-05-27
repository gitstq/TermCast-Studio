/**
 * TermCast - Terminal Recording Types
 * 
 * Core type definitions for terminal session recording and playback
 */

export interface TerminalFrame {
  /** Timestamp in milliseconds from recording start */
  time: number;
  /** Terminal output data (base64 encoded) */
  data: string;
  /** Optional event type */
  event?: 'output' | 'input' | 'resize';
}

export interface TerminalHeader {
  /** Recording format version */
  version: number;
  /** Terminal width in columns */
  width: number;
  /** Terminal height in rows */
  height: number;
  /** Recording timestamp (ISO 8601) */
  timestamp: string;
  /** Environment variables */
  env?: Record<string, string>;
  /** Shell type */
  shell?: string;
  /** Recording title */
  title?: string;
  /** Recording duration in seconds */
  duration?: number;
  /** Command that was recorded */
  command?: string;
}

export interface Recording {
  /** Unique recording ID */
  id: string;
  /** Recording header metadata */
  header: TerminalHeader;
  /** Array of terminal frames */
  frames: TerminalFrame[];
  /** AI-generated annotations */
  annotations?: CommandAnnotation[];
  /** Recording tags */
  tags?: string[];
  /** Creation date */
  createdAt: string;
  /** Last modified date */
  updatedAt: string;
}

export interface CommandAnnotation {
  /** Frame index where command starts */
  frameIndex: number;
  /** Timestamp of the command */
  timestamp: number;
  /** The command that was executed */
  command: string;
  /** AI-generated description of what the command does */
  description: string;
  /** Command category */
  category?: 'file' | 'git' | 'network' | 'system' | 'package' | 'other';
  /** Risk level for sensitive operations */
  riskLevel?: 'low' | 'medium' | 'high';
  /** Whether this command contains sensitive data */
  hasSensitiveData?: boolean;
}

export interface PlaybackOptions {
  /** Playback speed multiplier */
  speed: number;
  /** Start from frame index */
  startFrame?: number;
  /** End at frame index */
  endFrame?: number;
  /** Loop playback */
  loop: boolean;
  /** Show timestamps */
  showTimestamps: boolean;
  /** Show annotations */
  showAnnotations: boolean;
}

export interface ExportOptions {
  /** Output format */
  format: 'gif' | 'mp4' | 'webm' | 'html' | 'markdown' | 'asciinema';
  /** Output file path */
  output: string;
  /** Video quality (for video formats) */
  quality?: 'low' | 'medium' | 'high';
  /** Frame rate for video */
  fps?: number;
  /** Theme for HTML export */
  theme?: 'dark' | 'light';
  /** Include annotations */
  includeAnnotations?: boolean;
  /** Sensitive data redaction */
  redactSensitive?: boolean;
}

export interface RecorderOptions {
  /** Recording title */
  title?: string;
  /** Command to execute */
  command?: string;
  /** Initial terminal columns */
  cols?: number;
  /** Initial terminal rows */
  rows?: number;
  /** Environment variables to capture */
  env?: Record<string, string>;
  /** Enable AI annotations */
  enableAI?: boolean;
  /** Auto-redact sensitive data */
  autoRedact?: boolean;
  /** Output file path */
  output?: string;
}

export interface SearchResult {
  /** Frame index */
  frameIndex: number;
  /** Timestamp */
  timestamp: number;
  /** Matched text */
  match: string;
  /** Context around the match */
  context: string;
}

export interface SessionInfo {
  /** Session ID */
  id: string;
  /** Session title */
  title?: string;
  /** Recording file path */
  path: string;
  /** Duration in seconds */
  duration: number;
  /** Frame count */
  frameCount: number;
  /** File size in bytes */
  size: number;
  /** Creation time */
  createdAt: Date;
}

export type RecordingFormat = 'termcast' | 'asciinema';

export interface ConverterOptions {
  /** Input format (auto-detected if not specified) */
  inputFormat?: RecordingFormat;
  /** Output format */
  outputFormat: RecordingFormat;
  /** Preserve original metadata */
  preserveMetadata?: boolean;
}
