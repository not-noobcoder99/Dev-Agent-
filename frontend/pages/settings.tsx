import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '@/components/Header'
import { useRouter } from 'next/router'

export default function Settings() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState({
    groq: '',
    oumi: '',
    kestra: ''
  })
  const [saved, setSaved] = useState(false)
  const [showKeys, setShowKeys] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('devagent_api_keys')
    if (stored) {
      try {
        setApiKeys(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored keys')
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('devagent_api_keys', JSON.stringify(apiKeys))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTest = async (service: string) => {
    alert(`Testing ${service} connection... (Not implemented yet)`)
  }

  return (
    <>
      <Head>
        <title>Settings - DevAgent Pro</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.push('/')}
                className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">
                ⚙️ Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Configure your API keys and preferences
              </p>
            </div>

            {/* Success Message */}
            {saved && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg">
                ✅ Settings saved successfully!
              </div>
            )}

            {/* API Keys Section */}
            <div className="card mb-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                🔑 API Keys
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Your API keys are stored locally in your browser and never sent to our servers.
              </p>

              <div className="space-y-6">
                {/* Groq AI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Groq API Key
                    <span className="ml-2 text-xs text-blue-600">
                      (Required for AI code generation - FREE with 6,000 requests/day!)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={apiKeys.groq}
                      onChange={(e) => setApiKeys({ ...apiKeys, groq: e.target.value })}
                      placeholder="Enter your Groq API key (starts with gsk_)"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleTest('Groq')}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Test
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Get your FREE API key from{' '}
                    <a
                      href="https://console.groq.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Groq Console
                    </a>
                    {' '}(No credit card required!)
                  </p>
                </div>

                {/* Oumi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Oumi API Key
                    <span className="ml-2 text-xs text-gray-500">
                      (Optional - Alternative AI provider for code generation)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={apiKeys.oumi}
                      onChange={(e) => setApiKeys({ ...apiKeys, oumi: e.target.value })}
                      placeholder="Enter your Oumi API key"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleTest('Oumi')}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Test
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Get your API key from{' '}
                    <a
                      href="https://oumi.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Oumi Dashboard
                    </a>
                    {' '}(Fallback if Groq fails)
                  </p>
                </div>

                {/* Kestra */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kestra API URL
                    <span className="ml-2 text-xs text-gray-500">
                      (Optional - for workflow orchestration)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={apiKeys.kestra}
                    onChange={(e) => setApiKeys({ ...apiKeys, kestra: e.target.value })}
                    placeholder="http://localhost:8080"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Learn more at{' '}
                    <a
                      href="https://kestra.io/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Kestra Documentation
                    </a>
                  </p>
                </div>
              </div>

              {/* Show/Hide Toggle */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showKeys}
                    onChange={(e) => setShowKeys(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show API keys in plain text
                  </span>
                </label>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  💾 Save Settings
                </button>
                <button
                  onClick={() => {
                    setApiKeys({ groq: '', oumi: '', kestra: '' })
                    localStorage.removeItem('devagent_api_keys')
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
                💡 Getting Started
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span>1️⃣</span>
                  <span>Sign up for a Together AI account and get your API key</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2️⃣</span>
                  <span>Enter your API key above and click "Test" to verify</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3️⃣</span>
                  <span>Click "Save Settings" to store your configuration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>4️⃣</span>
                  <span>Go back to the dashboard and start generating code!</span>
                </li>
              </ul>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>🔒 Security:</strong> Your API keys are stored in your browser's local storage
                and are only sent directly to the respective API providers. Never share your API keys
                with anyone.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
