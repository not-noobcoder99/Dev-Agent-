interface ReviewResultsProps {
  data: {
    score: number
    summary: {
      total: number
      critical: number
      major: number
      minor: number
      info: number
    }
    issues: Array<{
      severity: 'critical' | 'major' | 'minor' | 'info'
      file: string
      line?: number
      message: string
      suggestion?: string
    }>
  }
}

export default function ReviewResults({ data }: ReviewResultsProps) {
  if (!data) return null

  const severityConfig = {
    critical: { icon: '🔴', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    major: { icon: '🟡', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    minor: { icon: '🟢', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    info: { icon: 'ℹ️', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          🔍 Code Review Results
        </h2>
        <div className={`text-3xl font-bold ${getScoreColor(data.score)}`}>
          {data.score}/100
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Issues" value={data.summary.total} />
        <StatCard label="Critical" value={data.summary.critical} color="text-red-600" />
        <StatCard label="Major" value={data.summary.major} color="text-yellow-600" />
        <StatCard label="Minor" value={data.summary.minor} color="text-green-600" />
        <StatCard label="Info" value={data.summary.info} color="text-blue-600" />
      </div>

      {/* Issues List */}
      {data.issues && data.issues.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Issues Found ({data.issues.length})
          </h3>
          {data.issues.map((issue, index) => {
            const config = severityConfig[issue.severity]
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${config.bg} border-gray-200 dark:border-gray-700`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`font-semibold uppercase text-sm ${config.color}`}>
                        {issue.severity}
                      </span>
                      {issue.line && (
                        <span className="text-sm text-gray-500">
                          Line {issue.line}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-1">
                      {issue.message}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      File: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {issue.file}
                      </code>
                    </p>
                    {issue.suggestion && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          💡 <strong>Suggestion:</strong> {issue.suggestion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-gray-600 dark:text-gray-300">
            No issues found! Your code looks great!
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color = 'text-gray-800 dark:text-white' }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  )
}
