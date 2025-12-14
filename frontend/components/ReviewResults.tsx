import { useState } from 'react'

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
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  
  if (!data) return null

  const severityConfig = {
    critical: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    major: { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    minor: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    info: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  }

  const filteredIssues = data.issues ? data.issues.filter(issue => 
    severityFilter === 'all' || issue.severity === severityFilter
  ) : []

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-yellow-500/10 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)]">
      {/* Gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Code Review Results
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl">
          <div className={`text-3xl font-bold text-white`}>
            {data.score}
          </div>
          <div className="text-xs text-white/80 font-semibold">out of 100</div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Issues" value={data.summary.total} />
        <StatCard label="Critical" value={data.summary.critical} color="text-red-600" />
        <StatCard label="Major" value={data.summary.major} color="text-yellow-600" />
        <StatCard label="Minor" value={data.summary.minor} color="text-green-600" />
        <StatCard label="Info" value={data.summary.info} color="text-blue-600" />
      </div>

      {/* Issues List */}
      {data.issues && data.issues.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Issues Found ({filteredIssues.length})
            </h3>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-yellow-300 dark:border-yellow-600 rounded-xl text-sm font-semibold transition-all duration-300 focus:ring-4 focus:ring-yellow-500/20 cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="info">Info</option>
            </select>
          </div>
          {filteredIssues.map((issue, index) => {
            const config = severityConfig[issue.severity]
            return (
              <div
                key={index}
                className={`relative overflow-hidden p-6 rounded-2xl border-2 ${config.bg} border-gray-200 dark:border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-${issue.severity === 'critical' ? 'red' : issue.severity === 'major' ? 'yellow' : issue.severity === 'minor' ? 'green' : 'blue'}-400`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`font-bold uppercase text-sm px-3 py-1 rounded-lg ${config.color} bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm`}>
                        {issue.severity}
                      </span>
                      {issue.line && (
                        <span className="text-sm font-semibold px-3 py-1 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg text-gray-700 dark:text-gray-300">
                          Line {issue.line}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-3 font-medium text-lg">
                      {issue.message}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center space-x-2">
                      <span className="font-semibold">File:</span>
                      <code className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-lg font-mono border border-gray-300 dark:border-gray-600">
                        {issue.file}
                      </code>
                    </p>
                    {issue.suggestion && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-sm rounded-xl border-2 border-blue-200 dark:border-blue-700">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong className="font-bold">Suggestion:</strong> {issue.suggestion}
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
        <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-700">
          <p className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Perfect Code!
          </p>
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
    <div className="text-center p-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  )
}
