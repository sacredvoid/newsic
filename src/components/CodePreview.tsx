import { motion } from 'framer-motion'
import { useState } from 'react'

interface CodePreviewProps {
  code: string
}

export function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strudelUrl = `https://strudel.cc/#${btoa(encodeURIComponent(code))}`

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <span className="text-xs uppercase tracking-widest text-zinc-500">Strudel Code</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <a
            href={strudelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            Open in Strudel
          </a>
        </div>
      </div>
      <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">
        <code>{highlightCode(code)}</code>
      </pre>
    </motion.div>
  )
}

function highlightCode(code: string): string {
  // Simple highlighting - return raw code for now
  // The pre/code block with monospace font is sufficient
  return code
}
