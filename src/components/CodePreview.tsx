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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: 'rgba(10, 10, 15, 0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: 'var(--text-muted)' }}>
          Strudel Code
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded-md font-medium transition-all border"
          style={{
            borderColor: 'var(--border-standard)',
            color: copied ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="flex-1 p-5 text-xs font-mono overflow-auto leading-relaxed custom-scrollbar"
        style={{ color: 'var(--text-secondary)' }}>
        <code>{code}</code>
      </pre>
    </motion.div>
  )
}
