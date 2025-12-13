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
  }
}

export default function WorkflowSummary({ data }: WorkflowSummaryProps) {
  if (!data) return null

  const isPassed = data.results?.decision?.includes('PASS')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          ⚡ Workflow Summary
        </h2>
        <span className={`badge ${isPassed ? 'badge-success' : 'badge-warning'}`}>
          {isPassed ? '✅ PASSED' : '⚠️ NEEDS REVIEW'}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Execution Details
        </h3>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Workflow ID:</strong> <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{data.workflow_id}</code>
          </p>
          <p>
            <strong>Execution ID:</strong> <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{data.execution_id}</code>
          </p>
          <p>
            <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Decision */}
      <div className={`mt-4 p-4 rounded-lg border-2 ${
        isPassed 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
      }`}>
        <p className="text-center font-semibold text-gray-800 dark:text-white">
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
    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  )
}
