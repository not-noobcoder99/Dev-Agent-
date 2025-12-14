interface EvaluationResultsProps {
  data: {
    overall_score: number
    metrics: {
      code_quality: number
      maintainability: number
      security: number
      performance: number
      best_practices: number
    }
    recommendations: string[]
  }
}

export default function EvaluationResults({ data }: EvaluationResultsProps) {
  if (!data) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Fair'
    if (score >= 60) return 'Needs Work'
    return 'Poor'
  }

  return (
    <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-blue-500/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Quality Evaluation
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Powered by Oumi AI</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl">
          <span className="text-xs text-white/90 font-semibold mb-1">{getScoreLabel(data.overall_score)}</span>
          <span className="text-3xl font-bold text-white">
            {data.overall_score.toFixed(1)}
          </span>
          <span className="text-xs text-white/80 font-semibold">out of 100</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-5 mb-8 p-6 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 backdrop-blur-sm rounded-2xl border border-blue-200/30 dark:border-blue-700/30">
        {Object.entries(data.metrics).map(([key, value]) => (
          <MetricBar
            key={key}
            label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            score={value}
            color={getScoreColor(value)}
          />
        ))}
      </div>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30 dark:border-purple-700/30">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Recommendations
            </h3>
          </div>
          <ul className="space-y-3">
            {data.recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-200 dark:border-blue-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>
                <span className="text-gray-800 dark:text-gray-200 font-medium">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function MetricBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-lg font-bold text-gray-800 dark:text-white bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-lg">
          {score.toFixed(1)}%
        </span>
      </div>
      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out rounded-full relative overflow-hidden`}
          style={{ width: `${score}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
