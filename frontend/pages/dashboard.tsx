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

export default function Dashboard() {
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
  const [kestraStatus, setKestraStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')

  // Check Kestra availability on mount
  useState(() => {
    const checkKestra = async () => {
      try {
        const response = await fetch('/api/kestra-status')
        const data = await response.json()
        setKestraStatus(data.available ? 'available' : 'unavailable')
      } catch (error) {
        setKestraStatus('unavailable')
      }
    }
    checkKestra()
  })

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
        const provider = data.generation.provider || 'AI'
        setCurrentStep(`✅ Code generated with ${provider}! 🔍 Reviewing...`)
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
        setCurrentStep(`✅ Workflow complete! (${duration}s)`)
        setWorkflowSummary(data.summary)
        
        // Add to history
        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          prompt: promptText,
          language: lang,
          framework: fw,
          timestamp: Date.now(),
          generatedCode: data.generation,
          reviewResults: data.review,
          evaluationResults: data.evaluation,
          workflowSummary: data.summary
        }
        setHistory(prev => [historyItem, ...prev])
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setCurrentStep('❌ Workflow failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const loadFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt)
    setLanguage(item.language)
    setFramework(item.framework || '')
    setGeneratedCode(item.generatedCode)
    setReviewResults(item.reviewResults)
    setEvaluationResults(item.evaluationResults)
    setWorkflowSummary(item.workflowSummary)
    setShowHistory(false)
  }

  return (
    <>
      <Head>
        <title>Dashboard - DevAgent</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header with gradient background */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 mb-8 shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCA0LTRoNHYyaC00Yy0xIDAtMiAxLTIgMnYyaDJ2NGgtNHYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Welcome to DevAgent
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
                Describe what you want to build, and watch AI create production-ready code in seconds
              </p>
              
              {/* Kestra Status Indicator */}
              <div className="flex justify-center">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  kestraStatus === 'available' 
                    ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                    : kestraStatus === 'unavailable'
                    ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                    : 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    kestraStatus === 'available' 
                      ? 'bg-green-400 animate-pulse' 
                      : kestraStatus === 'unavailable'
                      ? 'bg-yellow-400'
                      : 'bg-blue-400 animate-pulse'
                  }`}></div>
                  <span>
                    {kestraStatus === 'available' 
                      ? 'Kestra Orchestration Active' 
                      : kestraStatus === 'unavailable'
                      ? 'Direct AI Mode (Kestra Unavailable)'
                      : 'Checking Kestra Status...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* History Toggle */}
          {history.length > 0 && (
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="group px-6 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 flex items-center space-x-3 hover:scale-105"
              >
                <span className="font-bold text-gray-800 dark:text-white">
                  {showHistory ? 'Hide History' : `Show History (${history.length})`}
                </span>
                <span className={`text-xl transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
            </div>
          )}

          {/* History Panel */}
          {showHistory && (
            <div className="mb-8 relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 animate-[fadeIn_0.3s_ease-out]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
              
              <div className="flex items-center space-x-3 mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Recent Generations
                </h3>
              </div>
              
              <div className="space-y-4">
                {history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="group relative overflow-hidden p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {item.prompt.substring(0, 80)}{item.prompt.length > 80 ? '...' : ''}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 ml-11">
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold">
                            {item.language}
                          </span>
                          {item.framework && (
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold">
                              {item.framework}
                            </span>
                          )}
                          <span className="text-gray-400">•</span>
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold text-lg group-hover:translate-x-2 transition-transform duration-300">
                        <span>Load →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <PromptInput 
              onSubmit={handleSubmit} 
              isProcessing={isProcessing}
              initialLanguage={language}
            />

            {/* Current Step Indicator */}
            {isProcessing && currentStep && (
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 shadow-2xl animate-[pulse_2s_ease-in-out_infinite]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCA0LTRoNHYyaC00Yy0xIDAtMiAxLTIgMnYyaDJ2NGgtNHYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="relative flex items-center justify-center space-x-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
                  <span className="text-white font-bold text-xl">{currentStep}</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 shadow-2xl border-2 border-red-300 dark:border-red-700 animate-[shake_0.5s_ease-in-out]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-white font-bold text-lg mb-1">Error Occurred</p>
                    <p className="text-white/90">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {generatedCode && <GeneratedCode data={generatedCode} />}
            {reviewResults && <ReviewResults data={reviewResults} />}
            {evaluationResults && <EvaluationResults data={evaluationResults} />}
            {workflowSummary && <WorkflowSummary data={workflowSummary} />}
          </div>
        </main>

        <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            <p>Built with ❤️ using Cline, CodeRabbit, Kestra, Oumi, Together AI & Vercel</p>
            <p className="mt-2 text-sm">© 2025 DevAgent. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
