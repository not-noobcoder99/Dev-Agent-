export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🤖</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                DevAgent Pro
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI Development Assistant
              </p>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <a
              href="https://github.com/not-noobcoder99/Dev-Agent-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="/docs"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Docs
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
