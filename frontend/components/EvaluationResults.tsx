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

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🌟'
    if (score >= 80) return '✅'
    if (score >= 70) return '👍'
    if (score >= 60) return '⚠️'
    return '❌'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          📊 Quality Evaluation (Oumi)
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{getScoreEmoji(data.overall_score)}</span>
          <span className="text-3xl font-bold text-gray-800 dark:text-white">
            {data.overall_score.toFixed(1)}/100
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4 mb-6">
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
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            💡 Recommendations
          </h3>
          <ul className="space-y-2">
            {data.recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span className="text-gray-800 dark:text-gray-200">{recommendation}</span>
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
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-bold text-gray-800 dark:text-white">{score.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
