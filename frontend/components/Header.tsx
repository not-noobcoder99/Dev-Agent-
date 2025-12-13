import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession()

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
            {status === 'authenticated' ? (
              <>
                <a
                  href="/profile"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  👤 Profile
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  ⚙️ Settings
                </a>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {session?.user?.name || session?.user?.email}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <a
                  href="/auth/signin"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </a>
              </>
            )}
            <a
              href="https://github.com/not-noobcoder99/Dev-Agent-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
