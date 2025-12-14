import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

interface ReviewRequest {
  files: string[];
  context?: string;
}

interface ReviewIssue {
  severity: 'critical' | 'major' | 'minor' | 'info';
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

interface ReviewResult {
  success: boolean;
  issues: ReviewIssue[];
  summary: {
    total: number;
    critical: number;
    major: number;
    minor: number;
    info: number;
  };
  score: number; // 0-100
  timestamp: Date;
}

class CodeReviewer {
  private apiKey: string;
  private baseURL: string = 'https://api.groq.com/openai/v1';

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    this.apiKey = process.env.CODERABBIT_API_KEY || this.apiKey;
  }

  /**
   * Review code files using AI (CodeRabbit-inspired)
   */
  async review(request: ReviewRequest): Promise<ReviewResult> {
    console.log('🔍 Starting code review...');
    console.log(`📁 Files to review: ${request.files.length}`);

    try {
      const issues: ReviewIssue[] = [];

      for (const filePath of request.files) {
        console.log(`\n📄 Reviewing: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️  File not found: ${filePath}`);
          continue;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const fileIssues = await this.reviewFile(filePath, content, request.context);
        issues.push(...fileIssues);
      }

      const summary = this.calculateSummary(issues);
      const score = this.calculateScore(summary);

      console.log('\n✅ Code review completed!');

      return {
        success: true,
        issues,
        summary,
        score,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Code review failed:', error);
      return {
        success: false,
        issues: [],
        summary: { total: 0, critical: 0, major: 0, minor: 0, info: 0 },
        score: 0,
        timestamp: new Date()
      };
    }
  }

  /**
   * Review a single file
   */
  private async reviewFile(
    filePath: string,
    content: string,
    context?: string
  ): Promise<ReviewIssue[]> {
    // First, run basic static analysis
    const staticIssues = this.staticAnalysis(filePath, content);

    // Then, use AI for deeper review if API key available
    if (this.apiKey && this.apiKey.length > 10) {
      const aiIssues = await this.aiReview(filePath, content, context);
      return [...staticIssues, ...aiIssues];
    }

    return staticIssues;
  }

  /**
   * Static analysis (pattern-based)
   */
  private staticAnalysis(filePath: string, content: string): ReviewIssue[] {
    const issues: ReviewIssue[] = [];
    const lines = content.split('\n');

    // Check for common issues
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // TODO comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          severity: 'minor',
          file: filePath,
          line: lineNum,
          message: 'TODO comment found',
          suggestion: 'Consider creating a task or fixing the issue'
        });
      }

      // Console.log in production code
      if (line.includes('console.log') && !filePath.includes('test')) {
        issues.push({
          severity: 'minor',
          file: filePath,
          line: lineNum,
          message: 'Console.log found in production code',
          suggestion: 'Use proper logging framework'
        });
      }

      // Any type in TypeScript
      if (line.includes(': any')) {
        issues.push({
          severity: 'major',
          file: filePath,
          line: lineNum,
          message: 'Use of "any" type',
          suggestion: 'Specify proper type for better type safety'
        });
      }

      // Empty catch blocks
      if (line.trim() === 'catch {}' || line.trim() === 'catch(){}') {
        issues.push({
          severity: 'critical',
          file: filePath,
          line: lineNum,
          message: 'Empty catch block',
          suggestion: 'Handle errors properly or at least log them'
        });
      }

      // Long lines
      if (line.length > 120) {
        issues.push({
          severity: 'info',
          file: filePath,
          line: lineNum,
          message: 'Line too long (>120 characters)',
          suggestion: 'Consider breaking into multiple lines'
        });
      }
    });

    // Check for missing error handling
    if (content.includes('async ') && !content.includes('try') && !content.includes('catch')) {
      issues.push({
        severity: 'major',
        file: filePath,
        message: 'Async function without error handling',
        suggestion: 'Add try-catch block for async operations'
      });
    }

    // Check for security issues
    if (content.includes('eval(')) {
      issues.push({
        severity: 'critical',
        file: filePath,
        message: 'Use of eval() detected',
        suggestion: 'Avoid eval() as it poses security risks'
      });
    }

    return issues;
  }

  /**
   * AI-powered review using Together AI
   */
  private async aiReview(
    filePath: string,
    content: string,
    context?: string
  ): Promise<ReviewIssue[]> {
    try {
      const systemPrompt = `You are an expert code reviewer. Analyze the following code and identify:
1. Security vulnerabilities
2. Performance issues
3. Code quality problems
4. Best practice violations
5. Potential bugs

For each issue, provide:
- Severity (critical/major/minor/info)
- Line number (if applicable)
- Description
- Suggestion for improvement

${context ? `Context: ${context}` : ''}

Format your response as JSON array of issues.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `File: ${filePath}\n\n${content}` }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        console.warn('⚠️  AI review failed, using static analysis only');
        return [];
      }

      const data = await response.json() as any;
      const aiResponse = data.choices[0].message.content;

      // Parse AI response
      return this.parseAIReview(aiResponse, filePath);
    } catch (error) {
      console.warn('⚠️  AI review error:', error);
      return [];
    }
  }

  /**
   * Parse AI review response
   */
  private parseAIReview(response: string, filePath: string): ReviewIssue[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const issues = JSON.parse(jsonMatch[0]);
        return issues.map((issue: any) => ({
          severity: issue.severity || 'info',
          file: filePath,
          line: issue.line,
          message: issue.message || issue.description,
          suggestion: issue.suggestion
        }));
      }
    } catch (error) {
      console.warn('⚠️  Failed to parse AI review response');
    }
    return [];
  }

  /**
   * Calculate issue summary
   */
  private calculateSummary(issues: ReviewIssue[]) {
    return {
      total: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      major: issues.filter(i => i.severity === 'major').length,
      minor: issues.filter(i => i.severity === 'minor').length,
      info: issues.filter(i => i.severity === 'info').length
    };
  }

  /**
   * Calculate quality score (0-100)
   */
  private calculateScore(summary: any): number {
    const weights = {
      critical: 20,
      major: 10,
      minor: 3,
      info: 1
    };

    const deductions = 
      summary.critical * weights.critical +
      summary.major * weights.major +
      summary.minor * weights.minor +
      summary.info * weights.info;

    return Math.max(0, 100 - deductions);
  }

  /**
   * Generate review report
   */
  generateReport(result: ReviewResult): string {
    let report = '\n' + '='.repeat(60) + '\n';
    report += '📊 CODE REVIEW REPORT\n';
    report += '='.repeat(60) + '\n\n';

    report += `🎯 Overall Score: ${result.score}/100\n\n`;

    report += '📈 Issue Summary:\n';
    report += `  Total: ${result.summary.total}\n`;
    report += `  🔴 Critical: ${result.summary.critical}\n`;
    report += `  🟡 Major: ${result.summary.major}\n`;
    report += `  🟢 Minor: ${result.summary.minor}\n`;
    report += `  ℹ️  Info: ${result.summary.info}\n\n`;

    if (result.issues.length > 0) {
      report += '🔍 Issues Found:\n\n';
      
      result.issues.forEach((issue, index) => {
        const icon = {
          critical: '🔴',
          major: '🟡',
          minor: '🟢',
          info: 'ℹ️'
        }[issue.severity];

        report += `${index + 1}. ${icon} ${issue.severity.toUpperCase()}\n`;
        report += `   File: ${issue.file}\n`;
        if (issue.line) report += `   Line: ${issue.line}\n`;
        report += `   Issue: ${issue.message}\n`;
        if (issue.suggestion) report += `   💡 Suggestion: ${issue.suggestion}\n`;
        report += '\n';
      });
    } else {
      report += '✅ No issues found! Great job!\n\n';
    }

    report += '='.repeat(60) + '\n';

    return report;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Review generated directory by default
    const generatedDir = './generated';
    
    if (!fs.existsSync(generatedDir)) {
      console.error('❌ No generated code found. Run code generation first:');
      console.error('   npm run agent:generate -- "your prompt"');
      process.exit(1);
    }

    // Find all code files in generated directory
    const files = findCodeFiles(generatedDir);
    
    if (files.length === 0) {
      console.error('❌ No code files found in generated directory');
      process.exit(1);
    }

    console.log(`Found ${files.length} files to review\n`);
    
    const reviewer = new CodeReviewer();
    const result = await reviewer.review({ files });

    // Display report
    console.log(reviewer.generateReport(result));

    // Save report to file
    const reportPath = path.join(generatedDir, 'review-report.txt');
    fs.writeFileSync(reportPath, reviewer.generateReport(result));
    console.log(`\n📄 Report saved to: ${reportPath}`);

    // Save JSON result
    const jsonPath = path.join(generatedDir, 'review-result.json');
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
    console.log(`📄 JSON result saved to: ${jsonPath}`);

    console.log('\n🔜 Next step: Run Kestra workflow orchestration');
  } else {
    // Review specific files
    const reviewer = new CodeReviewer();
    const result = await reviewer.review({ files: args });
    console.log(reviewer.generateReport(result));
  }
}

/**
 * Recursively find code files in directory
 */
function findCodeFiles(dir: string): string[] {
  const files: string[] = [];
  const codeExtensions = ['.ts', '.js', '.py', '.java', '.go', '.rs'];

  function scan(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (codeExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  scan(dir);
  return files;
}

// Export for use as module
export { CodeReviewer, ReviewRequest, ReviewResult, ReviewIssue };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
