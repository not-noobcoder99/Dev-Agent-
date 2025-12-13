import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '@/components/Header'
import PromptInput from '@/components/PromptInput'
import GeneratedCode from '@/components/GeneratedCode'
import ReviewResults from '@/components/ReviewResults'
import EvaluationResults from '@/components/EvaluationResults'
import WorkflowSummary from '@/components/WorkflowSummary'

interface HistoryItem {
  id: string
  prompt: string
  language: string
  framework?: string
  timestamp: number
  generatedCode?: any
  reviewResults?: any
  evaluationResults?: any
  workflowSummary?: any
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('typescript')
  const [framework, setFramework] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [generatedCode, setGeneratedCode] = useState<any>(null)
  const [reviewResults, setReviewResults] = useState<any>(null)
  const [evaluationResults, setEvaluationResults] = useState<any>(null)
  const [workflowSummary, setWorkflowSummary] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const handleSubmit = async (promptText: string, lang: string, fw?: string) => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      setError('Please sign in to generate code')
      router.push('/auth/signin')
      return
    }

    setIsProcessing(true)
    setError(null)
    setGeneratedCode(null)
    setReviewResults(null)
    setEvaluationResults(null)
    setWorkflowSummary(null)
    setStartTime(Date.now())
    setCurrentStep('🚀 Initializing workflow...')

    try {
      setCurrentStep('🤖 Generating code with AI...')
      
      // API route will fetch user's API keys from database
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          language: lang,
          framework: fw || framework,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start workflow')
      }

      const data = await response.json()
      
      // Update states with results progressively
      if (data.generation) {
        setCurrentStep('✅ Code generated! 🔍 Reviewing...')
        setGeneratedCode(data.generation)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      if (data.review) {
        setCurrentStep('✅ Review complete! 📊 Evaluating quality...')
        setReviewResults(data.review)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      if (data.evaluation) {
        setCurrentStep('✅ Evaluation complete! 📝 Finalizing...')
        setEvaluationResults(data.evaluation)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      if (data.summary) {
        const duration = startTime ? ((Date.now() - startTime) / 1000).toFixed(1) : '0'
        data.summary.metrics.total_duration = `${duration}s`
        setWorkflowSummary(data.summary)
      }
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        prompt: promptText,
        language: lang,
        framework: fw || framework,
        timestamp: Date.now(),
        generatedCode: data.generation,
        reviewResults: data.review,
        evaluationResults: data.evaluation,
        workflowSummary: data.summary
      }
      setHistory(prev => [historyItem, ...prev].slice(0, 10)) // Keep last 10
      
      setCurrentStep('🎉 Complete!')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      setCurrentStep('')
      console.error('Workflow error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    if (prompt) {
      handleSubmit(prompt, language, framework)
    }
  }

  const handleReset = () => {
    setPrompt('')
    setLanguage('typescript')
    setFramework('')
    setIsProcessing(false)
    setCurrentStep('')
    setGeneratedCode(null)
    setReviewResults(null)
    setEvaluationResults(null)
    setWorkflowSummary(null)
    setError(null)
    setStartTime(null)
  }

  const loadFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt)
    setLanguage(item.language)
    setFramework(item.framework || '')
    setGeneratedCode(item.generatedCode)
    setReviewResults(item.reviewResults)
    setEvaluationResults(item.evaluationResults)
    setWorkflowSummary(item.workflowSummary)
  }

  return (
    <>
      <Head>
        <title>DevAgent Pro - AI Code Generation & Review</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DevAgent Pro
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              AI-Powered Code Generation, Review & Workflow Automation
            </p>
          </div>

          {/* Quick Stats */}
          {history.length > 0 && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {history.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Sessions
                </div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600">
                  {history.reduce((sum, item) => sum + (item.generatedCode?.files?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Files Generated
                </div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {history.filter(item => item.reviewResults?.score >= 80).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  High Quality
                </div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {[...new Set(history.map(item => item.language))].length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Languages Used
                </div>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="mb-8">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <PromptInput
                  onSubmit={handleSubmit}
                  isProcessing={isProcessing}
                  initialLanguage={language}
                />
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="View History"
                >
                  📜 History ({history.length})
                </button>
              )}
            </div>

            {/* History Panel */}
            {showHistory && history.length > 0 && (
              <div className="mt-4 card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Sessions
                  </h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                            {item.prompt.substring(0, 80)}...
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="badge badge-primary">{item.language}</span>
                            {item.framework && <span className="badge">{item.framework}</span>}
                            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    {error}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      🔄 Retry
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isProcessing && (
            <div className="mb-8">
              <div className="card">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Processing Your Request
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {currentStep}
                    </p>
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="space-y-8">
            {/* Generated Code */}
            {generatedCode && (
              <GeneratedCode data={generatedCode} />
            )}

            {/* Review Results */}
            {reviewResults && (
              <ReviewResults data={reviewResults} />
            )}

            {/* Evaluation Results */}
            {evaluationResults && (
              <EvaluationResults data={evaluationResults} />
            )}

            {/* Workflow Summary */}
            {workflowSummary && (
              <WorkflowSummary data={workflowSummary} />
            )}
          </div>

          {/* Features Section */}
          {!generatedCode && !isProcessing && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon="🤖"
                title="AI Code Generation"
                description="Generate production-ready code from natural language using Cline & Together AI"
              />
              <FeatureCard
                icon="🔍"
                title="Automated Review"
                description="Get instant code review feedback powered by CodeRabbit AI"
              />
              <FeatureCard
                icon="🎯"
                title="Quality Evaluation"
                description="Comprehensive quality scoring with Oumi evaluation framework"
              />
              <FeatureCard
                icon="⚡"
                title="Workflow Orchestration"
                description="Seamless automation with Kestra workflow engine"
              />
              <FeatureCard
                icon="📊"
                title="Real-time Dashboard"
                description="Monitor your code generation pipeline in real-time"
              />
              <FeatureCard
                icon="🚀"
                title="Fast Deployment"
                description="Deploy instantly with Vercel infrastructure"
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            <p>Built with ❤️ using Cline, CodeRabbit, Kestra, Oumi, Together AI & Vercel</p>
            <p className="mt-2 text-sm">© 2025 DevAgent Pro. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
