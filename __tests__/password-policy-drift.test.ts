/**
 * @ai-context Password Policy Drift Test | Ensures all codebases use shared PASSWORD_POLICY
 *
 * This test verifies that no endpoint or validation schema drifts from the
 * centralized PASSWORD_POLICY in @hollis/contracts/password.
 *
 * If this test fails, you likely have a hardcoded password requirement somewhere.
 * Fix it by importing PASSWORD_POLICY from @contracts and using its values.
 */

import fs from 'fs';
import path from 'path';
import { PASSWORD_POLICY } from '../index';

// __dirname is shared/contracts/__tests__, so go up 3 levels to workspace root
const WORKSPACE_ROOT = path.resolve(__dirname, '../../..');

// Patterns that indicate hardcoded password requirements
const HARDCODED_PATTERNS = [
  // Hardcoded min lengths (not using PASSWORD_POLICY)
  /password.*\.min\(8\)/gi,
  /password.*min.*8/gi,
  // Old-style complexity regex that we no longer enforce
  /password.*regex.*\[A-Z\]/gi,
  /password.*regex.*\[a-z\]/gi,
  /password.*regex.*\[0-9\]/gi,
  // Hardcoded length checks not using PASSWORD_POLICY
  /password\.length\s*[<>]=?\s*8/gi,
  /password\.length\s*[<>]=?\s*128/gi,
];

// Files to skip (test files, node_modules, generated, etc.)
const SKIP_PATTERNS = [
  /node_modules/,
  /\.next/,
  /dist/,
  /coverage/,
  /\.git/,
  /password\.test\.ts$/, // Password tests can reference values directly
  /password-policy-drift\.test\.ts$/, // This test file
  /password\/index\.ts$/, // The source of truth itself
  /\.d\.ts$/, // Type declarations
];

// Directories to scan
const SCAN_DIRS = [
  'src/contracts',
  'server/src/validation',
  'server/src/lib',
  'web-admin/contracts',
];

interface Violation {
  file: string;
  line: number;
  content: string;
  pattern: string;
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  
  // Skip excluded files
  if (SKIP_PATTERNS.some(pattern => pattern.test(filePath))) {
    return violations;
  }

  // Only scan TypeScript files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return violations;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip if line imports or uses PASSWORD_POLICY
    if (line.includes('PASSWORD_POLICY')) {
      continue;
    }

    for (const pattern of HARDCODED_PATTERNS) {
      // Reset regex lastIndex for global patterns
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        violations.push({
          file: filePath,
          line: i + 1,
          content: line.trim(),
          pattern: pattern.source,
        });
      }
    }
  }

  return violations;
}

function scanDirectory(dir: string): Violation[] {
  const violations: Violation[] = [];
  const fullPath = path.join(WORKSPACE_ROOT, dir);

  if (!fs.existsSync(fullPath)) {
    return violations;
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(fullPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recurse into subdirectories
      if (!SKIP_PATTERNS.some(pattern => pattern.test(entryPath))) {
        violations.push(...scanDirectoryRecursive(entryPath));
      }
    } else {
      violations.push(...scanFile(entryPath));
    }
  }

  return violations;
}

function scanDirectoryRecursive(dir: string): Violation[] {
  const violations: Violation[] = [];

  if (!fs.existsSync(dir)) {
    return violations;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!SKIP_PATTERNS.some(pattern => pattern.test(entryPath))) {
        violations.push(...scanDirectoryRecursive(entryPath));
      }
    } else {
      violations.push(...scanFile(entryPath));
    }
  }

  return violations;
}

describe('Password Policy Drift Detection', () => {
  it('should have PASSWORD_POLICY with correct minimum length', () => {
    expect(PASSWORD_POLICY.MIN_LENGTH).toBe(10);
    expect(PASSWORD_POLICY.MAX_LENGTH).toBe(128);
    expect(PASSWORD_POLICY.MIN_ZXCVBN_SCORE).toBe(3);
  });

  it('should not have hardcoded password requirements outside of PASSWORD_POLICY', () => {
    const violations: Violation[] = [];

    for (const dir of SCAN_DIRS) {
      violations.push(...scanDirectory(dir));
    }

    if (violations.length > 0) {
      const message = violations
        .map(v => `  ${v.file}:${v.line} - "${v.content}"`)
        .join('\n');
      
      fail(
        `Found ${violations.length} hardcoded password requirement(s):\n${message}\n\n` +
        `Fix by using PASSWORD_POLICY.MIN_LENGTH or PASSWORD_POLICY.MAX_LENGTH from @contracts.`
      );
    }
  });

  it('should export PASSWORD_POLICY from @contracts index', async () => {
    // Verify the shared contracts properly export PASSWORD_POLICY
    const sharedContractsPath = path.join(WORKSPACE_ROOT, 'shared/contracts/index.ts');
    const content = fs.readFileSync(sharedContractsPath, 'utf-8');
    
    expect(content).toContain('PASSWORD_POLICY');
  });

  it('should have PASSWORD_POLICY re-exported from src/contracts', async () => {
    // Verify mobile/feature contracts re-export PASSWORD_POLICY
    const srcContractsPath = path.join(WORKSPACE_ROOT, 'src/contracts/index.ts');
    const content = fs.readFileSync(srcContractsPath, 'utf-8');
    
    expect(content).toContain('PASSWORD_POLICY');
  });
});
