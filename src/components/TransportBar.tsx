import { motion } from 'framer-motion'

interface TransportBarProps {
  isPlaying: boolean
  hasTrack: boolean
  onPlay: () => void
  onStop: () => void
  onRemix: () => void
  loading: boolean
  accentColor: string
}

export function TransportBar({
  isPlaying,
  hasTrack,
  onPlay,
  onStop,
  onRemix,
  loading,
  accentColor,
}: TransportBarProps) {
  return (
    <div className="px-5 py-3 flex items-center justify-center gap-4">
      {/* Play/Stop */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={isPlaying ? onStop : onPlay}
        disabled={!hasTrack || loading}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all"
        style={{
          background: !hasTrack ? 'var(--surface-raised)' : '#fafafa',
          color: !hasTrack ? 'var(--text-muted)' : '#0a0a0f',
          cursor: !hasTrack ? 'not-allowed' : 'pointer',
        }}
      >
        {/* Pulsing ring when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${accentColor}` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span className="relative z-10">
          {isPlaying ? '\u23F9' : '\u25B6'}
        </span>
      </motion.button>

      {/* Remix */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onRemix}
        disabled={!hasTrack || loading}
        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all border"
        style={{
          borderColor: !hasTrack ? 'transparent' : 'var(--border-standard)',
          color: !hasTrack ? 'var(--text-muted)' : 'var(--text-secondary)',
          background: !hasTrack ? 'var(--surface-raised)' : 'transparent',
          cursor: !hasTrack ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Remixing
          </span>
        ) : (
          'Remix'
        )}
      </motion.button>
    </div>
  )
}
