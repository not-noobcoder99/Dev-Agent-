import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Landing() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/auth/signin')
    }
  }

  return (
    <>
      <Head>
        <title>DevAgent - AI-Powered Development Assistant</title>
        <meta name="description" content="Transform ideas into production-ready code with AI" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            style={{
              left: `${mousePosition.x / 20}px`,
              top: `${mousePosition.y / 20}px`,
              transition: 'all 0.3s ease-out'
            }}
          />
          <div 
            className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl right-0 bottom-0"
            style={{
              right: `${mousePosition.x / 30}px`,
              bottom: `${mousePosition.y / 30}px`,
              transition: 'all 0.3s ease-out'
            }}
          />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform">
                <span className="text-2xl font-bold">D</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                DevAgent
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
              {session ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
                <span className="text-sm"> Powered by Advanced AI Models</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Transform Ideas Into
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Production Code
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                DevAgent is your AI-powered development companion that generates, reviews, and optimizes code in seconds. 
                Build faster, code smarter, deploy confidently.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all"
                >
                  Get Started Free
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <div>
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div>Developers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1M+</div>
                  <div>Code Generated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div>Uptime</div>
                </div>
              </div>
            </div>

            {/* 3D Code Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 transform hover:scale-105 transition-transform duration-500">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <pre className="text-sm text-gray-300 overflow-hidden">{`// ✨ AI-Generated Code
import { useState } from 'react'

function TodoApp() {
  const [tasks, setTasks] = useState([])
  
  const addTask = (task) => {
    setTasks([...tasks, {
      id: Date.now(),
      text: task,
      completed: false
    }])
  }
  
  return (
    <div className="app">
      <h1>My Tasks</h1>
      {/* Complete implementation... */}
    </div>
  )
}`}</pre>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>⚡ Generated in 2.3s</span>
                  <span>✔ Production Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Why Developers <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Love DevAgent</span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need to build amazing software, faster</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: 'Lightning Fast Generation',
                description: 'Generate complete, production-ready applications in seconds. Not snippets - full projects with 5-10+ files.',
                stat: '10x faster',
                gradient: 'from-purple-500 to-blue-500'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: 'AI-Powered Quality',
                description: 'Every line analyzed for security, performance, and best practices with specific recommendations.',
                stat: 'Catch 80% of bugs',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                ),
                title: 'Smart Workflows',
                description: 'Automated generation, review, and optimization. Focus on innovation while AI handles repetitive tasks.',
                stat: 'Save 15+ hours/week',
                gradient: 'from-pink-500 to-purple-500'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:transform hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                <div className="text-sm text-purple-400">{feature.stat} →</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              From Idea to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Production</span>
            </h2>
            <p className="text-xl text-gray-400">Four simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Describe Your Idea', desc: 'Tell DevAgent what you want to build' },
              { num: 2, title: 'AI Generates Code', desc: 'Complete applications in seconds' },
              { num: 3, title: 'Review & Optimize', desc: 'AI analyzes quality and security' },
              { num: 4, title: 'Deploy', desc: 'Production-ready code immediately' }
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 container mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to 10x Your Development Speed?
            </h2>
            <button
              onClick={handleGetStarted}
              className="px-12 py-4 bg-white text-purple-600 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Start Building for Free
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-gray-700/50">
          <div className="text-center text-gray-400">
            <p>© 2025 DevAgent. Built with ❤️ by developer, for developers.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
