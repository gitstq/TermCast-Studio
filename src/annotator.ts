/**
 * TermCast - AI Annotator
 * 
 * Automatically annotates terminal commands with descriptions
 */

import { Recording, TerminalFrame, CommandAnnotation } from './types';

// Common command patterns for annotation
const COMMAND_PATTERNS: Record<string, { description: string; category: CommandAnnotation['category']; riskLevel: CommandAnnotation['riskLevel'] }> = {
  // File operations
  'ls': { description: 'List directory contents', category: 'file', riskLevel: 'low' },
  'ls -la': { description: 'List all files with details', category: 'file', riskLevel: 'low' },
  'cd': { description: 'Change directory', category: 'file', riskLevel: 'low' },
  'pwd': { description: 'Print working directory', category: 'file', riskLevel: 'low' },
  'mkdir': { description: 'Create directory', category: 'file', riskLevel: 'low' },
  'rm': { description: 'Remove files or directories', category: 'file', riskLevel: 'high' },
  'rm -rf': { description: 'Force remove recursively (DANGEROUS)', category: 'file', riskLevel: 'high' },
  'cp': { description: 'Copy files', category: 'file', riskLevel: 'low' },
  'mv': { description: 'Move or rename files', category: 'file', riskLevel: 'low' },
  'touch': { description: 'Create empty file or update timestamp', category: 'file', riskLevel: 'low' },
  'cat': { description: 'Display file contents', category: 'file', riskLevel: 'low' },
  'head': { description: 'Display first lines of file', category: 'file', riskLevel: 'low' },
  'tail': { description: 'Display last lines of file', category: 'file', riskLevel: 'low' },
  'find': { description: 'Search for files', category: 'file', riskLevel: 'low' },
  'grep': { description: 'Search text patterns', category: 'file', riskLevel: 'low' },
  'chmod': { description: 'Change file permissions', category: 'file', riskLevel: 'medium' },
  'chown': { description: 'Change file ownership', category: 'file', riskLevel: 'medium' },

  // Git operations
  'git status': { description: 'Show git status', category: 'git', riskLevel: 'low' },
  'git log': { description: 'Show commit history', category: 'git', riskLevel: 'low' },
  'git diff': { description: 'Show changes', category: 'git', riskLevel: 'low' },
  'git add': { description: 'Stage changes', category: 'git', riskLevel: 'low' },
  'git commit': { description: 'Commit changes', category: 'git', riskLevel: 'low' },
  'git push': { description: 'Push to remote', category: 'git', riskLevel: 'medium' },
  'git pull': { description: 'Pull from remote', category: 'git', riskLevel: 'low' },
  'git clone': { description: 'Clone repository', category: 'git', riskLevel: 'low' },
  'git branch': { description: 'Manage branches', category: 'git', riskLevel: 'low' },
  'git checkout': { description: 'Switch branches', category: 'git', riskLevel: 'low' },
  'git merge': { description: 'Merge branches', category: 'git', riskLevel: 'medium' },
  'git rebase': { description: 'Rebase commits', category: 'git', riskLevel: 'medium' },

  // Network operations
  'curl': { description: 'Transfer data from URL', category: 'network', riskLevel: 'low' },
  'wget': { description: 'Download files', category: 'network', riskLevel: 'low' },
  'ping': { description: 'Test network connectivity', category: 'network', riskLevel: 'low' },
  'ssh': { description: 'Connect to remote server', category: 'network', riskLevel: 'medium' },
  'scp': { description: 'Copy files over SSH', category: 'network', riskLevel: 'medium' },
  'nc': { description: 'Netcat - network utility', category: 'network', riskLevel: 'medium' },
  'ifconfig': { description: 'Network interface config', category: 'network', riskLevel: 'low' },
  'netstat': { description: 'Network statistics', category: 'network', riskLevel: 'low' },

  // System operations
  'ps': { description: 'List processes', category: 'system', riskLevel: 'low' },
  'top': { description: 'Display processes', category: 'system', riskLevel: 'low' },
  'htop': { description: 'Interactive process viewer', category: 'system', riskLevel: 'low' },
  'kill': { description: 'Terminate process', category: 'system', riskLevel: 'medium' },
  'killall': { description: 'Kill all matching processes', category: 'system', riskLevel: 'medium' },
  'df': { description: 'Disk space usage', category: 'system', riskLevel: 'low' },
  'du': { description: 'Directory space usage', category: 'system', riskLevel: 'low' },
  'free': { description: 'Memory usage', category: 'system', riskLevel: 'low' },
  'uname': { description: 'System information', category: 'system', riskLevel: 'low' },
  'env': { description: 'Environment variables', category: 'system', riskLevel: 'low' },
  'export': { description: 'Set environment variable', category: 'system', riskLevel: 'low' },
  'source': { description: 'Execute script in current shell', category: 'system', riskLevel: 'medium' },
  'sudo': { description: 'Execute as superuser', category: 'system', riskLevel: 'high' },
  'su': { description: 'Switch user', category: 'system', riskLevel: 'high' },

  // Package managers
  'npm': { description: 'Node package manager', category: 'package', riskLevel: 'low' },
  'npm install': { description: 'Install npm packages', category: 'package', riskLevel: 'low' },
  'npm update': { description: 'Update npm packages', category: 'package', riskLevel: 'low' },
  'npm run': { description: 'Run npm script', category: 'package', riskLevel: 'low' },
  'yarn': { description: 'Yarn package manager', category: 'package', riskLevel: 'low' },
  'pip': { description: 'Python package manager', category: 'package', riskLevel: 'low' },
  'pip install': { description: 'Install Python packages', category: 'package', riskLevel: 'low' },
  'brew': { description: 'Homebrew package manager', category: 'package', riskLevel: 'low' },
  'apt': { description: 'APT package manager', category: 'package', riskLevel: 'medium' },
  'apt-get': { description: 'APT package manager', category: 'package', riskLevel: 'medium' },
  'yum': { description: 'YUM package manager', category: 'package', riskLevel: 'medium' },
  'dnf': { description: 'DNF package manager', category: 'package', riskLevel: 'medium' },
};

