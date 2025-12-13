import { useState } from 'react'

interface GeneratedCodeProps {
  data: {
    files: Array<{
      path: string
      content: string
      language: string
    }>
    summary: string
    timestamp: string
  }
}

export default function GeneratedCode({ data }: GeneratedCodeProps) {
  const [selectedFile, setSelectedFile] = useState(0)

  if (!data || !data.files || data.files.length === 0) {
    return null
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          📝 Generated Code
        </h2>
        <span className="badge badge-success">
          {data.files.length} file(s)
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {data.summary}
      </p>

      {/* File Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        {data.files.map((file, index) => (
          <button
            key={index}
            onClick={() => setSelectedFile(index)}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedFile === index
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {file.path.split('/').pop()}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => {
              navigator.clipboard.writeText(data.files[selectedFile].content)
            }}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
          >
            📋 Copy
          </button>
        </div>

        <pre className="code-block overflow-x-auto">
          <code>{data.files[selectedFile].content}</code>
        </pre>
      </div>

      {/* File Path */}
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Path: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {data.files[selectedFile].path}
        </code>
      </div>
    </div>
  )
}
