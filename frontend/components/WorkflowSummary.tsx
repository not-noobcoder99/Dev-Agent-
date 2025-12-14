interface WorkflowSummaryProps {
  data: {
    workflow_id: string
    execution_id: string
    timestamp: string
    metrics: {
      total_duration: string
      files_generated: number
      issues_found: number
      quality_score: number
    }
    results: {
      decision: string
    }
    orchestrator?: string
  }
}

export default function WorkflowSummary({ data }: WorkflowSummaryProps) {
  if (!data) return null

  const isPassed = data.results?.decision?.includes('PASS')
  const isKestraOrchestrated = data.orchestrator === 'Kestra'

  return (
    <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-indigo-500/10 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
      {/* Gradient overlay */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Workflow Summary
            </h2>
            {isKestraOrchestrated && (
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                Orchestrated by Kestra
              </p>
            )}
          </div>
        </div>
        <div className={`px-6 py-3 rounded-2xl font-bold text-lg shadow-xl ${
          isPassed 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
        }`}>
          <span>{isPassed ? 'PASSED' : 'NEEDS REVIEW'}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon="📁"
          label="Files Generated"
          value={data.metrics.files_generated}
        />
        <MetricCard
          icon="🐛"
          label="Issues Found"
          value={data.metrics.issues_found}
          color={data.metrics.issues_found > 0 ? 'text-yellow-600' : 'text-green-600'}
        />
        <MetricCard
          icon="🎯"
          label="Quality Score"
          value={`${data.metrics.quality_score}/100`}
        />
        <MetricCard
          icon="⏱️"
          label="Duration"
          value={data.metrics.total_duration}
        />
      </div>

      {/* Execution Info */}
      <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30 dark:border-indigo-700/30 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Execution Details
          </h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <strong className="text-gray-700 dark:text-gray-300">Workflow ID:</strong>
              <code className="block mt-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-lg font-mono text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700">
                {data.workflow_id}
              </code>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <strong className="text-gray-700 dark:text-gray-300">Execution ID:</strong>
              <code className="block mt-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-lg font-mono text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700">
                {data.execution_id}
              </code>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <strong className="text-gray-700 dark:text-gray-300">Timestamp:</strong>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {new Date(data.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Decision */}
      <div className={`p-6 rounded-2xl border-2 shadow-xl ${
        isPassed 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500' 
          : 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-500'
      }`}>
        <p className="text-center font-bold text-xl text-gray-800 dark:text-white">
          {data.results.decision}
        </p>
      </div>
    </div>
  )
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  color = 'text-gray-800 dark:text-white' 
}: { 
  icon: string
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div className="relative overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="text-center">
        <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  )
}