// Sensitive patterns
const SENSITIVE_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /credential/i,
  /auth/i,
];

export class AIAnnotator {
  /**
   * Annotate a recording with command descriptions
   */
  annotate(recording: Recording): CommandAnnotation[] {
    const annotations: CommandAnnotation[] = [];
    let buffer = '';
    let lastCommandIndex = -1;

    for (let i = 0; i < recording.frames.length; i++) {
      const frame = recording.frames[i];
      const data = Buffer.from(frame.data, 'base64').toString();
      buffer += data;

      // Detect command lines (lines ending with prompt or starting after newline)
      const lines = buffer.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip empty lines and prompts
        if (!trimmed || trimmed.match(/^[>$#]\s*$/)) continue;

        // Check if this is a command
        const annotation = this.detectCommand(trimmed, i, frame.time);
        if (annotation && i !== lastCommandIndex) {
          annotations.push(annotation);
          lastCommandIndex = i;
        }
      }
    }

    return annotations;
  }

  /**
   * Detect and annotate a command
   */
  private detectCommand(line: string, frameIndex: number, timestamp: number): CommandAnnotation | null {
    // Strip ANSI codes
    const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '').trim();
    
    // Skip if it looks like output (contains typical output patterns)
    if (cleanLine.match(/^(total|drwx|lrwx|-rw|Permissions|Owner|Group)/)) return null;
    
    // Extract the command (first word or compound command)
    const parts = cleanLine.split(/\s+/);
    if (parts.length === 0) return null;

    const baseCommand = parts[0];
    const fullCommand = cleanLine;

    // Check for compound commands (git, npm, etc.)
    const compoundCommand = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : baseCommand;

    // Look up command pattern
    let pattern = COMMAND_PATTERNS[compoundCommand] || COMMAND_PATTERNS[baseCommand];

    if (!pattern) {
      // Generate generic annotation
      pattern = {
        description: `Execute: ${baseCommand}`,
        category: 'other',
        riskLevel: 'low'
      };
    }

    // Check for sensitive data
    const hasSensitiveData = SENSITIVE_PATTERNS.some(p => p.test(fullCommand));

    return {
      frameIndex,
      timestamp,
      command: fullCommand.substring(0, 100), // Truncate long commands
      description: pattern.description,
      category: pattern.category,
      riskLevel: hasSensitiveData ? 'high' : pattern.riskLevel,
      hasSensitiveData
    };
  }

  /**
   * Get summary of commands in recording
   */
  getSummary(annotations: CommandAnnotation[]): {
    totalCommands: number;
    categories: Record<string, number>;
    riskLevels: Record<string, number>;
    sensitiveCommands: number;
  } {
    const categories: Record<string, number> = {};
    const riskLevels: Record<string, number> = {};
    let sensitiveCommands = 0;

    for (const annotation of annotations) {
      const cat = annotation.category || 'other';
      categories[cat] = (categories[cat] || 0) + 1;

      const risk = annotation.riskLevel || 'low';
      riskLevels[risk] = (riskLevels[risk] || 0) + 1;

      if (annotation.hasSensitiveData) {
        sensitiveCommands++;
      }
    }

    return {
      totalCommands: annotations.length,
      categories,
      riskLevels,
      sensitiveCommands
    };
  }

  /**
   * Generate AI-style explanation for a command
   */
  explainCommand(command: string): string {
    const parts = command.trim().split(/\s+/);
    const baseCmd = parts[0];
    
    // Check for pipes and redirects
    if (command.includes('|')) {
      return `Pipeline: ${command.split('|').map(c => c.trim()).join(' → ')}`;
    }
    
    if (command.includes('>')) {
      return `Redirects output to file`;
    }
    
    if (command.includes('<')) {
      return `Reads input from file`;
    }

    // Look up in patterns
    const pattern = COMMAND_PATTERNS[baseCmd] || COMMAND_PATTERNS[`${parts[0]} ${parts[1]}`];
    if (pattern) {
      return pattern.description;
    }

    return `Executes ${baseCmd} command`;
  }
}

/**
 * Quick annotate function
 */
export function quickAnnotate(recording: Recording): CommandAnnotation[] {
  const annotator = new AIAnnotator();
  return annotator.annotate(recording);
}
