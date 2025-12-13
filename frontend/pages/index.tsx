import { useState } from 'react'
import Head from 'next/head'
import Header from '@/components/Header'
import PromptInput from '@/components/PromptInput'
import GeneratedCode from '@/components/GeneratedCode'
import ReviewResults from '@/components/ReviewResults'
import EvaluationResults from '@/components/EvaluationResults'
import WorkflowSummary from '@/components/WorkflowSummary'

export default function Home() {
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

  const handleSubmit = async (promptText: string, lang: string, fw?: string) => {
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
      // Call API to start workflow
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
      
      setCurrentStep('🎉 Complete!')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setCurrentStep('')
    } finally {
      setIsProcessing(false)
    }
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
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DevAgent Pro
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              AI-Powered Code Generation, Review & Workflow Automation
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <PromptInput
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
              initialLanguage={language}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
              <p className="font-bold">Error</p>
              <p>{error}</p>
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
