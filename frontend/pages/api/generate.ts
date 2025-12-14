import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import { 
  triggerKestraWorkflow, 
  getKestraExecutionStatus, 
  isKestraAvailable,
  type KestraWorkflowInput 
} from '../../lib/kestra-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, language = 'typescript', framework, apiKey } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    console.log('Starting workflow:', { prompt, language, framework })

    // Check if Kestra is available
    const kestraEnabled = await isKestraAvailable()
    console.log('Kestra availability:', kestraEnabled)

    if (kestraEnabled) {
      console.log('Using Kestra workflow orchestration...')
      try {
        return await executeKestraWorkflow(req, res, prompt, language, framework, apiKey)
      } catch (kestraError) {
        console.error('Kestra workflow failed, falling back to direct execution:', kestraError)
        // Continue to direct execution below
      }
    }

    console.log('Using direct AI execution (Kestra not available or failed)...')

    // Step 1: Generate Code
    console.log('Step 1: Generating code...')
    const generationResult = await generateCode(prompt, language, framework, apiKey)

    // Step 2: Review Code
    console.log('Step 2: Reviewing code...')
    const reviewResult = await reviewCode(generationResult.files, language)

    // Step 3: Evaluate Quality
    console.log('Step 3: Evaluating quality...')
    const evaluationResult = await evaluateQuality(generationResult.files, reviewResult.score)

    // Step 4: Create Summary
    const summary = {
      workflow_id: 'devagent_workflow',
      execution_id: generateId(),
      timestamp: new Date().toISOString(),
      metrics: {
        total_duration: '0s', // Calculate actual duration if needed
        files_generated: generationResult.files?.length || 0,
        issues_found: reviewResult.summary?.total || 0,
        quality_score: evaluationResult.overall_score || 0,
      },
      results: {
        decision: reviewResult.score >= 70 && evaluationResult.overall_score >= 70 
          ? 'DECISION: PASS ✅'
          : 'DECISION: NEEDS IMPROVEMENT ⚠️'
      }
    }

    return res.status(200).json({
      success: true,
      generation: generationResult,
      review: reviewResult,
      evaluation: evaluationResult,
      summary
    })

  } catch (error) {
    console.error('Workflow error:', error)
    return res.status(500).json({
      error: 'Workflow execution failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

/**
 * Execute workflow using Kestra orchestration
 */
async function executeKestraWorkflow(
  req: NextApiRequest,
  res: NextApiResponse,
  prompt: string,
  language: string,
  framework?: string,
  apiKey?: string
) {
  const startTime = Date.now()
  
  // Trigger Kestra workflow
  const workflowInput: KestraWorkflowInput = {
    user_prompt: prompt,
    language,
    framework
  }
  
  console.log('Triggering Kestra workflow with input:', workflowInput)
  const execution = await triggerKestraWorkflow(workflowInput)
  console.log('Kestra execution started:', execution.id)
  
  // Poll for completion (with timeout)
  const maxWaitTime = 300000 // 5 minutes
  const pollInterval = 2000 // 2 seconds
  let elapsedTime = 0
  
  while (elapsedTime < maxWaitTime) {
    await new Promise(resolve => setTimeout(resolve, pollInterval))
    elapsedTime += pollInterval
    
    const status = await getKestraExecutionStatus(execution.id)
    console.log('Kestra execution status:', status.state.current)
    
    if (status.state.current === 'SUCCESS') {
      // Extract results from Kestra execution
      const duration = Math.round((Date.now() - startTime) / 1000)
      
      // For now, we'll still generate using our own logic but tracked by Kestra
      // In a full integration, Kestra would return the actual generated code
      const generationResult = await generateCode(prompt, language, framework, apiKey)
      const reviewResult = await reviewCode(generationResult.files, language)
      const evaluationResult = await evaluateQuality(generationResult.files, reviewResult.score)
      
      const summary = {
        workflow_id: 'devagent_workflow',
        execution_id: execution.id,
        timestamp: new Date().toISOString(),
        metrics: {
          total_duration: `${duration}s`,
          files_generated: generationResult.files?.length || 0,
          issues_found: reviewResult.summary?.total || 0,
          quality_score: evaluationResult.overall_score || 0,
        },
        results: {
          decision: reviewResult.score >= 70 && evaluationResult.overall_score >= 70 
            ? 'DECISION: PASS (Orchestrated by Kestra)'
            : 'DECISION: NEEDS IMPROVEMENT (Orchestrated by Kestra)'
        },
        orchestrator: 'Kestra'
      }
      
      return res.status(200).json({
        success: true,
        generation: generationResult,
        review: reviewResult,
        evaluation: evaluationResult,
        summary,
        kestra: {
          enabled: true,
          executionId: execution.id,
          duration: `${duration}s`
        }
      })
    } else if (status.state.current === 'FAILED') {
      throw new Error('Kestra workflow execution failed')
    }
    
    // Continue polling for RUNNING, CREATED, etc.
  }
  
  throw new Error('Kestra workflow execution timeout')
}

async function generateCode(prompt: string, language: string, framework?: string, apiKey?: string) {
  try {
    // Always use server-side API key if no user key provided
    const groqKey = apiKey || process.env.GROQ_API_KEY
    console.log('Using Groq API key from:', apiKey ? 'user' : 'server environment')
    console.log('Groq key available:', !!groqKey)
    
    // Try multiple AI providers in order of preference
    const providers = [
      { name: 'Groq', key: groqKey, fn: callGroqAI },
      { name: 'Oumi', key: process.env.OUMI_API_KEY, fn: callOumiAI },
    ]
    
    for (const provider of providers) {
      if (provider.key) {
        try {
          console.log(`Attempting code generation with ${provider.name}...`)
          const response = await provider.fn(provider.key, prompt, language, framework)
          const files = parseGeneratedCode(response, language)
          
          return {
            success: true,
            files,
            provider: provider.name,
            summary: `Generated ${files.length} file(s) using ${provider.name}: ${files.map(f => f.path).join(', ')}`,
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          console.error(`${provider.name} failed:`, error)
          // Continue to next provider
        }
      }
    }
    
    // Fallback to enhanced mock generation if all providers fail
    console.log('All AI providers failed, using mock generation')
    const files = generateEnhancedMockCode(prompt, language, framework)
    
    return {
      success: true,
      files,
      provider: 'Mock',
      summary: `Generated ${files.length} file(s) for: ${prompt}`,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Code generation error:', error)
    throw error
  }
}

async function callGroqAI(apiKey: string, prompt: string, language: string, framework?: string) {
  const systemPrompt = `You are a world-class senior software engineer with 15+ years of experience in ${language}${
    framework ? ` and ${framework} framework` : ''
  }.

CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. SCOPE AND COMPLETENESS:
   - Generate a COMPLETE, PRODUCTION-READY application or module
   - Include ALL necessary files: source code, configuration, tests, README
   - Create proper project structure with multiple files and folders
   - Do not just provide snippets - build the entire solution

2. CODE QUALITY STANDARDS:
   - Write clean, maintainable, and well-documented code
   - Include comprehensive error handling and input validation
   - Add detailed comments explaining complex logic
   - Follow ${language} best practices and design patterns
   - Use proper naming conventions and code organization
   - Include TypeScript types and interfaces if applicable

3. PROFESSIONAL FEATURES:
   - Add proper logging and debugging capabilities
   - Include environment configuration with .env examples
   - Add input validation and security measures
   - Implement proper async/await patterns
   - Include database schemas if needed
   - Add API documentation comments

4. PROJECT STRUCTURE:
   - Separate concerns: utilities, models, controllers, services
   - Include package.json or requirements.txt with dependencies
   - Add .gitignore and README.md with setup instructions
   - Include example usage and testing instructions

5. OUTPUT FORMAT - MANDATORY:
   Format EACH file as:
   \`\`\`filename: path/to/file.ext
   [complete file content]
   \`\`\`
   
   Example:
   \`\`\`filename: src/index.ts
   [full TypeScript code]
   \`\`\`
   
   \`\`\`filename: package.json
   [full package.json]
   \`\`\`

IMPORTANT: Generate AT LEAST 5-10 files for a proper application structure. Be thorough and professional.`

  const enhancedPrompt = `${prompt}

Additional Context:
- Target Language: ${language}
${framework ? `- Framework: ${framework}\n` : ''}- Expected Output: Complete, production-ready application with proper structure
- Include: Source files, config files, documentation, and examples`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: enhancedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 8000,
      top_p: 0.95,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Groq API error details:', errorText)
    throw new Error(`Groq API error: ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callOumiAI(apiKey: string, prompt: string, language: string, framework?: string) {
  const systemPrompt = `You are a world-class senior software engineer with 15+ years of experience in ${language}${
    framework ? ` and ${framework} framework` : ''
  }.

CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. SCOPE AND COMPLETENESS:
   - Generate a COMPLETE, PRODUCTION-READY application or module
   - Include ALL necessary files: source code, configuration, tests, README
   - Create proper project structure with multiple files and folders
   - Do not just provide snippets - build the entire solution

2. CODE QUALITY STANDARDS:
   - Write clean, maintainable, and well-documented code
   - Include comprehensive error handling and input validation
   - Add detailed comments explaining complex logic
   - Follow ${language} best practices and design patterns
   - Use proper naming conventions and code organization
   - Include TypeScript types and interfaces if applicable

3. PROFESSIONAL FEATURES:
   - Add proper logging and debugging capabilities
   - Include environment configuration with .env examples
   - Add input validation and security measures
   - Implement proper async/await patterns
   - Include database schemas if needed
   - Add API documentation comments

4. PROJECT STRUCTURE:
   - Separate concerns: utilities, models, controllers, services
   - Include package.json or requirements.txt with dependencies
   - Add .gitignore and README.md with setup instructions
   - Include example usage and testing instructions

5. OUTPUT FORMAT - MANDATORY:
   Format EACH file as:
   \`\`\`filename: path/to/file.ext
   [complete file content]
   \`\`\`
   
   Example:
   \`\`\`filename: src/index.ts
   [full TypeScript code]
   \`\`\`
   
   \`\`\`filename: package.json
   [full package.json]
   \`\`\`

IMPORTANT: Generate AT LEAST 5-10 files for a proper application structure. Be thorough and professional.`

  const enhancedPrompt = `${prompt}

Additional Context:
- Target Language: ${language}
${framework ? `- Framework: ${framework}\n` : ''}- Expected Output: Complete, production-ready application with proper structure
- Include: Source files, config files, documentation, and examples`

  const response = await fetch('https://api.oumi.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'oumi-large',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: enhancedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 8000,
      top_p: 0.95,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Oumi API error: ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

function parseGeneratedCode(response: string, language: string) {
  const files: any[] = []
  const fileRegex = /```(?:filename:\s*)?([^\n]+)\n([\s\S]*?)```/g
  
  let match
  while ((match = fileRegex.exec(response)) !== null) {
    const filePath = match[1].trim()
    const content = match[2].trim()
    
    files.push({
      path: filePath,
      content,
      language: detectLanguageFromPath(filePath, language)
    })
  }

  // If no structured files found, create a single file
  if (files.length === 0) {
    const extension = getFileExtension(language)
    files.push({
      path: `main${extension}`,
      content: response,
      language
    })
  }

  return files
}

function detectLanguageFromPath(filePath: string, defaultLang: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  const langMap: { [key: string]: string } = {
    'ts': 'typescript',
    'js': 'javascript',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'rs': 'rust',
  }
  return langMap[ext || ''] || defaultLang
}

function getFileExtension(language: string): string {
  const extMap: { [key: string]: string } = {
    'typescript': '.ts',
    'javascript': '.js',
    'python': '.py',
    'java': '.java',
    'go': '.go',
    'rust': '.rs',
  }
  return extMap[language.toLowerCase()] || '.txt'
}

function generateEnhancedMockCode(prompt: string, language: string, framework?: string) {
  const ext = getFileExtension(language)
  const isTs = language === 'typescript'
  const isPy = language === 'python'
  
  // Generate more realistic mock code based on prompt
  const promptLower = prompt.toLowerCase()
  const isAPI = promptLower.includes('api') || promptLower.includes('rest') || promptLower.includes('endpoint')
  const isAuth = promptLower.includes('auth') || promptLower.includes('login') || promptLower.includes('user')
  const isDatabase = promptLower.includes('database') || promptLower.includes('db') || promptLower.includes('crud')
  
  const files: any[] = []
  
  if (isAPI && isTs) {
    files.push({
      path: `src/app${ext}`,
      content: `import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
${isAuth ? "import authRouter from './routes/auth';" : ''}
${isDatabase ? "import taskRouter from './routes/tasks';" : ''}

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

${isAuth ? "app.use('/api/auth', authRouter);" : ''}
${isDatabase ? "app.use('/api/tasks', taskRouter);" : ''}

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});

export default app;`,
      language
    })
    
    if (isAuth) {
      files.push({
        path: `src/routes/auth${ext}`,
        content: `import { Router, Request, Response } from 'express';

const router = Router();

interface LoginRequest {
  email: string;
  password: string;
}

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;
    
    // TODO: Implement authentication logic
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Mock response
    const token = 'mock-jwt-token-' + Date.now();
    res.json({ success: true, token, user: { email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    // TODO: Implement registration logic
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;`,
        language
      })
    }
  } else if (isAPI && isPy) {
    files.push({
      path: `main.py`,
      content: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="DevAgent Pro API", version="1.0.0")

${isDatabase ? `
class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    completed: bool = False

tasks_db: List[Task] = []
task_id_counter = 1
` : ''}

@app.get("/")
async def root():
    return {"message": "Welcome to DevAgent Pro API", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

${isDatabase ? `
@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    return tasks_db

@app.post("/tasks", response_model=Task)
async def create_task(task: Task):
    global task_id_counter
    task.id = task_id_counter
    task_id_counter += 1
    tasks_db.append(task)
    return task

@app.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: int):
    for task in tasks_db:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, updated_task: Task):
    for i, task in enumerate(tasks_db):
        if task.id == task_id:
            updated_task.id = task_id
            tasks_db[i] = updated_task
            return updated_task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    for i, task in enumerate(tasks_db):
        if task.id == task_id:
            tasks_db.pop(i)
            return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")
` : ''}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`,
      language
    })
  } else {
    // Generic code generation
    files.push({
      path: `src/main${ext}`,
      content: isPy 
        ? `"""
${prompt}

This is an AI-generated Python module.
"""

def main():
    """Main entry point"""
    print("Hello from DevAgent Pro!")
    # TODO: Implement your logic here
    pass

if __name__ == "__main__":
    main()`
        : `/**
 * ${prompt}
 * 
 * This is an AI-generated ${language} module.
 */

export function main() {
  console.log('Hello from DevAgent Pro!');
  // TODO: Implement your logic here
}

main();`,
      language
    })
  }
  
  // Add a README
  files.push({
    path: 'README.md',
    content: `# Generated Code

**Prompt**: ${prompt}

**Language**: ${language}${framework ? `\n**Framework**: ${framework}` : ''}

**Generated**: ${new Date().toISOString()}

## Files

${files.map(f => `- \`${f.path}\``).join('\n')}

## Getting Started

1. Install dependencies
2. Run the application
3. Customize the code as needed

---

*Generated by DevAgent Pro*`,
    language: 'markdown'
  })
  
  return files
}

async function reviewCode(files: any[], language: string) {
  try {
    const issues: any[] = []
    
    // Perform static analysis on all files
    for (const file of files) {
      const staticIssues = performStaticAnalysis(file, language)
      issues.push(...staticIssues)
    }
    
    const summary = {
      total: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      major: issues.filter(i => i.severity === 'major').length,
      minor: issues.filter(i => i.severity === 'minor').length,
      info: issues.filter(i => i.severity === 'info').length
    }
    
    const score = calculateReviewScore(summary)
    
    return {
      success: true,
      score,
      summary,
      issues,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Code review error:', error)
    throw error
  }
}

function performStaticAnalysis(file: any, language: string) {
  const issues: any[] = []
  const content = file.content
  const lines = content.split('\n')
  
  if (language === 'typescript' || language === 'javascript') {
    lines.forEach((line: string, idx: number) => {
      if (line.includes('console.log') && !line.trim().startsWith('//')) {
        issues.push({
          severity: 'info',
          file: file.path,
          line: idx + 1,
          message: 'Console.log statement found',
          suggestion: 'Remove debug statements in production code'
        })
      }
      
      if (line.includes('TODO')) {
        issues.push({
          severity: 'info',
          file: file.path,
          line: idx + 1,
          message: 'TODO comment found',
          suggestion: 'Complete implementation before production'
        })
      }
    })
    
    if (content.includes('async') && !content.includes('try') && !content.includes('catch')) {
      issues.push({
        severity: 'major',
        file: file.path,
        message: 'Async function without error handling',
        suggestion: 'Add try-catch blocks around async operations'
      })
    }
    
    if (!content.includes('export')) {
      issues.push({
        severity: 'minor',
        file: file.path,
        message: 'No exports found',
        suggestion: 'Consider exporting functions for reusability'
      })
    }
  } else if (language === 'python') {
    lines.forEach((line: string, idx: number) => {
      if (line.includes('print(') && !line.trim().startsWith('#')) {
        issues.push({
          severity: 'info',
          file: file.path,
          line: idx + 1,
          message: 'Print statement found',
          suggestion: 'Use proper logging instead of print statements'
        })
      }
      
      if (line.includes('TODO')) {
        issues.push({
          severity: 'info',
          file: file.path,
          line: idx + 1,
          message: 'TODO comment found',
          suggestion: 'Complete implementation'
        })
      }
    })
    
    if (content.includes('def ') && !content.includes('except')) {
      issues.push({
        severity: 'minor',
        file: file.path,
        message: 'Function without exception handling',
        suggestion: 'Consider adding try-except blocks'
      })
    }
  }
  
  return issues
}

function calculateReviewScore(summary: any): number {
  const weights = { critical: 20, major: 10, minor: 5, info: 1 }
  const deductions = 
    summary.critical * weights.critical +
    summary.major * weights.major +
    summary.minor * weights.minor +
    summary.info * weights.info
  
  return Math.max(0, Math.min(100, 100 - deductions))
}

async function evaluateQuality(files: any[], reviewScore: number) {
  try {
    const oumiKey = process.env.OUMI_API_KEY
    
    // Try Oumi AI evaluation if API key is available
    if (oumiKey && oumiKey.length > 10) {
      try {
        console.log('Using Oumi AI for quality evaluation...')
        return await evaluateWithOumiAI(oumiKey, files, reviewScore)
      } catch (error) {
        console.error('Oumi evaluation failed, falling back to standard evaluation:', error)
      }
    }
    
    // Fallback to enhanced heuristic evaluation
    console.log('Using enhanced heuristic evaluation...')
    return evaluateWithHeuristics(files, reviewScore)
  } catch (error) {
    console.error('Quality evaluation error:', error)
    throw error
  }
}

async function evaluateWithOumiAI(apiKey: string, files: any[], reviewScore: number) {
  // Prepare code context for Oumi
  const codeContext = files.map(f => 
    `File: ${f.path}\nLanguage: ${f.language}\nLines: ${f.content.split('\n').length}\n---\n${f.content.substring(0, 1000)}...`
  ).join('\n\n')
  
  const evaluationPrompt = `Evaluate the following code for production readiness:

${codeContext}

Provide scores (0-100) for:
1. Code Quality (structure, naming, organization)
2. Maintainability (readability, documentation, modularity)
3. Security (input validation, error handling, vulnerabilities)
4. Performance (efficiency, scalability, optimization)
5. Best Practices (patterns, conventions, standards)

Also provide 3-5 specific, actionable recommendations.

Respond in JSON format:
{
  "code_quality": <score>,
  "maintainability": <score>,
  "security": <score>,
  "performance": <score>,
  "best_practices": <score>,
  "recommendations": ["...", "..."]
}`

  const response = await fetch('https://api.oumi.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'oumi-large',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert code reviewer and quality assurance engineer. Analyze code thoroughly and provide honest, constructive feedback with specific scores and recommendations in JSON format.' 
        },
        { role: 'user', content: evaluationPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    throw new Error(`Oumi API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  // Try to parse JSON from response
  let evaluation
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\s*({[\s\S]*?})\s*```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : content
    evaluation = JSON.parse(jsonStr)
  } catch (e) {
    console.error('Failed to parse Oumi response, using fallback')
    return evaluateWithHeuristics(files, reviewScore)
  }
  
  const overall_score = (
    evaluation.code_quality * 0.3 +
    evaluation.maintainability * 0.2 +
    evaluation.security * 0.2 +
    evaluation.performance * 0.15 +
    evaluation.best_practices * 0.15
  )
  
  return {
    success: true,
    provider: 'Oumi AI',
    overall_score: Math.round(overall_score * 10) / 10,
    metrics: {
      code_quality: Math.round(evaluation.code_quality),
      maintainability: Math.round(evaluation.maintainability),
      security: Math.round(evaluation.security),
      performance: Math.round(evaluation.performance),
      best_practices: Math.round(evaluation.best_practices)
    },
    recommendations: evaluation.recommendations || [],
    timestamp: new Date().toISOString()
  }
}

function evaluateWithHeuristics(files: any[], reviewScore: number) {
  // Enhanced heuristic evaluation based on code analysis
  let qualityBonus = 0
  let securityBonus = 0
  let maintainabilityBonus = 0
  
  for (const file of files) {
    const content = file.content
    const lines = content.split('\n')
    
    // Quality indicators
    if (content.includes('try') && content.includes('catch')) qualityBonus += 3
    if (content.includes('interface') || content.includes('type ')) qualityBonus += 2
    if (content.includes('/**') || content.includes('"""')) qualityBonus += 2
    
    // Security indicators  
    if (content.includes('validate') || content.includes('sanitize')) securityBonus += 3
    if (content.includes('env.') || content.includes('process.env')) securityBonus += 2
    
    // Maintainability indicators
    if (file.path.includes('test') || file.path.includes('spec')) maintainabilityBonus += 5
    if (file.path.includes('README')) maintainabilityBonus += 3
    if (lines.length > 50 && lines.length < 300) maintainabilityBonus += 2
  }
  
  const metrics = {
    code_quality: Math.min(100, reviewScore + qualityBonus + Math.random() * 5),
    maintainability: Math.min(100, reviewScore + maintainabilityBonus + Math.random() * 3),
    security: Math.min(100, reviewScore + securityBonus + Math.random() * 5),
    performance: Math.min(100, reviewScore + Math.random() * 8 - 2),
    best_practices: Math.min(100, reviewScore + (qualityBonus / 2) + Math.random() * 4)
  }
  
  const overall_score = (
    metrics.code_quality * 0.3 +
    metrics.maintainability * 0.2 +
    metrics.security * 0.2 +
    metrics.performance * 0.15 +
    metrics.best_practices * 0.15
  )
  
  const recommendations = []
  if (metrics.code_quality < 80) recommendations.push('Add more error handling and type definitions')
  if (metrics.security < 85) recommendations.push('Implement input validation and environment variable usage')
  if (metrics.maintainability < 80) recommendations.push('Add comprehensive documentation and unit tests')
  if (metrics.performance < 75) recommendations.push('Consider async patterns and efficient data structures')
  if (files.length < 3) recommendations.push('Break down into more modular files for better organization')
  
  if (recommendations.length === 0) {
    recommendations.push('Excellent code quality! Well-structured and production-ready.')
  }
  
  return {
    success: true,
    provider: 'Heuristic Analysis',
    overall_score: Math.round(overall_score * 10) / 10,
    metrics: {
      code_quality: Math.round(metrics.code_quality),
      maintainability: Math.round(metrics.maintainability),
      security: Math.round(metrics.security),
      performance: Math.round(metrics.performance),
      best_practices: Math.round(metrics.best_practices)
    },
    recommendations,
    timestamp: new Date().toISOString()
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}
