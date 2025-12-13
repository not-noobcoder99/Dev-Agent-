import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Together AI integration for code generation (Cline alternative)
interface CodeGenerationRequest {
  prompt: string;
  language: string;
  framework?: string;
  outputDir?: string;
}

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

interface GenerationResult {
  success: boolean;
  files: GeneratedFile[];
  summary: string;
  timestamp: Date;
  error?: string;
}

class CodeGenerator {
  private apiKey: string;
  private baseURL: string = 'https://api.together.xyz/v1';

  constructor() {
    this.apiKey = process.env.TOGETHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  TOGETHER_API_KEY not found. Using mock generation mode.');
    }
  }

  /**
   * Generate code using Together AI (Cline-inspired workflow)
   */
  async generate(request: CodeGenerationRequest): Promise<GenerationResult> {
    console.log('🤖 Starting code generation...');
    console.log(`📝 Prompt: ${request.prompt}`);
    console.log(`💻 Language: ${request.language}`);

    try {
      if (!this.apiKey) {
        return this.mockGenerate(request);
      }

      // Create system prompt for code generation
      const systemPrompt = this.buildSystemPrompt(request);
      
      // Call Together AI API
      const response = await this.callTogetherAI(systemPrompt, request.prompt);
      
      // Parse response and extract code
      const files = this.parseGeneratedCode(response, request);
      
      // Save files to disk
      const outputDir = request.outputDir || './generated';
      await this.saveFiles(files, outputDir);

      console.log('✅ Code generation completed!');
      
      return {
        success: true,
        files,
        summary: this.generateSummary(files),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Code generation failed:', error);
      return {
        success: false,
        files: [],
        summary: 'Code generation failed',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Build system prompt for code generation
   */
  private buildSystemPrompt(request: CodeGenerationRequest): string {
    return `You are an expert software engineer specializing in ${request.language}${
      request.framework ? ` with ${request.framework}` : ''
    }.

Your task is to generate production-ready, well-structured code that follows best practices.

Requirements:
- Write clean, maintainable code
- Include proper error handling
- Add comments for complex logic
- Follow ${request.language} conventions
- Structure code in multiple files if needed
- Include basic tests if applicable

Format your response as:
\`\`\`filename: path/to/file.ext
[code content]
\`\`\`

Repeat for each file needed.`;
  }

  /**
   * Call Together AI API
   */
  private async callTogetherAI(systemPrompt: string, userPrompt: string): Promise<string> {
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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Parse generated code into structured files
   */
  private parseGeneratedCode(response: string, request: CodeGenerationRequest): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    const fileRegex = /```(?:filename:\s*)?([^\n]+)\n([\s\S]*?)```/g;
    
    let match;
    while ((match = fileRegex.exec(response)) !== null) {
      const filePath = match[1].trim();
      const content = match[2].trim();
      
      files.push({
        path: filePath,
        content,
        language: this.detectLanguage(filePath, request.language)
      });
    }

    // If no structured files found, create a single file
    if (files.length === 0) {
      const extension = this.getFileExtension(request.language);
      files.push({
        path: `main${extension}`,
        content: response,
        language: request.language
      });
    }

    return files;
  }

  /**
   * Save generated files to disk
   */
  private async saveFiles(files: GeneratedFile[], outputDir: string): Promise<void> {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const file of files) {
      const fullPath = path.join(outputDir, file.path);
      const dir = path.dirname(fullPath);

      // Create subdirectories if needed
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(fullPath, file.content, 'utf-8');
      console.log(`📄 Created: ${fullPath}`);
    }
  }

  /**
   * Generate summary of created files
   */
  private generateSummary(files: GeneratedFile[]): string {
    const fileList = files.map(f => f.path).join(', ');
    return `Generated ${files.length} file(s): ${fileList}`;
  }

  /**
   * Detect language from file extension
   */
  private detectLanguage(filePath: string, defaultLang: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const langMap: { [key: string]: string } = {
      '.ts': 'typescript',
      '.js': 'javascript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.cpp': 'cpp',
      '.c': 'c',
    };
    return langMap[ext] || defaultLang;
  }

  /**
   * Get file extension for language
   */
  private getFileExtension(language: string): string {
    const extMap: { [key: string]: string } = {
      'typescript': '.ts',
      'javascript': '.js',
      'python': '.py',
      'java': '.java',
      'go': '.go',
      'rust': '.rs',
    };
    return extMap[language.toLowerCase()] || '.txt';
  }

  /**
   * Mock generation for testing without API key
   */
  private mockGenerate(request: CodeGenerationRequest): GenerationResult {
    console.log('🎭 Using mock generation mode');
    
    const mockFiles: GeneratedFile[] = [
      {
        path: 'src/main.ts',
        content: `// Generated from prompt: ${request.prompt}\n\nexport function main() {\n  console.log('Hello from DevAgent Pro!');\n}\n\nmain();`,
        language: request.language
      },
      {
        path: 'src/types.ts',
        content: `export interface Config {\n  name: string;\n  version: string;\n}\n`,
        language: request.language
      }
    ];

    const outputDir = request.outputDir || './generated';
    this.saveFiles(mockFiles, outputDir);

    return {
      success: true,
      files: mockFiles,
      summary: `Mock generation: Created ${mockFiles.length} files`,
      timestamp: new Date()
    };
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🤖 DevAgent Pro - Code Generator

Usage:
  npm run agent:generate -- "your prompt here" [language] [framework]

Example:
  npm run agent:generate -- "Create a REST API for tasks" typescript express

Arguments:
  prompt      - Natural language description of what to build
  language    - Programming language (default: typescript)
  framework   - Optional framework to use
    `);
    process.exit(1);
  }

  const request: CodeGenerationRequest = {
    prompt: args[0],
    language: args[1] || 'typescript',
    framework: args[2],
    outputDir: './generated'
  };

  const generator = new CodeGenerator();
  const result = await generator.generate(request);

  console.log('\n📊 Generation Result:');
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n✅ Code generation successful!');
    console.log('📂 Output directory: ./generated');
    console.log('\n🔜 Next step: Run code review with CodeRabbit');
    console.log('   npm run agent:review');
  } else {
    console.error('\n❌ Code generation failed');
    process.exit(1);
  }
}

// Export for use as module
export { CodeGenerator, CodeGenerationRequest, GenerationResult, GeneratedFile };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
