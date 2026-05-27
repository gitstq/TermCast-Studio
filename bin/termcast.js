#!/usr/bin/env node

/**
 * TermCast CLI - Command Line Interface
 * 
 * Intelligent terminal recording and playback tool
 */

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { TerminalRecorder } = require('../dist/recorder');
const { TerminalPlayer } = require('../dist/player');
const { TerminalExporter } = require('../dist/exporter');
const { AIAnnotator } = require('../dist/annotator');

const VERSION = '1.0.0';
const CONFIG_DIR = path.join(os.homedir(), '.termcast');
const RECORDINGS_DIR = path.join(CONFIG_DIR, 'recordings');

// Ensure directories exist
fs.ensureDirSync(RECORDINGS_DIR);

program
  .name('termcast')
  .description('🎬 Intelligent terminal recording and playback tool')
  .version(VERSION);

// Record command
program
  .command('record [filename]')
  .description('Start recording terminal session')
  .option('-t, --title <title>', 'Recording title')
  .option('-c, --command <command>', 'Command to execute')
  .option('-o, --output <path>', 'Output directory')
  .option('--no-ai', 'Disable AI annotations')
  .action(async (filename, options) => {
    console.log(chalk.blue.bold('\n🎬 TermCast - Terminal Recorder\n'));
    
    const outputPath = options.output || RECORDINGS_DIR;
    const title = options.title || filename || 'Terminal Recording';
    
    try {
      const recorder = new TerminalRecorder({
        title,
        command: options.command,
        output: outputPath,
        enableAI: options.ai !== false
      });

      await recorder.start();

      // Handle input
      process.stdin.setRawMode(true);
      process.stdin.resume();
      
      process.stdin.on('data', (data) => {
        // Ctrl+C to stop
        if (data[0] === 3) {
          console.log(chalk.yellow('\n\n⏹️  Stopping recording...'));
          recorder.stop().then((recording) => {
            console.log(chalk.green(`\n✅ Recording saved: ${recording.id}`));
            console.log(chalk.gray(`📁 Path: ${outputPath}/${recording.id}.cast`));
            process.exit(0);
          });
        } else {
          recorder.handleInput(data);
        }
      });

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Play command
program
  .command('play <file>')
  .description('Play a recorded terminal session')
  .option('-s, --speed <speed>', 'Playback speed multiplier', '1')
  .option('--start <frame>', 'Start from frame', '0')
  .option('--end <frame>', 'End at frame')
  .option('-l, --loop', 'Loop playback', false)
  .option('--no-timestamps', 'Hide timestamps')
  .action(async (file, options) => {
    console.log(chalk.blue.bold('\n🎬 TermCast - Terminal Player\n'));
    
    const filepath = path.resolve(file);
    
    if (!fs.existsSync(filepath)) {
      console.error(chalk.red('Error:'), `File not found: ${filepath}`);
      process.exit(1);
    }

    try {
      const player = new TerminalPlayer({
        speed: parseFloat(options.speed),
        startFrame: parseInt(options.start),
        endFrame: options.end ? parseInt(options.end) : undefined,
        loop: options.loop,
        showTimestamps: options.timestamps !== false
      });

      await player.load(filepath);
      await player.play();

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Export command
program
  .command('export <file>')
  .description('Export recording to various formats')
  .option('-f, --format <format>', 'Output format (html, markdown, asciinema, gif)', 'html')
  .option('-o, --output <path>', 'Output file path')
  .option('--theme <theme>', 'Theme for HTML export (dark, light)', 'dark')
  .option('--redact', 'Redact sensitive data', false)
  .action(async (file, options) => {
    console.log(chalk.blue.bold('\n🎬 TermCast - Exporter\n'));
    
    const filepath = path.resolve(file);
    
    if (!fs.existsSync(filepath)) {
      console.error(chalk.red('Error:'), `File not found: ${filepath}`);
      process.exit(1);
    }

    try {
      // Load recording
      const player = new TerminalPlayer();
      const recording = await player.load(filepath);
      
      // Determine output path
      const ext = options.format === 'markdown' ? 'md' : 
                  options.format === 'asciinema' ? 'cast' : options.format;
      const defaultOutput = filepath.replace(/\.[^.]+$/, `.${ext}`);
      const outputPath = options.output || defaultOutput;

      const exporter = new TerminalExporter(recording);
      await exporter.export({
        format: options.format,
        output: outputPath,
        theme: options.theme,
        redactSensitive: options.redact
      });

      console.log(chalk.green(`\n✅ Exported to: ${outputPath}`));

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// List command
program
  .command('list')
  .description('List all recordings')
  .option('-d, --dir <path>', 'Recordings directory')
  .action(async (options) => {
    console.log(chalk.blue.bold('\n🎬 TermCast - Recordings\n'));
    
    const dir = options.dir || RECORDINGS_DIR;
    
    if (!fs.existsSync(dir)) {
      console.log(chalk.yellow('No recordings found.'));
      return;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.cast'));
    
    if (files.length === 0) {
      console.log(chalk.yellow('No recordings found.'));
      return;
    }

    console.log(chalk.gray(`Found ${files.length} recording(s):\n`));

    for (const file of files) {
      const filepath = path.join(dir, file);
      const stats = fs.statSync(filepath);
      const content = fs.readFileSync(filepath, 'utf-8');
      const headerLine = content.split('\n')[0];
      
      try {
        const header = JSON.parse(headerLine);
        const duration = header.duration ? `${header.duration.toFixed(2)}s` : 'N/A';
        const size = (stats.size / 1024).toFixed(2);
        
        console.log(chalk.white(`  📹 ${file}`));
        console.log(chalk.gray(`     Title: ${header.title || 'Untitled'}`));
        console.log(chalk.gray(`     Duration: ${duration} | Size: ${size}KB`));
        console.log(chalk.gray(`     Created: ${header.timestamp}`));
        console.log();
      } catch {
        console.log(chalk.white(`  📹 ${file}`));
        console.log(chalk.gray(`     Size: ${(stats.size / 1024).toFixed(2)}KB`));
        console.log();
      }
    }
  });

// Info command
program
  .command('info <file>')
  .description('Show recording details')
  .action(async (file) => {
    console.log(chalk.blue.bold('\n🎬 TermCast - Recording Info\n'));
    
    const filepath = path.resolve(file);
    
    if (!fs.existsSync(filepath)) {
      console.error(chalk.red('Error:'), `File not found: ${filepath}`);
      process.exit(1);
    }

    try {
      const player = new TerminalPlayer();
      const recording = await player.load(filepath);

      console.log(chalk.white('📋 Recording Details:\n'));
      console.log(chalk.gray(`  ID:          ${recording.id}`));
      console.log(chalk.gray(`  Title:       ${recording.header.title || 'Untitled'}`));
      console.log(chalk.gray(`  Duration:    ${recording.header.duration?.toFixed(2) || 'N/A'}s`));
      console.log(chalk.gray(`  Frames:      ${recording.frames.length}`));
      console.log(chalk.gray(`  Size:        ${recording.header.width}x${recording.header.height}`));
      console.log(chalk.gray(`  Shell:       ${recording.header.shell || 'N/A'}`));
      console.log(chalk.gray(`  Created:     ${recording.header.timestamp}`));
      
      // Annotate
      const annotator = new AIAnnotator();
      const annotations = annotator.annotate(recording);
      const summary = annotator.getSummary(annotations);

      console.log(chalk.white('\n📊 Command Summary:\n'));
      console.log(chalk.gray(`  Total Commands: ${summary.totalCommands}`));
      console.log(chalk.gray(`  Sensitive:      ${summary.sensitiveCommands}`));
      
      console.log(chalk.white('\n  By Category:'));
      for (const [cat, count] of Object.entries(summary.categories)) {
        console.log(chalk.gray(`    ${cat}: ${count}`));
      }

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Search command
program
  .command('search <file> <query>')
  .description('Search within a recording')
  .action(async (file, query) => {
    console.log(chalk.blue.bold('\n🎬 TermCast - Search\n'));
    
    const filepath = path.resolve(file);
    
    if (!fs.existsSync(filepath)) {
      console.error(chalk.red('Error:'), `File not found: ${filepath}`);
      process.exit(1);
    }

    try {
      const player = new TerminalPlayer();
      await player.load(filepath);
      
      const results = player.search(query);
      
      if (results.length === 0) {
        console.log(chalk.yellow('No matches found.'));
        return;
      }

      console.log(chalk.gray(`Found ${results.length} match(es):\n`));

      for (const result of results.slice(0, 20)) {
        console.log(chalk.white(`  Frame ${result.frameIndex} @ ${result.timestamp}ms`));
        console.log(chalk.gray(`  Context: ...${result.context}...`));
        console.log();
      }

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Convert command
program
  .command('convert <file>')
  .description('Convert between recording formats')
  .option('-f, --format <format>', 'Output format (termcast, asciinema)', 'termcast')
  .action(async (file, options) => {
    console.log(chalk.blue.bold('\n🎬 TermCast - Converter\n'));
    
    const filepath = path.resolve(file);
    
    if (!fs.existsSync(filepath)) {
      console.error(chalk.red('Error:'), `File not found: ${filepath}`);
      process.exit(1);
    }

    try {
      const player = new TerminalPlayer();
      const recording = await player.load(filepath);
      
      const exporter = new TerminalExporter(recording);
      const outputPath = filepath.replace(/\.[^.]+$/, `.${options.format === 'asciinema' ? 'cast' : 'termcast'}`);
      
      await exporter.export({
        format: options.format === 'asciinema' ? 'asciinema' : 'asciinema',
        output: outputPath
      });

      console.log(chalk.green(`\n✅ Converted to: ${outputPath}`));

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Parse arguments
program.parse();
