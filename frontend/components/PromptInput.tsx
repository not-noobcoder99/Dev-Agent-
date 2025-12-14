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
    <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-purple-500/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
      {/* Gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center space-x-3 mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          What would you like to build?
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Describe your code requirements
          </label>
          <textarea
            id="prompt"
            rows={5}
            className="w-full px-6 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white resize-none transition-all duration-300 placeholder:text-gray-400 group-hover:border-purple-400/50 shadow-inner"
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
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-lg backdrop-blur-sm">
            Ctrl+Enter to submit
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <label htmlFor="language" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Language
            </label>
            <select
              id="language"
              className="w-full px-4 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white transition-all duration-300 appearance-none cursor-pointer group-hover:border-purple-400/50 shadow-inner"
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

          <div className="relative group">
            <label htmlFor="framework" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Framework
            </label>
            <select
              id="framework"
              className="w-full px-4 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white transition-all duration-300 appearance-none cursor-pointer group-hover:border-purple-400/50 shadow-inner"
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
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-95 disabled:hover:scale-100"
            >
              {isProcessing ? (
                <>
                  <span className="text-lg">Processing...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">Generate Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8 p-6 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10 backdrop-blur-sm rounded-2xl border border-purple-200/30 dark:border-purple-700/30">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Try an example:
        </p>
        <div className="flex flex-wrap gap-3">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isProcessing}
              className="text-sm px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-purple-700 dark:text-purple-300 rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-200 dark:border-purple-700 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
