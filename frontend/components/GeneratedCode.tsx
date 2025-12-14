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
    <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-green-500/10 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]">
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Generated Code
          </h2>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
          <span className="font-bold text-lg">{data.files.length} file(s)</span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10 p-4 rounded-xl border border-green-200/30 dark:border-green-700/30">
        {data.summary}
      </p>

      {/* File Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 p-2 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl">
        {data.files.map((file, index) => (
          <button
            key={index}
            onClick={() => setSelectedFile(index)}
            className={`px-5 py-3 font-semibold rounded-xl transition-all duration-300 ${
              selectedFile === index
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl scale-105'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:scale-105 hover:shadow-lg'
            }`}
          >
            {file.path.split('/').pop()}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="relative group">
        <div className="absolute top-4 right-4 z-10 flex gap-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => {
              navigator.clipboard.writeText(data.files[selectedFile].content)
            }}
            className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            Copy
          </button>
          <button
            onClick={() => {
              const blob = new Blob([data.files[selectedFile].content], { type: 'text/plain' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = data.files[selectedFile].path.split('/').pop() || 'code.txt'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Download
          </button>
          <button
            onClick={() => {
              data.files.forEach((file) => {
                const blob = new Blob([file.content], { type: 'text/plain' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = file.path.split('/').pop() || 'code.txt'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
              })
            }}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Download All
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-inner overflow-hidden border-2 border-green-500/20">
          <pre className="code-block overflow-x-auto p-6">
            <code className={`language-${data.files[selectedFile].language}`}>
              {data.files[selectedFile].content}
            </code>
          </pre>
        </div>
      </div>

      {/* File Path */}
      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <span className="font-semibold">Path:</span>
        <code className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-lg font-mono text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700">
          {data.files[selectedFile].path}
        </code>
      </div>
    </div>
  )
}
