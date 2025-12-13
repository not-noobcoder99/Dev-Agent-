import { useState } from 'react'

interface PromptInputProps {
  onSubmit: (prompt: string, language: string, framework?: string) => void
  isProcessing: boolean
  initialLanguage?: string
}

export default function PromptInput({ onSubmit, isProcessing, initialLanguage = 'typescript' }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState(initialLanguage)
  const [framework, setFramework] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onSubmit(prompt, language, framework)
    }
  }

  const frameworks: Record<string, string[]> = {
    typescript: ['Express', 'NestJS', 'Next.js', 'Fastify'],
    javascript: ['Express', 'React', 'Vue', 'Node.js'],
    python: ['FastAPI', 'Django', 'Flask', 'Pandas'],
    java: ['Spring Boot', 'Quarkus', 'Micronaut'],
    go: ['Gin', 'Echo', 'Fiber'],
    rust: ['Actix', 'Rocket', 'Axum'],
  }

  const examples = [
    'Create a REST API for task management with authentication',
    'Build a React component for a user profile card',
    'Generate a Python web scraper for news articles',
    'Create a TypeScript utility for data validation',
  ]

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        What would you like to build?
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your code requirements
          </label>
          <textarea
            id="prompt"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="e.g., Create a REST API for managing tasks with user authentication... (Ctrl+Enter to submit)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                handleSubmit(e as any)
              }
            }}
            disabled={isProcessing}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Programming Language
            </label>
            <select
              id="language"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                setFramework('')
              }}
              disabled={isProcessing}
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <div>
            <label htmlFor="framework" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Framework (Optional)
            </label>
            <select
              id="framework"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              disabled={isProcessing}
            >
              <option value="">None</option>
              {frameworks[language]?.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isProcessing || !prompt.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Generate Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Try an example:
        </p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isProcessing}
              className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
